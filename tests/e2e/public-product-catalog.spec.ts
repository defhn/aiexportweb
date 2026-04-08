import { expect, test } from "@playwright/test";

test("public product catalog shows category navigation and product cards", async ({
  page,
}) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Custom Aluminum CNC Bracket" }),
  ).toBeVisible();

  await page.getByRole("link", { name: /explore capabilities/i }).first().click();
  await expect(page).toHaveURL(/\/products\/[a-z0-9-]+$/);
});
