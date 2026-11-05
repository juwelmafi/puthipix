import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ unreadCount: 0 });
    }

    await connectToDatabase();
    const currentUserId = new mongoose.Types.ObjectId(session.userId);

    const unreadCount = await Message.countDocuments({
      recipient: currentUserId,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json({ unreadCount: 0 });
  }
}

