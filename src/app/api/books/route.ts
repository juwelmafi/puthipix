import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { MOCK_BOOKS } from "@/data/mockBooks";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");
    const accessType = searchParams.get("accessType");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let books: any[] = [];

    try {
      await connectToDatabase();
      const query: any = { published: true };

      if (accessType && (accessType === "free" || accessType === "premium")) {
        query.accessType = accessType;
      }

      if (genre && genre !== "all") {
        query.genreSlug = genre;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      books = await Book.find(query).sort({ createdAt: -1 }).limit(limit);
    } catch (dbErr) {
      // If DB is offline or empty, gracefully serve mock books
      console.warn("Database not reachable or empty, serving mock data");
    }

    if (books.length === 0) {
      books = MOCK_BOOKS.filter((b) => {
        if (accessType && accessType !== "all" && b.accessType !== accessType) return false;
        if (genre && genre !== "all" && b.genreSlug !== genre) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q)
          );
        }
        return true;
      });
    }

    return NextResponse.json({ success: true, count: books.length, books });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

