"use client";

import React from "react";
import { SiteContent } from "@/data/defaultSiteContent";
import {
  Globe,
  Save,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Search,
  ExternalLink,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface SeoSettingsEditorProps {
  content: SiteContent;
  onChange: (updated: SiteContent) => void;
  onSave: () => Promise<void>;
  onResetDefaults: () => void;
  isSaving: boolean;
}

export function SeoSettingsEditor({
  content,
  onChange,
  onSave,
  onResetDefaults,
  isSaving,
}: SeoSettingsEditorProps) {
  const updateSeo = (key: string, value: any) => {
    onChange({
      ...content,
      seo: {
        ...content.seo,
        [key]: value,
      },
    });
  };

  const updatePageSeo = (
    pageKey: keyof SiteContent["seo"]["pages"],
    field: "title" | "description",
    value: string
  ) => {
    onChange({
      ...content,
      seo: {
        ...content.seo,
        pages: {
          ...content.seo.pages,
          [pageKey]: {
            ...content.seo.pages[pageKey],
            [field]: value,
          },
        },
      },
    });
  };

  return (
    <div className="space-y-6 font-serif-bengali">
      {/* SEO Header & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.18)]">
        <div>
          <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[#8a493b] font-bold">
            SEARCH ENGINE OPTIMIZATION & BRANDING
          </span>
          <h2 className="text-2xl font-bold text-[#171717]">এসইও ও ব্র্যান্ডিং ব্যবস্থাপনা</h2>
          <p className="text-xs text-[#53514a]">
            গুগল সার্চ ইঞ্জিন, সোশ্যাল মিডিয়া শেয়ার প্রিভিউ (OG Card), ফেভিকন ও লোগো কনফিগার করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3 py-2 border border-black/30 hover:border-black text-xs text-[#53514a] hover:text-[#171717] bg-[#e8e6d3] hover:bg-[#dedbc5] transition-colors flex items-center gap-1.5"
            title="ডিফল্ট এসইও ট্যাগ পূরণ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট এসইও</span>
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="px-5 py-2 bg-[#8a493b] text-[#eeeddb] text-xs font-bold hover:bg-[#171717] transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "সংরক্ষিত হচ্ছে..." : "এসইও সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </div>

      {/* Google Search Snippet Simulation Preview */}
      <div className="bg-[#f8f7f0] border-2 border-[#171717] p-4 space-y-2">
        <div className="flex items-center gap-2 border-b border-black/10 pb-2">
          <Search className="w-4 h-4 text-blue-600" />
          <span className="font-mono-meta text-[11px] font-bold text-[#171717] uppercase">
            গুগল সার্চ স্নsnippet প্রিভিউ (Google Search Result Preview)
          </span>
        </div>
        <div className="font-sans text-xs space-y-1 p-2 bg-white rounded border border-black/10">
          <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
            <span className="font-medium">puthipix.com</span>
            <span className="text-[#5f6368]">• https://puthipix.com</span>
          </div>
          <h3 className="text-blue-800 text-sm hover:underline cursor-pointer font-medium leading-snug">
            {content.seo.siteTitle}
          </h3>
          <p className="text-[#4d5156] text-[11px] leading-relaxed line-clamp-2">
            {content.seo.siteDescription}
          </p>
        </div>
      </div>

      {/* Global Meta & Visual Branding */}
      <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-5 space-y-5">
        <div className="border-b border-black/10 pb-2 flex items-center justify-between">
          <h3 className="font-bold text-base text-[#171717]">১. সার্বজনীন ওয়েবসাইট মেটাডাটা ও লোগো</h3>
          <span className="text-[10px] font-mono-meta bg-black/10 px-2 py-0.5 rounded">GLOBAL</span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
              সাইটের মূল শিরোনাম (Global Website Title) *
            </label>
            <input
              type="text"
              required
              value={content.seo.siteTitle}
              onChange={(e) => updateSeo("siteTitle", e.target.value)}
              className="w-full bg-[#eeeddb] border border-black/25 p-2 font-bold text-[#171717]"
              placeholder="Puthipix (পুঁথিপিক্স) — ডিজিটাল লাইব্রেরি"
            />
          </div>

          <div>
            <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
              সার্বজনীন মেটা ডেসক্রিপশন (Global Meta Description) *
            </label>
            <textarea
              rows={3}
              required
              value={content.seo.siteDescription}
              onChange={(e) => updateSeo("siteDescription", e.target.value)}
              className="w-full bg-[#eeeddb] border border-black/25 p-2 text-[#171717] leading-relaxed"
              placeholder="একটি minimalist, editorial-style digital library..."
            />
            <span className="text-[10px] font-mono-meta text-[#7a776e]">
              * আদর্শ দৈর্ঘ্য: ১২০ থেকে ১৬০ অক্ষর (বর্তমান অক্ষর সংখ্যা: {content.seo.siteDescription.length})
            </span>
          </div>

          <div>
            <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
              মেটা কিওয়ার্ডসমূহ (Keywords - কমা দিয়ে পৃথক করুন)
            </label>
            <input
              type="text"
              value={content.seo.keywords}
              onChange={(e) => updateSeo("keywords", e.target.value)}
              className="w-full bg-[#eeeddb] border border-black/25 p-2 font-mono-meta text-[11px]"
              placeholder="digital library, bengali books, puthipix, বাংলা বই"
            />
          </div>

          {/* Media Assets (Favicon, Logo, OG Share) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-black/10">
            {/* Favicon */}
            <div className="bg-[#eeeddb] p-3 border border-black/15 space-y-2">
              <label className="block font-mono-meta uppercase text-[#53514a] text-[10px] font-bold">
                ফেভিকন ইউআরএল (Favicon .ico/.png)
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={content.seo.faviconUrl || "/favicon.ico"}
                  alt="Favicon"
                  className="w-7 h-7 object-contain bg-white p-0.5 border border-black/30 rounded shrink-0"
                  onError={(e) => {
                    (e.target as any).src = "https://placehold.co/32x32?text=ICO";
                  }}
                />
                <input
                  type="text"
                  value={content.seo.faviconUrl}
                  onChange={(e) => updateSeo("faviconUrl", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-1 font-mono-meta text-[10px]"
                  placeholder="/favicon.ico"
                />
              </div>
            </div>

            {/* Site Logo */}
            <div className="bg-[#eeeddb] p-3 border border-black/15 space-y-2">
              <label className="block font-mono-meta uppercase text-[#53514a] text-[10px] font-bold">
                সাইট লোগো ইমেজ (Site Logo)
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={content.seo.siteLogo || "/logo.png"}
                  alt="Site Logo"
                  className="w-12 h-7 object-contain bg-white p-0.5 border border-black/30 rounded shrink-0"
                  onError={(e) => {
                    (e.target as any).src = "https://placehold.co/100x40?text=Logo";
                  }}
                />
                <input
                  type="text"
                  value={content.seo.siteLogo}
                  onChange={(e) => updateSeo("siteLogo", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-1 font-mono-meta text-[10px]"
                  placeholder="/logo.png"
                />
              </div>
            </div>

            {/* OG Image */}
            <div className="bg-[#eeeddb] p-3 border border-black/15 space-y-2">
              <label className="block font-mono-meta uppercase text-[#53514a] text-[10px] font-bold flex items-center gap-1">
                <Share2 className="w-3 h-3 text-[#8a493b]" />
                <span>সোশ্যাল শেয়ার ইমেজ (OG Share Card)</span>
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={content.seo.ogImage}
                  alt="OG Card"
                  className="w-12 h-7 object-cover bg-white border border-black/30 rounded shrink-0"
                  onError={(e) => {
                    (e.target as any).src = "https://placehold.co/120x63?text=OG";
                  }}
                />
                <input
                  type="text"
                  value={content.seo.ogImage}
                  onChange={(e) => updateSeo("ogImage", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-1 font-mono-meta text-[10px]"
                  placeholder="https://.../og-image.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page-by-Page SEO Configuration */}
      <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-5 space-y-5">
        <div className="border-b border-black/10 pb-2">
          <h3 className="font-bold text-base text-[#171717]">২. পৃষ্ঠাভিত্তিক সুনির্দিষ্ট মেটা ট্যাগ (Page-Specific Meta)</h3>
          <p className="text-xs text-[#53514a]">
            প্রতিটি ভিন্ন ভিন্ন পেজের জন্য আলাদা ব্রাউজার ট্যাব টাইটেল এবং সার্চ বিবরণী নির্দিষ্ট করুন।
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Home Page */}
          <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-2">
            <span className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta block">
              • প্রচ্ছদ পৃষ্ঠা (Homepage — /)
            </span>
            <input
              type="text"
              value={content.seo.pages.home.title}
              onChange={(e) => updatePageSeo("home", "title", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
              placeholder="প্রচ্ছদ মেটা টাইটেল"
            />
            <textarea
              rows={2}
              value={content.seo.pages.home.description}
              onChange={(e) => updatePageSeo("home", "description", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5"
              placeholder="প্রচ্ছদ মেটা ডেসক্রিপশন"
            />
          </div>

          {/* Library Page */}
          <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-2">
            <span className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta block">
              • লাইব্রেরি ও সূচি পৃষ্ঠা (Library — /library)
            </span>
            <input
              type="text"
              value={content.seo.pages.library.title}
              onChange={(e) => updatePageSeo("library", "title", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
              placeholder="লাইব্রেরি মেটা টাইটেল"
            />
            <textarea
              rows={2}
              value={content.seo.pages.library.description}
              onChange={(e) => updatePageSeo("library", "description", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5"
              placeholder="লাইব্রেরি মেটা ডেসক্রিপশন"
            />
          </div>

          {/* Audiobooks Page */}
          <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-2">
            <span className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta block">
              • শ্রুতিপাঠ ও অডিওবুক পৃষ্ঠা (Audiobooks — /audiobooks)
            </span>
            <input
              type="text"
              value={content.seo.pages.audiobooks.title}
              onChange={(e) => updatePageSeo("audiobooks", "title", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
              placeholder="শ্রুতিপাঠ মেটা টাইটেল"
            />
            <textarea
              rows={2}
              value={content.seo.pages.audiobooks.description}
              onChange={(e) => updatePageSeo("audiobooks", "description", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5"
              placeholder="শ্রুতিপাঠ মেটা ডেসক্রিপশন"
            />
          </div>

          {/* Amar Puthi Page */}
          <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-2">
            <span className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta block">
              • আমার পুঁথি পাঠক চত্বর (Community — /amar-puthi)
            </span>
            <input
              type="text"
              value={content.seo.pages.amarPuthi.title}
              onChange={(e) => updatePageSeo("amarPuthi", "title", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
              placeholder="আমার পুঁথি মেটা টাইটেল"
            />
            <textarea
              rows={2}
              value={content.seo.pages.amarPuthi.description}
              onChange={(e) => updatePageSeo("amarPuthi", "description", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5"
              placeholder="আমার পুঁথি মেটা ডেসক্রিপশন"
            />
          </div>

          {/* About / Manifesto Page */}
          <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-2">
            <span className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta block">
              • মেনিফেস্টো পৃষ্ঠা (About / Manifesto — /about)
            </span>
            <input
              type="text"
              value={content.seo.pages.about.title}
              onChange={(e) => updatePageSeo("about", "title", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
              placeholder="মেনিফেস্টো মেটা টাইটেল"
            />
            <textarea
              rows={2}
              value={content.seo.pages.about.description}
              onChange={(e) => updatePageSeo("about", "description", e.target.value)}
              className="w-full bg-white/70 border border-black/20 p-1.5"
              placeholder="মেনিফেস্টো মেটা ডেসক্রিপশন"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="p-4 bg-[#e8e6d3] border-2 border-[#171717] flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-[#53514a]">
          * সার্চ ইঞ্জিনের ক্যাশে মেটাডাটা প্রতিফলিত হতে কিছু সময় লাগতে পারে।
        </span>
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="px-6 py-2.5 bg-[#8a493b] text-[#eeeddb] text-xs font-bold hover:bg-[#171717] transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "সংরক্ষিত হচ্ছে..." : "এসইও সেটিংস সংরক্ষণ করুন"}</span>
        </button>
      </div>
    </div>
  );
}

