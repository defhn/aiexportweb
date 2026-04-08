import { expect, test } from "@playwright/test";

test("redirects to the login page and completes the admin sign-in flow", async ({
  page,
}) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(
    page.getByRole("heading", { name: "后台登录" }),
  ).toBeVisible();

  await page.getByLabel("用户名").fill("admin");
  await page.getByLabel("密码").fill("changeme");
  await page.getByRole("button", { name: "登录" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "仪表盘" })).toBeVisible();
});
