"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";

interface PostComposerProps {
  user: { name: string; email: string; role: string } | null;
  onPostCreated: (post: any) => void;
}

export function PostComposer({ user, onPostCreated }: PostComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      const res = await fetch("/api/community/upload", {
        method: "POST",
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
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      // Reset form
      setPostTitle("");
      setContent("");
      setBookTitle("");
      setBookAuthor("");
      setImageUrl("");
      setImageKey("");
      setIsExpanded(false);

      if (onPostCreated && data.post) {
        onPostCreated(data.post);
      }
    } catch (err: any) {
      setSubmitError(err.message || "পোস্ট তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="bg-[#f4f2e4] border-2 border-[#171717] p-4 sm:p-6 shadow-sm font-serif-bengali space-y-3">
        <div className="flex items-center gap-2.5 text-[#171717]">
          <Feather className="w-5 h-5 text-[#8a493b]" />
          <h3 className="text-base sm:text-lg font-bold">
            আমার পুঁথি — উন্মুক্ত সাহিত্য আড্ডায় যোগ দিন
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#53514a] leading-relaxed">
          আপনার পঠিত বইয়ের পর্যালোচনা, স্বরচিত গল্প, কবিতা বা মনের গভীর সাহিত্য ভাবনা প্রকাশ করতে
          অনুগ্রহ করে আপনার অ্যাকাউন্টে প্রবেশ করুন।
        </p>
        <div className="pt-1 flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-[#eeeddb] text-xs font-bold hover:bg-[#8a493b] transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>লগইন করুন</span>
          </Link>
          <Link
            href="/register"
            className="text-xs text-[#8a493b] font-bold hover:underline"
          >
            নতুন পাঠক নিবন্ধন →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f2e4] border-2 border-[#171717] p-4 sm:p-6 shadow-sm font-serif-bengali transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(23,23,23,0.15)]">
        <div className="flex items-center gap-2">
          <Feather className="w-4 h-4 text-[#8a493b]" />
          <span className="font-bold text-[#171717] text-sm">
            {user.name}, আপনার সাহিত্য ভাবনা বা বই পর্যালোচনা লিখুন
          </span>
        </div>
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-[#8a493b] font-bold hover:underline"
          >
            + নতুন পোস্ট
          </button>
        )}
      </div>

      {submitError && (
        <div className="mt-3 p-2.5 bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Collapsed quick trigger */}
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="mt-3 p-3 bg-[#ede9d6] border border-black/15 text-xs text-[#7a776e] cursor-pointer hover:border-black/30 transition-colors flex items-center justify-between"
        >
          <span>এখানে ক্লিক করে নতুন পোস্ট লিখুন...</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#8a493b] font-semibold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>ছবি যোগ করুন</span>
          </span>
        </div>
      ) : (
        /* Full Expanded Form */
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Post Title & Genre */}
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
                className="w-full bg-[#eeeddb] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black font-semibold"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-[11px] text-[#53514a] uppercase mb-1">
                সাহিত্যধারা / বিষয় *
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black font-semibold"
              >
                <option value="বই পর্যালোচনা">বই পর্যালোচনা (Review)</option>
                <option value="স্বরচিত সাহিত্য">স্বরচিত সাহিত্য (Story/Essay)</option>
                <option value="কবিতা ও গান">কবিতা ও পঙক্তি (Poetry)</option>
                <option value="সাহিত্য ভাবনা">সাহিত্য ভাবনা (Thoughts)</option>
                <option value="উদ্ধৃতি ও দর্শন">উদ্ধৃতি ও দর্শন (Quotes)</option>
              </select>
            </div>
          </div>

          {/* Optional Book Reference */}
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

          {/* Main Content Text Area */}
          <div>
            <label className="block font-mono-meta text-[11px] text-[#53514a] uppercase mb-1">
              মূল বক্তব্য বা লেখা *
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="আপনার মতামত, অনুভূতি বা সাহিত্যকর্ম এখানে লিখুন... প্যারাগ্রাফ ও লাইন ব্রেক স্বাভাবিক ফেসবুক পোস্টের মতো প্রদর্শিত হবে।"
              className="w-full bg-[#eeeddb] border border-black/20 p-3 text-[#171717] leading-relaxed focus:outline-none focus:border-black font-serif-bengali text-xs sm:text-sm"
            />
          </div>

          {/* Image Upload Zone (Cloudflare R2, Max 3MB) */}
          <div className="space-y-1.5">
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
                <div className="relative w-36 h-28 sm:w-48 sm:h-32 overflow-hidden bg-black/10">
                  <Image
                    src={imageUrl}
                    alt="Post preview"
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
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#8a493b] text-white flex items-center justify-center shadow-md hover:bg-black"
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black/30 bg-[#ede9d6] hover:bg-[#171717] hover:text-[#eeeddb] transition-colors text-xs font-serif-bengali"
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isUploadingImage
                      ? "Cloudflare R2-তে আপলোড হচ্ছে..."
                      : "ছবি যুক্ত করুন (ঐচ্ছিক)"}
                  </span>
                </button>
                <span className="text-[10px] text-[#7a776e] font-mono-meta">
                  সর্বোচ্চ ৩ মেগাবাইট • JPEG, PNG, WebP
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[rgba(23,23,23,0.15)] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-[#7a776e] hover:text-[#171717]"
            >
              সংক্ষেপ করুন
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#171717] text-[#eeeddb] text-xs font-bold hover:bg-[#8a493b] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>প্রকাশিত হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>'আমার পুঁথি'-তে প্রকাশ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
