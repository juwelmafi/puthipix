import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import AdminApplication from "@/models/AdminApplication";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const application = await AdminApplication.findOne({
      $or: [
        { email: session.email.toLowerCase().trim() },
        ...(session.userId && mongoose.Types.ObjectId.isValid(session.userId)
          ? [{ user: new mongoose.Types.ObjectId(session.userId) }]
          : []),
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      hasApplied: !!application,
      application,
    });
  } catch (error: any) {
    console.error("Fetch application error:", error);
    return NextResponse.json(
      { error: "আবেদনের তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "অ্যাডমিন পদের আবেদন জমা দিতে অনুগ্রহ করে প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    if (session.role === "admin" || session.role === "super_admin") {
      return NextResponse.json(
        { error: "আপনি ইতোমধ্যে একজন অনুমোদিত অ্যাডমিন হিসেবে নিয়োজিত আছেন।" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, phone, reason, experience, agreed } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "আবেদনকারীর নাম প্রদান আবশ্যক।" },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 15) {
      return NextResponse.json(
        { error: "অ্যাডমিন হতে চাওয়ার সুনির্দিষ্ট কারণ বিস্তারিতভাবে লিখুন (কমপক্ষে ১৫ অক্ষর)।" },
        { status: 400 }
      );
    }

    if (!agreed) {
      return NextResponse.json(
        { error: "পুঁথিপিক্সের শর্তাবলী ও নীতিমালা মেনে চলার অঙ্গীকার আবশ্যক।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find actual User document
    let userDoc = await User.findOne({ email: session.email.toLowerCase().trim() });
    if (!userDoc && session.userId && mongoose.Types.ObjectId.isValid(session.userId)) {
      userDoc = await User.findById(session.userId);
    }

    if (!userDoc) {
      return NextResponse.json(
        { error: "ইউজার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। আবার লগইন করুন।" },
        { status: 404 }
      );
    }

    // Check if an existing pending application exists
    const existingPending = await AdminApplication.findOne({
      $or: [{ user: userDoc._id }, { email: userDoc.email }],
      status: "pending",
    });

    if (existingPending) {
      return NextResponse.json(
        {
          error:
            "আপনার একটি আবেদন ইতোমধ্যে সুপার অ্যাডমিনের অনুমোদনের জন্য বিচারাধীন রয়েছে। অনুগ্রহ করে অপেক্ষা করুন।",
        },
        { status: 400 }
      );
    }

    const application = await AdminApplication.create({
      user: userDoc._id,
      name: name.trim(),
      email: userDoc.email,
      phone: (phone || "").trim(),
      reason: reason.trim(),
      experience: (experience || "").trim(),
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message:
        "আপনার অ্যাডমিন আবেদনটি সফলভাবে জমা হয়েছে। সুপার অ্যাডমিন পর্যালোচনা করে অনুমোদন প্রদান করবেন।",
      application,
    });
  } catch (error: any) {
    console.error("Submit admin application error:", error);
    return NextResponse.json(
      { error: error.message || "আবেদন জমা দিতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

