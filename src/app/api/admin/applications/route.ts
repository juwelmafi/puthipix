import { NextResponse } from "next/server";
import { getSession, isSuperAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import AdminApplication from "@/models/AdminApplication";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);

    if (!session || !isSuperAdmin(session)) {
      return NextResponse.json(
        {
          error:
            "প্রবেশাধিকার সংরক্ষিত: শুধুমাত্র সুপার অ্যাডমিনের এই তালিকায় প্রবেশাধিকার রয়েছে।",
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const applications = await AdminApplication.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error("Admin fetch applications error:", error);
    return NextResponse.json(
      { error: "আবেদন তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

