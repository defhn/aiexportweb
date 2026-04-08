import "../env";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { mediaAssets, products } from "@/db/schema";

const productMapping = {
  "custom-aluminum-cnc-bracket": "/images/products/cnc-bracket.png",
  "precision-steel-drive-shaft": "/images/products/steel-drive-shaft.png",
  "cnc-machined-housing": "/images/products/machined-housing.png",
  "stainless-steel-flange-plate": "/images/products/steel-flange-plate.png",
  "brass-threaded-connector": "/images/products/brass-connector.png",
  "cnc-turning-bushing": "/images/products/turning-bushing.png",
  "aluminum-heat-sink-base": "/images/products/heatsink-base.png",
  "precision-mounting-block": "/images/products/mounting-block.png",
  "cnc-motor-end-cap": "/images/products/motor-end-cap.png",
  "custom-sensor-mount": "/images/products/sensor-mount.png",
};

async function main() {
  const db = getDb();
  
  const productRows = await db.select({ 
    id: products.id, 
    slug: products.slug, 
    coverMediaId: products.coverMediaId 
  }).from(products);
  
  for (const product of productRows) {
    const newImageUrl = productMapping[product.slug as keyof typeof productMapping];
    if (newImageUrl && product.coverMediaId) {
      console.log(`Updating ${product.slug} cover media to use ${newImageUrl}`);
      await db.update(mediaAssets)
        .set({ url: newImageUrl, isPublic: true, assetType: "image" })
        .where(eq(mediaAssets.id, product.coverMediaId));
    }
  }
  
  console.log("Done updating product images to local files.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error updating DB:", err);
  process.exit(1);
});
