import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    await connectToDatabase();

    const notifications = await Notification.find({ recipient: session.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipient: session.userId,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error: any) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json(
      { error: "নোটিফিকেশন লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { notificationId, markAll } = body;

    await connectToDatabase();

    if (markAll) {
      await Notification.updateMany(
        { recipient: session.userId, isRead: false },
        { $set: { isRead: true } }
      );
    } else if (notificationId) {
      await Notification.updateOne(
        { _id: notificationId, recipient: session.userId },
        { $set: { isRead: true } }
      );
    }

    const unreadCount = await Notification.countDocuments({
      recipient: session.userId,
      isRead: false,
    });

    return NextResponse.json({ success: true, unreadCount });
  } catch (error: any) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { error: "নোটিফিকেশন আপডেট ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

