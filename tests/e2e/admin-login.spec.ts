import { expect, test } from "@playwright/test";

test("redirects to the login page and completes the admin sign-in flow", async ({
  page,
}) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login/);
  await page.locator('input[name="username"]').fill("admin");
  await page.locator('input[name="password"]').fill("changeme");
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });
  await expect(page.getByText("数据看板")).toBeVisible();
});
