import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { fetchProperties } from "../api/properties";
import { propertyFixture } from "../test/propertyFixture";

vi.mock("../api/properties", () => ({
    fetchProperties: vi.fn(),
    fetchProperty: vi.fn(),
}));

vi.mock("../components/PropertyMap/PropertyMap", () => ({
    default: () => null,
}));

const aarhusProperty = {
    ...propertyFixture,
    id: 2,
    address: "Parkvej 10",
    city: "Aarhus",
};
const copenhagenResult = "Strandvejen 45, Copenhagen";
const aarhusResult = "Parkvej 10, Aarhus";
const blankSubmissions = [
    { kind: "empty", query: "", method: "button" },
    { kind: "empty", query: "", method: "Enter" },
    { kind: "whitespace-only", query: "   ", method: "button" },
    { kind: "whitespace-only", query: "   ", method: "Enter" },
];

function renderSearch(initialEntry: string) {
    const router = createMemoryRouter([{ path: "*", element: <App /> }], {
        initialEntries: [initialEntry],
    });
    render(<RouterProvider router={router} />);
    return router;
}

function getSearchInput() {
    return screen.getByPlaceholderText("Search properties...");
}

function getSearchButton() {
    return screen.getByRole("button", { name: "Search" });
}

describe("Property search", () => {
    beforeEach(() => {
        vi.mocked(fetchProperties).mockResolvedValue([
            propertyFixture,
            aarhusProperty,
        ]);
    });

    it.each(["button", "Enter"])(
        "opens Buy with the trimmed, encoded Home query using %s",
        async (submission) => {
            const user = userEvent.setup();
            const router = renderSearch("/");
            await user.type(getSearchInput(), "  Strandvejen 45  ");

            if (submission === "button") {
                await user.click(getSearchButton());
            } else {
                await user.keyboard("{Enter}");
            }

            expect(router.state.location).toMatchObject({
                pathname: "/buy",
                search: "?search=Strandvejen%2045",
            });
            expect(
                screen.getByRole("heading", { name: "Properties for Sale" }),
            ).toBeInTheDocument();
            expect(getSearchInput()).toHaveValue("Strandvejen 45");
            expect(
                await screen.findByText(copenhagenResult),
            ).toBeInTheDocument();
            expect(screen.queryByText(aarhusResult)).not.toBeInTheDocument();
        },
    );

    it.each(blankSubmissions)(
        "opens unfiltered Buy when Home submits a $kind query with $method",
        async ({ query, method }) => {
            const user = userEvent.setup();
            const router = renderSearch("/");
            const input = getSearchInput();
            if (query) {
                await user.type(input, query);
            }

            if (method === "button") {
                await user.click(getSearchButton());
            } else {
                await user.click(input);
                await user.keyboard("{Enter}");
            }

            expect(router.state.location).toMatchObject({
                pathname: "/buy",
                search: "",
            });
            expect(getSearchInput()).toHaveValue("");
            expect(
                await screen.findByText(copenhagenResult),
            ).toBeInTheDocument();
            expect(screen.getByText(aarhusResult)).toBeInTheDocument();
        },
    );

    it.each(blankSubmissions)(
        "clears the active search when Buy submits a $kind query with $method",
        async ({ query, method }) => {
            const user = userEvent.setup();
            const router = renderSearch("/buy?view=list&search=Copenhagen");
            const input = getSearchInput();
            expect(
                await screen.findByText(copenhagenResult),
            ).toBeInTheDocument();

            await user.clear(input);
            if (query) {
                await user.type(input, query);
            }
            expect(router.state.location.search).toBe(
                "?view=list&search=Copenhagen",
            );
            expect(screen.queryByText(aarhusResult)).not.toBeInTheDocument();

            if (method === "button") {
                await user.click(getSearchButton());
            } else {
                await user.keyboard("{Enter}");
            }

            expect(router.state.location.search).toBe("?view=list");
            expect(input).toHaveValue("");
            expect(screen.getByText(copenhagenResult)).toBeInTheDocument();
            expect(screen.getByText(aarhusResult)).toBeInTheDocument();
        },
    );

    it.each([
        { query: "copen", kind: "partial city name" },
        { query: "cOpEnHaGeN", kind: "mixed-case city name" },
        { query: "Strandvej", kind: "partial street name" },
        { query: "Copenhabgen", kind: "misspelled city name" },
    ])("finds the matching property for a $kind", async ({ query }) => {
        const user = userEvent.setup();
        const router = renderSearch("/buy");
        expect(await screen.findByText(aarhusResult)).toBeInTheDocument();

        await user.type(getSearchInput(), query);
        await user.keyboard("{Enter}");

        expect(router.state.location.search).toBe(`?search=${query}`);
        expect(screen.getByText(copenhagenResult)).toBeVisible();
        expect(screen.queryByText(aarhusResult)).not.toBeInTheDocument();
    });

    it("shows the no-results state after an unmatched search and clears it after a match", async () => {
        const user = userEvent.setup();
        const router = renderSearch("/buy");
        const input = getSearchInput();
        const emptyState = () =>
            screen.queryByRole("heading", { name: "No properties found" });

        expect(await screen.findByText(copenhagenResult)).toBeInTheDocument();
        await user.type(input, "zzzzzz");
        expect(screen.getByText(copenhagenResult)).toBeInTheDocument();
        expect(emptyState()).not.toBeInTheDocument();

        await user.click(getSearchButton());
        expect(router.state.location.search).toBe("?search=zzzzzz");
        expect(emptyState()).toBeVisible();
        expect(
            screen.getByText("Try a different search or adjust your filters."),
        ).toBeVisible();
        expect(screen.queryByText(copenhagenResult)).not.toBeInTheDocument();
        expect(screen.queryByText(aarhusResult)).not.toBeInTheDocument();

        await user.clear(input);
        await user.type(input, "Aarhus");
        await user.keyboard("{Enter}");
        expect(screen.getByText(aarhusResult)).toBeVisible();
        expect(emptyState()).not.toBeInTheDocument();
    });

    it.each(["button", "Enter"])(
        "updates Buy results only after submitting with %s and restores them on back navigation",
        async (submission) => {
            const user = userEvent.setup();
            const router = renderSearch("/buy?view=list&search=Copenhagen");
            const input = getSearchInput();

            expect(input).toHaveValue("Copenhagen");
            expect(
                await screen.findByText(copenhagenResult),
            ).toBeInTheDocument();
            expect(screen.queryByText(aarhusResult)).not.toBeInTheDocument();

            await user.clear(input);
            await user.type(input, "  Aarhus  ");
            expect(router.state.location.search).toBe(
                "?view=list&search=Copenhagen",
            );
            expect(screen.getByText(copenhagenResult)).toBeInTheDocument();
            expect(screen.queryByText(aarhusResult)).not.toBeInTheDocument();

            if (submission === "button") {
                await user.click(getSearchButton());
            } else {
                await user.keyboard("{Enter}");
            }
            expect(router.state.location.search).toBe(
                "?view=list&search=Aarhus",
            );
            expect(input).toHaveValue("Aarhus");
            expect(screen.getByText(aarhusResult)).toBeInTheDocument();
            expect(
                screen.queryByText(copenhagenResult),
            ).not.toBeInTheDocument();

            await user.clear(input);
            await user.keyboard("{Enter}");
            expect(router.state.location.search).toBe("?view=list");
            expect(input).toHaveValue("");
            expect(screen.getByText(copenhagenResult)).toBeInTheDocument();
            expect(screen.getByText(aarhusResult)).toBeInTheDocument();

            await act(async () => {
                await router.navigate(-1);
            });
            expect(router.state.location.search).toBe(
                "?view=list&search=Aarhus",
            );
            expect(input).toHaveValue("Aarhus");
            expect(screen.getByText(aarhusResult)).toBeInTheDocument();
            expect(
                screen.queryByText(copenhagenResult),
            ).not.toBeInTheDocument();
        },
    );
});
