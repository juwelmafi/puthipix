import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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

console.log("==================================================");
console.log("  🔍 PUTHIPINX COMPREHENSIVE PLATFORM HEALTH CHECK");
console.log("==================================================\n");

const results = {
  mongo: false,
  booksCount: 0,
  audiobooksCount: 0,
  genresCount: 0,
  categoriesCount: 0,
  adminAuth: false,
  readerAuth: false,
  cloudinaryUpload: false,
  cloudinaryUrl: "",
  r2PdfUpload: false,
  r2AudioUpload: false,
  r2PublicUrlValid: false,
};

async function testDatabase() {
  console.log("▶ [1/4] ডাটাবেজ ও কালেকশন পরীক্ষা (MongoDB Atlas)...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    results.mongo = true;
    console.log("   ✅ MongoDB Atlas ক্লাস্টার সংযুক্ত।");

    const db = mongoose.connection.db;

    // 1. Books
    const books = await db.collection("books").find({}).toArray();
    results.booksCount = books.length;
    console.log(`   📚 মহাফেজখানায় মোট বই: ${books.length} টি`);
    if (books.length > 0) {
      console.log(`      নমুনা: "${books[0].title}" - ${books[0].author}`);
    }

    // 2. Audiobooks
    const audiobooks = await db.collection("audiobooks").find({}).toArray();
    results.audiobooksCount = audiobooks.length;
    console.log(`   🎧 মহাফেজখানায় মোট শ্রুতিপাঠ: ${audiobooks.length} টি`);
    if (audiobooks.length > 0) {
      console.log(`      নমুনা: "${audiobooks[0].title}" (কণ্ঠ: ${audiobooks[0].narrator})`);
    }

    // 3. Genres & Categories
    results.genresCount = await db.collection("genres").countDocuments();
    results.categoriesCount = await db.collection("categories").countDocuments();
    console.log(`   🏷️  সাহিত্যধারা (Genres): ${results.genresCount} টি, ক্যাটাগরি: ${results.categoriesCount} টি`);

    // 4. Users Authentication Check
    const adminUser = await db.collection("users").findOne({ email: "admin@puthipix.com" });
    if (adminUser) {
      const match = await bcrypt.compare("admin123456", adminUser.passwordHash);
      if (match) {
        results.adminAuth = true;
        console.log("   🔐 অ্যাডমিন অ্যাকাউন্ট ও পাসওয়ার্ড: সঠিক ✅ (admin@puthipix.com)");
      }
    }

    const readerUser = await db.collection("users").findOne({ email: "reader@puthipix.com" });
    if (readerUser) {
      const match = await bcrypt.compare("reader123456", readerUser.passwordHash);
      if (match) {
        results.readerAuth = true;
        console.log("   👤 পাঠক অ্যাকাউন্ট ও পাসওয়ার্ড: সঠিক ✅ (reader@puthipix.com)");
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("   ❌ ডাটাবেজ টেস্ট ত্রুটি:", err.message);
  }
}

async function testCloudinary() {
  console.log("\n▶ [2/4] ইমেজ স্টোরেজ ও সিডিএন পরীক্ষা (Cloudinary)...");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const testPixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64"
    );

    const publicId = `puthipix/health/cover-${Date.now()}`;
    const uploadRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId, resource_type: "image", format: "webp" },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(testPixel);
    });

    results.cloudinaryUpload = true;
    results.cloudinaryUrl = uploadRes.secure_url;
    console.log("   ✅ ছবি সরাসরি আপলোড হয়েছে এবং WebP ফরম্যাটে অপ্টিমাইজ হয়েছে!");
    console.log(`   🔗 CDN URL: ${uploadRes.secure_url}`);

    // Cleanup
    await cloudinary.uploader.destroy(publicId);
    console.log("   🧹 টেস্ট ইমেজ সফলভাবে ক্লিনআপ সম্পন্ন।");
  } catch (err) {
    console.error("   ❌ Cloudinary টেস্ট ত্রুটি:", err.message);
  }
}

