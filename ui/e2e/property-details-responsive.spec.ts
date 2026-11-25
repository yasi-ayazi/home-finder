import { expect, test } from "@playwright/test";
import { propertyFixture } from "../src/test/propertyFixture";

const widths = [320, 375, 393, 430, 768, 1024, 1280, 1440];
const imageUrls = Array.from(
    { length: 9 },
    (_, index) => `/media/responsive-${index + 1}.svg`,
);
const image =
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#2563eb"/></svg>';

test.beforeEach(async ({ page }) => {
    await page.route("**/api/properties/1", (route) =>
        route.fulfill({
            json: { ...propertyFixture, imageUrl: imageUrls[0], imageUrls },
        }),
    );
    await page.route("**/media/responsive-*.svg", (route) =>
        route.fulfill({ contentType: "image/svg+xml", body: image }),
    );
    await page.route("https://*.tile.openstreetmap.org/**", (route) =>
        route.fulfill({ contentType: "image/svg+xml", body: image }),
    );
});

test("details, map and footer stay aligned while resizing", async ({
    page,
}) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/property/1");
    await expect(
        page.getByRole("heading", { name: propertyFixture.address }),
    ).toBeVisible();

    const map = page.locator(".property-details-map");
    const header = page.locator(".site-header");
    const gallery = page.locator(".property-details__gallery");
    const facts = page.locator(".property-details__facts");
    const about = page.locator(".property-details__about");
    const footer = page.getByRole("contentinfo");

    for (const width of [...widths, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const viewport = await page.evaluate(() => ({
            content: document.documentElement.scrollWidth,
            visible: document.documentElement.clientWidth,
        }));
        expect(viewport.content, `horizontal overflow at ${width}px`).toBe(
            viewport.visible,
        );
        expect(await footer.boundingBox()).toMatchObject({
            x: 0,
            width: viewport.visible,
        });

        const [headerBox, galleryBox, factsBox, aboutBox, mapBox] =
            await Promise.all(
                [header, gallery, facts, about, map].map((locator) =>
                    locator.boundingBox(),
                ),
            );
        if (!headerBox || !galleryBox || !factsBox || !aboutBox || !mapBox) {
            throw new Error(`Incomplete details layout at ${width}px`);
        }
        if (width <= 1024) {
            expect(galleryBox.y).toBeGreaterThan(
                headerBox.y + headerBox.height,
            );
            expect(aboutBox.y).toBeGreaterThan(factsBox.y + factsBox.height);
        } else {
            expect(aboutBox.x).toBeGreaterThan(factsBox.x + factsBox.width);
            expect(galleryBox.height).toBe(620);
        }
        expect(mapBox.y).toBeGreaterThan(aboutBox.y + aboutBox.height);
        expect(mapBox.x + mapBox.width).toBeLessThanOrEqual(viewport.visible);

        await expect
            .poll(() =>
                map.evaluate((element) => {
                    const marker = element.querySelector(
                        ".leaflet-marker-icon",
                    );
                    if (!marker) return Infinity;
                    const bounds = element.getBoundingClientRect();
                    const icon = marker.getBoundingClientRect();
                    const style = getComputedStyle(marker);
                    return Math.hypot(
                        icon.left -
                            parseFloat(style.marginLeft) -
                            (bounds.left + bounds.width / 2),
                        icon.top -
                            parseFloat(style.marginTop) -
                            (bounds.top + bounds.height / 2),
                    );
                }),
            )
            .toBeLessThan(3);
    }
});

test("gallery stays usable while the open lightbox resizes", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto("/property/1");
    await page.locator(".property-details__gallery-thumbnail").last().click();

    const lightbox = page.locator(".property-details__lightbox");
    const close = page.getByRole("button", { name: "Close gallery" });
    const next = page.getByRole("button", { name: "Next image" });
    const previous = page.getByRole("button", { name: "Previous image" });
    const toggle = page.getByRole("button", { name: /all images/ });
    const selected = lightbox.locator(".property-details__lightbox-image");
    await expect(selected).toHaveAttribute("src", imageUrls.at(-1)!);

    for (const width of [...widths, 320]) {
        const height = width === 768 ? 360 : 740;
        await page.setViewportSize({ width, height });
        expect(await lightbox.boundingBox()).toEqual({
            x: 0,
            y: 0,
            width,
            height,
        });
        for (const control of [close, next, previous, toggle, selected]) {
            await expect(control).toBeInViewport({ ratio: 1 });
        }
        await next.click();
        await expect(selected).toHaveAttribute("src", imageUrls[0]);
        await previous.click();
        await expect(selected).toHaveAttribute("src", imageUrls.at(-1)!);
    }

    const thumbnails = lightbox.locator(
        ".property-details__lightbox-thumbnail",
    );
    await toggle.click();
    await expect(thumbnails).toHaveCount(0);
    await toggle.click();
    await thumbnails.last().click();
    await thumbnails.first().click();
    await expect(selected).toHaveAttribute("src", imageUrls[0]);
    await close.click();
    await expect(lightbox).toHaveCount(0);
});
