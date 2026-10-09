import { act, render, screen, waitFor } from "@testing-library/react";
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
            | ((value: typeof propertyFixture) => void)
            | undefined;
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
        expect(await screen.findByText(propertyFixture.address)).toBeInTheDocument();

        await act(async () => {
            await router.navigate("/property/2");
        });
        expect(await screen.findByText("Failed to load property")).toBeInTheDocument();
        expect(screen.queryByText(propertyFixture.address)).not.toBeInTheDocument();

        await act(async () => {
            await router.navigate("/property/3");
        });
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Failed to load property")).not.toBeInTheDocument();
        expect(screen.queryByText(propertyFixture.address)).not.toBeInTheDocument();

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
