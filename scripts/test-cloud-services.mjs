import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

console.log("=== PUTHIPINX CLOUD SERVICES TEST ===\n");

// 1. Test MongoDB
async function testMongo() {
  console.log("1. Testing MongoDB Atlas...");
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI missing");
    return false;
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas: Connected successfully!");
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.error("❌ MongoDB Atlas Error:", err.message);
    return false;
  }
}

// 2. Test Cloudinary
async function testCloudinary() {
  console.log("\n2. Testing Cloudinary...");
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("❌ Cloudinary credentials incomplete");
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    const testBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64"
    );

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "puthipix/test", public_id: `test-${Date.now()}` },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(testBuffer);
    });

    console.log("✅ Cloudinary: Upload successful!");
    console.log("   CDN URL:", result.secure_url);
    return true;
  } catch (err) {
    console.error("❌ Cloudinary Error:", err.message);
    return false;
  }
}

// 3. Test Cloudflare R2
async function testR2() {
  console.log("\n3. Testing Cloudflare R2...");
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || "puthipix-media";
  const publicDomain = process.env.R2_PUBLIC_DOMAIN;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error("❌ R2 credentials incomplete");
    return false;
  }

  const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const testKey = `test/test-${Date.now()}.txt`;
  const testContent = Buffer.from("Puthipix Cloudflare R2 connectivity test passed!");

  try {
    // Upload
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: testKey,
        Body: testContent,
        ContentType: "text/plain",
      })
    );
    console.log("✅ Cloudflare R2: File uploaded to bucket successfully!");

    // Verify Head
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: testKey,
      })
    );
    console.log("✅ Cloudflare R2: File verified in bucket!");

    if (publicDomain) {
      const formattedDomain = publicDomain.replace(/\/$/, "");
      console.log(`   Public URL: ${formattedDomain}/${testKey}`);
    }

    // Clean up test file
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: testKey,
      })
    );
    console.log("✅ Cloudflare R2: Cleanup successful!");
    return true;
  } catch (err) {
    console.error("❌ Cloudflare R2 Error:", err.message);
    return false;
  }
}

async function run() {
  const m = await testMongo();
  const c = await testCloudinary();
  const r = await testR2();

  console.log("\n=== TEST SUMMARY ===");
  console.log(`MongoDB Atlas:  ${m ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`Cloudinary:     ${c ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`Cloudflare R2:  ${r ? "PASSED ✅" : "FAILED ❌"}`);
}

run();
