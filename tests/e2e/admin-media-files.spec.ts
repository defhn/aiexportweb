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

test("admin can upload media assets and create a downloadable file record", async ({
  page,
}) => {
  const stamp = Date.now();
  const imageName = `hero-${stamp}.png`;
  const fileName = `spec-${stamp}.pdf`;
  const downloadTitle = `Spec Sheet ${stamp}`;

  await login(page);

  await page.goto("/admin/media", { waitUntil: "domcontentloaded" });
  await page.locator('input[type="file"]').setInputFiles({
    name: imageName,
    mimeType: "image/png",
    buffer: Buffer.from("png-demo-content"),
  });
  await page.getByRole("button", { name: "上传图片" }).click();
  await expect(page.getByText(`${imageName} 上传成功。`)).toBeVisible({
    timeout: 20_000,
  });
  await page.reload();

  await page.goto("/admin/files", { waitUntil: "domcontentloaded" });
  await page.locator('input[type="file"]').setInputFiles({
    name: fileName,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 demo"),
  });
  await page.getByRole("button", { name: "上传文件" }).click();
  await expect(page.getByText(`${fileName} 上传成功。`)).toBeVisible({
    timeout: 20_000,
  });
  await page.reload();

  const createDownloadForm = page.getByTestId("create-download-form");
  await createDownloadForm.locator('input[name="displayNameZh"]').fill(`规格书 ${stamp}`);
  await createDownloadForm.locator('input[name="displayNameEn"]').fill(downloadTitle);
  await page.getByRole("button", { name: "创建下载记录" }).click();
  await expect(page.getByText(downloadTitle)).toBeVisible({ timeout: 20_000 });
});

test("admin can bind uploaded media assets to a product and see them on the public page", async ({
  page,
}) => {
  const stamp = Date.now();
  const imageName = `gallery-${stamp}.png`;
  const fileName = `manual-${stamp}.pdf`;
  const productName = `QA Media Product ${stamp}`;
  const productSlug = `qa-media-product-${stamp}`;

  await login(page);

  await page.goto("/admin/media", { waitUntil: "domcontentloaded" });
  await page.locator('input[type="file"]').setInputFiles({
    name: imageName,
    mimeType: "image/png",
    buffer: Buffer.from("png-demo-content"),
  });
  await page.getByRole("button", { name: "上传图片" }).click();
  await expect(page.getByText(`${imageName} 上传成功。`)).toBeVisible({
    timeout: 20_000,
  });
  await page.reload();

  await page.goto("/admin/files", { waitUntil: "domcontentloaded" });
  await page.locator('input[type="file"]').setInputFiles({
    name: fileName,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 demo"),
  });
  await page.getByRole("button", { name: "上传文件" }).click();
  await expect(page.getByText(`${fileName} 上传成功。`)).toBeVisible({
    timeout: 20_000,
  });
  await page.reload();

  await page.goto("/admin/products/new", { waitUntil: "domcontentloaded" });
  await page.locator('input[name="nameZh"]').fill(`媒体产品 ${stamp}`);
  await page.locator('input[name="nameEn"]').fill(productName);
  await page.locator('input[name="slug"]').fill(productSlug);
  await page.locator('textarea[name="shortDescriptionEn"]').fill(
    "Playwright binds cover images, gallery assets, and PDFs.",
  );
  await page.locator('select[name="coverMediaId"]').selectOption({ label: imageName });
  await page.locator('input[name="galleryMediaIds"]').first().check();
  await page.locator('select[name="pdfFileId"]').selectOption({ label: fileName });
  await page.locator('input[name="showPdfDownload"]').check();
  await page.locator('select[name="status"]').selectOption("published");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin\/products\/\d+\?saved=1$/, {
    timeout: 20_000,
  });

  await page.goto(`/products/aluminum-machining-parts/${productSlug}`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator(`img[alt="${productName}"]`).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Download PDF" })).toBeVisible();
});
