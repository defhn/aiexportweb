import { NextResponse } from "next/server";

import { createMediaAsset } from "@/features/media/actions";
import {
  getAssetKindFromMimeType,
  isSupportedUploadMimeType,
  uploadToR2,
} from "@/lib/r2";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folderIdValue = formData.get("folderId");
  const folderId =
    typeof folderIdValue === "string" && folderIdValue.trim()
      ? Number.parseInt(folderIdValue, 10)
      : null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "缺少文件�? }, { status: 400 });
  }

  if (!isSupportedUploadMimeType(file.type)) {
    return NextResponse.json({ error: "不支持的文件格式�? }, { status: 400 });
  }

  const uploaded = await uploadToR2({
    kind: getAssetKindFromMimeType(file.type),
    fileName: file.name,
    mimeType: file.type,
    body: Buffer.from(await file.arrayBuffer()),
  });

  const asset = await createMediaAsset({
    ...uploaded,
    folderId,
  });

  return NextResponse.json(asset, { status: 201 });
}
