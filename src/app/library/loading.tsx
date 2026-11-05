import { Masthead } from "@/components/layout/Masthead";
import { BookGridSkeleton } from "@/components/ui/Skeletons";

export default function LibraryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl font-serif-bengali opacity-85">
        {/* Header Skeleton */}
        <div className="border-b border-black/10 pb-4 mb-6">
          <div className="h-3.5 w-32 bg-black/[0.06] animate-pulse rounded-xs mb-2" />
          <div className="h-7 w-64 bg-black/[0.09] animate-pulse rounded-xs mb-3" />
          <div className="h-3.5 w-96 max-w-full bg-black/[0.05] animate-pulse rounded-xs" />
        </div>

        {/* Filter bar placeholder */}
        <div className="h-10 bg-black/[0.04] animate-pulse border border-black/5 rounded-xs mb-8" />

        {/* Book Grid Skeleton */}
        <BookGridSkeleton count={8} />
      </main>
    </div>
  );
}
