import type { PropertyRecord } from "../models/property.js";

export function makeProperty(
    overrides: Partial<PropertyRecord> = {},
): PropertyRecord {
    return {
        id: 1,
        priceAmount: 2450000,
        currency: "DKK",
        address: "Strandvejen 45",
        city: "Copenhagen",
        propertyType: "Villa",
        bedrooms: 3,
        bathrooms: 2,
        areaSquareMetres: 145,
        badges: ["Featured", "New"],
        mediaKey: "properties/property-1.jpg",
        latitude: 55.6761,
        longitude: 12.5683,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
        ...overrides,
    };
}
