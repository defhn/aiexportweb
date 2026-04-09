import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "@/env";

const supportedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
]);

let r2Client: S3Client | null = null;

function isDevPlaceholderConfig() {
  return (
    env.R2_ACCOUNT_ID === "local-account" ||
    env.R2_ACCESS_KEY_ID === "local-access-key" ||
    env.R2_SECRET_ACCESS_KEY === "local-secret-key"
  );
}

function getR2Client() {
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  return r2Client;
}

export function isSupportedUploadMimeType(mimeType: string) {
  return supportedMimeTypes.has(mimeType);
}

export function getAssetKindFromMimeType(mimeType: string) {
  return mimeType.startsWith("image/") ? "image" : "file";
}

export function buildAssetKey(kind: "image" | "file", fileName: string) {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const safeName = fileName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${kind}/${yyyy}/${mm}/${Date.now()}-${safeName || "upload"}`;
}

export async function uploadToR2(input: {
  kind: "image" | "file";
  fileName: string;
  mimeType: string;
  body: Buffer;
}) {
  const key = buildAssetKey(input.kind, input.fileName);

  if (isDevPlaceholderConfig()) {
    return {
      assetType: input.kind,
      bucketKey: key,
      url: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`,
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileSize: input.body.byteLength,
    };
  }

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: input.body,
      ContentType: input.mimeType,
    }),
  );

  return {
    assetType: input.kind,
    bucketKey: key,
    url: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`,
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.body.byteLength,
  };
}

export async function deleteFromR2(bucketKey: string) {
  if (isDevPlaceholderConfig()) {
    return;
  }

  try {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: bucketKey,
      }),
    );
  } catch (err) {
    // R2 删除失败（文件不存在或网络问题）不应阻止数据库记录删除
    console.warn("[R2] deleteFromR2 warning (non-fatal):", bucketKey, err);
  }
}
