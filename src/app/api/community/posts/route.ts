import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const authorId = searchParams.get("authorId");
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    await connectToDatabase();

    const query: any = { status: "active" };

    if (genre && genre !== "all") {
      query.genre = genre;
    }

    if (authorId) {
      query.author = authorId;
    }

    const session = await getSession();
    const currentUserId = session?.userId ? session.userId.toString() : null;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Map `isLikedByMe` flag for current logged-in user
    const postsWithLikeState = posts.map((post: any) => ({
      ...post,
      isLikedByMe: currentUserId
        ? (post.likes || []).some((id: any) => id.toString() === currentUserId)
        : false,
    }));

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      success: true,
      count: postsWithLikeState.length,
      total,
      posts: postsWithLikeState,
    });
  } catch (error: any) {
    console.error("Fetch community posts error:", error);
    return NextResponse.json(
      { error: "পোস্টসমূহ লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "পোস্ট প্রকাশ করতে অনুগ্রহ করে প্রথমে অ্যাকাউন্টে লগইন করুন।" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postTitle, content, genre, bookTitle, bookAuthor, image, imageKey } = body;

    if (!postTitle || !postTitle.trim()) {
      return NextResponse.json(
        { error: "পোস্টের একটি সুন্দর শিরোনাম দিন।" },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "পোস্টের মূল বক্তব্য বা লেখা প্রদান করুন।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newPost = await Post.create({
      author: session.userId,
      authorName: session.name || "অজ্ঞাত সাহিত্যপ্রেমী",
      userAvatar: "",
      bookTitle: bookTitle ? bookTitle.trim() : "",
      bookAuthor: bookAuthor ? bookAuthor.trim() : "",
      postTitle: postTitle.trim(),
      genre: genre || "বই পর্যালোচনা",
      content: content.trim(),
      image: image || "",
      imageKey: imageKey || "",
      likes: [],
      likesCount: 0,
      commentsCount: 0,
      status: "active",
    });

    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create community post error:", error);
    return NextResponse.json(
      { error: "পোস্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
