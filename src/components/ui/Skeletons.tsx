"use client";

import React from "react";

/**
 * Base pulsing skeleton block tailored to Puthipix's vintage broadsheet newspaper aesthetic.
 * Muted, faded, and dull paper tint with soft edges that subtly blend into authentic parchment.
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
      className={`animate-pulse bg-black/[0.06] rounded-xs ${className}`}
    />
  );
}

/**
 * Post Card Skeleton matching PostCard.tsx with faded, muted newsprint aesthetic
 */
export function PostSkeleton() {
  return (
    <article className="bg-[#f4f2e4]/70 border border-black/10 p-4 sm:p-6 space-y-4 font-serif-bengali rounded-xs opacity-80">
      {/* Author Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/5">
        <div className="flex items-center gap-3">
          {/* Avatar Skeleton */}
          <Skeleton className="w-10 h-10 rounded-full shrink-0 bg-black/[0.09]" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-32 bg-black/[0.08]" />
            <Skeleton className="h-2.5 w-20 bg-black/[0.05]" />
          </div>
        </div>
        {/* Genre Pill Skeleton */}
        <Skeleton className="h-5 w-20 rounded-full bg-black/[0.05]" />
      </div>

      {/* Post Title */}
      <div className="space-y-2.5">
        <Skeleton className="h-5 sm:h-5.5 w-3/4 bg-black/[0.10]" />
        {/* Optional Book Reference Skeleton */}
        <div className="p-2.5 bg-black/[0.03] border border-black/5 rounded-xs flex items-center gap-3">
          <Skeleton className="w-4 h-4 rounded-xs shrink-0 bg-black/[0.08]" />
          <Skeleton className="h-3 w-1/2 bg-black/[0.06]" />
        </div>
      </div>

      {/* Main Content Lines */}
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3 w-full bg-black/[0.06]" />
        <Skeleton className="h-3 w-11/12 bg-black/[0.06]" />
        <Skeleton className="h-3 w-4/5 bg-black/[0.05]" />
      </div>

      {/* Optional Post Image Skeleton */}
      <Skeleton className="w-full h-44 sm:h-56 rounded-xs bg-black/[0.06]" />

      {/* Bottom Action Bar Skeleton */}
      <div className="pt-3 border-t border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-16 rounded-xs bg-black/[0.05]" />
          <Skeleton className="h-6 w-20 rounded-xs bg-black/[0.05]" />
        </div>
        <Skeleton className="h-5 w-12 rounded-xs bg-black/[0.05]" />
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
    <div className="p-3 bg-black/[0.02] border border-black/5 rounded-xs space-y-2 opacity-80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full shrink-0 bg-black/[0.08]" />
          <Skeleton className="h-2.5 w-24 bg-black/[0.06]" />
        </div>
        <Skeleton className="h-2 w-12 bg-black/[0.04]" />
      </div>
      <Skeleton className="h-2.5 w-5/6 ml-8 bg-black/[0.05]" />
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
 * Book Card Skeleton matching BookCard.tsx with muted, faded styling
 */
export function BookCardSkeleton() {
  return (
    <div className="bg-[#f4f2e4]/70 border border-black/10 p-2.5 sm:p-3.5 space-y-3 font-serif-bengali rounded-xs opacity-85">
      {/* Book Cover Placeholder */}
      <div className="relative aspect-[2/3] w-full bg-black/[0.04] overflow-hidden border border-black/5 rounded-xs">
        <Skeleton className="w-full h-full bg-black/[0.08]" />
        {/* Soft spine simulation line */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/[0.05]" />
      </div>

      {/* Book Meta */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-2 w-16 bg-black/[0.05]" />
          <Skeleton className="h-2 w-10 bg-black/[0.05]" />
        </div>
        <Skeleton className="h-3.5 w-4/5 bg-black/[0.09]" />
        <Skeleton className="h-2.5 w-3/5 bg-black/[0.06]" />
      </div>

      {/* Bottom Action Tag */}
      <div className="pt-2 border-t border-black/5 flex items-center justify-between">
        <Skeleton className="h-2.5 w-14 bg-black/[0.05]" />
        <Skeleton className="h-3.5 w-12 rounded-xs bg-black/[0.05]" />
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
    <div className="bg-[#f4f2e4]/70 border border-black/10 p-3 sm:p-4 space-y-3 font-serif-bengali rounded-xs opacity-85">
      {/* Audio Cover Square */}
      <div className="relative aspect-square w-full bg-black/[0.04] overflow-hidden border border-black/5 rounded-xs flex items-center justify-center">
        <Skeleton className="w-full h-full bg-black/[0.08]" />
        {/* Soft play circle */}
        <div className="absolute w-10 h-10 rounded-full bg-black/[0.06] flex items-center justify-center">
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-black/20 border-b-[5px] border-b-transparent ml-0.5" />
        </div>
      </div>

      {/* Audio Info */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-2 w-16 bg-black/[0.05]" />
          <Skeleton className="h-2 w-12 bg-black/[0.05]" />
        </div>
        <Skeleton className="h-3.5 w-5/6 bg-black/[0.09]" />
        <Skeleton className="h-2.5 w-2/3 bg-black/[0.06]" />
      </div>

      {/* Narrator & CTA */}
      <div className="pt-2 border-t border-black/5 flex items-center justify-between">
        <Skeleton className="h-2.5 w-20 bg-black/[0.05]" />
        <Skeleton className="h-3 w-14 bg-black/[0.05]" />
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
    <div className="w-full max-w-3xl min-h-[620px] p-6 sm:p-12 md:p-16 bg-[#fbf9ee]/90 shadow-lg border border-black/10 flex flex-col justify-between font-serif-bengali opacity-80">
      {/* Top Header of Page */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5">
        <Skeleton className="h-2.5 w-28 bg-black/[0.06]" />
        <Skeleton className="h-2.5 w-20 bg-black/[0.05]" />
      </div>

      {/* Classical Content Paragraph Lines */}
      <div className="space-y-4 py-6">
        <Skeleton className="h-4.5 w-1/2 mx-auto mb-6 bg-black/[0.08]" />
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-full bg-black/[0.06]" />
          <Skeleton className="h-3 w-full bg-black/[0.06]" />
          <Skeleton className="h-3 w-11/12 bg-black/[0.06]" />
          <Skeleton className="h-3 w-4/5 bg-black/[0.05]" />
        </div>
        <div className="space-y-2.5 pt-3">
          <Skeleton className="h-3 w-full bg-black/[0.06]" />
          <Skeleton className="h-3 w-full bg-black/[0.06]" />
          <Skeleton className="h-3 w-full bg-black/[0.06]" />
          <Skeleton className="h-3 w-3/4 bg-black/[0.05]" />
        </div>
        <div className="space-y-2.5 pt-3">
          <Skeleton className="h-3 w-11/12 bg-black/[0.06]" />
          <Skeleton className="h-3 w-4/5 bg-black/[0.05]" />
        </div>
      </div>

      {/* Page Footer */}
      <div className="flex items-center justify-center pt-4 border-t border-black/5">
        <Skeleton className="h-2.5 w-12 bg-black/[0.05]" />
      </div>
    </div>
  );
}

/**
 * Book Details Page Skeleton
 */
export function BookDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 font-serif-bengali opacity-85">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <Skeleton className="h-2.5 w-28 bg-black/[0.06]" />
        <Skeleton className="h-2.5 w-36 bg-black/[0.05]" />
      </div>

      {/* Main 2-column Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-black/5">
        {/* Cover Skeleton */}
        <div className="aspect-[2/3] max-w-xs mx-auto w-full bg-black/[0.03] border border-black/10 p-2 rounded-xs">
          <Skeleton className="w-full h-full bg-black/[0.08]" />
        </div>

        {/* Info Column */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-7 sm:h-9 w-3/4 bg-black/[0.10]" />
          <Skeleton className="h-4 w-1/2 bg-black/[0.07]" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-20 rounded-full bg-black/[0.05]" />
            <Skeleton className="h-5 w-24 rounded-full bg-black/[0.05]" />
          </div>
          <div className="space-y-2 pt-3">
            <Skeleton className="h-3 w-full bg-black/[0.06]" />
            <Skeleton className="h-3 w-full bg-black/[0.06]" />
            <Skeleton className="h-3 w-5/6 bg-black/[0.06]" />
            <Skeleton className="h-3 w-2/3 bg-black/[0.05]" />
          </div>
          <div className="pt-5 flex gap-3">
            <Skeleton className="h-9 w-32 rounded-xs bg-black/[0.07]" />
            <Skeleton className="h-9 w-32 rounded-xs bg-black/[0.05]" />
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
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 font-serif-bengali opacity-85">
      {/* Profile Header Box */}
      <div className="bg-[#f4f2e4]/70 border border-black/10 p-6 flex flex-col sm:flex-row items-center gap-5 rounded-xs">
        <Skeleton className="w-14 h-14 rounded-full shrink-0 bg-black/[0.08]" />
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <Skeleton className="h-5 w-44 mx-auto sm:mx-0 bg-black/[0.09]" />
          <Skeleton className="h-3 w-32 mx-auto sm:mx-0 bg-black/[0.05]" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-9 w-20 rounded-xs bg-black/[0.06]" />
          <Skeleton className="h-9 w-20 rounded-xs bg-black/[0.06]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-black/5 pb-2">
        <Skeleton className="h-7 w-24 rounded-xs bg-black/[0.05]" />
        <Skeleton className="h-7 w-28 rounded-xs bg-black/[0.05]" />
        <Skeleton className="h-7 w-24 rounded-xs bg-black/[0.05]" />
      </div>

      {/* Content grid */}
      <BookGridSkeleton count={4} />
    </div>
  );
}
