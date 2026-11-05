import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Bookmark from "@/models/Bookmark";
import ReadingProgress from "@/models/ReadingProgress";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "অবৈধ পাঠক আইডি।" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const session = await getSession(request);

    const user = await User.findById(id).select("-passwordHash").lean();
    if (!user) {
      return NextResponse.json(
        { error: "পাঠক প্রোফাইল খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const currentUserId = session?.userId;
    const isMe = currentUserId ? currentUserId === id : false;
    const isFollowing = currentUserId
      ? (user.followers || []).some((f: any) => f.toString() === currentUserId)
      : false;

    // Fetch user's active posts in 'Amar Puthi'
    const posts = await Post.find({ author: id, status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    // Map like status for the current viewer
    const formattedPosts = posts.map((post: any) => ({
      ...post,
      isLikedByMe: currentUserId
        ? (post.likes || []).some((likeId: any) => likeId.toString() === currentUserId)
        : false,
    }));

    // Stats
    const bookmarksCount = await Bookmark.countDocuments({ userId: id });
    const booksReadCount = await ReadingProgress.countDocuments({ userId: id });

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        bio: user.bio || "সাহিত্যপ্রেমী পাঠক ও পুথিপিক্স সংগ্রাহক।",
        avatar: user.avatar || "",
        followersCount: user.followersCount ?? (user.followers?.length || 0),
        followingCount: user.followingCount ?? (user.following?.length || 0),
        createdAt: user.createdAt,
        isMe,
        isFollowing,
        stats: {
          postsCount: posts.length,
          bookmarksCount,
          booksReadCount,
        },
      },
      posts: formattedPosts,
    });
  } catch (error: any) {
    console.error("User profile fetch error:", error);
    return NextResponse.json(
      { error: "প্রোফাইল তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }

    const { id } = await params;
    if (session.userId !== id && session.role !== "super_admin") {
      return NextResponse.json(
        { error: "আপনি কেবল নিজের প্রোফাইল পরিবর্তন করতে পারবেন।" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, bio, avatar } = body;

    await connectToDatabase();

    const updateFields: any = {};
    if (typeof name === "string" && name.trim()) {
      updateFields.name = name.trim();
    }
    if (typeof bio === "string") {
      updateFields.bio = bio.slice(0, 300).trim();
    }
    if (typeof avatar === "string") {
      updateFields.avatar = avatar.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return NextResponse.json({ error: "ব্যবহারকারী পাওয়া যায়নি।" }, { status: 404 });
    }

    // Also update authorName on posts if name was changed
    if (updateFields.name) {
      await Post.updateMany(
        { author: id },
        { $set: { authorName: updateFields.name } }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "প্রোফাইল সফলভাবে আপডেট হয়েছে।",
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

