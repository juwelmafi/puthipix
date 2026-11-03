import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Bookmark } from "@/models/Bookmark";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const bookmarks = await Bookmark.find({
      userId: new mongoose.Types.ObjectId(session.userId),
    })
      .populate("bookId", "title slug coverImage author")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId, pageNumber, note } = await request.json();

    if (!bookId || !pageNumber) {
      return NextResponse.json(
        { error: "bookId and pageNumber are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if bookmark exists; if so, delete (toggle) or update
    const existing = await Bookmark.findOne({
      userId: new mongoose.Types.ObjectId(session.userId),
      bookId: new mongoose.Types.ObjectId(bookId),
      pageNumber,
    });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return NextResponse.json({ success: true, action: "removed" });
    }

    const newBookmark = await Bookmark.create({
      userId: new mongoose.Types.ObjectId(session.userId),
      bookId: new mongoose.Types.ObjectId(bookId),
      pageNumber,
      note: note || "",
    });

    return NextResponse.json({ success: true, action: "added", bookmark: newBookmark });
  } catch (error: any) {
    console.error("Bookmark Error:", error);
    return NextResponse.json({ error: "Failed to process bookmark" }, { status: 500 });
  }
}

