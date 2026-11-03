import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AudiobookModel from "@/models/Audiobook";
import { MOCK_AUDIOBOOKS } from "@/data/mockAudiobooks";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const copyright = searchParams.get("copyright");
    const search = searchParams.get("search");

    let audiobooks = [...MOCK_AUDIOBOOKS];

    try {
      await connectToDatabase();
      const dbAudiobooks = await AudiobookModel.find({}).lean();
      if (dbAudiobooks && dbAudiobooks.length > 0) {
        audiobooks = dbAudiobooks as any;
      }
    } catch {
      // Use mock data if database is not connected
    }

    if (category && category !== "all") {
      audiobooks = audiobooks.filter((a) => a.categorySlug === category);
    }

    if (copyright && copyright !== "all") {
      audiobooks = audiobooks.filter((a) => a.copyrightType === copyright);
    }

    if (search) {
      const q = search.toLowerCase();
      audiobooks = audiobooks.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.narrator.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: audiobooks.length,
      audiobooks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, narrator, duration, audioUrl, coverImage, category, copyrightType } = body;

    if (!title || !author || !narrator || !audioUrl) {
      return NextResponse.json(
        { error: "প্রয়োজনীয় তথ্য (শিরোনাম, লেখক, বাচিক শিল্পী, অডিও ইউআরএল) প্রদান করুন।" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      `${title.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`;

    try {
      await connectToDatabase();
      const newAudiobook = await AudiobookModel.create({
        ...body,
        slug,
      });

      return NextResponse.json(
        { success: true, audiobook: newAudiobook },
        { status: 201 }
      );
    } catch (dbErr) {
      // In offline/mock mode
      const mockCreated = {
        id: `ab-${Date.now()}`,
        slug,
        title,
        author,
        narrator,
        duration: duration || "২০ মিনিট",
        durationSeconds: 1200,
        audioUrl,
        coverImage: coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
        description: body.description || "পুঁথিপিক্স উন্মুক্ত মহাফেজখানায় সংরক্ষিত শ্রুতিপাঠ।",
        category: category || "ছোটগল্প ও কথাসাহিত্য",
        categorySlug: "stories",
        copyrightType: copyrightType || "public-domain",
        chapters: [],
        publishedYear: body.publishedYear || 2026,
        language: "বাংলা",
      };

      return NextResponse.json(
        { success: true, audiobook: mockCreated, note: "Mock mode recorded" },
        { status: 201 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
