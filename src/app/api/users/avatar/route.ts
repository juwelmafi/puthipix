import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { uploadToR2, getR2FileUrl } from "@/lib/storage";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "প্রোফাইল ছবি পরিবর্তন করতে অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "কোনো ছবি নির্বাচন করা হয়নি।" },
        { status: 400 }
      );
    }

    // Validate image format
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    const isImageExt = file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i);
    if (!validTypes.includes(file.type.toLowerCase()) && !isImageExt) {
      return NextResponse.json(
        { error: "শুধুমাত্র ছবি (JPEG, PNG, WebP) ফাইল গ্রহণযোগ্য।" },
        { status: 400 }
      );
    }

    // Validate size limit
    if (file.size > MAX_AVATAR_SIZE) {
      return NextResponse.json(
        { error: "ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে পারবে।" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const key = `avatars/${session.userId}-${Date.now()}.${extension}`;

    // Upload to private storage
    const uploadResult = await uploadToR2(key, buffer, file.type || "image/jpeg");
    const avatarUrl = getR2FileUrl(uploadResult.key);

    await connectToDatabase();

    // 1. Update user record
    await User.findByIdAndUpdate(session.userId, {
      $set: { avatar: avatarUrl },
    });

    // 2. Update post avatars
    await Post.updateMany(
      { author: session.userId },
      { $set: { userAvatar: avatarUrl } }
    );

    // 3. Update comment avatars
    await Comment.updateMany(
      { user: session.userId },
      { $set: { userAvatar: avatarUrl } }
    );

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: "প্রোফাইল ছবি সফলভাবে হালনাগাদ করা হয়েছে।",
    });
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "ছবি সংরক্ষণ করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}

