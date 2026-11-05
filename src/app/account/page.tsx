"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { BookCard } from "@/components/books/BookCard";
import {
  User as UserIcon,
  BookOpen,
  Clock,
  Bookmark,
  BarChart3,
  LogIn,
  UserPlus,
  Feather,
  MessageSquare,
  Heart,
  Shield,
  Headphones,
  Sliders,
  UserCheck,
  ChevronRight,
  Camera,
  Edit3,
} from "lucide-react";
import { AccountSkeleton } from "@/components/ui/Skeletons";
import { useChat } from "@/context/ChatContext";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"library" | "continue" | "bookmarks" | "posts" | "stats">("library");
  const [user, setUser] = useState<{ id?: string; userId?: string; name: string; email: string; role: string; avatar?: string; bio?: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { openChat } = useChat();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("puthipix_session_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    fetch("/api/auth/me", { headers: getAuthHeaders(), credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
          const uid = data.user.id || data.user.userId;

          // For regular users, fetch bookmarks & community posts
          if (data.user.role === "user") {
            fetch("/api/bookmarks", { headers: getAuthHeaders(), credentials: "include" })
              .then((bRes) => (bRes.ok ? bRes.json() : null))
              .then((bData) => {
                if (bData?.bookmarks) {
                  setBookmarks(bData.bookmarks);
                }
              })
              .catch(() => {});

            if (uid) {
              fetch(`/api/community/posts?authorId=${uid}`, { headers: getAuthHeaders(), credentials: "include" })
                .then((pRes) => (pRes.ok ? pRes.json() : null))
                .then((pData) => {
                  if (pData?.posts) {
                    setMyPosts(pData.posts);
                  }
                })
                .catch(() => {});
            }
          }
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

  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");
  const isSuper = user && user.role === "super_admin";

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-12">
        {loading && <AccountSkeleton />}

        {!loading && (
          <>
            {/* Profile Header Box */}
            <div className="p-4 sm:p-6 bg-[#e8e6d3] border-2 border-[#171717] mb-6 sm:mb-8 shadow-sm font-serif-bengali">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-[#171717] text-[#eeeddb] flex items-center justify-center font-serif-bengali text-xl sm:text-2xl font-bold shrink-0 border border-black/20 rounded-full overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user ? user.name.slice(0, 2) : "পা"
                    )}
                  </div>
                  <div className="truncate">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-lg sm:text-2xl font-serif-bengali font-bold text-[#171717] truncate">
                        {user ? user.name : "পাঠক প্রোফাইল"}
                      </h1>
                      <span
                        className={`px-2 py-0.5 text-[9px] sm:text-[10px] font-mono-meta uppercase shrink-0 font-bold ${
                          isSuper
                            ? "bg-amber-600 text-amber-50 border border-amber-800"
                            : isAdmin
                            ? "bg-[#8a493b] text-[#f7f6ec]"
                            : user
                            ? "bg-emerald-800 text-white"
                            : "bg-[#7a776e] text-white"
                        }`}
                      >
                        {isSuper
                          ? "প্রধান সুপার অ্যাডমিন"
                          : isAdmin
                          ? "পুঁথিপিক্স অ্যাডমিন"
                          : user
                          ? "নিবন্ধিত পাঠক"
                          : "অতিথি পাঠক"}
                      </span>
                      {user && (
                        <button
                          type="button"
                          onClick={() => setIsEditModalOpen(true)}
                          className="px-2 py-0.5 bg-[#8a493b] hover:bg-[#723a2e] text-white text-[10px] font-bold rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="নাম ও ছবি পরিবর্তন করুন"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>সম্পাদনা</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs font-mono-meta text-[#7a776e] truncate">
                      {user ? `ইমেইল: ${user.email}` : "লগইন করা নেই • ডেমো প্রিভিউ"}
                    </p>
                    {user && (user.id || user.userId) && (
                      <div className="flex items-center gap-2 pt-1 font-serif-bengali">
                        <Link
                          href={`/profile/${user.id || user.userId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8a493b] hover:text-[#171717] hover:underline"
                        >
                          <span>সার্বজনীন প্রোফাইল দেখুন →</span>
                        </Link>
                        <span className="text-[#7a776e] text-[10px]">•</span>
                        <button
                          type="button"
                          onClick={() => openChat()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#53514a] hover:text-[#171717] hover:underline cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-[#8a493b]" />
                          <span>বার্তা ও আলাপ</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Metrics for Regular Users Only */}
                {!isAdmin && (
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
                )}
              </div>
            </div>

            {/* Guest Warning Banner if not logged in */}
            {!user && (
              <div className="mb-6 p-3 sm:p-4 bg-[#f4f2e4] border-l-4 border-[#8a493b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-serif-bengali">
                <p className="text-[#53514a]">
                  আপনি বর্তমানে অতিথি হিসেবে আছেন। আপনার পাঠের ধারাবাহিক অগ্রগতি ও বুকমার্ক সংরক্ষণ করতে লগইন করুন।
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

            {/* ========================================================= */}
            {/* ADMIN / SUPER ADMIN VIEW                                   */}
            {/* Shows: Admin Control Center & Dashboard CTA Button       */}
            {/* ========================================================= */}
            {isAdmin && (
              <div className="space-y-6 font-serif-bengali">
                <div className="bg-[#f4f2e4] border-2 border-[#171717] p-6 sm:p-8 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/15">
                    <div className="space-y-2 max-w-xl">
                      <span className="text-[10px] font-mono-meta uppercase tracking-wider text-[#8a493b] font-bold">
                        {isSuper ? "SUPER ADMIN PRIVILEGES ACTIVE" : "ADMINISTRATIVE ACCESS"}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
                        পুঁথিপিক্স প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র
                      </h2>
                      <p className="text-xs sm:text-sm text-[#53514a] leading-relaxed">
                        আপনি পুঁথিপিক্সের অনুমোদিত{" "}
                        <strong className="text-[#171717]">
                          {isSuper ? "প্রধান সুপার অ্যাডমিন" : "অ্যাডমিন"}
                        </strong>{" "}
                        হিসেবে দায়িত্ব পালন করছেন। সাইটের সম্পূর্ণ কনটেন্ট সিএমএস,
                        মহাফেজখানার গ্রন্থাবলি, শ্রুতিপাঠ এবং পাঠক সমাজ পরিচালনা করতে নিচের বাটনে
                        ক্লিক করে মূল ড্যাশবোর্ডে প্রবেশ করুন।
                      </p>
                    </div>

                    {/* Prominent Go to Dashboard Button (Admin Only) */}
                    <div className="shrink-0">
                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-3 px-6 py-4 bg-[#8a493b] hover:bg-[#171717] text-[#f7f6ec] text-sm sm:text-base font-bold font-serif-bengali uppercase tracking-wider transition-all shadow-md group"
                      >
                        <Shield className="w-5 h-5 text-[#e8c078] group-hover:rotate-12 transition-transform" />
                        <span>অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Capabilities Overview */}
                  <div className="pt-6">
                    <h3 className="text-xs font-mono-meta uppercase tracking-wider text-[#7a776e] mb-4">
                      আপনার প্রশাসনিক নিয়ন্ত্রণ ক্ষমতাসমূহ:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <BookOpen className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">গ্রন্থ মহাফেজখানা</h4>
                          <p className="text-[11px] text-[#53514a]">বই যুক্ত, এডিট ও ক্লাউডফ্লেয়ার R2 পিডিএফ আপলোড।</p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <Headphones className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">শ্রুতিপাঠ ক্যাটালগ</h4>
                          <p className="text-[11px] text-[#53514a]">অডিওবুক ফাইল ও প্লেলিস্ট ব্যবস্থাপনা।</p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <Sliders className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">কনটেন্ট সিএমএস ও এসইও</h4>
                          <p className="text-[11px] text-[#53514a]">সাইটের প্রতিটি টেক্সট, ব্যানার ও মেটাট্যাগ পরিবর্তন।</p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <Feather className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">‘আমার পুঁথি’ মডারেশন</h4>
                          <p className="text-[11px] text-[#53514a]">পাঠক পোস্ট পর্যালোচনা ও প্রয়োজনবোধে অপসারণ।</p>
                        </div>
                      </div>

                      {isSuper ? (
                        <div className="p-3 bg-amber-100/70 border border-amber-400 sm:col-span-2 flex items-start gap-2.5">
                          <UserCheck className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-amber-950">একক সুপার অ্যাডমিন ক্ষমতা</h4>
                            <p className="text-[11px] text-amber-900">
                              /admin-apply পেজে আবেদনকারীদের আবেদন পর্যালোচনা ও নতুন অ্যাডমিন অনুমোদনের একক ক্ষমতা।
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                          <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-[#171717]">সাধারণ অ্যাডমিন পদ</h4>
                            <p className="text-[11px] text-[#53514a]">কনটেন্ট পরিচালনা করতে পারবেন (অনুমোদন ক্ষমতা সুপার অ্যাডমিনের)।</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* REGULAR USER PROFILE VIEW (Normal Readers)                 */}
            {/* Shows: Saved Books, Continue Reading, Bookmarks, Posts    */}
            {/* ========================================================= */}
            {!isAdmin && (
              <>
                {/* Dashboard Tabs */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 border-b border-[rgba(23,23,23,0.18)] mb-6 sm:mb-8 font-serif-bengali">
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
                    onClick={() => setActiveTab("posts")}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-serif-bengali transition-all border-b-2 flex items-center gap-1 shrink-0 ${
                      activeTab === "posts"
                        ? "border-[#171717] text-[#171717] font-bold"
                        : "border-transparent text-[#53514a] hover:text-[#171717]"
                    }`}
                  >
                    <Feather className="w-3.5 h-3.5 text-[#8a493b]" />
                    <span>আমার পোস্টসমূহ ({myPosts.length})</span>
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

                {/* Tab Content: My Reading List */}
                {activeTab === "library" && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 font-serif-bengali">
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
                  <div className="space-y-3 sm:space-y-4 max-w-3xl font-serif-bengali">
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
                          পড়া চালিয়ে যান →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab Content: Bookmarks */}
                {activeTab === "bookmarks" && (
                  <div className="space-y-3 max-w-2xl font-serif-bengali">
                    {bookmarks.length > 0 ? (
                      bookmarks.map((bm: any, index: number) => (
                        <div
                          key={bm._id || index}
                          className="p-3 bg-[#f4f2e4] border border-[rgba(23,23,23,0.15)] flex items-center justify-between"
                        >
                          <div>
                            <span className="font-serif-bengali font-bold text-xs sm:text-sm text-[#171717]">
                              {bm.bookTitle || "গ্রন্থ বুকমার্ক"}
                            </span>
                            <span className="block text-[10px] sm:text-[11px] font-mono-meta text-[#7a776e]">
                              পৃষ্ঠা নং: {bm.pageNumber || 1} • {bm.note || "গুরুত্বপূর্ণ অংশ"}
                            </span>
                          </div>
                          <Link
                            href={`/read/${bm.bookId || "bk-01"}?page=${bm.pageNumber || 1}`}
                            className="px-2.5 py-1 text-[10px] sm:text-[11px] font-mono-meta uppercase bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] transition-colors"
                          >
                            যান →
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-[#7a776e] bg-[#f4f2e4] border border-black/10">
                        আপনার কোনো বুকমার্ক সংরক্ষিত নেই। যেকোনো বই পড়ার সময় বুকমার্ক আইকনে ক্লিক করুন।
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content: My Posts */}
                {activeTab === "posts" && (
                  <div className="space-y-4 max-w-3xl font-serif-bengali">
                    {myPosts.length > 0 ? (
                      myPosts.map((p: any) => (
                        <div
                          key={p._id}
                          className="p-4 bg-[#f4f2e4] border border-black/15 space-y-2"
                        >
                          <div className="flex items-center justify-between text-[11px] text-[#7a776e]">
                            <span>{p.genre}</span>
                            <span>{new Date(p.createdAt).toLocaleDateString("bn-BD")}</span>
                          </div>
                          <h4 className="font-bold text-base text-[#171717]">{p.postTitle}</h4>
                          <p className="text-xs text-[#53514a] line-clamp-2">{p.content}</p>
                          <div className="flex items-center gap-4 text-xs text-[#7a776e] pt-1 border-t border-black/10">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-rose-600" />
                              {p.likesCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                              {p.commentsCount || 0} মন্তব্য
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-[#7a776e] bg-[#f4f2e4] border border-black/10 space-y-2">
                        <p>আপনি ‘আমার পুঁথি’ চত্বরে এখনো কোনো পোস্ট বা সাহিত্য ভাবনা প্রকাশ করেননি।</p>
                        <Link
                          href="/amar-puthi"
                          className="inline-block px-3 py-1.5 bg-[#171717] text-[#eeeddb] text-[11px] hover:bg-[#8a493b]"
                        >
                          ‘আমার পুঁথি’-তে লিখুন →
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content: Stats */}
                {activeTab === "stats" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl font-serif-bengali">
                    <div className="p-4 bg-[#f4f2e4] border border-[rgba(23,23,23,0.15)] text-center space-y-1">
                      <span className="block text-2xl font-mono-meta font-bold text-[#8a493b]">১২</span>
                      <span className="text-xs text-[#53514a]">মোট পঠিত পৃষ্ঠা</span>
                    </div>
                    <div className="p-4 bg-[#f4f2e4] border border-[rgba(23,23,23,0.15)] text-center space-y-1">
                      <span className="block text-2xl font-mono-meta font-bold text-[#171717]">৩ ঘণ্টা</span>
                      <span className="text-xs text-[#53514a]">পড়ার মোট সময়</span>
                    </div>
                    <div className="p-4 bg-[#f4f2e4] border border-[rgba(23,23,23,0.15)] text-center space-y-1">
                      <span className="block text-2xl font-mono-meta font-bold text-[#171717]">{myPosts.length}টি</span>
                      <span className="text-xs text-[#53514a]">প্রকাশিত সাহিত্য পোস্ট</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Edit Profile Modal */}
        {user && (user.id || user.userId) && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={{
              _id: (user.id || user.userId) as string,
              name: user.name,
              bio: user.bio,
              avatar: user.avatar,
            }}
            onProfileUpdated={(updated) => {
              setUser((prev) => (prev ? { ...prev, ...updated } : null));
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
