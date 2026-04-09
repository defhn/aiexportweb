import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

/**
 * 生成 R2 私有文件的临时预签名下载 URL（默认 15 分钟有效）
 * 用于安全分发询盘附件，避免公开泄露文件 URL
 */
export async function getPresignedDownloadUrl(
  bucketKey: string,
  expiresInSeconds = 900
): Promise<string> {
  // 开发占位符模式 - 返回假 URL
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
