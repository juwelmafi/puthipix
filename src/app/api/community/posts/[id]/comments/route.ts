import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const comments = await Comment.find({ postId: id })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "মন্তব্যসমূহ লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "মন্তব্য করতে অনুগ্রহ করে প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "মন্তব্য খালি রাখা যাবে না।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const post = await Post.findById(id);
    if (!post || post.status !== "active") {
      return NextResponse.json({ error: "পোস্টটি পাওয়া যায়নি।" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(session.userId);

    const newComment = await Comment.create({
      postId: post._id,
      user: userId,
      userName: session.name || "এক পাঠক",
      userAvatar: "",
      content: content.trim(),
    });

    // Update post comments count
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    // Create Notification for Post Author (if commenter is not author)
    if (post.author.toString() !== session.userId) {
      try {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          senderName: session.name || "এক পাঠক",
          type: "comment",
          postId: post._id,
          postTitle: post.postTitle,
          message: `${session.name || "এক পাঠক"} আপনার "${post.postTitle.slice(0, 30)}" পোস্টে মন্তব্য করেছেন।`,
          isRead: false,
        });
      } catch (notifErr) {
        console.error("Failed to create comment notification:", notifErr);
      }
    }

    return NextResponse.json(
      { success: true, comment: newComment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "মন্তব্য প্রকাশ করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
