import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { DEFAULT_SITE_CONTENT } from "@/data/defaultSiteContent";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "অননুমোদিত: শুধুমাত্র অ্যাডমিন দেখতে পারবেন।" },
        { status: 403 }
      );
    }

    try {
      await connectToDatabase();
      const doc = await SiteSettings.findOne({ key: "global_site_settings" }).lean();
      if (doc && doc.content) {
        return NextResponse.json({
          success: true,
          content: doc.content,
        });
      }
    } catch (e) {
      // Return default
    }

    return NextResponse.json({
      success: true,
      content: DEFAULT_SITE_CONTENT,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "সাইট কনটেন্ট লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "অননুমোদিত: শুধুমাত্র অ্যাডমিন সাইট কনটেন্ট আপডেট করতে পারবেন।" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "কনটেন্ট অবজেক্ট প্রদান আবশ্যক।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await SiteSettings.findOneAndUpdate(
      { key: "global_site_settings" },
      { $set: { content } },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "সাইটের সম্পূর্ণ কনটেন্ট ও এসইও সফলভাবে হালনাগাদ করা হয়েছে!",
      content: updated.content,
    });
  } catch (error: any) {
    console.error("Update site settings error:", error);
    return NextResponse.json(
      { error: error.message || "সাইট কনটেন্ট সংরক্ষণ করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
