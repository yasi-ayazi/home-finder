import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { propertyFixture } from "../../test/propertyFixture";
import PropertyDetailsMap from "./PropertyDetailsMap";

vi.mock("react-leaflet", () => ({
    MapContainer: ({ children }: { children: ReactNode }) => children,
    Marker: ({ position }: { position: [number, number] }) => (
        <div data-testid="property-marker" data-position={position.join(",")} />
    ),
    TileLayer: () => null,
}));

describe("PropertyDetailsMap", () => {
    it("places the marker at the property coordinates", () => {
        render(
            <PropertyDetailsMap
                latitude={propertyFixture.latitude}
                longitude={propertyFixture.longitude}
            />,
        );

        expect(screen.getByTestId("property-marker")).toHaveAttribute(
            "data-position",
            `${propertyFixture.latitude},${propertyFixture.longitude}`,
        );
    });
});
