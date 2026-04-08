import { NextResponse } from "next/server";

import { replaceProductAsset } from "@/features/products/actions";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    productId?: number;
    targetType?: "cover" | "gallery";
    currentMediaId?: number | null;
    newMediaId?: number;
  };

  if (!body.productId || !body.targetType || !body.newMediaId) {
    return NextResponse.json({ error: "Missing asset replacement payload." }, { status: 400 });
  }

  await replaceProductAsset({
    productId: body.productId,
    targetType: body.targetType,
    currentMediaId: body.currentMediaId ?? null,
    newMediaId: body.newMediaId,
  });

  return NextResponse.json({ success: true });
}
