import { describe, expect, it } from "vitest";
import { loadEnvironment } from "./environment.js";

describe("loadEnvironment", () => {
    it("uses safe development defaults", () => {
        expect(loadEnvironment({})).toMatchObject({
            PORT: 3000,
            UI_ORIGIN: "http://localhost:5173",
        });
    });

    it("rejects invalid ports and origins", () => {
        expect(() =>
            loadEnvironment({ PORT: "0", UI_ORIGIN: "not-a-url" }),
        ).toThrow("Invalid environment configuration");
    });
});
