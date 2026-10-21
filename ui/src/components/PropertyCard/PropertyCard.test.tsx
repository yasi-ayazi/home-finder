import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { propertyFixture } from "../../test/propertyFixture";
import PropertyCard from "./PropertyCard";

describe("PropertyCard", () => {
    it("navigates to the property details route when clicked", async () => {
        const user = userEvent.setup();
        const router = createMemoryRouter(
            [
                {
                    path: "/",
                    element: <PropertyCard {...propertyFixture} />,
                },
                {
                    path: "/property/:id",
                    element: <p>Property details</p>,
                },
            ],
            { initialEntries: ["/"] },
        );
        render(<RouterProvider router={router} />);

        await user.click(
            screen.getByRole("link", {
                name: new RegExp(propertyFixture.address),
            }),
        );

        expect(router.state.location.pathname).toBe(
            `/property/${propertyFixture.id}`,
        );
        expect(screen.getByText("Property details")).toBeInTheDocument();
    });
});
