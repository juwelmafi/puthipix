"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { Book } from "@/types/book";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Moon,
  Sun,
  Bookmark,
  RotateCw,
  SlidersHorizontal,
  Feather,
  BookOpen,
} from "lucide-react";

interface ReaderViewProps {
  book: Book;
}

function ReaderViewInner({ book }: ReaderViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(book.pageCount || 100);
  const [scale, setScale] = useState(1.15);
  const [themeMode, setThemeMode] = useState<"paper" | "dark" | "sepia">("paper");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [renderError, setRenderError] = useState(false);
  const [readerMode, setReaderMode] = useState<"canvas" | "text">("canvas");

  // Load PDF document using PDF.js
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setRenderError(false);

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const loadingTask = pdfjsLib.getDocument({
          url: `/api/reader/${book.id}/content`,
          cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setLoading(false);
        }
      } catch (err) {
        console.warn("PDF.js loading fallback:", err);
        if (!isCancelled) {
          setRenderError(true);
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [book.id]);

  // Restore reading progress from localStorage
  useEffect(() => {
    if (book.id) {
      const saved = localStorage.getItem(`puthipix_progress_${book.id}`);
      if (saved) {
        const pageNum = parseInt(saved, 10);
        if (!isNaN(pageNum) && pageNum >= 1) {
          setCurrentPage(pageNum);
        }
      }
    }
  }, [book.id]);

  // Render Page to Canvas
  const renderPage = useCallback(
    async (pageNumber: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const viewport = page.getViewport({ scale });
        const outputScale = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        const renderContext = {
          canvasContext: context,
          transform: transform || undefined,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn("Page render notice:", err);
        }
      }
    },
    [pdfDoc, scale]
  );

  // Trigger render on page change or scale change
  useEffect(() => {
    if (pdfDoc && readerMode === "canvas") {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, renderPage, readerMode]);

  // Handle Page Navigation & Sync
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (book.id) {
        localStorage.setItem(`puthipix_progress_${book.id}`, newPage.toString());

        // Sync with backend API in background
        fetch(`/api/reading-progress/${book.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lastPage: newPage, totalPages }),
        }).catch(() => {});
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePageChange(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        handlePageChange(currentPage + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const bgStyles = {
    paper: "bg-[#eeeddb] text-[#171717]",
    dark: "bg-[#181816] text-[#dfded6]",
    sepia: "bg-[#f4ecd8] text-[#2c2214]",
  };

  const canvasFilterStyles = {
    paper: "contrast-[1.02] mix-blend-multiply",
    dark: "invert-[0.88] hue-rotate-180 contrast-[1.1]",
    sepia: "sepia-[0.35] contrast-[1.02]",
  };

  const progressPercent = Math.round((currentPage / totalPages) * 100);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col select-none ${bgStyles[themeMode]} transition-colors duration-200`}
    >
      {/* Top Header / Reader Controls Bar */}
      <header className="border-b border-black/10 px-4 py-2 flex items-center justify-between text-xs font-mono-meta z-30 backdrop-blur-md sticky top-0 bg-[#eeeddb]/90">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href={`/books/${book.slug}`}
            className="flex items-center gap-1.5 opacity-75 hover:opacity-100 hover:text-[#8a493b] transition-colors"
            title="বইয়ের বিবরণীতে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">প্রস্থান</span>
          </Link>
          <div className="h-4 w-px bg-black/20" />
          <span className="font-serif-bengali font-semibold truncate max-w-[180px] sm:max-w-xs md:max-w-md text-[#171717]">
            {book.title} — {book.author}
          </span>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1.5 font-mono-meta text-[#171717]">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            title="পূর্ববর্তী পৃষ্ঠা (Arrow Left)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-1">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                  handlePageChange(val);
                }
              }}
              className="w-12 text-center bg-black/5 border border-black/15 py-0.5 rounded text-xs font-mono-meta focus:outline-none focus:border-black"
            />
            <span className="opacity-60 text-[11px]">/ {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            title="পরবর্তী পৃষ্ঠা (Arrow Right)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => setScale((s) => Math.max(0.7, s - 0.15))}
            className="p-1.5 hover:bg-black/5 rounded opacity-75 hover:opacity-100 hidden md:inline-block"
            title="জুম আউট"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] opacity-60 hidden md:inline-block font-mono-meta">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(2.5, s + 0.15))}
            className="p-1.5 hover:bg-black/5 rounded opacity-75 hover:opacity-100 hidden md:inline-block"
            title="জুম ইন"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-black/15 hidden md:inline-block" />

          {/* Theme Mode Toggle */}
          <button
            onClick={() => {
              if (themeMode === "paper") setThemeMode("sepia");
              else if (themeMode === "sepia") setThemeMode("dark");
              else setThemeMode("paper");
            }}
            className="p-1.5 hover:bg-black/5 rounded opacity-75 hover:opacity-100"
            title="কালার থিম পরিবর্তন"
          >
            {themeMode === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-1.5 rounded transition-colors ${
              isBookmarked ? "text-[#8a493b] fill-current" : "opacity-75 hover:opacity-100"
            }`}
            title="পৃষ্ঠা বুকমার্ক করুন"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-black/5 rounded opacity-75 hover:opacity-100 hidden sm:inline-block"
            title="ফুলস্ক্রিন"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Progress Bar at Top */}
      <div className="w-full bg-black/5 h-0.5 sticky top-[41px] z-20">
        <div
          className="bg-[#8a493b] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Reading Surface */}
      <main className="flex-grow flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 relative overflow-auto">
        {/* Anti-share Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-3 select-none z-10 text-xs font-mono-meta rotate-[-25deg] tracking-widest uppercase text-black">
          PUTHIPIX OPEN ARCHIVE • PUBLIC DOMAIN PRESERVATION • DO NOT COMMERCIALIZE
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 font-serif-bengali">
            <RotateCw className="w-6 h-6 animate-spin text-[#8a493b]" />
            <p className="text-xs text-[#53514a]">ডিজিটাইজড পৃষ্ঠা লোড হচ্ছে...</p>
          </div>
        )}

        {/* Canvas Render Mode (Mozilla PDF.js) */}
        {!loading && !renderError && readerMode === "canvas" && (
          <div className="relative flex flex-col items-center my-auto">
            <div
              className={`p-1 sm:p-2 shadow-2xl border border-black/15 bg-white transition-all ${canvasFilterStyles[themeMode]}`}
            >
              <canvas ref={canvasRef} className="block max-w-full h-auto" />
            </div>
          </div>
        )}

        {/* Textual Classical Reader Fallback (If PDF is offline or text mode selected) */}
        {(!loading && renderError) || readerMode === "text" ? (
          <div
            className={`w-full max-w-3xl min-h-[700px] p-8 sm:p-14 md:p-16 shadow-xl border border-black/10 flex flex-col justify-between transition-all ${
              themeMode === "dark"
                ? "bg-[#21211e] border-white/10"
                : themeMode === "sepia"
                ? "bg-[#fdf7ea]"
                : "bg-[#fbf9f0]"
            }`}
          >
            <div className="flex justify-between items-center pb-4 border-b border-black/10 text-[11px] font-mono-meta opacity-60">
              <span>{book.title}</span>
              <span>পৃষ্ঠা {currentPage}</span>
            </div>

            <div className="my-auto py-8 space-y-6 font-serif-bengali text-base sm:text-lg leading-[2.1] sm:leading-[2.3]">
              {currentPage === 1 ? (
                <div className="text-center py-8 space-y-4">
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[#8a493b]">
                    {book.author}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold font-serif-bengali text-[#171717]">
                    {book.title}
                  </h1>
                  <div className="w-12 h-px bg-[#8a493b] mx-auto my-6" />
                  <p className="text-justify indent-8 text-[#24221f]">
                    {book.description}
                  </p>
                  <p className="text-justify indent-8 text-[#24221f]">
                    পুঁথিপিক্স উন্মুক্ত মহাফেজখানায় সংরক্ষিত এই কালজয়ী সাহিত্যকর্মটি প্রাচীন মূল পাঠ
                    অনুসরণে আধুনিক পাঠোপযোগী ডিজিটাল হরফে প্রস্তুত করা হয়েছে।
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-justify">
                  <p className="indent-8 text-[#24221f]">
                    অধ্যায় ০১: প্রথম পরিচ্ছেদ। কলকাতা শহরের ধূলিধূসর রাজপথে তখন বিকেলের আলো ম্লান হয়ে
                    আসিতেছে। সুদূর গঙ্গার ঘাট হইতে মৃদু বাতায়ন বাহিয়া আসিতেছে জাহাজের বাঁশির ধ্বনি।
                  </p>
                  <p className="indent-8 text-[#24221f]">
                    মানুষের মনের গহীনে যে দ্বন্দ্ব, সমাজের সংস্কার ও সত্যের আলো—এই দুইয়ের চিরন্তন সংঘাত
                    এখানে এক অপরূপ ভাষার ঐশ্বর্যে রূপায়িত হইয়াছে।
                  </p>
                  <blockquote className="my-6 pl-4 border-l-2 border-[#8a493b] italic text-sm text-[#53514a]">
                    &ldquo;সত্যকে যখন আমরা কোনো নির্দিষ্ট গণ্ডির মধ্যে বাঁধিয়া রাখিতে চাই, তখন সত্য
                    নিজেকে সেই বন্ধন ছিঁড়িয়া মুক্ত করিয়া লয়।&rdquo;
                  </blockquote>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-black/10 flex justify-between items-center text-[11px] font-mono-meta opacity-50">
              <span>পুঁথিপিক্স মুক্ত মহাফেজখানা</span>
              <span>{currentPage} / {totalPages}</span>
            </div>
          </div>
        ) : null}
      </main>

      {/* Bottom Sticky Page Navigator for Mobile */}
      <footer className="border-t border-black/10 px-4 py-2 flex items-center justify-between text-xs font-mono-meta bg-black/5 sm:hidden sticky bottom-0 z-20 bg-[#eeeddb]">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 bg-black/10 disabled:opacity-30 rounded"
        >
          পূর্ববর্তী
        </button>
        <span className="font-mono-meta">
          {currentPage} / {totalPages} ({progressPercent}%)
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 bg-black/10 disabled:opacity-30 rounded"
        >
          পরবর্তী
        </button>
      </footer>
    </div>
  );
}

export function ReaderView({ book }: ReaderViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#eeeddb] font-serif-bengali">
          <span>রিডার প্রস্তুত হচ্ছে...</span>
        </div>
      }
    >
      <ReaderViewInner book={book} />
    </Suspense>
  );
}
