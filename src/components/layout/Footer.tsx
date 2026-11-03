import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#e8e6d3] border-t-2 border-[#171717] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-[rgba(23,23,23,0.15)]">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-2xl font-serif-bengali font-semibold text-[#171717]">
              পুঁথিপিক্স / Puthipix
            </h3>
            <p className="text-xs sm:text-sm text-[#53514a] font-serif-bengali leading-relaxed max-w-md">
              বাংলা ভাষা ও সাহিত্যের ধ্রুপদী সৃষ্টিসমূহের এক উন্মুক্ত ও নিভৃত ডিজিটাল পাঠাগার।
              রবীন্দ্রনাথ, শরৎচন্দ্র, বঙ্কিম, রোকেয়া সহ কালজয়ী সাহিত্যিকদের লেখা কোনো বিজ্ঞাপন
              বা আর্থিক লেনদেন ছাড়াই সম্পূর্ণ বিনামূল্যে যে কেউ অনলাইনে পাঠ করতে পারেন।
            </p>
            <p className="text-[11px] font-mono-meta text-[#7a776e]">
              উন্মুক্ত মহাফেজখানা • শতভাগ বিনামূল্যে মুক্তপাঠ • পাবলিক ডোমেইন সংরক্ষণ
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-mono-meta text-[11px] uppercase tracking-wider text-[#171717] font-semibold">
              আর্কাইভ ও সূচি
            </h4>
            <ul className="space-y-2 text-[#53514a]">
              <li>
                <Link href="/library" className="hover:text-[#171717] transition-colors">
                  সকল গ্রন্থ (All Books)
                </Link>
              </li>
              <li>
                <Link href="/audiobooks" className="hover:text-[#171717] transition-colors font-medium text-[#8a493b]">
                  শ্রুতিপাঠ ও অডিওবুক (Audiobooks)
                </Link>
              </li>
              <li>
                <Link href="/library?genre=novels" className="hover:text-[#171717] transition-colors">
                  উপন্যাস ও গল্প (Novels)
                </Link>
              </li>
              <li>
                <Link href="/library?genre=poetry" className="hover:text-[#171717] transition-colors">
                  কবিতা ও পদাবলি (Poetry)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#171717] transition-colors">
                  আমাদের লক্ষ্য ও উদ্দেশ্য
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Preservation */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-mono-meta text-[11px] uppercase tracking-wider text-[#171717] font-semibold">
              নীতিমালা ও মহাফেজখানা
            </h4>
            <ul className="space-y-2 text-[#53514a]">
              <li>
                <Link href="/about#copyright" className="hover:text-[#171717] transition-colors">
                  কপিরাইট ও পাবলিক ডোমেইন নীতিমালা
                </Link>
              </li>
              <li>
                <Link href="/about#digitization" className="hover:text-[#171717] transition-colors">
                  ডিজিটাইজেশন ও টাইপোগ্রাফি
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#171717] transition-colors">
                  পাঠকের ব্যক্তিগত বুকমার্ক
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#171717] transition-colors">
                  পুঁথিপিক্স মেনিফেস্টো
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-meta text-[#7a776e] gap-4">
          <p>© 2026 পুঁথিপিক্স। বাংলা সাহিত্যের উন্মুক্ত মহাফেজখানা।</p>
          <p className="text-center sm:text-right">
            জ্ঞান ও সাহিত্যের সর্বজনীন প্রসারে নিবেদিত এক শান্ত পাঠাগার।
          </p>
        </div>
      </div>
    </footer>
  );
}
