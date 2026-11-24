import { expect, test } from "@playwright/test";

const viewportWidths = [320, 375, 393, 430, 768, 1024, 1280, 1440];

test("Home page remains within every supported viewport", async ({ page }) => {
    await page.route("**/api/properties", async (route) => {
        await route.fulfill({
            contentType: "application/json",
            json: [],
        });
    });

    for (const width of viewportWidths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/");
        await expect(
            page.getByRole("button", { name: "Search" }),
        ).toBeVisible();
        await expect(
            page.getByRole("heading", { name: "Our Services" }),
        ).toBeVisible();
        await expect(
            page.getByRole("heading", { name: "Featured Properties" }),
        ).toBeVisible();
        await expect(page.getByText(/© 2026 HomeFinder/)).toBeVisible();

        const layout = await page.evaluate(() => ({
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
        }));

        expect(layout.documentWidth, `horizontal overflow at ${width}px`).toBe(
            layout.viewportWidth,
        );
    }
});
