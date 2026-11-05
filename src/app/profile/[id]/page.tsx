"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/community/PostCard";
import {
  User as UserIcon,
  UserPlus,
  UserCheck,
  MessageSquare,
  BookOpen,
  Calendar,
  Feather,
  Shield,
  Sparkles,
  Edit3,
  Loader2,
  ArrowLeft,
  Share2,
  Check,
  Camera,
} from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

interface UserProfileData {
  _id: string;
  name: string;
  role: "user" | "admin" | "super_admin";
  bio: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  isMe: boolean;
  isFollowing: boolean;
  stats: {
    postsCount: number;
    bookmarksCount: number;
    booksReadCount: number;
  };
}

function UserProfileContent() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { openChatWithUser, openChat } = useChat();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Inline bio editing for profile owner
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fetch current user session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch profile data
  const loadProfile = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "প্রোফাইল লোড করতে ব্যর্থ হয়েছে।");
        return;
      }

      setProfile(data.user);
      setBioInput(data.user.bio || "");
      setPosts(data.posts || []);
    } catch (err) {
      setError("নেটওয়ার্ক ত্রুটি! অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  // Follow / Unfollow Handler
  const handleFollowToggle = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (!profile || isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      const res = await fetch(`/api/users/${profile._id}/follow`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: data.isFollowing,
                followersCount: data.followersCount,
              }
            : null
        );
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Save Bio Handler
  const handleSaveBio = async () => {
    if (!profile || isSavingBio) return;
    setIsSavingBio(true);
    try {
      const res = await fetch(`/api/users/${profile._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bioInput }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setProfile((prev) => (prev ? { ...prev, bio: data.user.bio } : null));
        setIsEditingBio(false);
      }
    } catch (err) {
      console.error("Save bio error:", err);
    } finally {
      setIsSavingBio(false);
    }
  };

  // Share profile
  const handleShareProfile = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const formatJoinDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "কিছুদিন আগে";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/amar-puthi"
            className="inline-flex items-center gap-1.5 text-xs font-mono-meta text-[#53514a] hover:text-[#171717] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>'আমার পুঁথি' সাহিত্য চত্বরে ফিরুন</span>
          </Link>

          <button
            onClick={handleShareProfile}
            className="inline-flex items-center gap-1.5 text-xs font-mono-meta px-3 py-1 bg-[#ede9d6] border border-black/15 text-[#53514a] hover:text-[#171717] hover:border-black transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">লিংক কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>প্রোফাইল শেয়ার</span>
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-[#f4f2e4] border-2 border-[#171717] p-8 sm:p-12 space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#ede9d6] border-2 border-black/20" />
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="h-7 bg-[#ede9d6] w-48 mx-auto sm:mx-0 rounded-xs" />
                <div className="h-4 bg-[#ede9d6] w-72 mx-auto sm:mx-0 rounded-xs" />
                <div className="h-5 bg-[#ede9d6] w-36 mx-auto sm:mx-0 rounded-xs" />
              </div>
            </div>
            <div className="h-16 bg-[#ede9d6] rounded-xs" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-[#f4f2e4] border-2 border-red-800 p-8 sm:p-12 text-center space-y-4">
            <UserIcon className="w-12 h-12 mx-auto text-red-700 opacity-60" />
            <h2 className="text-xl font-bold font-serif-bengali text-[#171717]">
              {error}
            </h2>
            <Link
              href="/amar-puthi"
              className="inline-block px-5 py-2 bg-[#171717] text-[#eeeddb] font-serif-bengali text-xs font-bold hover:bg-[#8a493b]"
            >
              সাহিত্য চত্বরে ফিরে যান
            </Link>
          </div>
        )}

        {/* Profile Card */}
        {!loading && profile && (
          <div className="space-y-6">
            {/* Broadsheet Profile Banner Header */}
            <div className="bg-[#f4f2e4] border-2 border-[#171717] p-6 sm:p-8 shadow-sm relative overflow-hidden font-serif-bengali">
              {/* Antique Corner Accents */}
              <div className="absolute top-2 left-2 text-[10px] font-mono-meta text-[#8a493b] opacity-40 select-none">
                [ PUTHPIX READER ARCHIVE ]
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-3">
                {/* Large Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-3xl sm:text-4xl border-3 border-[#8a493b] shadow-md select-none overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.name ? profile.name.charAt(0) : "পা"
                    )}
                  </div>
                  {profile.isMe && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="absolute -bottom-1 -left-1 bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] p-1.5 rounded-full border-2 border-[#eeeddb] shadow-sm transition-colors cursor-pointer"
                      title="ছবি ও প্রোফাইল পরিবর্তন করুন"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {profile.role === "super_admin" && (
                    <span
                      title="সুপার অ্যাডমিন"
                      className="absolute -bottom-1 -right-1 bg-[#8a493b] text-white p-1.5 rounded-full border-2 border-[#eeeddb]"
                    >
                      <Sparkles className="w-4 h-4" />
                    </span>
                  )}
                  {profile.role === "admin" && (
                    <span
                      title="অ্যাডমিন"
                      className="absolute -bottom-1 -right-1 bg-[#171717] text-[#eeeddb] p-1.5 rounded-full border-2 border-[#eeeddb]"
                    >
                      <Shield className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                      <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] leading-tight">
                        {profile.name}
                      </h1>

                      {/* Role Badge */}
                      <span className="inline-block self-center sm:self-auto px-2.5 py-0.5 bg-[#ede9d6] border border-black/20 text-[11px] font-mono-meta font-bold text-[#8a493b] rounded-full">
                        {profile.role === "super_admin"
                          ? "সুপার অ্যাডমিন"
                          : profile.role === "admin"
                          ? "অ্যাডমিন"
                          : "সম্মানিত পাঠক"}
                      </span>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] font-mono-meta text-[#7a776e]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>যোগদান: {formatJoinDate(profile.createdAt)}</span>
                    </div>
                  </div>

                  {/* Bio Area */}
                  {isEditingBio ? (
                    <div className="space-y-2 max-w-lg">
                      <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        maxLength={300}
                        rows={3}
                        className="w-full bg-[#eeeddb] border-2 border-[#171717] p-2.5 text-xs text-[#171717] font-serif-bengali focus:outline-none focus:border-[#8a493b]"
                        placeholder="আপনার সাহিত্য দর্শন বা পরিচয় লিখুন..."
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveBio}
                          disabled={isSavingBio}
                          className="px-3 py-1 bg-[#171717] text-[#eeeddb] text-xs font-bold hover:bg-[#8a493b] flex items-center gap-1 disabled:opacity-50"
                        >
                          {isSavingBio ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          <span>সংরক্ষণ করুন</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingBio(false);
                            setBioInput(profile.bio);
                          }}
                          className="px-3 py-1 bg-[#ede9d6] text-[#171717] text-xs hover:bg-[#ded9c2]"
                        >
                          বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-[#444] leading-relaxed italic max-w-xl flex items-start gap-2 justify-center sm:justify-start">
                      <p>“{profile.bio || "সাহিত্যপ্রেমী পাঠক ও পুথিপিক্স সংগ্রাহক।" }”</p>
                      {profile.isMe && (
                        <button
                          onClick={() => setIsEditingBio(true)}
                          className="text-[#8a493b] hover:text-[#171717] p-0.5 shrink-0"
                          title="পরিচিতি সম্পাদনা করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Stats Counter Bar (Followers, Following, Posts) */}
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs sm:text-sm font-mono-meta border-t border-black/10">
                    <div>
                      <span className="font-bold text-base text-[#171717]">
                        {profile.followersCount}
                      </span>{" "}
                      <span className="text-[#53514a]">অনুসারী</span>
                    </div>
                    <div>
                      <span className="font-bold text-base text-[#171717]">
                        {profile.followingCount}
                      </span>{" "}
                      <span className="text-[#53514a]">অনুসরণ করছেন</span>
                    </div>
                    <div>
                      <span className="font-bold text-base text-[#171717]">
                        {profile.stats?.postsCount || posts.length}
                      </span>{" "}
                      <span className="text-[#53514a]">প্রকাশিত সাহিত্য</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    {profile.isMe ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditModalOpen(true)}
                          className="px-4 py-2 bg-[#8a493b] text-[#eeeddb] hover:bg-[#723a2e] font-serif-bengali font-bold text-xs flex items-center gap-1.5 transition-colors border-2 border-[#171717] shadow-xs cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>প্রোফাইল সম্পাদনা (Edit Profile)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openChat()}
                          className="px-4 py-2 bg-[#ede9d6] text-[#171717] hover:bg-[#171717] hover:text-[#eeeddb] font-serif-bengali font-bold text-xs flex items-center gap-1.5 transition-colors border-2 border-black/20 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#8a493b]" />
                          <span>আমার বার্তা ও ডাকঘর</span>
                        </button>
                        <Link
                          href="/account"
                          className="px-3 py-2 bg-[#f4f2e4] text-[#53514a] hover:text-[#171717] font-serif-bengali text-xs flex items-center gap-1 transition-colors border border-black/20"
                        >
                          <UserIcon className="w-3.5 h-3.5" />
                          <span>অ্যাকাউন্ট সেটিংস</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        {/* Follow / Unfollow Button */}
                        <button
                          onClick={handleFollowToggle}
                          disabled={isFollowLoading}
                          className={`px-5 py-2 font-serif-bengali font-bold text-xs sm:text-sm flex items-center gap-2 border-2 border-[#171717] transition-all cursor-pointer ${
                            profile.isFollowing
                              ? "bg-[#171717] text-[#eeeddb] hover:bg-neutral-800"
                              : "bg-[#8a493b] text-[#eeeddb] hover:bg-[#723a2e]"
                          }`}
                        >
                          {isFollowLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : profile.isFollowing ? (
                            <>
                              <UserCheck className="w-4 h-4 text-emerald-400" />
                              <span>অনুসরণ করছেন ✓</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              <span>অনুসরণ করুন</span>
                            </>
                          )}
                        </button>

                        {/* Send Message Button (Opens Chat Modal directly) */}
                        <button
                          type="button"
                          onClick={() =>
                            openChatWithUser({
                              _id: profile._id,
                              name: profile.name,
                              avatar: profile.avatar,
                              role: profile.role,
                            })
                          }
                          className="px-5 py-2 bg-[#ede9d6] text-[#171717] hover:bg-[#171717] hover:text-[#eeeddb] font-serif-bengali font-bold text-xs sm:text-sm flex items-center gap-2 border-2 border-[#171717] transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-[#8a493b]" />
                          <span>বার্তা পাঠান</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex border-b-2 border-[#171717] font-serif-bengali text-xs sm:text-sm font-bold">
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-6 py-2.5 flex items-center gap-2 border-t-2 border-x-2 transition-colors ${
                  activeTab === "posts"
                    ? "bg-[#f4f2e4] border-[#171717] text-[#171717] -mb-[2px] pb-[12px]"
                    : "bg-[#e8e6d3] border-transparent text-[#7a776e] hover:text-[#171717]"
                }`}
              >
                <Feather className="w-4 h-4 text-[#8a493b]" />
                <span>প্রকাশিত সাহিত্য ও আলোচনা ({posts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("about")}
                className={`px-6 py-2.5 flex items-center gap-2 border-t-2 border-x-2 transition-colors ${
                  activeTab === "about"
                    ? "bg-[#f4f2e4] border-[#171717] text-[#171717] -mb-[2px] pb-[12px]"
                    : "bg-[#e8e6d3] border-transparent text-[#7a776e] hover:text-[#171717]"
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#8a493b]" />
                <span>পাঠক পরিচিতি ও পরিসংখ্যান</span>
              </button>
            </div>

            {/* Tab 1: Published Posts */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="bg-[#f4f2e4] border-2 border-black/15 p-10 text-center space-y-3 font-serif-bengali">
                    <Feather className="w-8 h-8 mx-auto text-[#8a493b] opacity-40" />
                    <h3 className="text-base font-bold text-[#171717]">
                      এখনও কোনো সাহিত্য প্রকাশ করা হয়নি
                    </h3>
                    <p className="text-xs text-[#53514a] max-w-md mx-auto">
                      {profile.isMe
                        ? "আপনি এখনও 'আমার পুঁথি' চত্বরে কোনো লেখা পোস্ট করেননি। আপনার চিন্তা ও অনুভূতি সহপাঠকদের সাথে ভাগ করে নিন।"
                        : `${profile.name} এখনও 'আমার পুঁথি' সাহিত্য চত্বরে কোনো লেখা প্রকাশ করেননি।`}
                    </p>
                    {profile.isMe && (
                      <Link
                        href="/amar-puthi"
                        className="inline-block mt-2 px-5 py-2 bg-[#8a493b] text-[#eeeddb] font-bold text-xs hover:bg-[#723a2e]"
                      >
                        নতুন সাহিত্য পোস্ট লিখুন →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        currentUser={currentUser}
                        onPostUpdated={(updated) => {
                          setPosts((prev) =>
                            prev.map((p) => (p._id === updated._id ? updated : p))
                          );
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Reader About & Stats */}
            {activeTab === "about" && (
              <div className="bg-[#f4f2e4] border-2 border-[#171717] p-6 sm:p-8 font-serif-bengali space-y-6">
                <div className="space-y-2 border-b border-black/10 pb-4">
                  <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#8a493b]" />
                    <span>পাঠক জীবনবৃত্তান্ত ও পরিচিতি</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#444] leading-relaxed whitespace-pre-line">
                    {profile.bio || "এই পাঠক এখনও কোনো বিস্তারিত জীবনী যোগ করেননি।"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-meta text-xs">
                  <div className="p-4 bg-[#ede9d6] border border-black/15 space-y-1">
                    <span className="text-[#7a776e] block text-[10px]">সংরক্ষিত গ্রন্থসমূহ</span>
                    <span className="text-xl font-bold text-[#171717]">
                      {profile.stats?.bookmarksCount || 0} টি
                    </span>
                  </div>

                  <div className="p-4 bg-[#ede9d6] border border-black/15 space-y-1">
                    <span className="text-[#7a776e] block text-[10px]">অধ্যয়নকৃত সাহিত্য</span>
                    <span className="text-xl font-bold text-[#171717]">
                      {profile.stats?.booksReadCount || 0} টি
                    </span>
                  </div>

                  <div className="p-4 bg-[#ede9d6] border border-black/15 space-y-1">
                    <span className="text-[#7a776e] block text-[10px]">সাহিত্য সম্ভারে লেখা</span>
                    <span className="text-xl font-bold text-[#171717]">
                      {profile.stats?.postsCount || posts.length} টি
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#ede9d6]/60 border-l-3 border-[#8a493b] text-xs text-[#53514a] leading-relaxed">
                  <p>
                    পুথিপিক্স উন্মুক্ত মহাফেজখানার সার্বজনীন পাঠক নেটওয়ার্কের সকল পাঠক পারস্পরিক শ্রদ্ধাবোধ ও সাহিত্য সৌহার্দ্যের মাধ্যমে সংযুক্ত।
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Modal */}
        {profile && profile.isMe && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={{
              _id: profile._id,
              name: profile.name,
              bio: profile.bio,
              avatar: profile.avatar,
            }}
            onProfileUpdated={(updated) => {
              setProfile((prev) =>
                prev
                  ? {
                      ...prev,
                      name: updated.name,
                      bio: updated.bio,
                      avatar: updated.avatar,
                    }
                  : null
              );
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#eeeddb]">
          <Loader2 className="w-6 h-6 animate-spin text-[#8a493b]" />
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}

