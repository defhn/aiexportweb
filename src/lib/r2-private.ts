import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

/**
 * 生成 R2 私有文件的临时预签名下载 URL，默认有效期 15 分钟
 * 用于让客户安全下载询盘附件而无需暴露存储桶凭证或真实 URL
 */
export async function getPresignedDownloadUrl(
  bucketKey: string,
  expiresInSeconds = 900
): Promise<string> {
  // 本地开发环境 Mock - 直接返回公开 URL
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
