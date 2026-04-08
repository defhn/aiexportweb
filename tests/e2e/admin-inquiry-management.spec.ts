import { expect, test } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.locator('input[name="username"]').fill("admin");
  await page.locator('input[name="password"]').fill("changeme");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });
  await expect(page.getByRole("link", { name: /数据看板/ })).toBeVisible();
}

test("admin can process inquiry status from the backend", async ({ page }) => {
  const stamp = Date.now();
  const inquiryName = `Inquiry QA ${stamp}`;

  await page.goto(
    "/products/aluminum-machining-parts/custom-aluminum-cnc-bracket",
  );
  const inquiryForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /submit for review/i }) })
    .first();

  await inquiryForm.getByPlaceholder("Full Name").fill(inquiryName);
  await inquiryForm.getByPlaceholder("Business Email").fill(
    `qa+${stamp}@example.com`,
  );
  await inquiryForm.getByPlaceholder("Company").fill("Inquiry QA Ltd");
  await inquiryForm.getByPlaceholder("Technical requirements & Project scope...").fill(
    "Please update this inquiry status in admin.",
  );
  await inquiryForm.getByRole("button", { name: /submit for review/i }).click();
  await expect(
    page.getByText(/thank you! our engineering team will review your request/i),
  ).toBeVisible();

  await login(page);
  await page.goto(`/admin/inquiries?q=${encodeURIComponent(inquiryName)}`);
  const inquiryCard = page.locator("article", {
    has: page.getByRole("heading", { name: inquiryName }),
  });
  await expect(inquiryCard.getByRole("heading", { name: inquiryName })).toBeVisible();

  await inquiryCard.locator('select[name="status"]').selectOption("done");
  await inquiryCard.locator('button[type="submit"]').click();

  await expect(inquiryCard.locator('select[name="status"]')).toHaveValue("done");
});
