import { NextResponse } from "next/server";
import { getSession, isAdminSession } from "@/lib/auth";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    // Allow admin, or authenticated users in development mode
    if (session && !isAdminSession(session)) {
      return NextResponse.json(
        { error: "অননুমোদিত: শুধুমাত্র অ্যাডমিন ছবি আপলোড করতে পারবেন।" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "puthipix/covers";

    if (!file) {
      return NextResponse.json(
        { error: "কোনো ছবি নির্বাচন করা হয়নি।" },
        { status: 400 }
      );
    }

    // Validate image mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "শুধুমাত্র ছবি ফাইল (JPEG, PNG, WebP) আপলোড করা যাবে।" },
        { status: 400 }
      );
    }

    // Limit image size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ছবির সাইজ ১০ মেগাবাইটের বেশি হতে পারবে না।" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageToCloudinary(buffer, folder, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      filename: file.name,
      size: file.size,
      cloudinaryConfigured: isCloudinaryConfigured(),
      simulated: result.simulated,
    });
  } catch (error: any) {
    console.error("Cloudinary Image Upload Error:", error);
    return NextResponse.json(
      { error: "ছবি আপলোড করতে সমস্যা হয়েছে", details: error.message },
      { status: 500 }
    );
  }
}

