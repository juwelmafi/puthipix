import { NextResponse } from "next/server";
import { getSession, isAdminSession } from "@/lib/auth";
import { getPresignedUploadUrl, isR2Configured, getR2FileUrl } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session || !isAdminSession(session)) {
      return NextResponse.json(
        { error: "অননুমোদিত: শুধুমাত্র অ্যাডমিন ফাইল আপলোড করতে পারবেন।" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { filename, type = "pdf", contentType = "application/pdf" } = body;

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "ফাইলের নাম প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    // Validate file extensions
    const cleanName = filename.toLowerCase().replace(/[^\w.-]/g, "_");
    if (type === "pdf" && !cleanName.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "শুধুমাত্র পিডিএফ (.pdf) ফাইল আপলোড করা যাবে।" },
        { status: 400 }
      );
    }

    if (
      type === "audio" &&
      !cleanName.match(/\.(mp3|m4a|wav|aac|ogg)$/i)
    ) {
      return NextResponse.json(
        { error: "শুধুমাত্র অডিও (.mp3, .m4a, .wav) ফাইল আপলোড করা যাবে।" },
        { status: 400 }
      );
    }

    const prefix = type === "audio" ? "audiobooks" : "books/pdfs";
    const key = `${prefix}/${Date.now()}-${cleanName}`;

    // If R2 credentials are not set on the environment (e.g. simulated mode), notify client
    if (!isR2Configured()) {
      return NextResponse.json({
        direct: false,
        key,
        url: getR2FileUrl(key),
        message: "R2 is not configured. Falling back to serverless upload.",
      });
    }

    // Generate AWS S3/R2 Presigned PUT URL
    const uploadUrl = await getPresignedUploadUrl(
      key,
      contentType || "application/octet-stream",
      3600
    );

    return NextResponse.json({
      direct: true,
      uploadUrl,
      key,
      url: getR2FileUrl(key),
    });
  } catch (error: any) {
    console.error("Presign upload error:", error);
    return NextResponse.json(
      { error: "প্রিসাইন ইউআরএল তৈরি করতে ব্যর্থ হয়েছে", details: error.message },
      { status: 500 }
    );
  }
}

