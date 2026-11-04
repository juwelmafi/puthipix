"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Feather,
  Image as ImageIcon,
  BookOpen,
  Send,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  LogIn,
  UploadCloud,
  PenTool,
  Sparkles,
} from "lucide-react";

interface PostComposerProps {
  user: { name: string; email: string; role: string } | null;
  onPostCreated: (post: any) => void;
  isExternalOpen?: boolean;
  onCloseExternal?: () => void;
}

export function PostComposer({
  user,
  onPostCreated,
  isExternalOpen,
  onCloseExternal,
}: PostComposerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [genre, setGenre] = useState("বই পর্যালোচনা");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync external open state if provided
  useEffect(() => {
    if (isExternalOpen !== undefined) {
      if (isExternalOpen) {
        if (!user) {
          setShowAuthModal(true);
        } else {
          setIsModalOpen(true);
        }
      } else {
        setIsModalOpen(false);
      }
    }
  }, [isExternalOpen, user]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (isModalOpen || showAuthModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, showAuthModal]);

  const openModal = (defaultGenre?: string, triggerImage = false) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (defaultGenre) {
      setGenre(defaultGenre);
    }
    setSubmitError("");
    setImageError("");
    setIsModalOpen(true);
    if (triggerImage) {
      setTimeout(() => fileInputRef.current?.click(), 200);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowAuthModal(false);
    if (onCloseExternal) {
      onCloseExternal();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");
    if (file.size > 3 * 1024 * 1024) {
      setImageError("ছবির সাইজ ৩ মেগাবাইটের বেশি হতে পারবে না।");
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("puthipix_session_token")
          : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/community/upload", {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ছবি আপলোড ব্যর্থ হয়েছে।");
      }

      setImageUrl(data.url);
      setImageKey(data.key);
    } catch (err: any) {
      setImageError(err.message || "ছবি আপলোডে সমস্যা হয়েছে।");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!user) {
      setSubmitError("পোস্ট প্রকাশ করতে অনুগ্রহ করে প্রথমে লগইন করুন।");
      return;
    }

    if (!postTitle.trim()) {
      setSubmitError("অনুগ্রহ করে একটি শিরোনাম লিখুন।");
      return;
    }

    if (!content.trim()) {
      setSubmitError("পোস্টের মূল বক্তব্য বা লেখা খালি রাখা যাবে না।");
      return;
    }

    setIsSubmitting(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("puthipix_session_token")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers,
        body: JSON.stringify({
          postTitle: postTitle.trim(),
          genre,
          bookTitle: bookTitle.trim(),
          bookAuthor: bookAuthor.trim(),
          content: content.trim(),
          image: imageUrl,
          imageKey: imageKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "পোস্ট প্রকাশ করতে ব্যর্থ হয়েছে।");
      }

      // Reset form and close modal
      setPostTitle("");
      setContent("");
      setBookTitle("");
      setBookAuthor("");
      setImageUrl("");
      setImageKey("");
      closeModal();

      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 5000);

      if (onPostCreated && data.post) {
        onPostCreated(data.post);
      }
    } catch (err: any) {
      setSubmitError(err.message || "পোস্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Notification Bar */}
      {postSuccess && (
        <div className="p-3.5 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 text-xs font-serif-bengali flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">
              আপনার লেখাটি সফলভাবে ‘আমার পুঁথি’ চত্বরে প্রকাশিত হয়েছে!
            </span>
          </div>
          <button
            onClick={() => setPostSuccess(false)}
            className="text-emerald-800 hover:text-black text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Clean Trigger Card on Page (Not inline form) */}
      <div className="bg-[#f4f2e4] border-2 border-[#171717] p-3.5 sm:p-5 shadow-sm font-serif-bengali space-y-3">
        <div className="flex items-center gap-3">
          {/* User Initial Circle */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-sm shrink-0 border border-black/20 shadow-xs">
            {user?.name ? user.name.charAt(0) : <Feather className="w-4 h-4 text-[#e8c078]" />}
          </div>

          {/* Trigger Input Bar */}
          <button
            type="button"
            onClick={() => openModal()}
            className="flex-1 text-left bg-[#eeeddb] border border-black/20 hover:border-black/60 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#7a776e] hover:text-[#171717] transition-all rounded-xs truncate shadow-inner"
          >
            {user
              ? `${user.name}, আপনার সাহিত্য ভাবনা বা বই পর্যালোচনা লিখুন...`
              : "নতুন সাহিত্য ভাবনা বা বই পর্যালোচনা লিখতে এখানে ক্লিক করুন..."}
          </button>

          {/* Direct Write Button */}
          <button
            type="button"
            onClick={() => openModal()}
            className="bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <PenTool className="w-3.5 h-3.5 text-[#e8c078]" />
            <span className="hidden sm:inline">নতুন পোস্ট</span>
            <span className="sm:hidden">লিখুন</span>
          </button>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => openModal("বই পর্যালোচনা")}
              className="inline-flex items-center gap-1.5 text-[#53514a] hover:text-[#8a493b] transition-colors py-1 px-1.5 rounded hover:bg-black/5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8a493b]" />
              <span>বই পর্যালোচনা</span>
            </button>
            <button
              type="button"
              onClick={() => openModal("স্বরচিত সাহিত্য")}
              className="inline-flex items-center gap-1.5 text-[#53514a] hover:text-[#8a493b] transition-colors py-1 px-1.5 rounded hover:bg-black/5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>স্বরচিত গল্প/প্রবন্ধ</span>
            </button>
            <button
              type="button"
              onClick={() => openModal("কবিতা ও গান")}
              className="inline-flex items-center gap-1.5 text-[#53514a] hover:text-[#8a493b] transition-colors py-1 px-1.5 rounded hover:bg-black/5"
            >
              <Feather className="w-3.5 h-3.5 text-indigo-700" />
              <span>কবিতা ও পঙক্তি</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => openModal(undefined, true)}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#8a493b] font-semibold hover:underline shrink-0 pl-2"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ছবি সংযুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* ----------------- POPUP MODAL (Clean Fullscreen Overlay) ----------------- */}
      {isModalOpen && user && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[#f4f2e4] border-2 border-[#171717] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl font-serif-bengali my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b-2 border-[#171717] bg-[#eeeddb] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Feather className="w-5 h-5 text-[#8a493b]" />
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#171717] leading-tight">
                    ‘আমার পুঁথি’ — নতুন লেখা প্রকাশ
                  </h3>
                  <p className="text-[11px] text-[#53514a] font-mono-meta">
                    পাঠক চত্বরে আপনার সাহিত্য ভাবনা বা বই পর্যালোচনা শেয়ার করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                title="বন্ধ করুন (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-grow">
              {/* User Identity Row */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/10">
                <div className="w-7 h-7 rounded-full bg-[#8a493b] text-[#eeeddb] flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-[#171717] text-xs block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#7a776e] font-mono-meta">
                    {user.role === "admin" ? "অ্যাডমিন পর্যালোচক" : "সাহিত্যপ্রেমী পাঠক"}
                  </span>
                </div>
              </div>

              {/* Submit Error Notice */}
              {submitError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Post Title & Genre Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-mono-meta text-[11px] text-[#53514a] uppercase mb-1">
                    পোস্টের শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="যেমন: অপুর শৈশব ও পথের পাঁচালীর চিরন্তন সুর..."
                    className="w-full bg-[#eeeddb] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black font-semibold text-xs sm:text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-mono-meta text-[11px] text-[#53514a] uppercase mb-1">
                    সাহিত্যধারা / বিষয় *
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-[#eeeddb] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black font-semibold text-xs"
                  >
                    <option value="বই পর্যালোচনা">বই পর্যালোচনা (Review)</option>
                    <option value="স্বরচিত সাহিত্য">স্বরচিত সাহিত্য (Story/Essay)</option>
                    <option value="কবিতা ও গান">কবিতা ও পঙক্তি (Poetry)</option>
                    <option value="সাহিত্য ভাবনা">সাহিত্য ভাবনা (Thoughts)</option>
                    <option value="উদ্ধৃতি ও দর্শন">উদ্ধৃতি ও দর্শন (Quotes)</option>
                  </select>
                </div>
              </div>

              {/* Optional Book Reference (Visible when genre is review) */}
              {genre === "বই পর্যালোচনা" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#ede9d6] border border-black/10">
                  <div>
                    <label className="block font-mono-meta text-[10px] text-[#53514a] uppercase mb-1">
                      বইয়ের নাম (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="যেমন: চাঁদের পাহাড়"
                      className="w-full bg-[#f4f2e4] border border-black/20 p-1.5 text-[#171717] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-meta text-[10px] text-[#53514a] uppercase mb-1">
                      মূল লেখক (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      placeholder="যেমন: বিভূতিভূষণ বন্দ্যোপাধ্যায়"
                      className="w-full bg-[#f4f2e4] border border-black/20 p-1.5 text-[#171717] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Main Content Textarea */}
              <div>
                <label className="block font-mono-meta text-[11px] text-[#53514a] uppercase mb-1">
                  মূল বক্তব্য বা লেখা *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="আপনার বিস্তারিত অনুভূতি, মূল্যায়ন বা সাহিত্যকর্ম এখানে লিখুন... প্যারাগ্রাফ ও লাইন ব্রেক ফেসবুকের মতো সংরক্ষিত থাকবে।"
                  className="w-full bg-[#eeeddb] border border-black/20 p-3 text-[#171717] leading-relaxed focus:outline-none focus:border-black font-serif-bengali text-xs sm:text-sm"
                />
              </div>

              {/* Image Upload Zone (Cloudflare R2, Max 3MB) */}
              <div className="space-y-1.5 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imageError && (
                  <p className="text-red-700 text-[11px] font-mono-meta">{imageError}</p>
                )}

                {imageUrl ? (
                  <div className="relative inline-block border-2 border-[#171717] p-1 bg-[#ede9d6]">
                    <div className="relative w-40 h-28 sm:w-48 sm:h-32 overflow-hidden bg-black/10">
                      <Image
                        src={imageUrl}
                        alt="Post image preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImageKey("");
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#8a493b] text-white flex items-center justify-center shadow-md hover:bg-black transition-colors"
                      title="ছবি মুছুন"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-mono-meta pt-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Cloudflare R2-তে সংরক্ষিত</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 p-3 bg-[#ede9d6] border border-black/10">
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black/30 bg-[#f4f2e4] hover:bg-[#171717] hover:text-[#eeeddb] transition-colors text-xs font-serif-bengali font-semibold shadow-2xs"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5 text-[#8a493b]" />
                      )}
                      <span>
                        {isUploadingImage
                          ? "Cloudflare R2-তে আপলোড হচ্ছে..."
                          : "ছবি যুক্ত করুন (ঐচ্ছিক)"}
                      </span>
                    </button>
                    <span className="text-[10px] text-[#7a776e] font-mono-meta">
                      সর্বোচ্চ ৩ মেগাবাইট • JPG, PNG, WebP
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-4 border-t border-[rgba(23,23,23,0.18)] flex items-center justify-end gap-3 sticky bottom-0 bg-[#f4f2e4] py-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-black/30 text-xs hover:bg-black/5 font-serif-bengali"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#171717] text-[#eeeddb] text-xs font-bold hover:bg-[#8a493b] transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>প্রকাশিত হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>‘আমার পুঁথি’-তে প্রকাশ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- LOGIN REQUIRED MODAL (If unauthenticated) ----------------- */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#f4f2e4] border-2 border-[#171717] max-w-md w-full p-6 space-y-4 shadow-2xl font-serif-bengali animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-black/15 pb-2">
              <div className="flex items-center gap-2 text-[#171717]">
                <Feather className="w-5 h-5 text-[#8a493b]" />
                <h3 className="text-base sm:text-lg font-bold">লগইন প্রয়োজন</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-black/50 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#53514a] leading-relaxed">
              ‘আমার পুঁথি’ চত্বরে বই পর্যালোচনা, সাহিত্য ভাবনা বা স্বরচিত লেখা প্রকাশ করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="px-3.5 py-1.5 border border-black/30 text-xs hover:bg-black/5"
              >
                পরে করব
              </button>
              <Link
                href="/login?redirect=/amar-puthi"
                className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#171717] text-[#eeeddb] text-xs font-bold hover:bg-[#8a493b] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন করুন</span>
              </Link>
              <Link
                href="/register?redirect=/amar-puthi"
                className="inline-flex items-center gap-1 px-4 py-1.5 border border-[#8a493b] text-[#8a493b] hover:bg-[#8a493b] hover:text-white text-xs font-bold transition-colors"
              >
                <span>নিবন্ধন করুন</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
