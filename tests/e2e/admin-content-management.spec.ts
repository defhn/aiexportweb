import { expect, test } from "@playwright/test";

test.setTimeout(60_000);

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.locator('input[name="username"]').fill("admin");
  await page.locator('input[name="password"]').fill("changeme");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });
  await expect(page.getByRole("link", { name: /数据看板/ })).toBeVisible();
}

test("admin can update site settings and homepage hero content", async ({
  page,
}) => {
  const stamp = Date.now();
  const companyName = `QA Factory ${stamp}`;
  const heroTitle = `QA Hero ${stamp}`;

  await login(page);

  await page.goto("/admin/settings");
  await page.locator('input[name="companyNameEn"]').fill(companyName);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin\/settings\?saved=1$/, {
    timeout: 20_000,
  });

  await page.goto("/admin/pages/home");
  await page.locator('input[name="hero__title"]').fill(heroTitle);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin\/pages\/home\?saved=1$/, {
    timeout: 20_000,
  });

  await page.goto("/");
  await expect(page.getByRole("link", { name: companyName })).toBeVisible();
  await expect(page.getByRole("heading", { name: heroTitle })).toBeVisible();
});

test("admin can create a published product and blog post", async ({ page }) => {
  const stamp = Date.now();
  const productName = `QA Export Bracket ${stamp}`;
  const productSlug = `qa-export-bracket-${stamp}`;
  const blogTitle = `QA CNC Guide ${stamp}`;
  const blogSlug = `qa-cnc-guide-${stamp}`;

  await login(page);

  await page.goto("/admin/products/new");
  await page.locator('input[name="nameZh"]').fill(`测试支架 ${stamp}`);
  await page.locator('input[name="nameEn"]').fill(productName);
  await page.locator('input[name="slug"]').fill(productSlug);
  await page.locator('textarea[name="shortDescriptionEn"]').fill(
    "Playwright created product for admin verification.",
  );
  await page.locator('select[name="status"]').selectOption("published");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin\/products\/\d+\?saved=1$/, {
    timeout: 20_000,
  });

  await page.goto(`/products/aluminum-machining-parts/${productSlug}`);
  await expect(page.getByRole("heading", { name: productName })).toBeVisible();

  await page.goto("/admin/blog/new");
  await page.locator('input[name="titleZh"]').fill(`测试文章 ${stamp}`);
  await page.locator('input[name="titleEn"]').fill(blogTitle);
  await page.locator('input[name="slug"]').fill(blogSlug);
  await page
    .getByTestId("rich-text-editor-surface-contentEn")
    .fill("Playwright verifies that published blog posts can be created from the admin.");
  await page.locator('select[name="status"]').selectOption("published");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin\/blog\/\d+\?saved=1$/, {
    timeout: 20_000,
  });

  await page.goto(`/blog/${blogSlug}`);
  await expect(page.getByRole("heading", { name: blogTitle })).toBeVisible();
});
