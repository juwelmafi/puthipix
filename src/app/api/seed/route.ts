import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { Genre } from "@/models/Genre";
import { Category } from "@/models/Category";
import AudiobookModel from "@/models/Audiobook";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { MOCK_BOOKS, GENRES, CATEGORIES } from "@/data/mockBooks";
import { MOCK_AUDIOBOOKS } from "@/data/mockAudiobooks";

async function performSeed() {
  await connectToDatabase();

  // 1. Seed Genres
  for (const g of GENRES) {
    await Genre.findOneAndUpdate(
      { slug: g.slug },
      { name: g.name, description: g.description, order: parseInt(g.id, 10) || 0 },
      { upsert: true }
    );
  }

  // 2. Seed Categories
  for (const c of CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: c.slug },
      { name: c.name, description: c.description },
      { upsert: true }
    );
  }

  // 3. Seed Books
  for (const b of MOCK_BOOKS) {
    await Book.findOneAndUpdate(
      { slug: b.slug },
      {
        title: b.title,
        titleEn: b.titleEn,
        author: b.author,
        translator: b.translator,
        description: b.description,
        synopsis: b.synopsis,
        coverImage: b.coverImage,
        price: b.price || 0,
        accessType: "free",
        publishedYear: b.publishedYear,
        edition: b.edition,
        pageCount: b.pageCount,
        language: b.language,
        genre: b.genre,
        genreSlug: b.genreSlug,
        category: b.category,
        categorySlug: b.categorySlug,
        featured: b.featured,
        recentlyAdded: b.recentlyAdded,
        publisher: b.publisher,
        tableOfContents: b.tableOfContents,
        published: true,
      },
      { upsert: true }
    );
  }

  // 4. Seed Audiobooks
  for (const a of MOCK_AUDIOBOOKS) {
    await AudiobookModel.findOneAndUpdate(
      { slug: a.slug },
      {
        title: a.title,
        titleEn: a.titleEn,
        author: a.author,
        narrator: a.narrator,
        narratorBio: a.narratorBio,
        duration: a.duration,
        durationSeconds: a.durationSeconds,
        coverImage: a.coverImage,
        description: a.description,
        synopsis: a.synopsis,
        transcript: a.transcript,
        category: a.category,
        categorySlug: a.categorySlug,
        copyrightType: a.copyrightType,
        copyrightNote: a.copyrightNote,
        chapters: a.chapters,
        audioUrl: a.audioUrl,
        featured: a.featured,
        publishedYear: a.publishedYear,
        language: a.language,
        readBookSlug: a.readBookSlug,
      },
      { upsert: true }
    );
  }

  // 5. Seed Default Admin & Demo Reader Accounts
  const adminPasswordHash = await hashPassword("admin123456");
  await User.findOneAndUpdate(
    { email: "admin@puthipix.com" },
    {
      name: "পুঁথিপিক্স অ্যাডমিন",
      email: "admin@puthipix.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      status: "active",
    },
    { upsert: true }
  );

  const readerPasswordHash = await hashPassword("reader123456");
  await User.findOneAndUpdate(
    { email: "reader@puthipix.com" },
    {
      name: "আহমেদ জাহিদ",
      email: "reader@puthipix.com",
      passwordHash: readerPasswordHash,
      role: "user",
      status: "active",
    },
    { upsert: true }
  );

  const totalBooks = await Book.countDocuments();
  const totalAudiobooks = await AudiobookModel.countDocuments();
  const totalGenres = await Genre.countDocuments();
  const totalCategories = await Category.countDocuments();
  const totalUsers = await User.countDocuments();

  return {
    totalBooks,
    totalAudiobooks,
    totalGenres,
    totalCategories,
    totalUsers,
    defaultAccounts: [
      { role: "admin", email: "admin@puthipix.com", password: "admin123456" },
      { role: "reader", email: "reader@puthipix.com", password: "reader123456" },
    ],
  };
}

export async function GET() {
  try {
    const stats = await performSeed();
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with books, audiobooks, and default accounts",
      stats,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        error: "Failed to seed database. Ensure MongoDB URI is configured and reachable.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
