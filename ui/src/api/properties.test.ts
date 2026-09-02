import { afterEach, describe, expect, it, vi } from "vitest";
import { propertyFixture } from "../test/propertyFixture";
import { fetchProperties } from "./properties";

describe("fetchProperties", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("loads backend properties and keeps relative media URLs", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => [propertyFixture],
            }),
        );

        await expect(fetchProperties()).resolves.toEqual([propertyFixture]);
        expect(fetch).toHaveBeenCalledWith("/api/properties", {
            signal: undefined,
        });
    });

    it("rejects failed and malformed API responses", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
        await expect(fetchProperties()).rejects.toThrow(
            "Failed to load properties",
        );

        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ properties: [] }),
            }),
        );
        await expect(fetchProperties()).rejects.toThrow(
            "Invalid properties response",
        );
    });
});
