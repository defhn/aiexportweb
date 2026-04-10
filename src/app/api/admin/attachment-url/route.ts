import { NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/r2-private";
import { getDb } from "@/db/client";
import { inquiries, mediaAssets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /api/admin/attachment-url?inquiryId=123
 * 閻㈢喐鍨氶張澶嬫閺佸牏娈戠粔浣规箒闂勫嫪娆㈡稉瀣祰闁剧偓甯撮敍锟�15 閸掑棝鎸撻敍澶涚礉娴犲懘妾� Admin 娴ｈ法鏁�
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inquiryId = Number.parseInt(searchParams.get("inquiryId") ?? "", 10);

  if (!Number.isFinite(inquiryId)) {
    return NextResponse.json({ error: "閺冪姵鏅ラ惃锟� inquiryId" }, { status: 400 });
  }

  const db = getDb();

  // 閺屻儴顕楃拠銏㈡磸閸忓疇浠堥惃鍕娴狅拷
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
    return NextResponse.json({ error: "鐠囥垻娲忔稉宥呯摠閸︼拷" }, { status: 404 });
  }

  if (!inquiry.bucketKey) {
    return NextResponse.json({ error: "濮濄倛顕楅惄妯绘￥闂勫嫪娆�" }, { status: 404 });
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
