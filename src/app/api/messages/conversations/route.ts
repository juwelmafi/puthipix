import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUserId = new mongoose.Types.ObjectId(session.userId);

    // Find all conversations containing the current user
    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "name email role avatar bio")
      .lean();

    // Calculate unread count for each conversation
    const formattedConversations = await Promise.all(
      conversations.map(async (conv: any) => {
        const otherParticipant = conv.participants.find(
          (p: any) => p._id.toString() !== session.userId
        );

        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          recipient: currentUserId,
          isRead: false,
        });

        return {
          _id: conv._id,
          otherUser: otherParticipant || {
            _id: "unknown",
            name: "পাঠক",
            role: "user",
          },
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          lastSender: conv.lastSender,
          unreadCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error: any) {
    console.error("Fetch conversations error:", error);
    return NextResponse.json(
      { error: "কথোপকথন তালিকা লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId } = body;

    if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
      return NextResponse.json({ error: "অবৈধ প্রাপক আইডি।" }, { status: 400 });
    }

    if (session.userId === recipientId) {
      return NextResponse.json(
        { error: "নিজেকে বার্তা পাঠানো যাবে না।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const recipientUser = await User.findById(recipientId).select("name email role avatar").lean();
    if (!recipientUser) {
      return NextResponse.json({ error: "প্রাপক পাঠক পাওয়া যায়নি।" }, { status: 404 });
    }

    const currentUserId = new mongoose.Types.ObjectId(session.userId);
    const recipientUserId = new mongoose.Types.ObjectId(recipientId);

    // Check if conversation already exists between these 2 users
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, recipientUserId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, recipientUserId],
        lastMessage: "",
        lastMessageAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      conversation: {
        _id: conversation._id,
        otherUser: recipientUser,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
      },
    });
  } catch (error: any) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "কথোপকথন শুরু করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

