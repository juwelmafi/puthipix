"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { BookCard } from "@/components/books/BookCard";
import { User as UserIcon, BookOpen, Clock, Bookmark, BarChart3, LogIn, UserPlus } from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"library" | "continue" | "bookmarks" | "stats">("library");
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
          // Fetch real bookmarks
          fetch("/api/bookmarks")
            .then((bRes) => (bRes.ok ? bRes.json() : null))
            .then((bData) => {
              if (bData?.bookmarks) {
                setBookmarks(bData.bookmarks);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myBooks = MOCK_BOOKS.slice(0, 4);
  const continueReading = [
    {
      book: MOCK_BOOKS[0],
      lastPage: 74,
      totalPages: MOCK_BOOKS[0].pageCount,
      percent: Math.round((74 / MOCK_BOOKS[0].pageCount) * 100),
      lastRead: "আজ সকাল ৯:৩০",
    },
    {
      book: MOCK_BOOKS[1],
      lastPage: 38,
      totalPages: MOCK_BOOKS[1].pageCount,
      percent: Math.round((38 / MOCK_BOOKS[1].pageCount) * 100),
      lastRead: "গতকাল সন্ধ্যায়",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-12">
        {/* User Profile Header */}
        <div className="p-4 sm:p-6 bg-[#e8e6d3] border-2 border-[#171717] mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-[#171717] text-[#eeeddb] flex items-center justify-center font-serif-bengali text-xl sm:text-2xl font-bold shrink-0">
                {user ? user.name.slice(0, 2) : "পা"}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-serif-bengali font-bold text-[#171717] truncate">
                    {user ? user.name : "পাঠক ড্যাশবোর্ড"}
                  </h1>
                  <span className="px-1.5 py-0.5 bg-[#8a493b] text-[#f7f6ec] text-[9px] sm:text-[10px] font-mono-meta uppercase shrink-0">
                    {user ? (user.role === "admin" ? "অ্যাডমিন" : "নিবন্ধিত পাঠক") : "অতিথি পাঠক"}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs font-mono-meta text-[#7a776e] truncate">
                  {user ? `ইমেইল: ${user.email}` : "লগইন করা নেই • ডেমো প্রিভিউ"}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center justify-around sm:justify-end gap-3 sm:gap-6 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[rgba(23,23,23,0.15)]">
              <div className="text-center sm:text-right">
                <span className="block text-[9px] sm:text-[10px] font-mono-meta uppercase text-[#7a776e]">সংরক্ষিত</span>
                <span className="text-base sm:text-lg font-mono-meta font-bold text-[#171717]">{myBooks.length}টি</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="block text-[9px] sm:text-[10px] font-mono-meta uppercase text-[#7a776e]">চলমান পাঠ</span>
                <span className="text-base sm:text-lg font-mono-meta font-bold text-[#8a493b]">{continueReading.length}টি</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="block text-[9px] sm:text-[10px] font-mono-meta uppercase text-[#7a776e]">বুকমার্কস</span>
                <span className="text-base sm:text-lg font-mono-meta font-bold text-[#171717]">
                  {bookmarks.length > 0 ? bookmarks.length : 2}টি
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Warning Banner if not logged in */}
        {!user && !loading && (
          <div className="mb-6 p-3 sm:p-4 bg-[#f4f2e4] border-l-4 border-[#8a493b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-serif-bengali">
            <p className="text-[#53514a]">
              আপনি বর্তমানে অতিথি হিসেবে ড্যাশবোর্ড দেখছেন। আপনার পাঠের ধারাবাহিক অগ্রগতি ও বুকমার্ক সংরক্ষণ করতে লগইন করুন।
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="px-3 py-1 bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] transition-colors flex items-center gap-1 text-[11px]"
              >
                <LogIn className="w-3 h-3" />
                <span>লগইন</span>
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 border border-[#171717] hover:bg-[#171717] hover:text-[#eeeddb] transition-colors flex items-center gap-1 text-[11px]"
              >
                <UserPlus className="w-3 h-3" />
                <span>নিবন্ধন</span>
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Tabs (Wrapped cleanly on mobile, 0 cropping!) */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 border-b border-[rgba(23,23,23,0.18)] mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-serif-bengali transition-all border-b-2 flex items-center gap-1 shrink-0 ${
              activeTab === "library"
                ? "border-[#171717] text-[#171717] font-bold"
                : "border-transparent text-[#53514a] hover:text-[#171717]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>পড়ার তালিকা ({myBooks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("continue")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-serif-bengali transition-all border-b-2 flex items-center gap-1 shrink-0 ${
              activeTab === "continue"
                ? "border-[#171717] text-[#171717] font-bold"
                : "border-transparent text-[#53514a] hover:text-[#171717]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>চলমান পাঠ ({continueReading.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-serif-bengali transition-all border-b-2 flex items-center gap-1 shrink-0 ${
              activeTab === "bookmarks"
                ? "border-[#171717] text-[#171717] font-bold"
                : "border-transparent text-[#53514a] hover:text-[#171717]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>বুকমার্কস ({bookmarks.length > 0 ? bookmarks.length : 2})</span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-serif-bengali transition-all border-b-2 flex items-center gap-1 shrink-0 ${
              activeTab === "stats"
                ? "border-[#171717] text-[#171717] font-bold"
                : "border-transparent text-[#53514a] hover:text-[#171717]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>পরিসংখ্যান</span>
          </button>
        </div>

        {/* Tab Content: My Reading List - 2 columns on mobile! */}
        {activeTab === "library" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {myBooks.map((book) => (
                <div key={book.id} className="flex flex-col">
                  <BookCard book={book} />
                  <Link
                    href={`/read/${book.id}`}
                    className="mt-1.5 py-1.5 px-2 text-center bg-[#171717] text-[#eeeddb] text-[10px] sm:text-xs font-serif-bengali hover:bg-[#8a493b] transition-colors truncate"
                  >
                    পড়া শুরু করুন →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Continue Reading */}
        {activeTab === "continue" && (
          <div className="space-y-3 sm:space-y-4 max-w-3xl">
            {continueReading.map((item) => (
              <div
                key={item.book.id}
                className="p-3 sm:p-4 bg-[#f4f2e4] border border-[rgba(23,23,23,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4"
              >
                <div className="space-y-1">
                  <h3 className="font-serif-bengali font-bold text-sm sm:text-base text-[#171717] line-clamp-1">
                    {item.book.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-serif-bengali text-[#53514a]">
                    লেখক: {item.book.author} • {item.lastRead}
                  </p>
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="w-32 sm:w-48 bg-black/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8a493b] h-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono-meta text-[#7a776e]">
                      {item.lastPage} / {item.totalPages} পৃষ্ঠা ({item.percent}%)
                    </span>
                  </div>
                </div>

                <Link
                  href={`/read/${item.book.id}`}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#171717] text-[#eeeddb] text-[11px] sm:text-xs font-serif-bengali hover:bg-[#8a493b] transition-colors shrink-0 text-center"
                >
                  পৃষ্ঠা {item.lastPage} থেকে পড়ুন
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Bookmarks */}
        {activeTab === "bookmarks" && (
          <div className="max-w-2xl space-y-2.5">
            {bookmarks.length > 0 ? (
              bookmarks.map((bm: any) => (
                <div
                  key={bm._id || bm.id}
                  className="p-2.5 sm:p-3 bg-[#f4f2e4] border border-[rgba(23,23,23,0.12)] flex justify-between items-center text-xs font-mono-meta"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-[#171717] block font-serif-bengali text-xs sm:text-sm truncate">
                      {bm.bookId?.title || "বইয়ের বুকমার্ক"} {bm.bookId?.author ? `— ${bm.bookId.author}` : ""}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#7a776e]">পৃষ্ঠা {bm.pageNumber}</span>
                  </div>
                  <Link
                    href={`/read/${bm.bookId?.slug || bm.bookId?._id || "bk-01"}`}
                    className="text-[#8a493b] hover:underline shrink-0 text-xs font-serif-bengali"
                  >
                    পাতায় যান →
                  </Link>
                </div>
              ))
            ) : (
              <>
                <div className="p-2.5 sm:p-3 bg-[#f4f2e4] border border-[rgba(23,23,23,0.12)] flex justify-between items-center text-xs font-mono-meta">
                  <div className="truncate mr-2">
                    <span className="font-bold text-[#171717] block font-serif-bengali text-xs sm:text-sm truncate">
                      গোরা — রবীন্দ্রনাথ ঠাকুর
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#7a776e]">পৃষ্ঠা ৭৪ • ০২ নভেম্বর ২০২৬</span>
                  </div>
                  <Link href="/read/bk-01" className="text-[#8a493b] hover:underline shrink-0 text-xs font-serif-bengali">
                    পাতায় যান →
                  </Link>
                </div>
                <div className="p-2.5 sm:p-3 bg-[#f4f2e4] border border-[rgba(23,23,23,0.12)] flex justify-between items-center text-xs font-mono-meta">
                  <div className="truncate mr-2">
                    <span className="font-bold text-[#171717] block font-serif-bengali text-xs sm:text-sm truncate">
                      শ্রীকান্ত (প্রথম পর্ব) — শরৎচন্দ্র চট্টোপাধ্যায়
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#7a776e]">পৃষ্ঠা ৩৮ • ৩১ অক্টোবর ২০২৬</span>
                  </div>
                  <Link href="/read/bk-02" className="text-[#8a493b] hover:underline shrink-0 text-xs font-serif-bengali">
                    পাতায় যান →
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab Content: Stats */}
        {activeTab === "stats" && (
          <div className="max-w-3xl bg-[#f4f2e4] border border-[rgba(23,23,23,0.15)] p-4 sm:p-6 space-y-3 sm:space-y-4">
            <h3 className="font-serif-bengali font-bold text-base sm:text-lg text-[#171717]">
              আপনার পাঠের সারসংক্ষেপ
            </h3>
            <p className="text-xs font-serif-bengali text-[#53514a]">
              গত ৩০ দিনে আপনি সর্বমোট ১১২ পৃষ্ঠা পাঠ করেছেন।
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2">
              <div className="p-2 sm:p-3 bg-[#eeeddb] border border-black/10 text-center sm:text-left">
                <span className="text-[9px] sm:text-[10px] font-mono-meta uppercase text-[#7a776e] block">মোট সময়</span>
                <span className="text-xs sm:text-xl font-mono-meta font-bold text-[#171717]">৬ ঘণ্টা</span>
              </div>
              <div className="p-2 sm:p-3 bg-[#eeeddb] border border-black/10 text-center sm:text-left">
                <span className="text-[9px] sm:text-[10px] font-mono-meta uppercase text-[#7a776e] block">পঠিত পৃষ্ঠা</span>
                <span className="text-xs sm:text-xl font-mono-meta font-bold text-[#8a493b]">১১২পৃ</span>
              </div>
              <div className="p-2 sm:p-3 bg-[#eeeddb] border border-black/10 text-center sm:text-left">
                <span className="text-[9px] sm:text-[10px] font-mono-meta uppercase text-[#7a776e] block">সম্পূর্ণ গ্রন্থ</span>
                <span className="text-xs sm:text-xl font-mono-meta font-bold text-[#171717]">১টি</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
