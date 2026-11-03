import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { BookOpen, Feather, ArrowLeft, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MOCK_BOOKS.map((b) => ({
    slug: b.slug,
  }));
}

export default async function BookDetailsPage({ params }: Props) {
  const { slug } = await params;
  const book = MOCK_BOOKS.find((b) => b.slug === slug);

  if (!book) {
    notFound();
  }

  const relatedBooks = MOCK_BOOKS.filter((b) => b.genreSlug === book.genreSlug && b.id !== book.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-[11px] sm:text-xs font-mono-meta text-[#7a776e]">
          <Link
            href="/library"
            className="hover:text-[#171717] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মহাফেজখানা</span>
          </Link>
          <div className="flex items-center gap-1.5 truncate">
            <span>আইডি: {book.id.toUpperCase()}</span>
            <span>•</span>
            <span className="uppercase truncate">{book.genre.split(" ")[0]}</span>
          </div>
        </div>

        {/* Main Book Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-8 sm:pb-12 border-b border-[rgba(23,23,23,0.18)]">
          {/* Left Column: Book Cover Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[200px] sm:max-w-sm aspect-[2/3] bg-[#e5e2cd] border-2 border-[#171717] p-1.5 sm:p-2 shadow-md">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 60vw, 40vw"
                  className="object-cover"
                />
                {/* Paper Spine illusion */}
                <div className="absolute inset-y-0 left-0 w-3 sm:w-4 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Book Spec Table */}
            <div className="w-full max-w-[280px] sm:max-w-sm mt-4 sm:mt-6 bg-[#f4f2e4] border border-[rgba(23,23,23,0.15)] divide-y divide-[rgba(23,23,23,0.1)] text-[11px] sm:text-xs font-mono-meta">
              <div className="p-2 sm:p-2.5 flex justify-between">
                <span className="text-[#7a776e]">আদি প্রকাশকাল</span>
                <span className="text-[#171717]">{book.publishedYear} সাল</span>
              </div>
              <div className="p-2 sm:p-2.5 flex justify-between">
                <span className="text-[#7a776e]">পৃষ্ঠা সংখ্যা</span>
                <span className="text-[#171717]">{book.pageCount} পৃষ্ঠা</span>
              </div>
              <div className="p-2 sm:p-2.5 flex justify-between">
                <span className="text-[#7a776e]">ভাষা</span>
                <span className="text-[#171717]">{book.language}</span>
              </div>
              <div className="p-2 sm:p-2.5 flex justify-between">
                <span className="text-[#7a776e]">কপিরাইট স্থিতি</span>
                <span className="text-emerald-800 font-bold">পাবলিক ডোমেইন (উন্মুক্ত)</span>
              </div>
              <div className="p-2 sm:p-2.5 flex justify-between">
                <span className="text-[#7a776e]">পড়ার মাধ্যম</span>
                <span className="text-[#8a493b] font-semibold">ডিজিটাল ব্রাউজার রিডার</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Metadata, CTA, Synopsis */}
          <div className="lg:col-span-7 flex flex-col justify-start space-y-4 sm:space-y-6">
            <div>
              {/* Access status tag */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-1.5 bg-[#171717] text-[#eeeddb] text-[9px] sm:text-[11px] font-mono-meta uppercase tracking-wider font-medium">
                <Feather className="w-2.5 h-2.5 text-[#8a493b]" />
                পাবলিক ডোমেইন ক্লাসিক • শতভাগ উন্মুক্ত পাঠ
              </span>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif-bengali font-bold text-[#171717] leading-tight">
                {book.title}
              </h1>

              {book.titleEn && (
                <p className="text-xs sm:text-base font-serif-bengali italic text-[#7a776e] mt-0.5">
                  {book.titleEn}
                </p>
              )}

              {/* Author */}
              <div className="mt-3 pt-2.5 border-t border-[rgba(23,23,23,0.12)] flex items-baseline gap-2">
                <span className="text-[10px] sm:text-xs font-mono-meta uppercase text-[#7a776e]">লেখক:</span>
                <span className="text-base sm:text-lg font-serif-bengali font-semibold text-[#171717]">
                  {book.author}
                </span>
                {book.translator && (
                  <span className="text-[11px] sm:text-xs font-serif-bengali italic text-[#53514a]">
                    (অনুবাদক: {book.translator})
                  </span>
                )}
              </div>
            </div>

            {/* Action CTA Block */}
            <div className="p-3.5 sm:p-5 bg-[#e8e6d3] border-2 border-[#171717] space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <span className="block text-[10px] sm:text-[11px] font-mono-meta text-[#7a776e] uppercase">
                    পাঠাধিকার ও মাধ্যম
                  </span>
                  <span className="text-lg sm:text-2xl font-serif-bengali font-bold text-[#171717]">
                    সম্পূর্ণ বিনামূল্যে পাঠযোগ্য
                  </span>
                </div>

                <Link
                  href={`/read/${book.id}`}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-[#171717] text-[#eeeddb] font-serif-bengali font-semibold text-xs sm:text-sm hover:bg-[#8a493b] transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>সরাসরি অনলাইনে পড়ুন</span>
                </Link>
              </div>

              {/* Security & Access Guarantee */}
              <div className="pt-2 sm:pt-3 border-t border-[rgba(23,23,23,0.12)] flex items-center gap-2 text-[10px] sm:text-[11px] font-mono-meta text-[#53514a]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8a493b] shrink-0" />
                <span>
                  কোনো অ্যাকাউন্ট বা সাইনআপ ছাড়াই যেকোনো ডিভাইস থেকে এখনই সম্পূর্ণ বইটি পাঠ করা যাবে।
                </span>
              </div>
            </div>

            {/* Synopsis / About the Book */}
            <div className="space-y-2 sm:space-y-3 pt-1">
              <h3 className="font-serif-bengali text-base sm:text-lg font-bold text-[#171717]">
                গ্রন্থ পরিচিতি ও মূল প্রেক্ষাপট
              </h3>
              <p className="text-xs sm:text-sm font-serif-bengali text-[#171717] leading-relaxed">
                {book.description}
              </p>
              {book.synopsis && book.synopsis.map((para: string, i: number) => (
                <p key={i} className="text-xs sm:text-sm font-serif-bengali text-[#53514a] leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Table of Contents */}
            {book.tableOfContents && (
              <div className="pt-3 border-t border-[rgba(23,23,23,0.12)] space-y-1.5">
                <h4 className="font-mono-meta text-[11px] sm:text-xs uppercase tracking-wider text-[#171717] font-semibold">
                  সূচিপত্র ও পরিচ্ছেদ
                </h4>
                <ul className="space-y-1 text-xs font-serif-bengali text-[#53514a]">
                  {book.tableOfContents.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-1.5 py-0.5">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#8a493b] shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Books - 2 columns on mobile! */}
        {relatedBooks.length > 0 && (
          <div className="mt-8 sm:mt-12 pt-4 sm:pt-8">
            <div className="mb-4 sm:mb-6 flex items-baseline justify-between border-b border-[rgba(23,23,23,0.14)] pb-2 sm:pb-3">
              <h3 className="text-lg sm:text-xl font-serif-bengali font-bold text-[#171717]">
                এই ধারার অন্যান্য অমর সাহিত্য
              </h3>
              <Link href={`/library?genre=${book.genreSlug}`} className="text-xs font-serif-bengali italic text-[#8a493b] hover:underline">
                আরও দেখুন →
              </Link>
            </div>
            {/* 2 columns on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
              {relatedBooks.map((relBook) => (
                <BookCard key={relBook.id} book={relBook} compact />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
