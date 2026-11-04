import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "লাইক দিতে অনুগ্রহ করে প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const post = await Post.findById(id);
    if (!post || post.status !== "active") {
      return NextResponse.json({ error: "পোস্টটি পাওয়া যায়নি।" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(session.userId);
    const existingIndex = post.likes.findIndex((uid) => uid.toString() === session.userId);

    let isLiked = false;

    if (existingIndex > -1) {
      // Unlike
      post.likes.splice(existingIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
      isLiked = false;
    } else {
      // Like
      post.likes.push(userId);
      post.likesCount += 1;
      isLiked = true;

      // Create Notification for Post Author (if not self-like)
      if (post.author.toString() !== session.userId) {
        try {
          await Notification.create({
            recipient: post.author,
            sender: userId,
            senderName: session.name || "এক পাঠক",
            type: "like",
            postId: post._id,
            postTitle: post.postTitle,
            message: `${session.name || "এক পাঠক"} আপনার "${post.postTitle.slice(0, 30)}" পোস্টে লাইক দিয়েছেন।`,
            isRead: false,
          });
        } catch (notifErr) {
          console.error("Failed to create like notification:", notifErr);
        }
      }
    }

    await post.save();

    return NextResponse.json({
      success: true,
      likesCount: post.likesCount,
      isLiked,
    });
  } catch (error: any) {
    console.error("Like post error:", error);
    return NextResponse.json(
      { error: "লাইক প্রক্রিয়াকরণে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
