import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const post = await Post.findById(id).lean();
    if (!post || post.status !== "active") {
      return NextResponse.json({ error: "পোস্টটি পাওয়া যায়নি।" }, { status: 404 });
    }

    const session = await getSession();
    const currentUserId = session?.userId ? session.userId.toString() : null;

    const isLikedByMe = currentUserId
      ? (post.likes || []).some((uid: any) => uid.toString() === currentUserId)
      : false;

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        isLikedByMe,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "পোস্ট লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত অনুরোধ।" }, { status: 401 });
    }

    await connectToDatabase();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "পোস্টটি পাওয়া যায়নি।" }, { status: 404 });
    }

    // Only author or admin can delete
    if (post.author.toString() !== session.userId && session.role !== "admin") {
      return NextResponse.json(
        { error: "এই পোস্টটি মুছে ফেলার অনুমতি আপনার নেই।" },
        { status: 403 }
      );
    }

    // Mark as deleted
    post.status = "deleted_by_admin";
    post.adminDeletionNote = session.role === "admin" ? "লেখক বা অ্যাডমিন কর্তৃক অপসারিত" : "লেখক কর্তৃক অপসারিত";
    await post.save();

    return NextResponse.json({ success: true, message: "পোস্টটি মুছে ফেলা হয়েছে।" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "পোস্ট মুছতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
