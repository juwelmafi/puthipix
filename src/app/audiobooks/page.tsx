"use client";

import { useState, useMemo, useEffect } from "react";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { AudioCard } from "@/components/audio/AudioCard";
import { MOCK_AUDIOBOOKS, AUDIO_CATEGORIES } from "@/data/mockAudiobooks";
import { Headphones, Search, X, Volume2, Sparkles, Filter } from "lucide-react";

export default function AudiobooksPage() {
  const [allAudiobooks, setAllAudiobooks] = useState(MOCK_AUDIOBOOKS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCopyright, setSelectedCopyright] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "duration">("newest");

  // Load audiobooks from Database API (with fallback to mock)
  useEffect(() => {
    fetch("/api/audiobooks")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.audiobooks && data.audiobooks.length > 0) {
          setAllAudiobooks(data.audiobooks);
        }
      })
      .catch(() => {});
  }, []);

  const filteredAudiobooks = useMemo(() => {
    return allAudiobooks.filter((audio) => {
      // Category filter
      if (selectedCategory !== "all" && audio.categorySlug !== selectedCategory) {
        return false;
      }

      // Copyright type filter
      if (selectedCopyright !== "all" && audio.copyrightType !== selectedCopyright) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = audio.title.toLowerCase().includes(query);
        const matchesAuthor = audio.author.toLowerCase().includes(query);
        const matchesNarrator = audio.narrator.toLowerCase().includes(query);
        const matchesDesc = audio.description.toLowerCase().includes(query);
        const matchesEn = audio.titleEn?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesNarrator && !matchesDesc && !matchesEn) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return b.publishedYear - a.publishedYear;
      if (sortBy === "duration") return b.durationSeconds - a.durationSeconds;
      if (sortBy === "title") return a.title.localeCompare(b.title, "bn");
      return 0;
    });
  }, [selectedCategory, selectedCopyright, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-12">
        {/* Editorial Header */}
        <div className="mb-4 sm:mb-8 pb-3 sm:pb-6 border-b border-[rgba(23,23,23,0.18)]">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider text-[#8a493b] flex items-center gap-1 font-semibold">
              <Headphones className="w-3 h-3 text-[#8a493b]" />
              DIGITAL AUDIO ARCHIVE & LISTENING ROOM
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif-bengali font-bold text-[#171717]">
                পুঁথিপিক্স শ্রুতিপাঠ মহাফেজখানা
              </h1>
              <p className="text-xs sm:text-sm font-serif-bengali text-[#53514a] mt-0.5 sm:mt-1.5 max-w-xl">
                ধ্রুপদী ও উন্মুক্ত আধুনিক সাহিত্যের শ্রুতিমধুর বাচিক পরিবেশনা। শতভাগ মুক্ত অডিও মহাফেজখানায় অবগাহন করুন শান্ত মনে।
              </p>
            </div>
            <div className="font-mono-meta text-[10px] sm:text-xs text-[#7a776e] bg-[#e4e2cb] px-2.5 py-1 border border-[rgba(23,23,23,0.12)] self-start md:self-auto flex items-center gap-1.5">
              <Volume2 className="w-3 h-3 text-[#8a493b]" />
              <span>মোট শ্রুতিপাঠ: <strong className="text-[#171717]">{filteredAudiobooks.length}</strong> টি</span>
            </div>
          </div>
        </div>

        {/* Informational Banner on Audio Copyright and Free Listening */}
        <div className="mb-6 bg-[#f4f2e4] border-l-3 border-[#8a493b] p-3 sm:p-4 text-xs font-serif-bengali text-[#53514a] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="font-bold text-[#171717] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8a493b]" />
              উন্মুক্ত শ্রবণনীতি ও কপিরাইট মর্যাদা
            </p>
            <p className="text-[11px] sm:text-xs leading-relaxed">
              এখানে সংরক্ষিত ধ্রুপদী লেখকদের (রবীন্দ্রনাথ, শরৎচন্দ্র, জীবনানন্দ) মূল সাহিত্যকর্ম পাবলিক ডোমেইন। আধুনিক সাহিত্যের ক্ষেত্রে শুধুমাত্র মুক্ত লাইসেন্সপ্রাপ্ত ও অনুমোদিত কণ্ঠপাঠ অন্তর্ভুক্ত করা হয়েছে।
            </p>
          </div>
          <span className="font-mono-meta text-[10px] text-[#8a493b] uppercase px-2 py-0.5 bg-[#e8e6d3] border border-[rgba(23,23,23,0.1)] shrink-0 self-start sm:self-auto">
            ১০০% উন্মুক্ত পাঠ
          </span>
        </div>

        {/* Filter & Controls Bar */}
        <div className="space-y-3 mb-6 bg-[#f4f2e4] p-3 sm:p-4 border border-[rgba(23,23,23,0.15)] shadow-xs">
          {/* Category Tabs (Wrapped cleanly on mobile, 0 cropping!) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#e4e2cb] border border-[rgba(23,23,23,0.15)]">
            {AUDIO_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-2.5 sm:px-3 py-1 text-xs font-serif-bengali transition-all shrink-0 ${
                    isActive
                      ? "bg-[#171717] text-[#eeeddb] font-semibold"
                      : "text-[#53514a] hover:text-[#171717] hover:bg-[#e8e6d3]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter & Search Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শ্রুতিপাঠ, লেখক বা বাচিক শিল্পীর নাম দিয়ে খুঁজুন..."
                className="w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm font-serif-bengali bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] focus:border-[#171717] focus:outline-none transition-colors placeholder:text-[#99968d]"
              />
              <Search className="w-3.5 h-3.5 text-[#7a776e] absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7a776e] hover:text-[#171717]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Copyright Type Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedCopyright}
                onChange={(e) => setSelectedCopyright(e.target.value)}
                className="w-full px-2 py-1.5 text-xs font-serif-bengali bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] focus:border-[#171717] focus:outline-none text-[#171717]"
              >
                <option value="all">সকল স্বত্বাধিকার</option>
                <option value="public-domain">পাবলিক ডোমেইন ক্লাসিক</option>
                <option value="open-license">ক্রিয়েটিভ কমন্স / উন্মুক্ত</option>
                <option value="authorized">অনুমোদিত প্রযোজনা</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-2 py-1.5 text-xs font-serif-bengali bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] focus:border-[#171717] focus:outline-none text-[#171717]"
              >
                <option value="newest">সর্বশেষ সংযোজিত</option>
                <option value="duration">দীর্ঘতম শ্রুতিপাঠ</option>
                <option value="title">শিরোনাম (অ-ক্ষরানুযায়ী)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audiobooks Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        {filteredAudiobooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredAudiobooks.map((audiobook) => (
              <AudioCard key={audiobook.id} audiobook={audiobook} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-[#f4f2e4] border border-[rgba(23,23,23,0.14)] my-6">
            <Headphones className="w-8 h-8 mx-auto text-[#7a776e] opacity-40 mb-3" />
            <h3 className="font-serif-bengali text-base sm:text-lg font-bold text-[#171717]">
              কোনো শ্রুতিপাঠ পাওয়া যায়নি
            </h3>
            <p className="font-serif-bengali text-xs sm:text-sm text-[#53514a] mt-1 max-w-sm mx-auto">
              আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো অডিওবুক এই মুহূর্তে তালিকায় নেই।
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedCopyright("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-1.5 bg-[#171717] text-[#eeeddb] text-xs font-serif-bengali hover:bg-[#8a493b] transition-colors"
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

