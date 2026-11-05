import { Masthead } from "@/components/layout/Masthead";
import { AudioGridSkeleton } from "@/components/ui/Skeletons";

export default function AudiobooksLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl font-serif-bengali">
        {/* Header Skeleton */}
        <div className="border-b-2 border-[#171717] pb-4 mb-6">
          <div className="h-4 w-32 bg-[#dedbc2] animate-pulse rounded-xs mb-2" />
          <div className="h-8 w-64 bg-[#dedbc2] animate-pulse rounded-xs mb-3" />
          <div className="h-4 w-96 max-w-full bg-[#dedbc2] animate-pulse rounded-xs" />
        </div>

        {/* Filter bar placeholder */}
        <div className="h-11 bg-[#dedbc2]/60 animate-pulse border border-black/10 rounded-xs mb-8" />

        {/* Audio Grid Skeleton */}
        <AudioGridSkeleton count={8} />
      </main>
    </div>
  );
}

