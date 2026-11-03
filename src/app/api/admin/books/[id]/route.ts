import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "অননুমোদিত এক্সেস" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const updated = await Book.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "বইটি পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ success: true, book: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "বই আপডেট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "অননুমোদিত এক্সেস" }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await Book.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "বইটি পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "বইটি সফলভাবে মুছে ফেলা হয়েছে" });
  } catch (error: any) {
    return NextResponse.json({ error: "বই মুছতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

