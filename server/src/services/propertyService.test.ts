import { describe, expect, it, vi } from "vitest";
import type { PropertyRepository } from "../repositories/propertyRepository.js";
import { makeProperty } from "../test/fixtures.js";
import { PropertyService, mapProperty } from "./propertyService.js";

describe("PropertyService", () => {
    it("maps persistence values to the public API contract", async () => {
        const property = makeProperty();
        const repository: PropertyRepository = {
            findAll: vi.fn().mockResolvedValue([property]),
            findById: vi.fn().mockResolvedValue(property),
        };

        const result = await new PropertyService(repository).getAll();

        expect(result).toEqual([
            expect.objectContaining({
                id: 1,
                imageUrl: "/media/properties/property-1.jpg",
                price: "2,450,000 DKK",
                area: "145 m²",
            }),
        ]);
    });

    it("rejects unsafe media keys", () => {
        expect(() =>
            mapProperty(makeProperty({ mediaKey: "../secret.txt" })),
        ).toThrow("invalid media key");
    });

    it("returns null when a property does not exist", async () => {
        const repository: PropertyRepository = {
            findAll: vi.fn(),
            findById: vi.fn().mockResolvedValue(null),
        };
        await expect(
            new PropertyService(repository).getById(99),
        ).resolves.toBeNull();
    });
});
