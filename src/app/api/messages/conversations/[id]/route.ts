import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "অবৈধ কথোপকথন আইডি।" }, { status: 400 });
    }

    await connectToDatabase();
    const currentUserId = new mongoose.Types.ObjectId(session.userId);

    const conversation = await Conversation.findById(id)
      .populate("participants", "name email role avatar bio")
      .lean();

    if (!conversation) {
      return NextResponse.json(
        { error: "কথোপকথন খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Verify current user is a participant
    const isParticipant = (conversation.participants || []).some(
      (p: any) => p._id.toString() === session.userId
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: "এই কথোপকথন দেখার অনুমতি নেই।" },
        { status: 403 }
      );
    }

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      {
        conversation: id,
        recipient: currentUserId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    // Fetch conversation message history
    const messages = await Message.find({ conversation: id })
      .sort({ createdAt: 1 })
      .lean();

    const otherParticipant = (conversation.participants || []).find(
      (p: any) => p._id.toString() !== session.userId
    );

    return NextResponse.json({
      success: true,
      otherUser: otherParticipant || null,
      messages,
    });
  } catch (error: any) {
    console.error("Fetch conversation messages error:", error);
    return NextResponse.json(
      { error: "বার্তা লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "অবৈধ কথোপকথন আইডি।" }, { status: 400 });
    }

    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "বার্তার বিবরণ প্রদান করুন।" }, { status: 400 });
    }

    await connectToDatabase();
    const currentUserId = new mongoose.Types.ObjectId(session.userId);

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json(
        { error: "কথোপকথন খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const isParticipant = (conversation.participants || []).some(
      (p: any) => p.toString() === session.userId
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: "বার্তা প্রেরণের অনুমতি নেই।" },
        { status: 403 }
      );
    }

    // Identify recipient
    const recipientId = conversation.participants.find(
      (p: any) => p.toString() !== session.userId
    );

    if (!recipientId) {
      return NextResponse.json(
        { error: "প্রাপক চিহ্নিত করা সম্ভব হয়নি।" },
        { status: 400 }
      );
    }

    const cleanText = text.trim();

    // Create message
    const newMessage = await Message.create({
      conversation: id,
      sender: currentUserId,
      recipient: recipientId,
      text: cleanText,
      isRead: false,
    });

    // Update conversation record
    await Conversation.findByIdAndUpdate(id, {
      $set: {
        lastMessage: cleanText,
        lastSender: currentUserId,
        lastMessageAt: new Date(),
      },
    });

    // Dispatch notification to recipient
    try {
      const previewText =
        cleanText.length > 50 ? `${cleanText.slice(0, 50)}...` : cleanText;

      await Notification.create({
        recipient: recipientId,
        sender: currentUserId,
        senderName: session.name,
        type: "message",
        conversationId: id,
        message: `${session.name} আপনাকে বার্তা পাঠিয়েছেন: "${previewText}"`,
      });
    } catch (notifErr) {
      console.error("Message notification error:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch (error: any) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "বার্তা পাঠানো ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

