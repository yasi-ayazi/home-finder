import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";
import type { PropertyRepository } from "./repositories/propertyRepository.js";
import { makeProperty } from "./test/fixtures.js";

describe("Home Finder API", () => {
    let storageRoot: string;
    let repository: PropertyRepository;

    beforeEach(async () => {
        storageRoot = await mkdtemp(
            path.join(os.tmpdir(), "home-finder-media-"),
        );
        await mkdir(path.join(storageRoot, "properties"));
        await writeFile(
            path.join(storageRoot, "properties", "property-1.jpg"),
            "image data",
        );
        repository = {
            findAll: vi.fn().mockResolvedValue([makeProperty()]),
            findById: vi
                .fn()
                .mockImplementation(async (id: number) =>
                    id === 1 ? makeProperty() : null,
                ),
        };
    });

    afterEach(async () => rm(storageRoot, { recursive: true, force: true }));

    function app(databaseReady = true) {
        return createApp({
            propertyRepository: repository,
            pool: {
                query: databaseReady
                    ? vi.fn().mockResolvedValue({})
                    : vi.fn().mockRejectedValue(new Error("down")),
            },
            storageRoot,
            uiOrigin: "http://localhost:5173",
        });
    }

    it("reports liveness and database readiness", async () => {
        await request(app()).get("/health").expect(200, { status: "ok" });
        await request(app()).get("/ready").expect(200, { status: "ready" });
        const unavailable = await request(app(false)).get("/ready").expect(503);
        expect(unavailable.body.error.code).toBe("DATABASE_UNAVAILABLE");
    });

    it("lists properties and gets one by ID", async () => {
        const list = await request(app()).get("/api/properties").expect(200);
        expect(list.body).toHaveLength(1);
        expect(list.body[0]).toMatchObject({
            id: 1,
            imageUrl: "/media/properties/property-1.jpg",
        });

        const detail = await request(app())
            .get("/api/properties/1")
            .expect(200);
        expect(detail.body.address).toBe("Strandvejen 45");
    });

    it("validates IDs and handles missing resources", async () => {
        expect(
            (await request(app()).get("/api/properties/nope").expect(400)).body
                .error.code,
        ).toBe("INVALID_PROPERTY_ID");
        expect(
            (await request(app()).get("/api/properties/99").expect(404)).body
                .error.code,
        ).toBe("PROPERTY_NOT_FOUND");
        await request(app()).get("/unknown").expect(404);
    });

    it("serves only media beneath the storage root", async () => {
        await request(app())
            .get("/media/properties/property-1.jpg")
            .expect(200);
        await request(app()).get("/media/%2e%2e/package.json").expect(404);
    });

    it("serves OpenAPI JSON and Scalar documentation", async () => {
        const specification = await request(app())
            .get("/openapi.json")
            .expect(200);
        expect(specification.body.paths["/api/properties/{id}"]).toBeDefined();
        await request(app())
            .get("/docs")
            .expect(200)
            .expect("content-type", /html/);
    });
});
