import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "প্রবেশাধিকার সংরক্ষিত: শুধুমাত্র অ্যাডমিন এই কাজটি করতে পারেন" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      titleEn,
      author,
      translator,
      description,
      synopsis,
      coverImage,
      coverKey,
      pdfKey,
      price,
      accessType,
      genre,
      genreSlug,
      category,
      categorySlug,
      pageCount,
      language,
      edition,
      publishedYear,
      tableOfContents,
    } = body;

    if (!title || !author || !description || !coverImage) {
      return NextResponse.json(
        { error: "শিরোনাম, লেখক, বিবরণ এবং প্রচ্ছদ ছবি আবশ্যক" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate unique slug
    let baseSlug = (titleEn || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) {
      baseSlug = `book-${Date.now()}`;
    }

    let slug = baseSlug;
    let counter = 1;
    while (await Book.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBook = await Book.create({
      title: title.trim(),
      titleEn: titleEn?.trim() || "",
      slug,
      author: author.trim(),
      translator: translator?.trim() || "",
      description: description.trim(),
      synopsis: Array.isArray(synopsis) ? synopsis : [],
      coverImage,
      coverKey: coverKey || "",
      pdfKey: pdfKey || "",
      price: accessType === "premium" ? Number(price) || 0 : 0,
      accessType: accessType === "premium" ? "premium" : "free",
      published: true,
      featured: body.featured || false,
      recentlyAdded: true,
      publishedYear: publishedYear || new Date().getFullYear(),
      edition: edition || "প্রথম সংস্করণ",
      pageCount: Number(pageCount) || 100,
      language: language || "বাংলা",
      genre: genre || "সাহিত্য ও চিন্তা",
      genreSlug: genreSlug || "literature",
      category: category || "সাধারণ সংগ্রহ",
      categorySlug: categorySlug || "general",
      tableOfContents: Array.isArray(tableOfContents) ? tableOfContents : [],
    });

    return NextResponse.json({ success: true, book: newBook }, { status: 201 });
  } catch (error: any) {
    console.error("Admin create book error:", error);
    return NextResponse.json(
      { error: "বই যুক্ত করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}

