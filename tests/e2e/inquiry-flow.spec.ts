import { expect, test } from "@playwright/test";

test("product detail page shows inquiry form and can submit", async ({
  page,
}) => {
  await page.goto(
    "/products/aluminum-machining-parts/custom-aluminum-cnc-bracket",
  );

  await expect(
    page.getByRole("heading", { name: "Send Inquiry" }),
  ).toBeVisible();

  await page.getByPlaceholder("Your name").fill("Playwright Tester");
  await page.getByPlaceholder("Email").fill(
    `tester+${Date.now()}@example.com`,
  );
  await page.getByPlaceholder("Company").fill("Export QA Ltd");
  await page.getByPlaceholder("Tell us what you need").fill(
    "Need a quotation for a pilot order.",
  );
  await page.getByRole("button", { name: "Submit Inquiry" }).click();

  await expect(
    page.getByText("Inquiry submitted successfully."),
  ).toBeVisible();
});
