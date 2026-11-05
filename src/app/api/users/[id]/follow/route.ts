import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "অনুসরণ করতে অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "অবৈধ পাঠক আইডি।" }, { status: 400 });
    }

    if (session.userId === id) {
      return NextResponse.json(
        { error: "আপনি নিজেকে অনুসরণ করতে পারবেন না।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { error: "পাঠক প্রোফাইল পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const currentUserIdObj = new mongoose.Types.ObjectId(session.userId);
    const targetUserIdObj = new mongoose.Types.ObjectId(id);

    const isAlreadyFollowing = (targetUser.followers || []).some(
      (f: any) => f.toString() === session.userId
    );

    if (isAlreadyFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUserIdObj },
      });
      await User.findByIdAndUpdate(session.userId, {
        $pull: { following: targetUserIdObj },
      });

      // Update counters reliably
      const updatedTarget = await User.findById(id);
      const newFollowersCount = updatedTarget?.followers?.length || 0;
      await User.findByIdAndUpdate(id, { $set: { followersCount: newFollowersCount } });

      const updatedCurrent = await User.findById(session.userId);
      const newFollowingCount = updatedCurrent?.following?.length || 0;
      await User.findByIdAndUpdate(session.userId, { $set: { followingCount: newFollowingCount } });

      return NextResponse.json({
        success: true,
        isFollowing: false,
        followersCount: newFollowersCount,
        message: "অনুসরণ বাতিল করা হয়েছে।",
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(id, {
        $addToSet: { followers: currentUserIdObj },
      });
      await User.findByIdAndUpdate(session.userId, {
        $addToSet: { following: targetUserIdObj },
      });

      // Update counters reliably
      const updatedTarget = await User.findById(id);
      const newFollowersCount = updatedTarget?.followers?.length || 0;
      await User.findByIdAndUpdate(id, { $set: { followersCount: newFollowersCount } });

      const updatedCurrent = await User.findById(session.userId);
      const newFollowingCount = updatedCurrent?.following?.length || 0;
      await User.findByIdAndUpdate(session.userId, { $set: { followingCount: newFollowingCount } });

      // Create notification for followed user
      try {
        await Notification.create({
          recipient: targetUserIdObj,
          sender: currentUserIdObj,
          senderName: session.name,
          type: "follow",
          message: `${session.name} আপনাকে অনুসরণ করা শুরু করেছেন।`,
        });
      } catch (notifErr) {
        console.error("Follow notification error:", notifErr);
      }

      return NextResponse.json({
        success: true,
        isFollowing: true,
        followersCount: newFollowersCount,
        message: "সফলভাবে অনুসরণ করা হয়েছে।",
      });
    }
  } catch (error: any) {
    console.error("Follow toggle error:", error);
    return NextResponse.json(
      { error: "অনুসরণ প্রক্রিয়ায় সমস্যা দেখা দিয়েছে।" },
      { status: 500 }
    );
  }
}

