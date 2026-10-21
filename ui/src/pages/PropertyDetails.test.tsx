import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createMemoryRouter,
    RouterProvider,
    type RouteObject,
} from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchProperty } from "../api/properties";
import { propertyFixture } from "../test/propertyFixture";
import PropertyDetails from "./PropertyDetails";

vi.mock("../api/properties", () => ({
    fetchProperty: vi.fn(),
}));

vi.mock("../components/PropertyDetailsMap/PropertyDetailsMap", () => ({
    default: ({
        latitude,
        longitude,
    }: {
        latitude: number;
        longitude: number;
    }) => <div>{`Map at ${latitude}, ${longitude}`}</div>,
}));

const routes: RouteObject[] = [
    {
        path: "/property/:id?",
        element: <PropertyDetails />,
    },
];

function renderPropertyDetails(initialEntry: string) {
    const router = createMemoryRouter(routes, {
        initialEntries: [initialEntry],
    });
    render(<RouterProvider router={router} />);
    return router;
}

function getLightboxImage() {
    return document.querySelector<HTMLImageElement>(
        ".property-details__lightbox-image",
    );
}

describe("PropertyDetails data fetching", () => {
    const fetchPropertyMock = vi.mocked(fetchProperty);

    beforeEach(() => {
        fetchPropertyMock.mockReset();
    });

    it("stops loading without fetching when the property ID is missing", async () => {
        renderPropertyDetails("/property");

        await waitFor(() =>
            expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
        );
        expect(fetchPropertyMock).not.toHaveBeenCalled();
    });

    it("aborts an outdated request and only renders the latest property", async () => {
        let firstSignal: AbortSignal | undefined;
        fetchPropertyMock
            .mockImplementationOnce((_id, signal) => {
                firstSignal = signal;
                return new Promise((_resolve, reject) => {
                    signal?.addEventListener("abort", () => {
                        reject(new DOMException("Aborted", "AbortError"));
                    });
                });
            })
            .mockResolvedValueOnce({
                ...propertyFixture,
                id: 2,
                address: "Latest property",
            });

        const router = renderPropertyDetails("/property/1");
        await waitFor(() => expect(fetchPropertyMock).toHaveBeenCalledTimes(1));

        await act(async () => {
            await router.navigate("/property/2");
        });

        expect(firstSignal?.aborted).toBe(true);
        expect(await screen.findByText("Latest property")).toBeInTheDocument();
        expect(fetchPropertyMock).toHaveBeenLastCalledWith(
            "2",
            expect.any(AbortSignal),
        );
    });

    it("clears stale property and error state while a new ID loads", async () => {
        let resolveThirdRequest:
            ((value: typeof propertyFixture) => void) | undefined;
        fetchPropertyMock
            .mockResolvedValueOnce(propertyFixture)
            .mockRejectedValueOnce(new Error("not found"))
            .mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        resolveThirdRequest = resolve;
                    }),
            );

        const router = renderPropertyDetails("/property/1");
        expect(
            await screen.findByText(propertyFixture.address),
        ).toBeInTheDocument();

        await act(async () => {
            await router.navigate("/property/2");
        });
        expect(
            await screen.findByText("Failed to load property"),
        ).toBeInTheDocument();
        expect(
            screen.queryByText(propertyFixture.address),
        ).not.toBeInTheDocument();

        await act(async () => {
            await router.navigate("/property/3");
        });
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(
            screen.queryByText("Failed to load property"),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(propertyFixture.address),
        ).not.toBeInTheDocument();

        await act(async () => {
            resolveThirdRequest?.({
                ...propertyFixture,
                id: 3,
                address: "Third property",
            });
        });
        expect(await screen.findByText("Third property")).toBeInTheDocument();
    });
});

describe("PropertyDetails gallery", () => {
    const fetchPropertyMock = vi.mocked(fetchProperty);

    beforeEach(() => {
        fetchPropertyMock.mockReset();
        fetchPropertyMock.mockResolvedValue(propertyFixture);
    });

    it("opens and closes the lightbox from the main image", async () => {
        const user = userEvent.setup();
        renderPropertyDetails("/property/1");

        const galleryImages = await screen.findAllByAltText(
            propertyFixture.address,
        );
        await user.click(galleryImages[0]);

        expect(screen.getByText("1/3")).toBeInTheDocument();
        expect(getLightboxImage()).toHaveAttribute(
            "src",
            propertyFixture.imageUrls[0],
        );
        expect(document.body).toHaveStyle({ overflow: "hidden" });

        await user.click(screen.getByRole("button", { name: "Close gallery" }));

        expect(
            screen.queryByRole("button", { name: "Close gallery" }),
        ).not.toBeInTheDocument();
        expect(document.body.style.overflow).toBe("");
    });

    it("shows next and previous images with wraparound", async () => {
        const user = userEvent.setup();
        renderPropertyDetails("/property/1");

        const galleryImages = await screen.findAllByAltText(
            propertyFixture.address,
        );
        await user.click(galleryImages[0]);

        await user.click(
            screen.getByRole("button", { name: "Previous image" }),
        );
        expect(getLightboxImage()).toHaveAttribute(
            "src",
            propertyFixture.imageUrls[2],
        );
        expect(screen.getByText("3/3")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Next image" }));
        expect(getLightboxImage()).toHaveAttribute(
            "src",
            propertyFixture.imageUrls[0],
        );
        expect(screen.getByText("1/3")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Next image" }));
        expect(getLightboxImage()).toHaveAttribute(
            "src",
            propertyFixture.imageUrls[1],
        );
        expect(screen.getByText("2/3")).toBeInTheDocument();
    });

    it("selects an image from the lightbox thumbnails", async () => {
        const user = userEvent.setup();
        renderPropertyDetails("/property/1");

        const galleryImages = await screen.findAllByAltText(
            propertyFixture.address,
        );
        await user.click(galleryImages[0]);

        const thumbnails = document.querySelectorAll<HTMLImageElement>(
            ".property-details__lightbox-thumbnail",
        );
        await user.click(thumbnails[2]);

        expect(getLightboxImage()).toHaveAttribute(
            "src",
            propertyFixture.imageUrls[2],
        );
        expect(screen.getByText("3/3")).toBeInTheDocument();
        expect(thumbnails[2]).toHaveClass(
            "property-details__lightbox-thumbnail--active",
        );
    });
});
