import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { getFileStreamFromR2, isR2Configured, getPresignedReadUrl } from "@/lib/storage";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

interface Props {
  params: Promise<{ bookId: string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { bookId } = await params;

    let book: any = null;

    try {
      await connectToDatabase();
      if (mongoose.Types.ObjectId.isValid(bookId)) {
        book = await Book.findById(bookId).lean();
      }
      if (!book) {
        book = await Book.findOne({
          $or: [{ slug: bookId }, { id: bookId }]
        }).lean();
      }
      // If bookId is like bk-01, lookup mock slug and find real updated book in DB
      if (!book && bookId.startsWith("bk-")) {
        const mockMatch = MOCK_BOOKS.find((b) => b.id === bookId);
        if (mockMatch?.slug) {
          book = await Book.findOne({ slug: mockMatch.slug }).lean();
        }
      }
    } catch (e) {
      console.error("DB lookup error in reader content route:", e);
    }

    if (!book) {
      book = MOCK_BOOKS.find((b) => b.id === bookId || b.slug === bookId);
    }

    if (!book) {
      return NextResponse.json({ error: "গ্রন্থটি পাওয়া যায়নি" }, { status: 404 });
    }

    // 1. Direct PDF URL if already full public URL
    if (book.pdfUrl && book.pdfUrl.startsWith("http")) {
      return NextResponse.redirect(book.pdfUrl, {
        status: 307,
        headers: {
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      });
    }

    // 2. If book has a pdfKey and R2 is configured, redirect to presigned read URL or stream
    const r2Key = book.pdfKey || (book.pdfUrl && !book.pdfUrl.startsWith("http") ? book.pdfUrl : null);
    if (r2Key && isR2Configured()) {
      try {
        const presignedUrl = await getPresignedReadUrl(r2Key, 3600);
        if (presignedUrl) {
          return NextResponse.redirect(presignedUrl, {
            status: 307,
            headers: {
              "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
            },
          });
        }

        const stream = await getFileStreamFromR2(r2Key);
        return new Response(stream as any, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${book.slug || "book"}.pdf"`,
            "Cache-Control": "private, max-age=3600",
            "X-Content-Type-Options": "nosniff",
          },
        });
      } catch (r2Err) {
        console.error("R2 fetch error, falling back to local sample PDF:", r2Err);
      }
    }

    // 3. Development fallback: Stream local sample PDF from project root
    const samplePath = path.join(process.cwd(), "digital_book_reading_platform_complete_walkthrough.pdf");
    if (fs.existsSync(samplePath)) {
      const fileBuffer = fs.readFileSync(samplePath);
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${book.slug || "book"}.pdf"`,
          "Cache-Control": "private, max-age=3600",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return NextResponse.json(
      { error: "PDF ফাইল স্টোরেজে পাওয়া যায়নি" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("PDF Streaming error:", error);
    return NextResponse.json(
      { error: "পিডিএফ স্ট্রিম করতে সমস্যা হয়েছে", details: error.message },
      { status: 500 }
    );
  }
}

