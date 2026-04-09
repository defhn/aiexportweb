import { NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/r2-private";
import { getDb } from "@/db/client";
import { inquiries, mediaAssets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /api/admin/attachment-url?inquiryId=123
 * 生成有时效的私有附件下载链接（15 分钟），仅限 Admin 使用
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inquiryId = Number.parseInt(searchParams.get("inquiryId") ?? "", 10);

  if (!Number.isFinite(inquiryId)) {
    return NextResponse.json({ error: "无效的 inquiryId" }, { status: 400 });
  }

  const db = getDb();

  // 查询询盘关联的附件
  const [inquiry] = await db
    .select({
      attachmentMediaId: inquiries.attachmentMediaId,
      bucketKey: mediaAssets.bucketKey,
      fileName: mediaAssets.fileName,
      fileSize: mediaAssets.fileSize,
      mimeType: mediaAssets.mimeType,
    })
    .from(inquiries)
    .leftJoin(mediaAssets, eq(mediaAssets.id, inquiries.attachmentMediaId))
    .where(eq(inquiries.id, inquiryId))
    .limit(1);

  if (!inquiry) {
    return NextResponse.json({ error: "询盘不存在" }, { status: 404 });
  }

  if (!inquiry.bucketKey) {
    return NextResponse.json({ error: "此询盘无附件" }, { status: 404 });
  }

  const signedUrl = await getPresignedDownloadUrl(inquiry.bucketKey, 900);

  return NextResponse.json({
    url: signedUrl,
    fileName: inquiry.fileName,
    fileSize: inquiry.fileSize,
    mimeType: inquiry.mimeType,
    expiresIn: 900,
  });
}
