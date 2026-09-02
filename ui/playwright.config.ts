import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    workers: process.env.CI ? 1 : undefined,
    retries: process.env.CI ? 1 : 0,
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173",
        trace: "retain-on-failure",
    },
});
