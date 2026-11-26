import { expect, test } from "@playwright/test";
import { propertyFixture } from "../src/test/propertyFixture";

const matchingVillas = [
    { id: 1, address: "Birkevej 1", price: "3,000,000 DKK" },
    { id: 2, address: "Birkevej 2", price: "5,000,000 DKK" },
    { id: 3, address: "Birkevej 3", price: "2,000,000 DKK" },
    { id: 4, address: "Birkevej 4", price: "6,000,000 DKK" },
    { id: 5, address: "Birkevej 5", price: "4,000,000 DKK" },
].map((property) => ({ ...propertyFixture, ...property }));

const properties = [
    ...matchingVillas,
    {
        ...propertyFixture,
        id: 6,
        address: "Birkevej 6",
        price: "3,500,000 DKK",
        type: "Apartment",
    },
    {
        ...propertyFixture,
        id: 7,
        address: "Birkevej 7",
        price: "3,500,000 DKK",
        city: "Aarhus",
    },
];

test("keeps sorted cards and map markers in sync with search and filters", async ({
    page,
}) => {
    await page.route("**/api/properties", (route) =>
        route.fulfill({ json: properties }),
    );
    await page.route("https://*.tile.openstreetmap.org/**", (route) =>
        route.fulfill({ status: 204 }),
    );
    await page.goto("/buy?search=Copenhagen");

    const addresses = page.locator(".property-card__address");
    const map = page.locator(".buy-page__map");
    const cluster = map.locator(".marker-cluster");
    const loadMore = page.getByRole("button", { name: "Load More" });

    await expect(addresses).toHaveText(
        [6, 5, 4, 3].map((number) => `Birkevej ${number}, Copenhagen`),
    );
    await expect(cluster).toHaveText("6");

    await page.getByRole("button", { name: /Filters/ }).click();
    await page.getByRole("checkbox", { name: "Villa" }).check();
    await expect(cluster).toHaveText("5");

    const sort = page.getByRole("combobox");
    await sort.selectOption("price-low");
    await expect(addresses).toHaveText(
        [3, 1, 5, 2].map((number) => `Birkevej ${number}, Copenhagen`),
    );
    await expect(cluster).toHaveText("5");

    await loadMore.click();
    await expect(addresses).toHaveText(
        [3, 1, 5, 2, 4].map((number) => `Birkevej ${number}, Copenhagen`),
    );
    await expect(loadMore).toHaveCount(0);
    await expect(cluster).toHaveText("5");

    await sort.selectOption("price-high");
    await expect(addresses).toHaveText(
        [4, 2, 5, 1, 3].map((number) => `Birkevej ${number}, Copenhagen`),
    );

    const search = page.getByPlaceholder("Search properties...");
    await search.fill("Copen");
    await search.press("Enter");
    await expect(addresses).toHaveText(
        [4, 2, 5, 1].map((number) => `Birkevej ${number}, Copenhagen`),
    );
    await expect(loadMore).toBeVisible();
    await expect(cluster).toHaveText("5");

    await page.getByRole("button", { name: /Filters/ }).click();
    await page.getByPlaceholder("Min Price").fill("3000000");
    await page.getByPlaceholder("Max Price").fill("4000000");
    await expect(addresses).toHaveText([
        "Birkevej 5, Copenhagen",
        "Birkevej 1, Copenhagen",
    ]);
    await expect(cluster).toHaveText("2");

    await search.click();
    await search.fill("Aarhus");
    await search.press("Enter");
    await expect(addresses).toHaveText(["Birkevej 7, Aarhus"]);
    await expect(cluster).toHaveCount(0);
    const marker = map.locator(".property-marker");
    await expect(marker).toHaveCount(1);
    await marker.locator(".property-marker__pin").click();
    await expect(map.locator(".property-popup__address")).toHaveText(
        "Birkevej 7, Aarhus",
    );
});
