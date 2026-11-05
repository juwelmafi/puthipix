import { NextResponse } from "next/server";
import { getSession, isAdminSession } from "@/lib/auth";
import { uploadToR2, isR2Configured, getR2FileUrl } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session || !isAdminSession(session)) {
      return NextResponse.json(
        { error: "অননুমোদিত: শুধুমাত্র অ্যাডমিন ফাইল আপলোড করতে পারবেন" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "pdf"; // "pdf" | "audio"

    if (!file) {
      return NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
    }

    // Validate mime types
    if (type === "pdf" && !file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "শুধুমাত্র পিডিএফ (.pdf) ফাইল আপলোড করা যাবে।" },
        { status: 400 }
      );
    }

    if (
      type === "audio" &&
      !file.type.startsWith("audio/") &&
      !file.name.match(/\.(mp3|m4a|wav|aac|ogg)$/i)
    ) {
      return NextResponse.json(
        { error: "শুধুমাত্র অডিও (.mp3, .m4a, .wav) ফাইল আপলোড করা যাবে।" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^\w.-]/g, "_");
    const prefix = type === "audio" ? "audiobooks" : "books/pdfs";
    const key = `${prefix}/${Date.now()}-${cleanName}`;

    // Upload to Cloudflare R2
    const result = await uploadToR2(key, buffer, file.type || "application/octet-stream");
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
    console.error("R2 Upload error:", error);
    return NextResponse.json(
      { error: "ফাইল আপলোড ব্যর্থ হয়েছে", details: error.message },
      { status: 500 }
    );
  }
}

