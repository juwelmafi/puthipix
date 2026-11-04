"use client";

import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { Feather, BookOpen, ShieldCheck, HeartHandshake, Compass, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function AboutPage() {
  const { content } = useSiteContent();
  const { about } = content;

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Editorial Eyebrow */}
        <div className="text-center space-y-4 mb-12 pb-8 border-b border-[rgba(23,23,23,0.18)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[rgba(23,23,23,0.2)] bg-[#e6e4cf] text-[11px] font-mono-meta uppercase tracking-widest text-[#53514a]">
            <Feather className="w-3.5 h-3.5 text-[#8a493b]" />
            <span>{about.eyebrow}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-bengali font-bold text-[#171717] leading-tight">
            {about.headline}
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base font-serif-bengali italic text-[#53514a]">
            {about.quote}
          </p>
        </div>

        {/* Longform Content */}
        <article className="space-y-8 font-serif-bengali text-base sm:text-lg text-[#24221f] leading-[2.1] text-justify">
          <p className="indent-8">
            {about.p1}
          </p>

          <p className="indent-8">
            {about.p2}
          </p>

          {/* Quote Block */}
          <div className="my-10 p-6 sm:p-8 bg-[#e8e6d3] border-l-4 border-[#8a493b] space-y-2">
            <p className="text-lg sm:text-xl font-serif-bengali italic text-[#171717] leading-relaxed">
              {about.quoteCallout}
            </p>
            <p className="text-xs font-mono-meta text-[#7a776e] uppercase tracking-wider">
              {about.quoteAttribution}
            </p>
          </div>

          <h2 id="copyright" className="text-2xl font-serif-bengali font-bold text-[#171717] pt-4 border-b border-[rgba(23,23,23,0.15)] pb-2">
            {about.copyrightHeading}
          </h2>

          <p className="indent-8">
            {about.copyrightText}
          </p>

          <div className="space-y-3 bg-[#f4f2e4] p-5 border border-[rgba(23,23,23,0.15)] text-sm">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
              <span>
                <strong>পাবলিক ডোমেইন ক্লাসিক:</strong> আমরা কেবল সেই সকল লেখকের বই সংরক্ষণ করি যা কপিরাইট মেয়াদের বাইরে এবং সবার জন্য উন্মুক্ত।
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
              <span>
                <strong>মৌলিক টাইপোগ্রাফি ও লেআউট:</strong> অন্য কোনো প্রকাশকের মুদ্রিত পৃষ্ঠা স্ক্যান না করে, প্রাচীন মূল পাঠ থেকে নিজস্ব ফন্ট বিন্যাস ও শৈল্পিক প্রচ্ছদে প্রতিটি বই নতুন করে সাজানো হয়।
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
              <span>
                <strong>সম্পূর্ণ অ-বাণিজ্যিক:</strong> এই পাঠাগার কোনো মুনাফালোভী উদ্দেশ্য ছাড়া সম্পূর্ণ বিনামূল্যে জনসাধারণের পাঠোপযোগী করে তৈরি।
              </span>
            </div>
          </div>

          <h2 id="digitization" className="text-2xl font-serif-bengali font-bold text-[#171717] pt-6 border-b border-[rgba(23,23,23,0.15)] pb-2">
            {about.audiobookHeading}
          </h2>

          <p className="indent-8">
            {about.audiobookText}
          </p>

          <h2 id="no-download" className="text-2xl font-serif-bengali font-bold text-[#171717] pt-6 border-b border-[rgba(23,23,23,0.15)] pb-2">
            {about.noDownloadHeading}
          </h2>

          <p className="indent-8">
            {about.noDownloadText}
          </p>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#171717] text-[#eeeddb] font-serif-bengali text-sm font-semibold hover:bg-[#8a493b] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>গ্রন্থ মহাফেজখানা ব্রাউজ করুন</span>
            </Link>
            <Link
              href="/audiobooks"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 border border-[#171717] text-[#171717] font-serif-bengali text-sm font-semibold hover:bg-[#171717] hover:text-[#eeeddb] transition-colors"
            >
              <Feather className="w-4 h-4 text-[#8a493b]" />
              <span>শ্রুতিপাঠ আসরে প্রবেশ করুন</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
