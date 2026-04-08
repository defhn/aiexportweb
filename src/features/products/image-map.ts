const productImageMap: Record<string, string> = {
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

export function getPublicProductImageFallback(slug: string) {
  return productImageMap[slug] ?? null;
}

export function getPreferredProductImageUrl(input: {
  slug: string;
  currentUrl?: string | null;
}) {
  const fallback = getPublicProductImageFallback(input.slug);

  if (fallback) {
    return fallback;
  }

  return input.currentUrl ?? null;
}
