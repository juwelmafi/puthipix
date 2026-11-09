import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "puthipix-books";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

export function isR2Configured(): boolean {
  return Boolean(
    R2_ACCOUNT_ID &&
      R2_ACCESS_KEY_ID &&
      R2_SECRET_ACCESS_KEY &&
      R2_BUCKET_NAME
  );
}

export function getR2FileUrl(key: string): string {
  if (R2_PUBLIC_DOMAIN) {
    const domain = R2_PUBLIC_DOMAIN.startsWith("http")
      ? R2_PUBLIC_DOMAIN
      : `https://${R2_PUBLIC_DOMAIN}`;
    return `${domain.replace(/\/$/, "")}/${key}`;
  }
  return `/api/reader/r2/${encodeURIComponent(key)}`;
}

// Initialize S3 Client configured for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "https://dummy.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "dummy",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "dummy",
  },
});

/**
 * Upload a file (PDF or Image) to Cloudflare R2 private bucket
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | Blob,
  contentType: string
): Promise<{ key: string; success: boolean }> {
  if (!isR2Configured()) {
    console.warn("Cloudflare R2 is not configured. Simulating upload for key:", key);
    return { key, success: true };
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body as any,
    ContentType: contentType,
  });

  await r2Client.send(command);
  return { key, success: true };
}

/**
 * Get readable stream of a private PDF from Cloudflare R2
 */
export async function getFileStreamFromR2(key: string) {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured");
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);
  return response.Body;
}

/**
 * Generate temporary presigned download URL (Short-lived, e.g. 5 minutes)
 */
export async function getPresignedReadUrl(
  key: string,
  expiresInSeconds = 300
): Promise<string> {
  if (!isR2Configured()) {
    return "";
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generate temporary presigned upload URL for direct browser-to-R2 upload (Bypasses Vercel 4.5MB limit)
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 3600
): Promise<string> {
  if (!isR2Configured()) {
    return "";
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  if (!isR2Configured()) return true;

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
  return true;
}

