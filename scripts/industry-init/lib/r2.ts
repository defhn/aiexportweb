/**
 * R2 Upload Helper — wraps @aws-sdk/client-s3 with PutObject
 * Reads CLOUDFLARE_R2_* env vars.
 */
import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { extname } from "path";

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing R2 env vars: CLOUDFLARE_R2_ENDPOINT, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY",
    );
  }

  _client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

function getMimeType(filename: string): string {
  const ext = extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  };
  return map[ext] ?? "application/octet-stream";
}

export async function uploadToR2(opts: {
  localPath: string;
  r2Key: string; // e.g. "industry-init/001-hero.webp"
}): Promise<string> {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL; // e.g. https://cdn.example.com

  if (!bucket) throw new Error("CLOUDFLARE_R2_BUCKET is not set");
  if (!publicUrl) throw new Error("CLOUDFLARE_R2_PUBLIC_URL is not set");

  const client = getClient();
  const body = readFileSync(opts.localPath);
  const contentType = getMimeType(opts.localPath);

  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: opts.r2Key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  };

  await client.send(new PutObjectCommand(params));

  return `${publicUrl.replace(/\/$/, "")}/${opts.r2Key}`;
}
