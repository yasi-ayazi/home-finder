import { expect, test } from "@playwright/test";

test("renders PostgreSQL properties and backend-managed media", async ({
    page,
    request,
}) => {
    const apiResponse = await request.get("/api/properties");
    expect(apiResponse.ok()).toBeTruthy();
    const properties = await apiResponse.json();
    expect(properties).toHaveLength(6);

    await page.goto("/");
    await expect(page.getByText("Strandvejen 45, Copenhagen")).toBeVisible();

    const image = page.getByRole("img", { name: "Strandvejen 45" });
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute(
        "src",
        "/media/properties/property-1.jpg",
    );
    expect(
        await image.evaluate(
            (element: HTMLImageElement) => element.naturalWidth,
        ),
    ).toBeGreaterThan(0);
});