async function testCloudflareR2() {
  console.log("\n▶ [3/4] হেভি মিডিয়া অবজেক্ট স্টোরেজ পরীক্ষা (Cloudflare R2)...");
  const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  const bucket = process.env.R2_BUCKET_NAME || "puthipix-media";
  const publicDomain = (process.env.R2_PUBLIC_DOMAIN || "").replace(/\/$/, "");

  // 1. PDF Test
  const pdfKey = `books/pdfs/health-check-${Date.now()}.pdf`;
  const dummyPdf = Buffer.from("%PDF-1.4 Puthipix Health Check Document EOF");

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: pdfKey,
        Body: dummyPdf,
        ContentType: "application/pdf",
      })
    );
    await r2Client.send(new HeadObjectCommand({ Bucket: bucket, Key: pdfKey }));
    results.r2PdfUpload = true;
    console.log("   ✅ PDF ফাইল আপলোড ও বাকেটে যাচাই সম্পন্ন!");

    // Verify public link accessibility via fetch
    if (publicDomain) {
      const publicUrl = `${publicDomain}/${pdfKey}`;
      try {
        const fetchRes = await fetch(publicUrl, { method: "HEAD" });
        if (fetchRes.ok || fetchRes.status === 200) {
          results.r2PublicUrlValid = true;
          console.log(`   🌐 পাবলিক রিডিং লিঙ্ক সক্রিয়: ${publicUrl} (Status: ${fetchRes.status})`);
        } else {
          console.log(`   ℹ️  পাবলিক লিঙ্ক তৈরি হয়েছে: ${publicUrl} (Status: ${fetchRes.status})`);
        }
      } catch {
        console.log(`   ℹ️  পাবলিক লিঙ্ক ফরম্যাট: ${publicUrl}`);
      }
    }

    await r2Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: pdfKey }));
  } catch (err) {
    console.error("   ❌ R2 PDF টেস্ট ত্রুটি:", err.message);
  }

  // 2. Audio MP3 Test
  const audioKey = `audiobooks/health-audio-${Date.now()}.mp3`;
  const dummyAudio = Buffer.from("ID3 dummy mp3 audio buffer for puthipix streaming");

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: audioKey,
        Body: dummyAudio,
        ContentType: "audio/mpeg",
      })
    );
    await r2Client.send(new HeadObjectCommand({ Bucket: bucket, Key: audioKey }));
    results.r2AudioUpload = true;
    console.log("   ✅ অডিও ফাইল (.mp3) আপলোড ও স্ট্রিমিং প্রস্তুতি সফল!");
    await r2Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: audioKey }));
    console.log("   🧹 টেস্ট ফাইলসমূহ ক্লিনআপ সম্পন্ন।");
  } catch (err) {
    console.error("   ❌ R2 অডিও টেস্ট ত্রুটি:", err.message);
  }
}

async function printSummary() {
  console.log("\n==================================================");
  console.log("             📊 সম্পূর্ণ হেলথ চেক সামারি");
  console.log("==================================================");
  console.log(`1. MongoDB Atlas ডাটাবেজ:       ${results.mongo ? "✅ কার্যকর" : "❌ অকার্যকর"}`);
  console.log(`   - সংরক্ষিত বই:                ${results.booksCount} টি`);
  console.log(`   - সংরক্ষিত শ্রুতিপাঠ:          ${results.audiobooksCount} টি`);
  console.log(`   - অ্যাডমিন লগইন ক্রেডেনশিয়াল:  ${results.adminAuth ? "✅ যাচাইকৃত" : "❌ অমিল"}`);
  console.log(`   - পাঠক লগইন ক্রেডেনশিয়াল:    ${results.readerAuth ? "✅ যাচাইকৃত" : "❌ অমিল"}`);
  console.log(`2. Cloudinary ইমেজ সিডিএন:        ${results.cloudinaryUpload ? "✅ কার্যকর (WebP)" : "❌ অকার্যকর"}`);
  console.log(`3. Cloudflare R2 পিডিএফ স্টোরেজ:  ${results.r2PdfUpload ? "✅ কার্যকর" : "❌ অকার্যকর"}`);
  console.log(`4. Cloudflare R2 অডিও স্ট্রিমিং:   ${results.r2AudioUpload ? "✅ কার্যকর" : "❌ অকার্যকর"}`);
  console.log("==================================================");

  const allPassed =
    results.mongo &&
    results.booksCount > 0 &&
    results.audiobooksCount > 0 &&
    results.adminAuth &&
    results.cloudinaryUpload &&
    results.r2PdfUpload &&
    results.r2AudioUpload;

  if (allPassed) {
    console.log("\n🎉 অভিনন্দন! প্ল্যাটফর্মের প্রতিটি সিস্টেম শতভাগ সক্রিয় ও কার্যকর!");
  } else {
    console.log("\n⚠️ কিছু সার্ভিস এখনো কনফিগারেশন বা ডেটা রিফ্রেশ দরকার হতে পারে।");
  }
}

async function run() {
  await testDatabase();
  await testCloudinary();
  await testCloudflareR2();
  await printSummary();
}

run();
