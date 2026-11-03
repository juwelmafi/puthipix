import Link from "next/link";
import Image from "next/image";
import { Audiobook } from "@/types/audiobook";
import { Headphones, Play, Mic, Sparkles } from "lucide-react";

interface AudioCardProps {
  audiobook: Audiobook;
  compact?: boolean;
}

export function AudioCard({ audiobook, compact = false }: AudioCardProps) {
  const getCopyrightBadge = (type: string) => {
    switch (type) {
      case "open-license":
        return { label: "উন্মুক্ত স্বত্ব", bg: "bg-[#2f5d47]" };
      case "authorized":
        return { label: "অনুমোদিত", bg: "bg-[#43527a]" };
      default:
        return { label: "পাবলিক ডোমেইন", bg: "bg-[#171717]" };
    }
  };

  const badge = getCopyrightBadge(audiobook.copyrightType);

  return (
    <article className="group flex flex-col h-full bg-[#f4f2e4] border border-[rgba(23,23,23,0.14)] p-2 sm:p-3.5 hover:border-[#171717] transition-all duration-200">
      {/* Cover / Vinyl Art Area */}
      <Link
        href={`/audiobooks/${audiobook.slug}`}
        className="block relative aspect-square w-full overflow-hidden bg-[#e5e2cd] border border-[rgba(23,23,23,0.12)] shadow-sm"
      >
        <Image
          src={audiobook.coverImage}
          alt={audiobook.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Vintage Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Center Play Button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]">
          <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#eeeddb] text-[#171717] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-[#171717] ml-0.5" />
          </span>
        </div>

        {/* Top Tag: Copyright Status */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <span
            className={`inline-flex items-center gap-0.5 sm:gap-1 ${badge.bg} text-[#eeeddb] text-[8px] sm:text-[9px] font-mono-meta font-medium uppercase px-1 sm:px-1.5 py-0.5 tracking-wider shadow-sm`}
          >
            <Sparkles className="w-2 h-2 text-[#e8c078]" />
            <span className="truncate max-w-[80px] xs:max-w-none">{badge.label}</span>
          </span>
        </div>

        {/* Bottom Duration Badge */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2">
          <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-[2px] text-[#eeeddb] text-[9px] sm:text-[10px] font-mono-meta px-1.5 py-0.5 rounded-sm">
            <Headphones className="w-2.5 h-2.5 text-[#e8c078]" />
            <span>{audiobook.duration}</span>
          </span>
        </div>
      </Link>

      {/* Metadata */}
      <div className="flex flex-col flex-grow pt-2 sm:pt-3 space-y-1">
        {/* Category & Chapters count */}
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono-meta text-[#7a776e]">
          <span className="truncate max-w-[65%]">{audiobook.category.split(" ")[0]}</span>
          <span className="shrink-0">{audiobook.chapters.length} পর্ব</span>
        </div>

        {/* Audiobook Title */}
        <h3 className="font-serif-bengali text-xs sm:text-base font-bold text-[#171717] leading-tight line-clamp-1 sm:line-clamp-2">
          <Link
            href={`/audiobooks/${audiobook.slug}`}
            className="hover:text-[#8a493b] transition-colors"
            title={audiobook.title}
          >
            {audiobook.title}
          </Link>
        </h3>

        {/* Author */}
        <p className="text-[10px] sm:text-xs font-serif-bengali italic text-[#53514a] line-clamp-1">
          {audiobook.author}
        </p>

        {/* Narrator */}
        <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-[#7a776e] font-sans-bengali pt-0.5">
          <Mic className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#8a493b] shrink-0" />
          <span className="truncate">কণ্ঠ: {audiobook.narrator}</span>
        </div>

        {/* Description snippet for desktop */}
        {!compact && audiobook.description && (
          <p className="hidden md:line-clamp-2 text-xs text-[#53514a] font-serif-bengali pt-1 border-t border-[rgba(23,23,23,0.08)]">
            {audiobook.description}
          </p>
        )}

        {/* Listen Action Button */}
        <div className="pt-2 sm:pt-2.5 mt-auto border-t border-[rgba(23,23,23,0.1)]">
          <Link
            href={`/audiobooks/${audiobook.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 text-[10px] sm:text-xs font-serif-bengali font-semibold bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] transition-colors"
          >
            <Headphones className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">শ্রুতিপাঠ শুনুন</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

