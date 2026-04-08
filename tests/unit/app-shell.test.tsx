import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(public)/page";

describe("HomePage", () => {
  it("renders the export lead generation headline and CTA", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        name: /high-quality manufacturing solutions for global buyers/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /get a quote/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
