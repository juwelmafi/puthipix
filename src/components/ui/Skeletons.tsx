"use client";

import React from "react";

/**
 * Base pulsing skeleton block tailored to Puthipix's vintage broadsheet newspaper aesthetic
 */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`animate-pulse bg-[#dedbc2] border border-black/5 rounded-xs ${className}`}
    />
  );
}

/**
 * Post Card Skeleton matching PostCard.tsx
 */
export function PostSkeleton() {
  return (
    <article className="bg-[#f4f2e4] border-2 border-[#171717] p-4 sm:p-6 shadow-sm space-y-4 font-serif-bengali">
      {/* Author Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(23,23,23,0.12)]">
        <div className="flex items-center gap-3">
          {/* Avatar Skeleton */}
          <Skeleton className="w-10 h-10 rounded-full shrink-0 !bg-[#d5d1b5]" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
        {/* Genre Pill Skeleton */}
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Post Title */}
      <div className="space-y-2">
        <Skeleton className="h-5 sm:h-6 w-3/4 !bg-[#d0ccaf]" />
        {/* Optional Book Reference Skeleton */}
        <div className="p-2.5 bg-[#ede9d6] border border-black/10 flex items-center gap-3">
          <Skeleton className="w-4 h-4 rounded-xs shrink-0" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </div>

      {/* Main Content Lines */}
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>

      {/* Optional Post Image Skeleton */}
      <Skeleton className="w-full h-48 sm:h-64 border border-black/15 !bg-[#d8d4b8]" />

      {/* Bottom Action Bar Skeleton */}
      <div className="pt-3 border-t border-[rgba(23,23,23,0.14)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
    </article>
  );
}

/**
 * Feed of multiple Post Skeletons
 */
export function PostSkeletonFeed({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Single Comment Skeleton
 */
export function CommentSkeleton() {
  return (
    <div className="p-3 bg-[#f7f5e8] border border-black/10 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full shrink-0" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-2 w-14" />
      </div>
      <Skeleton className="h-3 w-5/6 ml-8" />
    </div>
  );
}

/**
 * Multiple Comments Skeleton
 */
export function CommentSkeletonList({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-2.5 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Book Card Skeleton matching BookCard.tsx
 */
export function BookCardSkeleton() {
  return (
    <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-2.5 sm:p-3.5 space-y-3 font-serif-bengali">
      {/* Book Cover Placeholder */}
      <div className="relative aspect-[2/3] w-full bg-[#dedbc2] overflow-hidden border border-black/10">
        <Skeleton className="w-full h-full !bg-[#d3cfb1]" />
        {/* Spine simulation line */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/10" />
      </div>

      {/* Book Meta */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2.5 w-10" />
        </div>
        <Skeleton className="h-4 w-4/5 !bg-[#d0ccaf]" />
        <Skeleton className="h-3 w-3/5" />
      </div>

      {/* Bottom Action Tag */}
      <div className="pt-2 border-t border-black/10 flex items-center justify-between">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

/**
 * Books Grid Skeleton
 */
export function BookGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Audio Card Skeleton matching AudioCard.tsx
 */
export function AudioCardSkeleton() {
  return (
    <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] p-3 sm:p-4 space-y-3 font-serif-bengali">
      {/* Audio Cover Square */}
      <div className="relative aspect-square w-full bg-[#dedbc2] overflow-hidden border border-black/10 flex items-center justify-center">
        <Skeleton className="w-full h-full !bg-[#d3cfb1]" />
        {/* Silhouette Play Circle */}
        <div className="absolute w-12 h-12 rounded-full bg-black/15 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-black/30 border-b-[7px] border-b-transparent ml-1" />
        </div>
      </div>

      {/* Audio Info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2.5 w-12" />
        </div>
        <Skeleton className="h-4 w-5/6 !bg-[#d0ccaf]" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      {/* Narrator & CTA */}
      <div className="pt-2 border-t border-black/10 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3.5 w-14" />
      </div>
    </div>
  );
}

/**
 * Audiobooks Grid Skeleton
 */
export function AudioGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AudioCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Reader View Classical Paper Page Skeleton
 */
export function ReaderSkeleton() {
  return (
    <div className="w-full max-w-3xl min-h-[650px] p-6 sm:p-12 md:p-16 bg-[#fbf9ee] shadow-2xl border border-black/15 flex flex-col justify-between font-serif-bengali animate-pulse">
      {/* Top Header of Page */}
      <div className="flex items-center justify-between pb-4 border-b border-black/15">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Classical Content Paragraph Lines */}
      <div className="space-y-4 py-8">
        <Skeleton className="h-5 w-1/2 mx-auto mb-6 !bg-[#cfcbb0]" />
        <div className="space-y-2.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="space-y-2.5 pt-3">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div className="space-y-2.5 pt-3">
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      </div>

      {/* Page Footer */}
      <div className="flex items-center justify-center pt-4 border-t border-black/15">
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

/**
 * Book Details Page Skeleton
 */
export function BookDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 font-serif-bengali">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>

      {/* Main 2-column Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-black/15">
        {/* Cover Skeleton */}
        <div className="aspect-[2/3] max-w-xs mx-auto w-full bg-[#dedbc2] border-2 border-[#171717] p-2">
          <Skeleton className="w-full h-full !bg-[#d3cfb1]" />
        </div>

        {/* Info Column */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 sm:h-10 w-3/4 !bg-[#cec9ad]" />
          <Skeleton className="h-5 w-1/2" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="pt-6 flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Account Profile Skeleton
 */
export function AccountSkeleton() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 font-serif-bengali">
      {/* Profile Header Box */}
      <div className="bg-[#f4f2e4] border-2 border-[#171717] p-6 flex flex-col sm:flex-row items-center gap-5">
        <Skeleton className="w-16 h-16 rounded-full shrink-0 !bg-[#d3cfb1]" />
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-36 mx-auto sm:mx-0" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-black/15 pb-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Content grid */}
      <BookGridSkeleton count={4} />
    </div>
  );
}

