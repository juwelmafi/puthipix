"use client";

import { useState, useMemo, useEffect } from "react";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";
import { BookGridSkeleton } from "@/components/ui/Skeletons";
import { MOCK_BOOKS, GENRES } from "@/data/mockBooks";
import { Search, BookOpen, X, SlidersHorizontal } from "lucide-react";

export default function LibraryPage() {
  const [allBooks, setAllBooks] = useState(MOCK_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "year">("newest");
  const [loading, setLoading] = useState(false);

  // Load books from Database API (with fallback to mock)
  useEffect(() => {
    setLoading(true);
    fetch("/api/books?limit=100")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.books && data.books.length > 0) {
          setAllBooks(data.books);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Read genre query param on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const genre = params.get("genre");
      if (genre) setSelectedGenre(genre);
    }
  }, []);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      // Genre filter
      if (selectedGenre !== "all" && book.genreSlug !== selectedGenre) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesDesc = book.description.toLowerCase().includes(query);
        const matchesEn = book.titleEn?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesDesc && !matchesEn) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return b.publishedYear - a.publishedYear;
      if (sortBy === "year") return a.publishedYear - b.publishedYear;
      if (sortBy === "title") return a.title.localeCompare(b.title, "bn");
      return 0;
    });
  }, [selectedGenre, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
        {/* Page Title & Kicker */}
        <div className="mb-4 sm:mb-6 pb-3 sm:pb-5 border-b border-[rgba(23,23,23,0.18)]">
          <p className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider text-[#8a493b] mb-0.5">
            OPEN DIGITAL ARCHIVE CATALOGUE
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif-bengali font-bold text-[#171717]">
                পুঁথিপিক্স উন্মুক্ত মহাফেজখানা
              </h1>
              <p className="text-xs sm:text-sm font-serif-bengali text-[#53514a] mt-0.5 sm:mt-1 max-w-xl">
                বাংলা সাহিত্যের ক্লাসিক উপন্যাস, কবিতা, গল্প ও প্রবন্ধের মুক্ত পাঠাগার।
              </p>
            </div>
            <div className="font-mono-meta text-[10px] sm:text-xs text-[#7a776e] bg-[#e4e2cb] px-2.5 py-1 border border-[rgba(23,23,23,0.12)] self-start md:self-auto">
              মোট গ্রন্থ: <span className="text-[#171717] font-bold">{filteredBooks.length}</span> টি
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-3 mb-6 bg-[#f4f2e4] p-3 sm:p-4 border border-[rgba(23,23,23,0.15)] shadow-xs">
          {/* Search & Sort Controls Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বইয়ের নাম বা লেখক দিয়ে অনুসন্ধান করুন..."
                className="w-full bg-[#eeeddb] border border-[rgba(23,23,23,0.2)] px-3 py-1.5 pl-8 text-xs sm:text-sm font-serif-bengali text-[#171717] placeholder-[#7a776e] focus:outline-none focus:border-[#171717]"
              />
              <Search className="w-3.5 h-3.5 text-[#7a776e] absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7a776e] hover:text-[#171717]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[10px] sm:text-[11px] font-mono-meta text-[#7a776e] uppercase shrink-0">ক্রম:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#eeeddb] border border-[rgba(23,23,23,0.2)] px-2 py-1.5 text-xs font-serif-bengali text-[#171717] focus:outline-none focus:border-[#171717]"
              >
                <option value="newest">সর্বশেষ সংযোজিত</option>
                <option value="year">আদি প্রকাশকাল</option>
                <option value="title">শিরোনাম (অক্ষরানুযায়ী)</option>
              </select>
            </div>
          </div>

          {/* Unified Genre Tabs (flex-wrap guarantees 0 cropping on any phone) */}
          <div className="pt-2 border-t border-[rgba(23,23,23,0.1)]">
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono-meta text-[#7a776e] mb-1.5 uppercase">
              <SlidersHorizontal className="w-3 h-3 text-[#8a493b]" />
              <span>সাহিত্যধারা ও বিভাগ:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setSelectedGenre("all")}
                className={`text-xs px-2.5 sm:px-3 py-1 border transition-colors shrink-0 font-serif-bengali ${
                  selectedGenre === "all"
                    ? "bg-[#171717] text-[#eeeddb] border-[#171717] font-semibold shadow-xs"
                    : "bg-[#eeeddb] text-[#53514a] border-[rgba(23,23,23,0.18)] hover:border-[#171717] hover:bg-[#ede9d6]"
                }`}
              >
                সকল বিভাগ
              </button>
              {GENRES.map((genre) => {
                const isSelected = selectedGenre === genre.slug;
                return (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.slug)}
                    className={`text-xs px-2.5 sm:px-3 py-1 border transition-colors shrink-0 font-serif-bengali ${
                      isSelected
                        ? "bg-[#171717] text-[#eeeddb] border-[#171717] font-semibold shadow-xs"
                        : "bg-[#eeeddb] text-[#53514a] border-[rgba(23,23,23,0.18)] hover:border-[#171717] hover:bg-[#ede9d6]"
                    }`}
                  >
                    {genre.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Books Grid - 2 columns on mobile! */}
        {loading ? (
          <BookGridSkeleton count={8} />
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[rgba(23,23,23,0.2)] bg-[#f4f2e4] p-6">
            <BookOpen className="w-8 h-8 mx-auto text-[#7a776e] mb-2" />
            <h3 className="text-base font-serif-bengali font-bold text-[#171717]">
              কোনো গ্রন্থ খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs font-serif-bengali text-[#53514a] mt-1 max-w-xs mx-auto">
              অনুসন্ধানের শব্দ পরিবর্তন করে বা ফিল্টার রিসেট করে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSelectedGenre("all");
                setSearchQuery("");
              }}
              className="mt-3 px-4 py-1.5 bg-[#171717] text-[#eeeddb] text-xs font-serif-bengali hover:bg-[#8a493b] transition-colors"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
