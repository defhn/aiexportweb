import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

/**
 * 閻㈢喐鍨� R2 缁変焦婀侀弬鍥︽閻ㄥ嫪澶嶉弮鍫曨暕缁涙儳鎮曟稉瀣祰 URL閿涘牓绮拋锟� 15 閸掑棝鎸撻張澶嬫櫏閿涳拷
 * 閻€劋绨€瑰鍙忛崚鍡楀絺鐠囥垻娲忛梽鍕閿涘矂浼╅崗宥呭彆瀵偓濞夊嫰婀堕弬鍥︽ URL
 */
export async function getPresignedDownloadUrl(
  bucketKey: string,
  expiresInSeconds = 900
): Promise<string> {
  // 瀵偓閸欐垵宕版担宥囶儊濡€崇础 - 鏉╂柨娲栭崑锟� URL
  if (
    env.R2_ACCOUNT_ID === "local-account" ||
    env.R2_ACCESS_KEY_ID === "local-access-key"
  ) {
    return `${env.R2_PUBLIC_URL}/${bucketKey}?presigned=mock`;
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: bucketKey,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}
