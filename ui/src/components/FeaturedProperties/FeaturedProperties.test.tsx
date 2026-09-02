import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { propertyFixture } from "../../test/propertyFixture";
import FeaturedProperties from "./FeaturedProperties";

describe("FeaturedProperties", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("shows loading then renders featured API properties and their media", async () => {
        let resolveResponse: ((value: unknown) => void) | undefined;
        vi.stubGlobal(
            "fetch",
            vi.fn().mockReturnValue(
                new Promise((resolve) => {
                    resolveResponse = resolve;
                }),
            ),
        );

        render(<FeaturedProperties />);
        expect(
            screen.getByText("Loading featured properties..."),
        ).toBeInTheDocument();

        resolveResponse?.({ ok: true, json: async () => [propertyFixture] });

        expect(await screen.findByText(/Strandvejen 45/)).toBeInTheDocument();
        expect(
            screen.getByRole("img", { name: "Strandvejen 45" }),
        ).toHaveAttribute("src", "/media/properties/property-1.jpg");
    });

    it("renders an error when the backend is unavailable", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
        render(<FeaturedProperties />);
        expect(
            await screen.findByText("Failed to load featured properties."),
        ).toBeInTheDocument();
    });
});
