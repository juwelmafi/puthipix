import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "প্রবেশাধিকার সংরক্ষিত: শুধুমাত্র অ্যাডমিন দেখতে পারবেন।" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    await connectToDatabase();

    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error: any) {
    console.error("Admin fetch posts error:", error);
    return NextResponse.json(
      { error: "কমিউনিটি পোস্ট লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "প্রবেশাধিকার সংরক্ষিত: শুধুমাত্র অ্যাডমিন এই কাজটি করতে পারবেন।" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { postId, note } = body;

    if (!postId) {
      return NextResponse.json({ error: "পোস্ট আইডি প্রদান করুন।" }, { status: 400 });
    }

    if (!note || !note.trim()) {
      return NextResponse.json(
        { error: "পোস্ট অপসারণের কারণ বা ব্যাখ্যা (নোট) প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let post: any = null;
    if (mongoose.Types.ObjectId.isValid(postId)) {
      post = await Post.findById(postId);
    }

    if (post) {
      post.status = "deleted_by_admin";
      post.adminDeletionNote = note.trim();
      await post.save();

      // Create Notification for the Post Author
      try {
        await Notification.create({
          recipient: post.author,
          sender: session.userId,
          senderName: "পুঁথিপিক্স মডারেশন দল",
          type: "admin_deletion",
          postId: post._id,
          postTitle: post.postTitle,
          message: `আপনার "${post.postTitle.slice(0, 30)}" পোস্টটি মহাফেজখানা নীতিমালা অনুযায়ী অপসারণ করা হয়েছে।`,
          note: note.trim(),
          isRead: false,
        });
      } catch (notifErr) {
        console.error("Failed to notify user about deletion:", notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "পোস্টটি সফলভাবে অপসারণ করা হয়েছে এবং লেখককে নোটিফিকেশন পাঠানো হয়েছে।",
    });
  } catch (error: any) {
    console.error("Admin delete post error:", error);
    return NextResponse.json(
      { error: "পোস্ট অপসারণ করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

