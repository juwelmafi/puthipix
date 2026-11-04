"use client";

import React, { useState } from "react";
import { SiteContent } from "@/data/defaultSiteContent";
import {
  Sliders,
  Save,
  RotateCcw,
  Sparkles,
  BookOpen,
  Headphones,
  Feather,
  Layout,
  Type,
  FileText,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from "lucide-react";

interface CmsContentEditorProps {
  content: SiteContent;
  onChange: (updated: SiteContent) => void;
  onSave: () => Promise<void>;
  onResetDefaults: () => void;
  isSaving: boolean;
}

export function CmsContentEditor({
  content,
  onChange,
  onSave,
  onResetDefaults,
  isSaving,
}: CmsContentEditorProps) {
  const [subTab, setSubTab] = useState<"hero" | "sections" | "header" | "footer" | "about">("hero");

  // Helper to deep update
  const updateContent = (section: keyof SiteContent, key: string, value: any) => {
    onChange({
      ...content,
      [section]: {
        ...(content[section] as any),
        [key]: value,
      },
    });
  };

  const updatePillar = (index: number, field: "number" | "title" | "description", value: string) => {
    const updatedPillars = [...content.hero.pillars];
    updatedPillars[index] = {
      ...updatedPillars[index],
      [field]: value,
    };
    onChange({
      ...content,
      hero: {
        ...content.hero,
        pillars: updatedPillars,
      },
    });
  };

  const updateNestedSection = (
    sectionKey: keyof SiteContent["sections"],
    field: string,
    value: string
  ) => {
    onChange({
      ...content,
      sections: {
        ...content.sections,
        [sectionKey]: {
          ...(content.sections[sectionKey] as any),
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6 font-serif-bengali">
      {/* CMS Header & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.18)]">
        <div>
          <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[#8a493b] font-bold">
            CONTENT MANAGEMENT SYSTEM
          </span>
          <h2 className="text-2xl font-bold text-[#171717]">ওয়েবসাইট কনটেন্ট সিএমএস</h2>
          <p className="text-xs text-[#53514a]">
            লাইভ ওয়েবসাইটের সকল টেক্সট, হেডলাইন, ব্যানার ও সেকশন বিবরণী সরাসরি এডিট বা পরিবর্তন করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3 py-2 border border-black/30 hover:border-black text-xs text-[#53514a] hover:text-[#171717] bg-[#e8e6d3] hover:bg-[#dedbc5] transition-colors flex items-center gap-1.5"
            title="মূল ডিফল্ট টেক্সট ফিরিয়ে আনুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট টেক্সট পূরণ</span>
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="px-5 py-2 bg-[#8a493b] text-[#eeeddb] text-xs font-bold hover:bg-[#171717] transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "সংরক্ষিত হচ্ছে..." : "কনটেন্ট সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[rgba(23,23,23,0.18)] pb-2">
        <button
          type="button"
          onClick={() => setSubTab("hero")}
          className={`px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === "hero"
              ? "bg-[#171717] text-[#eeeddb]"
              : "bg-[#f4f2e4] text-[#53514a] hover:bg-[#e8e6d3] hover:text-[#171717]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e8c078]" />
          <span>প্রচ্ছদ হিরো (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("sections")}
          className={`px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === "sections"
              ? "bg-[#171717] text-[#eeeddb]"
              : "bg-[#f4f2e4] text-[#53514a] hover:bg-[#e8e6d3] hover:text-[#171717]"
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-[#e8c078]" />
          <span>শেলফ ও বিভাগ শিরোনাম</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("header")}
          className={`px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === "header"
              ? "bg-[#171717] text-[#eeeddb]"
              : "bg-[#f4f2e4] text-[#53514a] hover:bg-[#e8e6d3] hover:text-[#171717]"
          }`}
        >
          <Type className="w-3.5 h-3.5 text-[#e8c078]" />
          <span>মাস্টহেড ও ঘোষণা বার</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("footer")}
          className={`px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === "footer"
              ? "bg-[#171717] text-[#eeeddb]"
              : "bg-[#f4f2e4] text-[#53514a] hover:bg-[#e8e6d3] hover:text-[#171717]"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#e8c078]" />
          <span>ফুটার ও পরিচিতি</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("about")}
          className={`px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === "about"
              ? "bg-[#171717] text-[#eeeddb]"
              : "bg-[#f4f2e4] text-[#53514a] hover:bg-[#e8e6d3] hover:text-[#171717]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#e8c078]" />
          <span>মেনিফেস্টো পৃষ্ঠা (/about)</span>
        </button>
      </div>

      {/* SubTab 1: HERO SECTION */}
      {subTab === "hero" && (
        <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-5 space-y-5">
          <div className="border-b border-black/10 pb-2">
            <h3 className="font-bold text-base text-[#171717]">প্রচ্ছদ হিরো ব্যানার ও শীর্ষ বক্তব্য</h3>
            <p className="text-xs text-[#53514a]">
              ভিজিটর সাইটে ঢুকলেই যে প্রধান হেডলাইন, আইব্রো ও ভূমিকা দেখতে পায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs">
            <div>
              <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                আইব্রো ব্যাজ টেক্সট (Eyebrow Badge)
              </label>
              <input
                type="text"
                value={content.hero.eyebrow}
                onChange={(e) => updateContent("hero", "eyebrow", e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/25 p-2 text-[#171717] focus:outline-none focus:border-black"
                placeholder="যেমন: বাংলা সাহিত্যের উন্মুক্ত ডিজিটাল মহাফেজখানা"
              />
            </div>

            <div>
              <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                মূল সম্পাদকীয় হেডলাইন (Main Headline) *
              </label>
              <input
                type="text"
                value={content.hero.headline}
                onChange={(e) => updateContent("hero", "headline", e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/25 p-2.5 text-base font-bold text-[#171717] focus:outline-none focus:border-black"
                placeholder="যেমন: চিন্তাশীল পাঠকের জন্য এক নিভৃত পাঠাগার"
              />
            </div>

            <div>
              <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                উপ-বিবরণী ও দর্শন (Subtext) *
              </label>
              <textarea
                rows={3}
                value={content.hero.subtext}
                onChange={(e) => updateContent("hero", "subtext", e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/25 p-2 text-[#171717] focus:outline-none focus:border-black leading-relaxed"
                placeholder="হিরো ব্যানারের বিস্তারিত বক্তব্য..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/10">
              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                  প্রধান বাটন টেক্সট (Primary CTA)
                </label>
                <input
                  type="text"
                  value={content.hero.primaryCtaText}
                  onChange={(e) => updateContent("hero", "primaryCtaText", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2 text-[#171717]"
                />
                <input
                  type="text"
                  value={content.hero.primaryCtaLink}
                  onChange={(e) => updateContent("hero", "primaryCtaLink", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-1.5 text-[11px] font-mono-meta text-[#53514a] mt-1"
                  placeholder="/library"
                />
              </div>

              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                  দ্বিতীয় বাটন টেক্সট (Secondary CTA)
                </label>
                <input
                  type="text"
                  value={content.hero.secondaryCtaText}
                  onChange={(e) => updateContent("hero", "secondaryCtaText", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2 text-[#171717]"
                />
                <input
                  type="text"
                  value={content.hero.secondaryCtaLink}
                  onChange={(e) => updateContent("hero", "secondaryCtaLink", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-1.5 text-[11px] font-mono-meta text-[#53514a] mt-1"
                  placeholder="/about"
                />
              </div>
            </div>

            {/* Feature Pillars */}
            <div className="pt-3 border-t border-black/10">
              <label className="block font-mono-meta uppercase text-[#8a493b] mb-2 font-bold text-[11px]">
                হিরোর ৪টি ভিত্তিস্তম্ভ (Feature Pillars)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.hero.pillars.map((pillar, idx) => (
                  <div key={idx} className="bg-[#eeeddb] p-3 border border-black/20 space-y-1.5">
                    <input
                      type="text"
                      value={pillar.number}
                      onChange={(e) => updatePillar(idx, "number", e.target.value)}
                      className="w-full bg-white/50 border border-black/20 p-1 font-mono-meta text-[10px] text-[#7a776e]"
                      placeholder="০১ • শতভাগ উন্মুক্ত"
                    />
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => updatePillar(idx, "title", e.target.value)}
                      className="w-full bg-white/70 border border-black/20 p-1.5 font-bold text-xs text-[#171717]"
                      placeholder="সকল বই বিনামূল্যে সবার জন্য পাঠযোগ্য"
                    />
                    <input
                      type="text"
                      value={pillar.description}
                      onChange={(e) => updatePillar(idx, "description", e.target.value)}
                      className="w-full bg-white/50 border border-black/20 p-1 text-[11px] text-[#53514a]"
                      placeholder="কোনো সাবস্ক্রিপশন ফি নেই"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: SHELVES & SECTIONS */}
      {subTab === "sections" && (
        <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-5 space-y-6">
          <div className="border-b border-black/10 pb-2">
            <h3 className="font-bold text-base text-[#171717]">হোমপেজ বুকশেলফ ও বিভাগ শিরোনাম</h3>
            <p className="text-xs text-[#53514a]">
              বই ও অডিওবুকের প্রতিটি তাকে প্রদর্শিত বাংলা ও ইংরেজি ক্যাটাগরি শিরোনাম কাস্টমাইজ করুন।
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Featured Classics */}
            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta">
                ১. নির্বাচিত ধ্রুপদী সংকলন শেলফ (Featured Classics)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    আইব্রো ট্যাগ (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={content.sections.featuredBooks.eyebrow}
                    onChange={(e) => updateNestedSection("featuredBooks", "eyebrow", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    মূল শিরোনাম (Heading)
                  </label>
                  <input
                    type="text"
                    value={content.sections.featuredBooks.heading}
                    onChange={(e) => updateNestedSection("featuredBooks", "heading", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    লিঙ্ক টেক্সট (Link Text)
                  </label>
                  <input
                    type="text"
                    value={content.sections.featuredBooks.linkText}
                    onChange={(e) => updateNestedSection("featuredBooks", "linkText", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Genres Section */}
            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta">
                ২. সাহিত্যধারা অনুযায়ী অন্বেষণ বিভাগ (Literary Classification)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    আইব্রো ট্যাগ (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={content.sections.genres.eyebrow}
                    onChange={(e) => updateNestedSection("genres", "eyebrow", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    মূল শিরোনাম (Heading)
                  </label>
                  <input
                    type="text"
                    value={content.sections.genres.heading}
                    onChange={(e) => updateNestedSection("genres", "heading", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Audiobooks Shelf */}
            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta">
                ৩. নির্বাচিত শ্রুতিপাঠ ও অডিওবুক শেলফ (Audiobooks Shelf)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    আইব্রো ট্যাগ (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={content.sections.audiobooks.eyebrow}
                    onChange={(e) => updateNestedSection("audiobooks", "eyebrow", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    মূল শিরোনাম (Heading)
                  </label>
                  <input
                    type="text"
                    value={content.sections.audiobooks.heading}
                    onChange={(e) => updateNestedSection("audiobooks", "heading", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    লিঙ্ক টেক্সট (Link Text)
                  </label>
                  <input
                    type="text"
                    value={content.sections.audiobooks.linkText}
                    onChange={(e) => updateNestedSection("audiobooks", "linkText", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Recent Books Shelf */}
            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta">
                ৪. সদ্য ডিজিটাইজড গ্রন্থসমূহ শেলফ (Recent Books Shelf)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    আইব্রো ট্যাগ (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={content.sections.recentBooks.eyebrow}
                    onChange={(e) => updateNestedSection("recentBooks", "eyebrow", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    মূল শিরোনাম (Heading)
                  </label>
                  <input
                    type="text"
                    value={content.sections.recentBooks.heading}
                    onChange={(e) => updateNestedSection("recentBooks", "heading", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                    লিঙ্ক টেক্সট (Link Text)
                  </label>
                  <input
                    type="text"
                    value={content.sections.recentBooks.linkText}
                    onChange={(e) => updateNestedSection("recentBooks", "linkText", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Editorial Quote Block */}
            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta">
                ৫. ব্রডশীট সম্পাদকীয় উদ্ধৃতি ব্লক (Editorial Quote)
              </h4>
              <div>
                <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                  উদ্ধৃতি বাণী (Quote Text)
                </label>
                <textarea
                  rows={2}
                  value={content.sections.editorialQuote.quote}
                  onChange={(e) => updateNestedSection("editorialQuote", "quote", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-2 text-[#171717]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                  রচয়িতা / ক্রেডিট (Attribution)
                </label>
                <input
                  type="text"
                  value={content.sections.editorialQuote.author}
                  onChange={(e) => updateNestedSection("editorialQuote", "author", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-1.5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: HEADER & MASTHEAD */}
      {subTab === "header" && (
        <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-5 space-y-5">
          <div className="border-b border-black/10 pb-2">
            <h3 className="font-bold text-base text-[#171717]">শীর্ষ তথ্য বার, মাস্টহেড ও নোটিশ ব্যানার</h3>
            <p className="text-xs text-[#53514a]">
              সংবাদপত্রের স্টাইলের মাস্টহেড টেক্সট, প্রকাশনা তথ্য ও ঘোষণা কন্ট্রোল করুন।
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta">
                ১. শীর্ষ ইনফো বার (Top Information Bar)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">স্থান (Location)</label>
                  <input
                    type="text"
                    value={content.header.topBarLocation}
                    onChange={(e) => updateContent("header", "topBarLocation", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">ভলিউম / সংখ্যা (Volume)</label>
                  <input
                    type="text"
                    value={content.header.topBarVolume}
                    onChange={(e) => updateContent("header", "topBarVolume", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">আর্কাইভ পরিচিতি</label>
                  <input
                    type="text"
                    value={content.header.topBarArchiveText}
                    onChange={(e) => updateContent("header", "topBarArchiveText", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">শীর্ষ ব্যাজ বার্তা</label>
                  <input
                    type="text"
                    value={content.header.topBarBadge}
                    onChange={(e) => updateContent("header", "topBarBadge", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta">
                ২. মাস্টহেড ব্র্যান্ড ও বাণী
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">ব্র্যান্ড নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={content.header.brandNameBn}
                    onChange={(e) => updateContent("header", "brandNameBn", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">ইংরেজি সাব-ট্যাগলাইন</label>
                  <input
                    type="text"
                    value={content.header.brandTagline}
                    onChange={(e) => updateContent("header", "brandTagline", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-mono-meta text-[11px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">মাস্টহেডের বাণী / স্লোগান</label>
                <input
                  type="text"
                  value={content.header.mastheadQuote}
                  onChange={(e) => updateContent("header", "mastheadQuote", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-1.5"
                />
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="bg-[#eeeddb] p-4 border border-black/15 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#8a493b] text-xs uppercase font-mono-meta flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>৩. বিশেষ নোটিশ ব্যানার (Announcement Bar)</span>
                </h4>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#171717]">
                  <input
                    type="checkbox"
                    checked={content.header.announcementEnabled}
                    onChange={(e) => updateContent("header", "announcementEnabled", e.target.checked)}
                    className="w-4 h-4 rounded text-[#8a493b]"
                  />
                  <span>ব্যানার চালু রাখুন</span>
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                  নোটিশের মূল বার্তা
                </label>
                <input
                  type="text"
                  value={content.header.announcementText}
                  onChange={(e) => updateContent("header", "announcementText", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-2 text-[#171717]"
                  placeholder="যেমন: স্বাগতম! পুঁথিপিক্সে যুক্ত হয়েছে ‘আমার পুঁথি’ সাহিত্য আড্ডা।"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-meta text-[#53514a] mb-1">
                  ক্লিকেবল লিঙ্ক (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={content.header.announcementLink || ""}
                  onChange={(e) => updateContent("header", "announcementLink", e.target.value)}
                  className="w-full bg-white/70 border border-black/20 p-1.5 font-mono-meta text-[11px]"
                  placeholder="/amar-puthi"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: FOOTER */}
      {subTab === "footer" && (
        <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-5 space-y-5">
          <div className="border-b border-black/10 pb-2">
            <h3 className="font-bold text-base text-[#171717]">ফুটার ও প্রতিষ্ঠান পরিচিতি</h3>
            <p className="text-xs text-[#53514a]">
              ওয়েবসাইটের নিচের অংশের ব্র্যান্ড পরিচিতি, ট্যাগলাইন ও কপিরাইট বার্তা পরিবর্তন করুন।
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                ফুটার ব্র্যান্ড শিরোনাম
              </label>
              <input
                type="text"
                value={content.footer.brandTitle}
                onChange={(e) => updateContent("footer", "brandTitle", e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/25 p-2 font-bold text-[#171717]"
              />
            </div>

            <div>
              <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                ফুটার পরিচিতি ও উদ্দেশ্য বিবরণী (About Paragraph)
              </label>
              <textarea
                rows={3}
                value={content.footer.aboutText}
                onChange={(e) => updateContent("footer", "aboutText", e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/25 p-2 text-[#171717] leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                সাব-ট্যাগলাইন বার্তা
              </label>
              <input
                type="text"
                value={content.footer.tagline}
                onChange={(e) => updateContent("footer", "tagline", e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/25 p-2 text-[#171717]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/10">
              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                  কপিরাইট লাইন (Copyright Text)
                </label>
                <input
                  type="text"
                  value={content.footer.copyrightText}
                  onChange={(e) => updateContent("footer", "copyrightText", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2 font-mono-meta text-[11px]"
                />
              </div>

              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                  সর্বশেষ পাদটীকা (Bottom Note)
                </label>
                <input
                  type="text"
                  value={content.footer.bottomNote}
                  onChange={(e) => updateContent("footer", "bottomNote", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 5: ABOUT / MANIFESTO PAGE */}
      {subTab === "about" && (
        <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-5 space-y-5">
          <div className="border-b border-black/10 pb-2">
            <h3 className="font-bold text-base text-[#171717]">মেনিফেস্টো পৃষ্ঠা (/about) কনটেন্ট</h3>
            <p className="text-xs text-[#53514a]">
              পুঁথিপিক্সের উদ্দেশ্য, পাবলিক ডোমেইন সংরক্ষণ দর্শন ও কপিরাইট পলিসি টেক্সট কাস্টমাইজ করুন।
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                  আইব্রো ট্যাগ (Eyebrow)
                </label>
                <input
                  type="text"
                  value={content.about.eyebrow}
                  onChange={(e) => updateContent("about", "eyebrow", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2"
                />
              </div>

              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                  পৃষ্ঠার প্রধান শিরোনাম (Main Headline)
                </label>
                <input
                  type="text"
                  value={content.about.headline}
                  onChange={(e) => updateContent("about", "headline", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2 font-bold text-base text-[#171717]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono-meta uppercase text-[#53514a] mb-1 font-semibold">
                শীর্ষ দর্শন বাণী / উদ্ধৃতি (Quote)
              </label>
              <textarea
                rows={2}
                value={content.about.quote}
                onChange={(e) => updateContent("about", "quote", e.target.value)}
                className="w-full bg-[#eeeddb] border border-black/25 p-2 italic"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-black/10">
              <label className="block font-mono-meta uppercase text-[#8a493b] font-bold">
                মেনিফেস্টো মূল বক্তব্য (Paragraphs)
              </label>
              <div>
                <span className="text-[10px] text-[#53514a] font-mono-meta">অনুচ্ছেদ ০১ (ইন্টারনেট ও পড়ার প্রশান্তি)</span>
                <textarea
                  rows={4}
                  value={content.about.p1}
                  onChange={(e) => updateContent("about", "p1", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2 leading-relaxed"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#53514a] font-mono-meta">অনুচ্ছেদ ০২ (পুঁথিপিক্সের মিশন)</span>
                <textarea
                  rows={4}
                  value={content.about.p2}
                  onChange={(e) => updateContent("about", "p2", e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/25 p-2 leading-relaxed"
                />
              </div>
            </div>

            <div className="bg-[#eeeddb] p-3 border border-black/15 space-y-2">
              <label className="block font-mono-meta uppercase text-[#53514a] font-bold">
                হাইলাইট কলআউট বক্স (Callout Quote)
              </label>
              <textarea
                rows={2}
                value={content.about.quoteCallout}
                onChange={(e) => updateContent("about", "quoteCallout", e.target.value)}
                className="w-full bg-white/70 border border-black/20 p-2 italic"
              />
              <input
                type="text"
                value={content.about.quoteAttribution}
                onChange={(e) => updateContent("about", "quoteAttribution", e.target.value)}
                className="w-full bg-white/70 border border-black/20 p-1 font-mono-meta text-[10px]"
                placeholder="— ক্রেডিট"
              />
            </div>

            {/* Policy sections */}
            <div className="space-y-3 pt-2 border-t border-black/10">
              <label className="block font-mono-meta uppercase text-[#8a493b] font-bold">
                পলিসি ও নীতিমালা সেকশনসমূহ
              </label>
              <div className="space-y-3">
                <div className="bg-[#eeeddb] p-3 border border-black/15 space-y-1.5">
                  <input
                    type="text"
                    value={content.about.copyrightHeading}
                    onChange={(e) => updateContent("about", "copyrightHeading", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                  <textarea
                    rows={2}
                    value={content.about.copyrightText}
                    onChange={(e) => updateContent("about", "copyrightText", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>

                <div className="bg-[#eeeddb] p-3 border border-black/15 space-y-1.5">
                  <input
                    type="text"
                    value={content.about.audiobookHeading}
                    onChange={(e) => updateContent("about", "audiobookHeading", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                  <textarea
                    rows={2}
                    value={content.about.audiobookText}
                    onChange={(e) => updateContent("about", "audiobookText", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>

                <div className="bg-[#eeeddb] p-3 border border-black/15 space-y-1.5">
                  <input
                    type="text"
                    value={content.about.noDownloadHeading}
                    onChange={(e) => updateContent("about", "noDownloadHeading", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5 font-bold"
                  />
                  <textarea
                    rows={2}
                    value={content.about.noDownloadText}
                    onChange={(e) => updateContent("about", "noDownloadText", e.target.value)}
                    className="w-full bg-white/70 border border-black/20 p-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="p-4 bg-[#e8e6d3] border-2 border-[#171717] flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-[#53514a]">
          * কোনো ভুল হলে ‘ডিফল্ট টেক্সট পূরণ’ বাটনে ক্লিক করে মূল লেখায় ফিরে যেতে পারেন।
        </span>
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="px-6 py-2.5 bg-[#8a493b] text-[#eeeddb] text-xs font-bold hover:bg-[#171717] transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "সংরক্ষিত হচ্ছে..." : "সকল পরিবর্তন সংরক্ষণ করুন"}</span>
        </button>
      </div>
    </div>
  );
}
