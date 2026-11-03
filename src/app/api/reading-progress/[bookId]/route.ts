import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ReadingProgress } from "@/models/ReadingProgress";
import { Book } from "@/models/Book";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ bookId: string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, progress: null }, { status: 401 });
    }

    const { bookId } = await params;
    await connectToDatabase();

    const progress = await ReadingProgress.findOne({
      userId: new mongoose.Types.ObjectId(session.userId),
      bookId: new mongoose.Types.ObjectId(bookId),
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await params;
    const { lastPage, totalPages } = await request.json();

    if (!lastPage) {
      return NextResponse.json({ error: "lastPage is required" }, { status: 400 });
    }

    await connectToDatabase();

    const progressPercent = totalPages > 0 ? Math.round((lastPage / totalPages) * 100) : 0;

    const updated = await ReadingProgress.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(session.userId),
        bookId: new mongoose.Types.ObjectId(bookId),
      },
      {
        lastPage,
        totalPages: totalPages || 100,
        progressPercent,
        lastReadAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, progress: updated });
  } catch (error: any) {
    console.error("Progress save error:", error);
    return NextResponse.json({ error: "Failed to save reading progress" }, { status: 500 });
  }
}

