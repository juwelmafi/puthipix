import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";
import { AudioCard } from "@/components/audio/AudioCard";
import { MOCK_BOOKS, GENRES } from "@/data/mockBooks";
import { MOCK_AUDIOBOOKS } from "@/data/mockAudiobooks";
import { BookOpen, ArrowRight, Feather, Headphones } from "lucide-react";

export default function HomePage() {
  const featuredBooks = MOCK_BOOKS.filter((b) => b.featured);
  const recentBooks = MOCK_BOOKS.filter((b) => b.recentlyAdded);
  const featuredAudiobooks = MOCK_AUDIOBOOKS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow">
        {/* Editorial Hero Section */}
        <section className="relative border-b border-[rgba(23,23,23,0.18)] py-8 sm:py-16 md:py-20 bg-[#eeeddb]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 border border-[rgba(23,23,23,0.2)] bg-[#e6e4cf] text-[10px] sm:text-[11px] font-mono-meta uppercase tracking-wider text-[#53514a]">
              <Feather className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#8a493b]" />
              <span>বাংলা সাহিত্যের উন্মুক্ত ডিজিটাল মহাফেজখানা</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif-bengali font-bold text-[#171717] tracking-tight leading-[1.25]">
              চিন্তাশীল পাঠকের জন্য এক নিভৃত পাঠাগার
            </h1>

            {/* Subtext */}
            <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg font-serif-bengali text-[#53514a] leading-relaxed line-clamp-3 sm:line-clamp-none">
              রবীন্দ্রনাথ, শরৎচন্দ্র, বঙ্কিম, বেগম রোকেয়া সহ বাংলা সাহিত্যের কালজয়ী ধ্রুপদী সৃষ্টিকর্মসমূহ
              কোনো পে-ওয়াল বা বিজ্ঞাপন ছাড়াই সম্পূর্ণ বিনামূল্যে সরাসরি ব্রাউজারে নিবিষ্ট হয়ে পাঠ করুন।
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              <Link
                href="/library"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#171717] text-[#eeeddb] font-serif-bengali text-xs sm:text-sm font-semibold hover:bg-[#8a493b] transition-colors"
              >
                <span>সম্পূর্ণ মহাফেজখানা ব্রাউজ করুন</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 border border-[#171717] text-[#171717] font-serif-bengali text-xs sm:text-sm font-semibold hover:bg-[#171717] hover:text-[#eeeddb] transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>আমাদের উদ্দেশ্য ও দর্শন</span>
              </Link>
            </div>

            {/* Feature Pillars */}
            <div className="pt-6 sm:pt-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-left border-t border-[rgba(23,23,23,0.12)] max-w-4xl mx-auto">
              <div className="p-2 sm:p-3 border-r border-[rgba(23,23,23,0.1)]">
                <span className="block font-mono-meta text-[9px] sm:text-[11px] text-[#7a776e] uppercase">০১ • শতভাগ উন্মুক্ত</span>
                <span className="font-serif-bengali text-[11px] sm:text-xs text-[#171717] font-medium leading-tight block mt-0.5">সকল বই বিনামূল্যে সবার জন্য পাঠযোগ্য</span>
              </div>
              <div className="p-2 sm:p-3 md:border-r border-[rgba(23,23,23,0.1)]">
                <span className="block font-mono-meta text-[9px] sm:text-[11px] text-[#7a776e] uppercase">০২ • পাবলিক ডোমেইন</span>
                <span className="font-serif-bengali text-[11px] sm:text-xs text-[#171717] font-medium leading-tight block mt-0.5">কপিরাইট মুক্ত ধ্রুপদী সাহিত্যের সংগ্রহ</span>
              </div>
              <div className="p-2 sm:p-3 border-r border-[rgba(23,23,23,0.1)]">
                <span className="block font-mono-meta text-[9px] sm:text-[11px] text-[#7a776e] uppercase">০৩ • নো ডাউনলোড পলিসি</span>
                <span className="font-serif-bengali text-[11px] sm:text-xs text-[#171717] font-medium leading-tight block mt-0.5">পিসিতে বা মোবাইলে সরাসরি নিবিষ্ট পাঠ</span>
              </div>
              <div className="p-2 sm:p-3">
                <span className="block font-mono-meta text-[9px] sm:text-[11px] text-[#7a776e] uppercase">০৪ • শান্ত ও বিজ্ঞাপনহীন</span>
                <span className="font-serif-bengali text-[11px] sm:text-xs text-[#171717] font-medium leading-tight block mt-0.5">স্ক্রিনের কোলাহলমুক্ত নিভৃত পাঠের অভিজ্ঞতা</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collection Section (2 columns on mobile!) */}
        <section className="py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-b border-[rgba(23,23,23,0.14)]">
          <div className="flex items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[rgba(23,23,23,0.18)]">
            <div>
              <p className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider text-[#8a493b] mb-0.5">
                FEATURED CLASSICS
              </p>
              <h2 className="text-xl sm:text-3xl font-serif-bengali font-bold text-[#171717]">
                নির্বাচিত ধ্রুপদী সংকলন
              </h2>
            </div>
            <Link
              href="/library"
              className="text-xs sm:text-sm font-serif-bengali italic text-[#53514a] hover:text-[#171717] flex items-center gap-1 shrink-0"
            >
              <span>সকল গ্রন্থ</span>
              <span>→</span>
            </Link>
          </div>

          {/* 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Browse by Genre / Department */}
        <section className="py-8 sm:py-12 bg-[#e8e6d3] border-b border-[rgba(23,23,23,0.18)]">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-5 sm:mb-8">
              <p className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider text-[#7a776e] mb-0.5">
                LITERARY CLASSIFICATION
              </p>
              <h2 className="text-xl sm:text-2xl font-serif-bengali font-bold text-[#171717]">
                সাহিত্যধারা অনুযায়ী অন্বেষণ
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {GENRES.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/library?genre=${genre.slug}`}
                  className="group block p-2.5 sm:p-3.5 bg-[#eeeddb] border border-[rgba(23,23,23,0.12)] hover:border-[#171717] hover:bg-[#f7f6ec] transition-all"
                >
                  <span className="block font-mono-meta text-[9px] sm:text-[10px] text-[#8a493b] uppercase">
                    {genre.count} সংকলন
                  </span>
                  <span className="block font-serif-bengali text-xs sm:text-sm font-semibold text-[#171717] mt-0.5 sm:mt-1 group-hover:text-[#8a493b] transition-colors line-clamp-1">
                    {genre.name.split(" ")[0]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Audiobook Showcase Shelf (2 columns on mobile!) */}
        <section className="py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-b border-[rgba(23,23,23,0.14)]">
          <div className="flex items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[rgba(23,23,23,0.18)]">
            <div>
              <p className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider text-[#8a493b] mb-0.5 flex items-center gap-1 font-semibold">
                <Headphones className="w-3 h-3 text-[#8a493b]" />
                AUDIOBOOK ARCHIVE • শ্রুতিপাঠ
              </p>
              <h2 className="text-xl sm:text-3xl font-serif-bengali font-bold text-[#171717]">
                নির্বাচিত শ্রুতিপাঠ ও অডিওবুক
              </h2>
            </div>
            <Link
              href="/audiobooks"
              className="text-xs sm:text-sm font-serif-bengali italic text-[#8a493b] hover:underline shrink-0"
            >
              সকল শ্রুতিপাঠ শুনুন →
            </Link>
          </div>

          {/* 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {featuredAudiobooks.map((audiobook) => (
              <AudioCard key={audiobook.id} audiobook={audiobook} />
            ))}
          </div>
        </section>

        {/* Recent Additions Shelf (2 columns on mobile!) */}
        <section className="py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-b border-[rgba(23,23,23,0.14)]">
          <div className="flex items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[rgba(23,23,23,0.18)]">
            <div>
              <p className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider text-[#7a776e] mb-0.5">
                RECENT DIGITIZATIONS
              </p>
              <h2 className="text-xl sm:text-3xl font-serif-bengali font-bold text-[#171717]">
                সদ্য ডিজিটাইজড গ্রন্থসমূহ
              </h2>
            </div>
            <Link
              href="/library"
              className="text-xs sm:text-sm font-serif-bengali italic text-[#8a493b] hover:underline shrink-0"
            >
              লাইব্রেরিতে যান →
            </Link>
          </div>

          {/* 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Editorial Quote Block */}
        <section className="py-10 sm:py-16 bg-[#e4e2cb] border-b border-[rgba(23,23,23,0.2)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
            <Feather className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#8a493b]" />
            <blockquote className="font-serif-bengali text-base sm:text-2xl font-normal text-[#171717] italic leading-relaxed">
              &ldquo;একটি বই কেবল তথ্য নয়, এটি এক নির্জন কথোপকথন। পুঁথিপিক্সের উদ্দেশ্য পাঠককে
              স্ক্রিনের কৃত্রিম কোলাহল থেকে মুক্ত রেখে এক নিবিষ্ট পাঠের অভিজ্ঞতা দেওয়া।&rdquo;
            </blockquote>
            <p className="font-mono-meta text-[10px] sm:text-xs text-[#7a776e] uppercase tracking-widest">
              — পুঁথিপিক্স সম্পাদকীয় নীতিমালা
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
