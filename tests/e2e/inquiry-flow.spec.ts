import { expect, test } from "@playwright/test";

test.setTimeout(60_000);

test("product detail page shows inquiry form and can submit", async ({
  page,
}) => {
  await page.goto(
    "/products/aluminum-machining-parts/custom-aluminum-cnc-bracket",
  );

  const inquiryForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /submit for review/i }) })
    .first();

  await expect(
    inquiryForm.getByRole("heading", { name: "Request Consultation" }),
  ).toBeVisible();

  await inquiryForm.getByPlaceholder("Full Name").fill("Playwright Tester");
  await inquiryForm.getByPlaceholder("Business Email").fill(
    `tester+${Date.now()}@example.com`,
  );
  await inquiryForm.getByPlaceholder("Company").fill("Export QA Ltd");
  await inquiryForm.getByPlaceholder("Technical requirements & Project scope...").fill(
    "Need a quotation for a pilot order.",
  );
  await inquiryForm.getByRole("button", { name: /submit for review/i }).click();

  await expect(
    page.getByText(/thank you! our engineering team will review your request/i),
  ).toBeVisible({ timeout: 20_000 });
});
