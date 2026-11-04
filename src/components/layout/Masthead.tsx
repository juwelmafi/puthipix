"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Search, User, LogIn, LogOut, Shield, Feather, Sparkles } from "lucide-react";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import { useSiteContent } from "@/context/SiteContentContext";

export function Masthead() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const { content } = useSiteContent();
  const { header } = content;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  // Core architectural pages: Home, Library, Audiobooks, Manifesto
  const navLinks = [
    { href: "/", labelBn: "প্রচ্ছদ", labelEn: "Home" },
    { href: "/library", labelBn: "লাইব্রেরি", labelEn: "Library" },
    { href: "/audiobooks", labelBn: "শ্রুতিপাঠ", labelEn: "Audiobooks" },
    { href: "/about", labelBn: "মেনিফেস্টো", labelEn: "About" },
  ];

  return (
    <header className="w-full bg-[#eeeddb] border-b border-[rgba(23,23,23,0.18)]">
      {/* Optional Announcement Banner */}
      {header.announcementEnabled && header.announcementText && (
        <div className="bg-[#8a493b] text-[#eeeddb] px-3 py-1.5 text-center text-[11px] sm:text-xs font-serif-bengali font-semibold flex items-center justify-center gap-2 border-b border-black/20">
          <span>{header.announcementText}</span>
          {header.announcementLink && (
            <Link
              href={header.announcementLink}
              className="underline hover:text-white text-[10px] sm:text-[11px] font-mono-meta ml-1 font-bold"
            >
              বিস্তারিত →
            </Link>
          )}
        </div>
      )}

      {/* Top Information Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="py-1.5 border-b border-[rgba(23,23,23,0.12)] flex items-center justify-between text-[10px] sm:text-[11px] font-mono-meta text-[#53514a] uppercase tracking-wider">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span>{header.topBarLocation}</span>
            <span className="opacity-40">•</span>
            <span className="hidden sm:inline">{header.topBarVolume}</span>
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="truncate">{header.topBarArchiveText}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-[#8a493b] font-medium hidden md:inline">{header.topBarBadge}</span>
            <span className="opacity-40 hidden md:inline">•</span>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 lowercase font-sans-bengali">
                {/* Notification Dropdown Component */}
                <NotificationDropdown />

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-[#8a493b] font-bold hover:underline flex items-center gap-0.5 uppercase text-[9px] sm:text-[10px]"
                  >
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>অ্যাডমিন</span>
                  </Link>
                )}
                <Link
                  href="/account"
                  className="hover:text-[#171717] transition-colors flex items-center gap-1 text-[10px] sm:text-xs truncate max-w-[90px] sm:max-w-none"
                >
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="opacity-60 hover:opacity-100 hover:text-red-700 transition-colors flex items-center text-[9px] sm:text-[10px]"
                  title="লগআউট"
                >
                  <LogOut className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline ml-0.5">প্রস্থান</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 font-sans-bengali text-[10px] sm:text-[11px]">
                <Link
                  href="/login"
                  className="hover:text-[#171717] transition-colors flex items-center gap-0.5"
                >
                  <LogIn className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>লগইন</span>
                </Link>
                <span className="opacity-30">|</span>
                <Link
                  href="/register"
                  className="text-[#8a493b] font-semibold hover:underline"
                >
                  নিবন্ধন
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Editorial Masthead */}
        <div className="py-4 sm:py-8 text-center border-b border-[rgba(23,23,23,0.12)]">
          <div className="inline-block">
            <Link href="/" className="group inline-flex flex-col items-center">
              <span className="text-3xl sm:text-6xl md:text-7xl font-serif-bengali font-normal tracking-tight text-[#171717] transition-opacity group-hover:opacity-90">
                {header.brandNameBn}
              </span>
              <span className="text-[10px] sm:text-xs font-serif-bengali italic tracking-widest text-[#7a776e] mt-0.5 sm:mt-1 uppercase">
                {header.brandTagline}
              </span>
            </Link>
          </div>
          <p className="max-w-xl mx-auto mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-[#53514a] font-serif-bengali italic px-2 line-clamp-1 sm:line-clamp-none">
            {header.mastheadQuote}
          </p>
        </div>

        {/* Navigation Bar */}
        <div className="py-2 sm:py-2.5 flex items-center justify-between gap-1 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-6 flex-1 min-w-0 justify-between sm:justify-start">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs sm:text-sm whitespace-nowrap transition-colors px-1.5 sm:px-2.5 py-1 ${
                    isActive
                      ? "text-[#171717] font-bold border-b-2 border-[#171717]"
                      : "text-[#53514a] hover:text-[#171717]"
                  }`}
                >
                  <span>{link.labelBn}</span>
                  <span className="hidden md:inline font-normal text-xs opacity-60 ml-1">
                    ({link.labelEn})
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0 pl-1">
            <Link
              href="/amar-puthi"
              className={`text-xs font-serif-bengali font-bold flex items-center gap-1.5 px-3 py-1.5 transition-all shadow-xs ${
                pathname === "/amar-puthi"
                  ? "bg-[#8a493b] text-[#eeeddb] border border-[#8a493b]"
                  : "bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] border border-[#171717]"
              }`}
              title="আমার পুঁথি — উন্মুক্ত পাঠক চত্বর ও সাহিত্য আড্ডা"
            >
              <Feather className="w-3.5 h-3.5 text-[#e8c078]" />
              <span className="tracking-wide">আমার পুঁথি</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
