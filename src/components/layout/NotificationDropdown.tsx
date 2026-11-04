"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Heart, MessageSquare, AlertTriangle, Check, X, BookOpen } from "lucide-react";

interface NotificationItem {
  _id: string;
  type: "like" | "comment" | "admin_deletion";
  senderName: string;
  postTitle?: string;
  postId?: string;
  message: string;
  note?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // Quiet fail if offline
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { notificationId: id } : { markAll: true }),
      });
      if (id) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } else {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (e) {
      console.error("Mark notification read error", e);
    }
  };

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

  return (
    <div className="relative font-serif-bengali" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            // Optional: keep badge until explicit read or mark upon open
          }
        }}
        className="relative p-2 text-[#53514a] hover:text-[#171717] hover:bg-black/5 rounded-full transition-colors flex items-center justify-center"
        aria-label="বিজ্ঞপ্তি"
        title="বিজ্ঞপ্তি ও নোটিফিকেশন"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#171717]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#8a493b] text-white text-[10px] font-mono-meta font-bold rounded-full flex items-center justify-center border-2 border-[#eeeddb] shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#eeeddb] border-2 border-[#171717] shadow-2xl z-50 overflow-hidden text-xs">
          {/* Header */}
          <div className="px-4 py-3 bg-[#e8e6d3] border-b border-[rgba(23,23,23,0.18)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8a493b]" />
              <span className="font-bold text-[#171717] text-sm font-serif-bengali">
                বিজ্ঞপ্তি ও প্রতিক্রিয়া
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-[#8a493b] text-white rounded font-mono-meta">
                  {unreadCount} নতুন
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAsRead()}
                className="text-[11px] text-[#8a493b] hover:underline flex items-center gap-1 font-mono-meta"
              >
                <Check className="w-3 h-3" />
                <span>সব পঠিত</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(23,23,23,0.1)]">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-[#7a776e] space-y-1">
                <BookOpen className="w-6 h-6 mx-auto opacity-30" />
                <p className="text-xs">এখনও কোনো নতুন বিজ্ঞপ্তি নেই।</p>
                <p className="text-[10px] font-mono-meta">আপনার পোস্টে লাইক বা কমেন্ট এলে এখানে দেখতে পাবেন।</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => {
                    if (!n.isRead) markAsRead(n._id);
                    if (n.postId && n.type !== "admin_deletion") {
                      window.location.href = `/amar-puthi#post-${n.postId}`;
                    }
                  }}
                  className={`p-3 transition-colors cursor-pointer flex gap-3 ${
                    !n.isRead ? "bg-[#ede9d6] font-semibold" : "hover:bg-[#f4f2e4]"
                  }`}
                >
                  {/* Icon Indicator */}
                  <div className="shrink-0 mt-0.5">
                    {n.type === "like" && (
                      <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                      </div>
                    )}
                    {n.type === "comment" && (
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {n.type === "admin_deletion" && (
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-grow min-w-0 space-y-1">
                    <p className="text-[#171717] leading-tight text-xs">
                      {n.message}
                    </p>

                    {/* Admin Deletion Note Callout */}
                    {n.type === "admin_deletion" && n.note && (
                      <div className="p-2 bg-red-50 border border-red-200 text-red-900 text-[11px] space-y-0.5 rounded-xs mt-1">
                        <span className="font-bold block">মডারেশন নোট:</span>
                        <p className="font-serif-bengali italic">{n.note}</p>
                      </div>
                    )}

                    <span className="block text-[10px] font-mono-meta text-[#7a776e]">
                      {formatTime(n.createdAt)}
                    </span>
                  </div>

                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#8a493b] shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#e8e6d3] border-t border-[rgba(23,23,23,0.18)] text-center">
            <Link
              href="/amar-puthi"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-[#8a493b] hover:underline"
            >
              'আমার পুঁথি' সাহিত্য চত্বর ব্রাউজ করুন →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

