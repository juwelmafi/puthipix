import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  success: boolean;
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  simulated?: boolean;
}

/**
 * Upload an image buffer to Cloudinary
 * If Cloudinary is not yet configured with API keys in .env.local,
 * it returns a temporary base64 data-URI so development never breaks.
 */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  folder = "puthipix/covers",
  mimeType = "image/jpeg"
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary credentials not yet provided in .env.local. Storing as Data-URI.");
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;
    return {
      success: true,
      url: dataUri,
      publicId: `dev-temp-${Date.now()}`,
      simulated: true,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto:best" },
          { fetch_format: "auto" }
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          simulated: false,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export { cloudinary };

