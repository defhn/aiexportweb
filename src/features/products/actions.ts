import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { products } from "@/db/schema";

export function buildProductPdfBinding(input: {
  productId: number;
  mediaId: number;
  showDownloadButton: boolean;
}) {
  return {
    productId: input.productId,
    pdfFileId: input.mediaId,
    showDownloadButton: input.showDownloadButton,
  };
}

export async function bindProductPdfFile(input: {
  productId: number;
  mediaId: number;
  showDownloadButton: boolean;
}) {
  const binding = buildProductPdfBinding(input);
  const db = getDb();

  const [product] = await db
    .update(products)
    .set({
      pdfFileId: binding.pdfFileId,
      showPdfDownload: binding.showDownloadButton,
      updatedAt: new Date(),
    })
    .where(eq(products.id, binding.productId))
    .returning({
      productId: products.id,
      pdfFileId: products.pdfFileId,
      showDownloadButton: products.showPdfDownload,
    });

  return {
    productId: product?.productId ?? binding.productId,
    pdfFileId: product?.pdfFileId ?? binding.pdfFileId,
    showDownloadButton: product?.showDownloadButton ?? binding.showDownloadButton,
  };
}
