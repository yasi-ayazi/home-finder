import { expect, test } from "@playwright/test";
import { propertyFixture } from "../src/test/propertyFixture";

test("restores Buy searches with browser Back and Forward", async ({
    page,
}) => {
    await page.route("**/api/properties", (route) =>
        route.fulfill({
            json: [
                propertyFixture,
                {
                    ...propertyFixture,
                    id: 2,
                    address: "Parkvej 10",
                    city: "Aarhus",
                },
            ],
        }),
    );

    await page.goto("/buy?search=Copenhagen");
    const input = page.getByPlaceholder("Search properties...");
    const copenhagen = page.getByText("Strandvejen 45, Copenhagen", {
        exact: true,
    });
    const aarhus = page.getByText("Parkvej 10, Aarhus", { exact: true });
    await expect(copenhagen).toBeVisible();

    await input.fill("Aarhus");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/buy\?search=Aarhus$/);
    await expect(aarhus).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/buy\?search=Copenhagen$/);
    await expect(input).toHaveValue("Copenhagen");
    await expect(copenhagen).toBeVisible();
    await expect(aarhus).toHaveCount(0);

    await page.goForward();
    await expect(page).toHaveURL(/\/buy\?search=Aarhus$/);
    await expect(input).toHaveValue("Aarhus");
    await expect(aarhus).toBeVisible();
    await expect(copenhagen).toHaveCount(0);
});
