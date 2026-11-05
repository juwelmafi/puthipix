"use client";

import { useState, useEffect } from "react";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { PostComposer } from "@/components/community/PostComposer";
import { PostCard } from "@/components/community/PostCard";
import { MOCK_COMMUNITY_POSTS } from "@/data/mockCommunityPosts";
import { PostSkeletonFeed } from "@/components/ui/Skeletons";
import { Feather, BookOpen, Sparkles, MessageSquare } from "lucide-react";

export default function AmarPuthiPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string; userId?: string } | null>(null);
  const [posts, setPosts] = useState<any[]>(MOCK_COMMUNITY_POSTS);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState("all");
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const genres = [
    { id: "all", label: "সকল লেখা" },
    { id: "বই পর্যালোচনা", label: "বই পর্যালোচনা" },
    { id: "স্বরচিত সাহিত্য", label: "স্বরচিত সাহিত্য" },
    { id: "কবিতা ও গান", label: "কবিতা ও গান" },
    { id: "সাহিত্য ভাবনা", label: "সাহিত্য ভাবনা" },
    { id: "উদ্ধৃতি ও দর্শন", label: "উদ্ধৃতি ও দর্শন" },
  ];

  // Fetch Current User
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // Fetch Posts
  const fetchPosts = async (genreFilter = activeGenre) => {
    setLoading(true);
    try {
      const url =
        genreFilter === "all"
          ? "/api/community/posts?limit=50"
          : `/api/community/posts?genre=${encodeURIComponent(genreFilter)}&limit=50`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error("Fetch community posts failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeGenre);
  }, [activeGenre]);

  const handlePostCreated = (newPost: any) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb] font-serif-bengali">
      <Masthead />

      <main className="flex-grow max-w-4xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Hero Banner */}
        <section className="text-center py-4 sm:py-6 border-b-2 border-[#171717] space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ede9d6] border border-black/15 text-xs text-[#8a493b] font-bold">
            <Feather className="w-3.5 h-3.5" />
            <span>উন্মুক্ত সাহিত্য চত্বর ও পাঠক সমাজ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
            আমার পুঁথি
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#53514a] leading-relaxed">
            এখানে পাঠক নিজেই লেখক, পর্যালোচক ও ভাবুক। আপনার পঠিত বইয়ের গভীর অনুভূতি,
            স্বরচিত ছোটগল্প বা কবিতা শেয়ার করুন সহমর্মী পাঠকদের সাথে।
          </p>

          <div className="pt-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#8a493b] hover:bg-[#171717] text-[#eeeddb] text-xs font-bold transition-all shadow-xs"
            >
              <Feather className="w-3.5 h-3.5 text-[#e8c078]" />
              <span>নতুন লেখা প্রকাশ করুন</span>
            </button>
          </div>
        </section>

        {/* Post Composer Card (Triggers Popup Modal) */}
        <PostComposer
          user={user}
          onPostCreated={handlePostCreated}
          isExternalOpen={isComposerOpen}
          onCloseExternal={() => setIsComposerOpen(false)}
        />

        {/* Genre Filter Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-[rgba(23,23,23,0.18)]">
          {genres.map((g) => {
            const isActive = activeGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGenre(g.id)}
                className={`px-3 py-1.5 text-xs whitespace-nowrap transition-colors border ${
                  isActive
                    ? "bg-[#171717] text-[#eeeddb] border-[#171717] font-bold"
                    : "bg-[#f4f2e4] text-[#53514a] hover:bg-[#ede9d6] hover:text-[#171717] border-black/15"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Posts Feed */}
        {loading ? (
          <PostSkeletonFeed count={3} />
        ) : posts.length === 0 ? (
          <div className="bg-[#f4f2e4] border-2 border-[#171717] p-8 sm:p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 mx-auto text-[#8a493b] opacity-60" />
            <h3 className="text-base sm:text-lg font-bold text-[#171717]">
              এই বিভাগে এখনও কোনো পোস্ট প্রকাশিত হয়নি।
            </h3>
            <p className="text-xs text-[#53514a] max-w-md mx-auto leading-relaxed">
              আপনিই হতে পারেন এই প্রাঙ্গণের প্রথম রচয়িতা! ওপরের পোস্ট বক্সে আপনার প্রথম পর্যালোচনা বা লেখা লিখে প্রকাশ করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

