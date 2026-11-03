import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { getFileStreamFromR2, isR2Configured } from "@/lib/storage";
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
      book = await Book.findById(bookId);
    } catch (e) {
      // Ignore DB error, fallback to mock
    }

    if (!book) {
      book = MOCK_BOOKS.find((b) => b.id === bookId);
    }

    if (!book) {
      return NextResponse.json({ error: "গ্রন্থটি পাওয়া যায়নি" }, { status: 404 });
    }

    // 1. If book has a pdfKey and R2 is configured, stream from R2
    if (book.pdfKey && isR2Configured()) {
      try {
        const stream = await getFileStreamFromR2(book.pdfKey);
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

    // 2. Development fallback: Stream local sample PDF from project root
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

