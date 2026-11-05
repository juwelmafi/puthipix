import { NextResponse } from "next/server";
import { getSession, isSuperAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import AdminApplication from "@/models/AdminApplication";
import User from "@/models/User";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const session = await getSession(request);

    if (!session || !isSuperAdmin(session)) {
      return NextResponse.json(
        {
          error:
            "অননুমোদিত: শুধুমাত্র সুপার অ্যাডমিন কোনো আবেদন অনুমোদন বা বাতিল করতে পারেন। সাধারণ অ্যাডমিনের এই ক্ষমতা নেই।",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, note } = body; // action: "approve" | "reject"

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "অবৈধ অ্যাকশন। শুধুমাত্র 'approve' বা 'reject' গ্রহণযোগ্য।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const application = await AdminApplication.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "আবেদনটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    let reviewerObjectId: any = session.userId;
    if (!reviewerObjectId || !mongoose.Types.ObjectId.isValid(reviewerObjectId)) {
      const superAdminUser = await User.findOne({ email: session.email });
      if (superAdminUser) reviewerObjectId = superAdminUser._id;
    }

    if (action === "approve") {
      // 1. Upgrade user role to admin
      await User.findByIdAndUpdate(application.user, { $set: { role: "admin" } });

      // 2. Update application status
      application.status = "approved";
      application.reviewedBy = reviewerObjectId;
      application.reviewedAt = new Date();
      application.reviewNote = note || "সুপার অ্যাডমিন কর্তৃক অনুমোদিত";
      await application.save();

      // 3. Send notification to applicant
      try {
        await Notification.create({
          recipient: application.user,
          sender: reviewerObjectId || application.user,
          senderName: "সুপার অ্যাডমিন",
          type: "admin_approval",
          message:
            "অভিনন্দন! আপনার অ্যাডমিন পদের আবেদনটি সুপার অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে। আপনি এখন সম্পূর্ণ অ্যাডমিন ড্যাশবোর্ড পরিচালনা করতে পারবেন।",
          note: application.reviewNote,
          isRead: false,
        });
      } catch (notifErr) {
        console.warn("Notification creation error:", notifErr);
      }

      return NextResponse.json({
        success: true,
        message: `আবেদনকারী ${application.name}-কে সফলভাবে অ্যাডমিন হিসেবে অনুমোদন দেওয়া হয়েছে!`,
        application,
      });
    } else {
      // Reject application
      application.status = "rejected";
      application.reviewedBy = reviewerObjectId;
      application.reviewedAt = new Date();
      application.reviewNote = note || "আবেদনটি এই মুহূর্তে গ্রহণ করা সম্ভব হয়নি";
      await application.save();

      // Send rejection notification
      try {
        await Notification.create({
          recipient: application.user,
          sender: reviewerObjectId || application.user,
          senderName: "সুপার অ্যাডমিন",
          type: "admin_rejection",
          message:
            "আপনার অ্যাডমিন পদের আবেদনটি পর্যালোচনা শেষে এই মুহূর্তে গ্রহণ করা সম্ভব হয়নি।",
          note: application.reviewNote,
          isRead: false,
        });
      } catch (notifErr) {
        console.warn("Notification creation error:", notifErr);
      }

      return NextResponse.json({
        success: true,
        message: `আবেদনটি বাতিল করা হয়েছে।`,
        application,
      });
    }
  } catch (error: any) {
    console.error("Update admin application error:", error);
    return NextResponse.json(
      { error: error.message || "আবেদন আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

