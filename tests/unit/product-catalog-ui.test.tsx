import { render, screen } from "@testing-library/react";

import { CategoryGrid } from "@/components/public/category-grid";
import { ProductCard } from "@/components/public/product-card";

describe("product catalog ui", () => {
  it("links category cards to the public category route", () => {
    render(
      <CategoryGrid
        items={[
          {
            slug: "aluminum-machining-parts",
            nameEn: "Aluminum Machining Parts",
            summaryEn: "Lightweight structural CNC components.",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", { name: /explore capabilities/i }),
    ).toHaveAttribute("href", "/products/aluminum-machining-parts");
  });

  it("renders the product cover image when provided", () => {
    render(
      <ProductCard
        categorySlug="aluminum-machining-parts"
        slug="custom-aluminum-cnc-bracket"
        nameEn="Custom Aluminum CNC Bracket"
        shortDescriptionEn="Export-ready bracket"
        imageUrl="https://example.com/bracket.jpg"
        imageAlt="Custom Aluminum CNC Bracket"
      />,
    );

    expect(
      screen.getByRole("img", { name: "Custom Aluminum CNC Bracket" }),
    ).toHaveAttribute("src", "https://example.com/bracket.jpg");
  });
});
