import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { propertyFixture } from "../../test/propertyFixture";
import PropertyDetailsMap from "./PropertyDetailsMap";

const map = vi.hoisted(() => ({
    getContainer: vi.fn(() => document.createElement("div")),
    invalidateSize: vi.fn(),
}));

vi.mock("react-leaflet", () => ({
    MapContainer: ({ children }: { children: ReactNode }) => children,
    Marker: ({ position }: { position: [number, number] }) => (
        <div data-testid="property-marker" data-position={position.join(",")} />
    ),
    TileLayer: () => null,
    useMap: () => map,
}));

describe("PropertyDetailsMap", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "ResizeObserver",
            class {
                observe() {}
                disconnect() {}
            },
        );
    });

    afterEach(() => vi.unstubAllGlobals());

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
