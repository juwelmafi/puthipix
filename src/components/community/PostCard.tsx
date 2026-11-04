"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Share2,
  BookOpen,
  Send,
  Loader2,
  Check,
  User,
  Clock,
  Sparkles,
  Maximize2,
  X,
} from "lucide-react";

interface CommentItem {
  _id: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface PostCardProps {
  post: {
    _id: string;
    author: string;
    authorName: string;
    userAvatar?: string;
    bookTitle?: string;
    bookAuthor?: string;
    postTitle: string;
    genre: string;
    content: string;
    image?: string;
    likesCount: number;
    commentsCount: number;
    isLikedByMe?: boolean;
    createdAt: string;
  };
  currentUser: { name: string; email: string; role: string; userId?: string } | null;
  onPostUpdated?: (updatedPost: any) => void;
}

export function PostCard({ post, currentUser, onPostUpdated }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(Boolean(post.isLikedByMe));
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [isExpandedText, setIsExpandedText] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!mounted) {
        return "কিছুক্ষণ আগে";
      }
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 1) return "এইমাত্র";
      if (diffMinutes < 60) return `${diffMinutes} মিনিট আগে`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} দিন আগে`;
    } catch {
      return "";
    }
  };

  // Toggle Like Handler
  const handleLike = async () => {
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    // Optimistic UI update
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch(`/api/community/posts/${post._id}/like`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      } else {
        // Revert on error
        setIsLiked(!nextLiked);
        setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch {
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setIsLiking(false);
    }
  };

  // Load Comments
  const handleToggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);

    if (nextState && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/community/posts/${post._id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
          setCommentsCount(data.count || 0);
        }
      } catch (err) {
        console.error("Load comments error", err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  // Submit Comment Handler
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }
    if (!commentInput.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/community/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setCommentsCount((c) => c + 1);
        setCommentInput("");
      }
    } catch (err) {
      console.error("Add comment error", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Share Handler
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/amar-puthi#post-${post._id}` : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.postTitle,
          text: post.content.slice(0, 100),
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const isLongText = post.content.length > 280;

  return (
    <article
      id={`post-${post._id}`}
      className="bg-[#f4f2e4] border-2 border-[#171717] p-4 sm:p-6 shadow-sm font-serif-bengali transition-all space-y-3.5 relative"
    >
      {/* Post Header: Author info, genre, timestamp */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-sm shrink-0 border border-black/20">
            {post.authorName ? post.authorName.charAt(0) : "পা"}
          </div>
          <div>
            <span className="font-bold text-[#171717] text-sm sm:text-base block leading-tight">
              {post.authorName}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono-meta text-[#7a776e]">
              <Clock className="w-3 h-3" />
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Genre Pill */}
        <span className="inline-block px-2.5 py-0.5 bg-[#ede9d6] border border-black/15 text-[11px] font-bold text-[#8a493b] rounded-full shrink-0">
          {post.genre}
        </span>
      </div>

      {/* Book Reference Tag (if present) */}
      {post.bookTitle && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ede9d6] border-l-3 border-[#8a493b] text-xs text-[#171717]">
          <BookOpen className="w-3.5 h-3.5 text-[#8a493b] shrink-0" />
          <span className="font-semibold">আলোচ্য গ্রন্থ:</span>
          <span>
            {post.bookTitle} {post.bookAuthor ? `— ${post.bookAuthor}` : ""}
          </span>
        </div>
      )}

      {/* Post Title */}
      <h2 className="text-lg sm:text-xl font-bold text-[#171717] leading-snug tracking-tight">
        {post.postTitle}
      </h2>

      {/* Post Content */}
      <div className="text-xs sm:text-sm text-[#262626] leading-relaxed whitespace-pre-line font-serif-bengali">
        {isLongText && !isExpandedText
          ? `${post.content.slice(0, 280)}...`
          : post.content}

        {isLongText && (
          <button
            onClick={() => setIsExpandedText(!isExpandedText)}
            className="text-xs text-[#8a493b] font-bold hover:underline ml-1 inline-block"
          >
            {isExpandedText ? "সংক্ষেপ করুন" : "আরও পড়ুন..."}
          </button>
        )}
      </div>

      {/* Post Image (Cloudflare R2, Max 3MB) */}
      {post.image && (
        <div className="pt-1">
          <div
            onClick={() => setShowImageModal(true)}
            className="relative w-full max-h-[420px] h-64 sm:h-80 bg-[#e5e2cd] border border-black/20 overflow-hidden cursor-pointer group shadow-xs"
          >
            <Image
              src={post.image}
              alt={post.postTitle}
              fill
              unoptimized
              className="object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute bottom-2 right-2 p-1.5 bg-black/60 text-white rounded text-[10px] font-mono-meta flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3 h-3" />
              <span>বড় করে দেখুন</span>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {showImageModal && post.image && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-[80vh]">
            <Image
              src={post.image}
              alt={post.postTitle}
              fill
              unoptimized
              className="object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Engagement Counter & Bar */}
      <div className="pt-2 border-t border-[rgba(23,23,23,0.15)] flex items-center justify-between text-xs font-mono-meta text-[#53514a]">
        <div className="flex items-center gap-4">
          <span>{likesCount} টি পছন্দ (Likes)</span>
          <span>{commentsCount} টি মন্তব্য</span>
        </div>

        {isCopied && (
          <span className="text-[11px] font-serif-bengali text-emerald-800 font-bold flex items-center gap-1 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>লিঙ্ক কপি করা হয়েছে!</span>
          </span>
        )}
      </div>

      {/* Action Buttons: Like, Comment, Share */}
      <div className="pt-1 border-t border-[rgba(23,23,23,0.12)] grid grid-cols-3 gap-2 text-center text-xs font-serif-bengali font-bold">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`py-1.5 px-2 flex items-center justify-center gap-1.5 transition-colors border ${
            isLiked
              ? "bg-rose-50 text-rose-700 border-rose-300"
              : "bg-[#ede9d6] text-[#53514a] hover:bg-[#171717] hover:text-[#eeeddb] border-black/15"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isLiked ? "fill-rose-600 text-rose-600" : ""
            }`}
          />
          <span>{isLiked ? "পছন্দ হয়েছে" : "পছন্দ (Like)"}</span>
        </button>

        {/* Comment Toggle Button */}
        <button
          onClick={handleToggleComments}
          className={`py-1.5 px-2 flex items-center justify-center gap-1.5 transition-colors border ${
            showComments
              ? "bg-[#171717] text-[#eeeddb] border-[#171717]"
              : "bg-[#ede9d6] text-[#53514a] hover:bg-[#171717] hover:text-[#eeeddb] border-black/15"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>মন্তব্য ({commentsCount})</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="py-1.5 px-2 bg-[#ede9d6] text-[#53514a] hover:bg-[#171717] hover:text-[#eeeddb] transition-colors border border-black/15 flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-4 h-4" />
          <span>শেয়ার</span>
        </button>
      </div>

      {/* Comments Section Drawer */}
      {showComments && (
        <div className="pt-3 border-t-2 border-[#171717]/20 space-y-3 bg-[#ede9d6]/50 p-3 sm:p-4 rounded-xs">
          <h4 className="font-bold text-xs text-[#171717] font-serif-bengali flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#8a493b]" />
            <span>পাঠক মন্তব্য ও প্রতিক্রিয়া ({commentsCount})</span>
          </h4>

          {/* Comment Composer */}
          {currentUser ? (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                required
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="আপনার মন্তব্য বা ভাবনা লিখুন..."
                className="flex-grow bg-[#eeeddb] border border-black/25 p-2 text-xs text-[#171717] focus:outline-none focus:border-black font-serif-bengali"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !commentInput.trim()}
                className="px-4 py-2 bg-[#171717] text-[#eeeddb] text-xs font-bold hover:bg-[#8a493b] transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1"
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>মন্তব্য</span>
              </button>
            </form>
          ) : (
            <div className="p-2.5 bg-[#f4f2e4] border border-black/15 text-xs text-[#53514a] flex items-center justify-between">
              <span>মন্তব্য করতে অনুগ্রহ করে অ্যাকাউন্টে লগইন করুন।</span>
              <Link
                href="/login"
                className="text-[#8a493b] font-bold hover:underline shrink-0"
              >
                লগইন করুন →
              </Link>
            </div>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <div className="py-4 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#8a493b]" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center py-3 text-xs text-[#7a776e] font-serif-bengali italic">
              এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!
            </p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 divide-y divide-black/10">
              {comments.map((c) => (
                <div key={c._id} className="pt-2 text-xs font-serif-bengali space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#171717] flex items-center gap-1">
                      <User className="w-3 h-3 text-[#8a493b]" />
                      <span>{c.userName}</span>
                    </span>
                    <span className="text-[10px] font-mono-meta text-[#7a776e]">
                      {formatTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-[#333] pl-4 leading-relaxed whitespace-pre-line">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

