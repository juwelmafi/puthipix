import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types/book";
import { BookOpen, Feather } from "lucide-react";

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export function BookCard({ book, compact = false }: BookCardProps) {
  return (
    <article className="group flex flex-col h-full bg-[#f4f2e4] border border-[rgba(23,23,23,0.14)] p-2 sm:p-3.5 hover:border-[#171717] transition-all duration-200">
      {/* Book Cover Image Area with book-like ratio */}
      <Link
        href={`/books/${book.slug}`}
        className="block relative aspect-[2/3] w-full overflow-hidden bg-[#e5e2cd] border border-[rgba(23,23,23,0.12)] shadow-sm"
      >
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Paper Spine Effect */}
        <div className="absolute inset-y-0 left-0 w-2 sm:w-3 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none" />

        {/* Public Domain Badge */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-[#171717] text-[#eeeddb] text-[8px] sm:text-[10px] font-mono-meta font-medium uppercase px-1 sm:px-1.5 py-0.5 tracking-wider shadow-sm">
            <Feather className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#8a493b]" />
            <span className="hidden xs:inline">মুক্তপাঠ</span>
          </span>
        </div>
      </Link>

      {/* Book Metadata */}
      <div className="flex flex-col flex-grow pt-2 sm:pt-3 space-y-1">
        {/* Genre & Meta Tag */}
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono-meta text-[#7a776e]">
          <span className="truncate max-w-[65%]">{book.genre.split(" ")[0]}</span>
          <span className="shrink-0">{book.pageCount}পৃ</span>
        </div>

        {/* Book Title */}
        <h3 className="font-serif-bengali text-xs sm:text-base font-bold text-[#171717] leading-tight line-clamp-1 sm:line-clamp-2">
          <Link
            href={`/books/${book.slug}`}
            className="hover:text-[#8a493b] transition-colors"
            title={book.title}
          >
            {book.title}
          </Link>
        </h3>

        {/* Author */}
        <p className="text-[10px] sm:text-xs font-serif-bengali italic text-[#53514a] line-clamp-1">
          {book.author}
        </p>

        {/* Description snippet - shown on tablet and desktop only to keep mobile cards neat */}
        {!compact && book.description && (
          <p className="hidden md:line-clamp-2 text-xs text-[#53514a] font-serif-bengali pt-1 border-t border-[rgba(23,23,23,0.08)]">
            {book.description}
          </p>
        )}

        {/* Card Action Button */}
        <div className="pt-2 sm:pt-2.5 mt-auto flex items-center justify-between gap-1 sm:gap-2 border-t border-[rgba(23,23,23,0.1)]">
          <Link
            href={`/books/${book.slug}`}
            className="w-full inline-flex items-center justify-center gap-1 py-1 sm:py-1.5 px-1.5 sm:px-3 text-[10px] sm:text-xs font-serif-bengali font-semibold bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] transition-colors"
          >
            <BookOpen className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">বইটি পড়ুন</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
