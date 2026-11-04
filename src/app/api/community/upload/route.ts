import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadToR2, getR2FileUrl, isR2Configured } from "@/lib/storage";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3 MB Limit

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "ছবি আপলোড করতে অনুগ্রহ করে প্রথমে অ্যাকাউন্টে লগইন করুন।" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "কোনো ছবি পাওয়া যায়নি।" }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      return NextResponse.json(
        { error: "শুধুমাত্র ছবি (JPEG, PNG, WebP) আপলোড করা যাবে।" },
        { status: 400 }
      );
    }

    // Validate size limit (max 3MB)
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "ছবির সাইজ সর্বোচ্চ ৩ মেগাবাইট (3 MB) হতে পারবে।" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename
    const cleanName = file.name.toLowerCase().replace(/[^\w.-]/g, "_");
    const key = `community/posts/${Date.now()}-${cleanName}`;

    // Upload to Cloudflare R2
    const result = await uploadToR2(key, buffer, file.type || "image/jpeg");
    const fileUrl = getR2FileUrl(result.key);

    return NextResponse.json({
      success: true,
      key: result.key,
      url: fileUrl,
      filename: file.name,
      size: file.size,
      r2Configured: isR2Configured(),
    });
  } catch (error: any) {
    console.error("Community post image upload error:", error);
    return NextResponse.json(
      { error: "ছবি আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}

