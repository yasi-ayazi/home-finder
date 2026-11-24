import { expect, test } from "@playwright/test";

const viewportWidths = [320, 375, 393, 430, 768, 1024, 1280, 1440];

const properties = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    imageUrl: `/media/properties/property-${index + 1}.jpg`,
    imageUrls: [`/media/properties/property-${index + 1}.jpg`],
    price: `${2_000_000 + index * 250_000} DKK`,
    address: `Responsive Street ${index + 1}`,
    city: "Copenhagen",
    type: index % 2 === 0 ? "Villa" : "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: "145 m²",
    description: "Responsive property fixture",
    badges: ["New"],
    latitude: 55.6761 + index * 0.01,
    longitude: 12.5683 + index * 0.01,
}));

test.beforeEach(async ({ page }) => {
    await page.route("**/api/properties", async (route) => {
        await route.fulfill({
            contentType: "application/json",
            json: properties,
        });
    });
});

test("Buy page remains responsive across supported viewport sizes", async ({
    page,
}) => {
    await page.goto("/buy");
    await expect(page.getByText("Responsive Street 1")).toBeVisible();

    for (const width of viewportWidths) {
        await page.setViewportSize({ width, height: 900 });

        await expect(
            page.getByRole("heading", { name: "Properties for Sale" }),
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Search" }),
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: /Filters/ }),
        ).toBeVisible();
        await expect(page.locator(".leaflet-container")).toBeVisible();

        const layout = await page.evaluate(() => {
            const content = document.querySelector(".buy-page__content");
            const list = document.querySelector(".buy-page__properties");
            const map = document.querySelector(".buy-page__map");

            if (!content || !list || !map) {
                throw new Error("Buy page layout was not rendered");
            }

            const contentStyle = getComputedStyle(content);
            const listStyle = getComputedStyle(list);
            const listRect = list.getBoundingClientRect();
            const mapRect = map.getBoundingClientRect();

            return {
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: document.documentElement.clientWidth,
                contentColumns:
                    contentStyle.gridTemplateColumns.split(" ").length,
                cardColumns: listStyle.gridTemplateColumns.split(" ").length,
                overlaps: !(
                    listRect.right <= mapRect.left ||
                    mapRect.right <= listRect.left ||
                    listRect.bottom <= mapRect.top ||
                    mapRect.bottom <= listRect.top
                ),
                mapWidth: mapRect.width,
            };
        });

        expect(layout.documentWidth, `horizontal overflow at ${width}px`).toBe(
            layout.viewportWidth,
        );
        expect(layout.mapWidth, `collapsed map at ${width}px`).toBeGreaterThan(
            0,
        );
        expect(layout.overlaps, `map overlaps cards at ${width}px`).toBe(false);

        if (width <= 600) {
            expect(layout.contentColumns).toBe(1);
            expect(layout.cardColumns).toBe(1);
        } else if (width <= 1100) {
            expect(layout.contentColumns).toBe(1);
            expect(layout.cardColumns).toBe(2);
        } else {
            expect(layout.contentColumns).toBe(2);
            expect(layout.cardColumns).toBe(2);
        }
    }
});

test("Buy controls fit and remain usable on a 320px viewport", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/buy");

    await page.getByRole("button", { name: /Filters/ }).click();
    const panel = page.locator(".property-filters__panel");
    await expect(panel).toBeVisible();

    const panelBounds = await panel.boundingBox();
    expect(panelBounds).not.toBeNull();
    expect(panelBounds?.x).toBeGreaterThanOrEqual(0);
    expect(
        (panelBounds?.x ?? 0) + (panelBounds?.width ?? 0),
    ).toBeLessThanOrEqual(320);

    await page.locator(".property-sort").selectOption("price-high");
    await expect(page.locator(".property-sort")).toHaveValue("price-high");
});
