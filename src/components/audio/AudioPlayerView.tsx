"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Audiobook, AudiobookChapter } from "@/types/audiobook";
import { formatSecondsToTime, toBengaliNumber } from "@/lib/formatters";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Headphones,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Mic,
  ListMusic,
  FileText,
  Clock,
  Share2,
  Check
} from "lucide-react";

interface AudioPlayerViewProps {
  audiobook: Audiobook;
}

export function AudioPlayerView({ audiobook }: AudioPlayerViewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audiobook.durationSeconds || 100);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"player" | "transcript" | "chapters">("player");
  const [copiedLink, setCopiedLink] = useState(false);

  const currentChapter = audiobook.chapters[currentChapterIndex] || audiobook.chapters[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay or audio play issue:", err);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + seconds)
      );
    }
  };

  const selectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    if (audioRef.current) {
      // Calculate offset based on previous chapters if chapters are segments
      const targetTime = 0;
      audioRef.current.currentTime = targetTime;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getCopyrightBadge = (type: string) => {
    switch (type) {
      case "open-license":
        return { label: "উন্মুক্ত স্বত্ব (Creative Commons)", bg: "bg-[#2f5d47]" };
      case "authorized":
        return { label: "অনুমোদিত প্রযোজনা (Authorized)", bg: "bg-[#43527a]" };
      default:
        return { label: "পাবলিক ডোমেইন (Public Domain Classic)", bg: "bg-[#171717]" };
    }
  };

  const badge = getCopyrightBadge(audiobook.copyrightType);

  return (
    <div className="w-full">
      {/* Hidden native HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={currentChapter.audioUrl || audiobook.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
      />

      {/* Navigation breadcrumb */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <Link
          href="/audiobooks"
          className="inline-flex items-center gap-1.5 text-xs font-serif-bengali text-[#53514a] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>শ্রুতিপাঠ মহাফেজখানায় ফিরুন</span>
        </Link>

        <div className="flex items-center gap-2">
          {audiobook.readBookSlug && (
            <Link
              href={`/read/${audiobook.readBookSlug}`}
              className="inline-flex items-center gap-1 text-[11px] font-serif-bengali text-[#8a493b] hover:underline bg-[#e8e6d3] px-2.5 py-1 border border-[rgba(23,23,23,0.12)]"
            >
              <BookOpen className="w-3 h-3 text-[#8a493b]" />
              <span>মূল গ্রন্থটি পড়ুন</span>
            </Link>
          )}

          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-1 text-[11px] font-mono-meta text-[#53514a] hover:text-[#171717] bg-[#f4f2e4] px-2.5 py-1 border border-[rgba(23,23,23,0.14)]"
            title="লিঙ্ক কপি করুন"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-green-700" />
                <span className="text-green-700">কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-[#7a776e]" />
                <span className="hidden sm:inline">ভাগাভাগি</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Editorial Broadsheet Audio Deck */}
      <div className="bg-[#f4f2e4] border-2 border-[#171717] p-4 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          {/* Left Column: Cover & Visual Presentation */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] bg-[#e5e2cd] border-2 border-[#171717] shadow-md overflow-hidden group">
              <Image
                src={audiobook.coverImage}
                alt={audiobook.title}
                fill
                unoptimized
                sizes="(max-width: 1024px) 80vw, 320px"
                className="object-cover"
              />

              {/* Vinyl Groove & Paper Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

              {/* Status Indicator */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono-meta bg-black/70 backdrop-blur-xs px-2 py-1">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPlaying ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"
                    }`}
                  />
                  <span>{isPlaying ? "চলছে..." : "থামানো আছে"}</span>
                </span>
                <span>{audiobook.duration}</span>
              </div>
            </div>

            {/* Copyright & Digitization Note */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] mt-4 p-3 bg-[#e8e6d3] border border-[rgba(23,23,23,0.12)] text-[11px] font-serif-bengali text-[#53514a]">
              <div className="flex items-center gap-1 text-[#171717] font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-[#8a493b]" />
                <span>কপিরাইট তথ্য</span>
              </div>
              <p className="leading-tight text-[10px] sm:text-[11px]">
                {audiobook.copyrightNote || "উন্মুক্ত মহাফেজখানা কর্তৃক ডিজিটাল ফরম্যাটে সংরক্ষিত।"}
              </p>
            </div>
          </div>

          {/* Right Column: Title, Metadata & Player Controls */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              {/* Header tags */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 ${badge.bg} text-[#eeeddb] text-[9px] sm:text-[10px] font-mono-meta uppercase px-2 py-0.5 tracking-wider`}
                >
                  {badge.label}
                </span>
                <span className="font-mono-meta text-[10px] text-[#7a776e]">
                  {audiobook.category} • প্রকাশ: {toBengaliNumber(audiobook.publishedYear)}
                </span>
              </div>

              {/* Audiobook Title */}
              <h1 className="text-2xl sm:text-4xl font-serif-bengali font-bold text-[#171717] leading-tight">
                {audiobook.title}
              </h1>

              {/* Author & Voice Artist */}
              <div className="mt-2 sm:mt-3 pb-3 border-b border-[rgba(23,23,23,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-serif-bengali text-base sm:text-lg text-[#171717] italic">
                    রচনা: {audiobook.author}
                  </p>
                  <p className="text-xs sm:text-sm font-sans-bengali text-[#8a493b] flex items-center gap-1 mt-0.5 font-medium">
                    <Mic className="w-3.5 h-3.5" />
                    <span>কণ্ঠপাঠ: {audiobook.narrator}</span>
                  </p>
                </div>

                <div className="text-[11px] font-mono-meta text-[#7a776e] bg-[#e4e2cb] px-2.5 py-1 self-start sm:self-auto border border-[rgba(23,23,23,0.1)]">
                  অধ্যায় {toBengaliNumber(currentChapterIndex + 1)} / {toBengaliNumber(audiobook.chapters.length)}
                </div>
              </div>

              {/* Current Track / Chapter Title */}
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm font-serif-bengali text-[#53514a]">
                <span className="font-semibold text-[#171717] truncate">
                  {currentChapter.title}
                </span>
                <span className="text-[11px] font-mono-meta text-[#7a776e] shrink-0 ml-2">
                  {currentChapter.duration}
                </span>
              </div>
            </div>

            {/* Custom Interactive Player Interface */}
            <div className="mt-4 pt-4 border-t-2 border-[#171717] space-y-4">
              {/* Progress Slider Bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="অডিও সময়রেখা"
                  className="w-full h-2 bg-[#d8d5be] accent-[#8a493b] rounded-none cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-mono-meta text-[#53514a]">
                  <span>{formatSecondsToTime(currentTime)}</span>
                  <span>{formatSecondsToTime(duration)}</span>
                </div>
              </div>

              {/* Primary Player Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Playback speed buttons */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono-meta text-[#7a776e] hidden xs:inline">গতি:</span>
                  {[0.75, 1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`text-[10px] font-mono-meta px-1.5 py-0.5 border ${
                        playbackRate === rate
                          ? "bg-[#171717] text-[#eeeddb] border-[#171717]"
                          : "bg-[#e8e6d3] text-[#53514a] border-[rgba(23,23,23,0.15)] hover:border-[#171717]"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Central Transport Controls (Skip, Play/Pause) */}
                <div className="flex items-center gap-3 sm:gap-5 mx-auto">
                  <button
                    onClick={() => skipSeconds(-10)}
                    className="p-2 text-[#53514a] hover:text-[#171717] transition-colors"
                    title="১০ সেকেন্ড পেছনে যান"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8a493b] text-[#eeeddb] hover:bg-[#171717] flex items-center justify-center shadow-md transition-all transform active:scale-95"
                    title={isPlaying ? "বিরতি" : "শুনুন"}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-[#eeeddb]" />
                    ) : (
                      <Play className="w-6 h-6 fill-[#eeeddb] ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => skipSeconds(10)}
                    className="p-2 text-[#53514a] hover:text-[#171717] transition-colors"
                    title="১০ সেকেন্ড এগিয়ে যান"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume & Mute control */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-[#53514a] hover:text-[#171717]"
                    title={isMuted ? "শব্দ চালু" : "শব্দ বন্ধ"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-700" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    aria-label="ভলিউম নিয়ন্ত্রণ"
                    className="w-16 h-1.5 bg-[#d8d5be] accent-[#171717] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Supplementary Content: Chapters Playlist vs Text Transcript */}
        <div className="mt-8 pt-6 border-t border-[rgba(23,23,23,0.18)]">
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-[rgba(23,23,23,0.12)] pb-2">
            <button
              onClick={() => setActiveTab("chapters")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-serif-bengali transition-colors ${
                activeTab === "chapters"
                  ? "bg-[#171717] text-[#eeeddb] font-semibold"
                  : "text-[#53514a] hover:text-[#171717]"
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>অধ্যায় ও সূচিপত্র ({toBengaliNumber(audiobook.chapters.length)})</span>
            </button>

            <button
              onClick={() => setActiveTab("transcript")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-serif-bengali transition-colors ${
                activeTab === "transcript"
                  ? "bg-[#171717] text-[#eeeddb] font-semibold"
                  : "text-[#53514a] hover:text-[#171717]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>শ্রুতিপাঠের সাথে সাথে পাঠ (Read along)</span>
            </button>
          </div>

          {/* Chapters List Tab */}
          {activeTab === "chapters" && (
            <div className="space-y-2">
              {audiobook.chapters.map((chapter, idx) => {
                const isSelected = idx === currentChapterIndex;
                return (
                  <div
                    key={chapter.id}
                    onClick={() => selectChapter(idx)}
                    className={`cursor-pointer p-3 flex items-center justify-between border transition-all ${
                      isSelected
                        ? "bg-[#e8e6d3] border-[#171717] font-semibold shadow-xs"
                        : "bg-[#f4f2e4] border-[rgba(23,23,23,0.1)] hover:bg-[#ede9d6]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono-meta ${
                          isSelected
                            ? "bg-[#8a493b] text-[#eeeddb]"
                            : "bg-[#e4e2cb] text-[#53514a]"
                        }`}
                      >
                        {toBengaliNumber(idx + 1)}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-serif-bengali text-[#171717]">
                          {chapter.title}
                        </p>
                        {chapter.narrator && (
                          <p className="text-[10px] font-sans-bengali text-[#7a776e]">
                            কণ্ঠ: {chapter.narrator}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono-meta text-[#7a776e]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {chapter.duration}
                      </span>
                      {isSelected && isPlaying ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      ) : (
                        <Play className="w-3 h-3 text-[#53514a]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Transcript / Read Along Tab */}
          {activeTab === "transcript" && (
            <div className="bg-[#ede9d6] p-4 sm:p-6 border border-[rgba(23,23,23,0.12)]">
              <h3 className="font-serif-bengali font-bold text-base sm:text-lg text-[#171717] mb-3">
                মূল পাঠ্যাংশ
              </h3>
              {audiobook.transcript ? (
                <div className="prose prose-stone max-w-none font-serif-bengali text-xs sm:text-sm sm:leading-relaxed text-[#2a2926] whitespace-pre-line space-y-3">
                  {audiobook.transcript}
                </div>
              ) : (
                <p className="font-serif-bengali text-xs text-[#7a776e] italic">
                  এই শ্রুতিপাঠটির লিখিত অনুলিপি প্রস্তুতকরণ প্রক্রিয়াধীন রয়েছে।
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

