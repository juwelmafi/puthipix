import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { Feather, BookOpen, ShieldCheck, HeartHandshake, Compass, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Editorial Eyebrow */}
        <div className="text-center space-y-4 mb-12 pb-8 border-b border-[rgba(23,23,23,0.18)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[rgba(23,23,23,0.2)] bg-[#e6e4cf] text-[11px] font-mono-meta uppercase tracking-widest text-[#53514a]">
            <Feather className="w-3.5 h-3.5 text-[#8a493b]" />
            <span>পুঁথিপিক্স মেনিফেস্টো</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-bengali font-bold text-[#171717] leading-tight">
            একটি শান্ত পাঠাগার ও মহাফেজখানা
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base font-serif-bengali italic text-[#53514a]">
            &ldquo;জ্ঞান কেবল সংরক্ষণ করার বিষয় নয়, এটি নিভৃতে অনুধাবন ও উত্তরপ্রজন্মের মাঝে ছড়িয়ে দেওয়ার এক সাধনা।&rdquo;
          </p>
        </div>

        {/* Longform Content */}
        <article className="space-y-8 font-serif-bengali text-base sm:text-lg text-[#24221f] leading-[2.1] text-justify">
          <p className="indent-8">
            ইন্টারনেট যখন শুরু হয়েছিল, তখন এর মূল উদ্দেশ্য ছিল জ্ঞানের সার্বজনীন বিস্তার। কিন্তু সময়ের সাথে সাথে
            আমাদের ডিজিটাল জীবন বিজ্ঞাপনের কোলাহল, বিভ্রান্তিকর নোটিফিকেশন এবং বাণিজ্যিক স্বার্থে ভারাক্রান্ত হয়ে উঠেছে।
            বই পড়ার যে চিরায়ত প্রশান্তি—একটি নির্জন পাতার গভীর নিস্তব্ধতা, পরিপাটি মার্জিন এবং চিন্তার গভীর মনোযোগ—ডিজিটাল
            স্ক্রিনে তা ক্রমশ হারিয়ে যাচ্ছিল।
          </p>

          <p className="indent-8">
            <strong>পুঁথিপিক্স (Puthipix)</strong> সেই হারানো প্রশান্তি ফিরিয়ে আনার একটি আন্তরিক প্রয়াস। এটি
            কোনো বাণিজ্যিক ই-কমার্স শপ নয়; এটি বাংলা ভাষা ও সাহিত্যের ধ্রুপদী সৃষ্টিসমূহের এক মুক্ত মহাফেজখানা।
            এখানে আমরা রবীন্দ্রনাথ ঠাকুর, শরৎচন্দ্র চট্টোপাধ্যায়, বঙ্কিমচন্দ্র চট্টোপাধ্যায়, বেগম রোকেয়া, জীবনানন্দ দাশ সহ
            বাংলা সাহিত্যের পথিকৃৎদের অমর রচনাগুলোকে ডিজিটাল মাধ্যমে সংরক্ষণ করছি।
          </p>

          {/* Quote Block */}
          <div className="my-10 p-6 sm:p-8 bg-[#e8e6d3] border-l-4 border-[#8a493b] space-y-2">
            <p className="text-lg sm:text-xl font-serif-bengali italic text-[#171717] leading-relaxed">
              &ldquo;আমাদের লক্ষ্য এমন একটি পাঠপরিবেশ তৈরি করা যা পুরোনো সাহিত্য সাময়িকীর মতো শান্ত, রুচিশীল এবং
              পড়ার টেবিলে আসল বই খুলে বসার মতোই স্বাভাবিক ও নির্ভার।&rdquo;
            </p>
            <p className="text-xs font-mono-meta text-[#7a776e] uppercase tracking-wider">
              — পুঁথিপিক্স নকশা ও শিল্প ভাবনা
            </p>
          </div>

          <h2 id="copyright" className="text-2xl font-serif-bengali font-bold text-[#171717] pt-4 border-b border-[rgba(23,23,23,0.15)] pb-2">
            কপিরাইট ও পাবলিক ডোমেইন সংরক্ষণ
          </h2>

          <p className="indent-8">
            পুঁথিপিক্স বৌদ্ধিক সম্পত্তি ও কপিরাইট আইনের প্রতি শ্রদ্ধাশীল। বাংলাদেশের <em>কপিরাইট আইন, ২০২৩</em> অনুযায়ী
            লেখকের মৃত্যুর ৬০ বছর পর সাহিত্যকর্ম সাধারণ নিয়মে <strong>পাবলিক ডোমেইন (Public Domain)</strong>-এ উন্মুক্ত হয়।
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
            শ্রুতিপাঠ ও অডিওবুক সংরক্ষণ নীতি
          </h2>

          <p className="indent-8">
            মুদ্রিত সাহিত্যের পাশাপাশি শ্রবণমনস্ক পাঠকদের জন্য পুঁথিপিক্সে সংযোজিত হয়েছে <strong>শ্রুতিপাঠ (Audiobooks)</strong>। ধ্রুপদী গল্প, উপন্যাস ও কবিতার বাচিক রূপায়ণ এখানে সংরক্ষিত হয়। আধুনিক রচনার ক্ষেত্রে আমরা ক্রিয়েটিভ কমন্স (Creative Commons) ও অনুমোদিত মুক্ত স্বত্বাধিকারী সাহিত্যকর্ম অন্তর্ভুক্ত করি, যাতে কোনো ধরনের স্বত্ব লংঘন ছাড়াই পাঠক সাহিত্যের মাধুর্য উপভোগ করতে পারেন।
          </p>

          <h2 id="no-download" className="text-2xl font-serif-bengali font-bold text-[#171717] pt-6 border-b border-[rgba(23,23,23,0.15)] pb-2">
            কেন সরাসরি ডাউনলোড লিংক নেই?
          </h2>

          <p className="indent-8">
            একটি সাধারণ প্রশ্ন হতে পারে: পুঁথিপিক্সে বই বা অডিওর কোনো ডাউনলোড বাটন রাখা হয়নি কেন?
            এর কারণ হলো—আমরা চাই পাঠক স্ক্রিনে ফাইল জমিয়ে ভুলে না গিয়ে সরাসরি একটি শান্ত পাঠাগারে
            পড়ার এবং শোনার অনুভূতি পান। আমাদের কাস্টম ব্রাউজার রিডার ও অডিও প্লেয়ারে যেকোনো মোবাইল, ট্যাব বা ল্যাপটপ থেকে আপনি যেখানে পড়া বা শোনা শেষ
            করেছিলেন, সেখান থেকেই পুনরায় উপভোগ করতে পারবেন।
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
