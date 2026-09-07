import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { propertyFixture } from "../../test/propertyFixture";
import PropertyMap from "./PropertyMap";

vi.mock("react-leaflet-cluster", () => ({
    default: ({ children }: { children: ReactNode }) => children,
}));

describe("PropertyMap", () => {
    beforeEach(() => {
        vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    });

    afterEach(() => vi.restoreAllMocks());

    it("opens the property details when its marker is clicked", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <PropertyMap properties={[propertyFixture]} />,
        );

        await waitFor(() =>
            expect(
                container.querySelector(".leaflet-marker-icon"),
            ).not.toBeNull(),
        );
        const marker = container.querySelector<HTMLElement>(
            ".leaflet-marker-icon",
        );
        expect(marker).not.toBeNull();

        await user.click(marker!);

        expect(
            screen.getByRole("img", { name: propertyFixture.address }),
        ).toHaveAttribute("src", propertyFixture.imageUrl);
        expect(
            screen.getByText(
                `${propertyFixture.address}, ${propertyFixture.city}`,
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                `${propertyFixture.type} | ${propertyFixture.area} | ${propertyFixture.price}`,
            ),
        ).toBeInTheDocument();
    });
});
