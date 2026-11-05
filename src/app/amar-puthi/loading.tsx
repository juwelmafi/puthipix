import { Masthead } from "@/components/layout/Masthead";
import { PostSkeletonFeed } from "@/components/ui/Skeletons";

export default function AmarPuthiLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl font-serif-bengali">
        {/* Header Skeleton */}
        <div className="border-b-2 border-[#171717] pb-4 mb-6 text-center">
          <div className="h-4 w-36 mx-auto bg-[#dedbc2] animate-pulse rounded-xs mb-2" />
          <div className="h-9 w-48 mx-auto bg-[#dedbc2] animate-pulse rounded-xs mb-3" />
          <div className="h-4 w-80 max-w-full mx-auto bg-[#dedbc2] animate-pulse rounded-xs" />
        </div>

        {/* Post Composer placeholder */}
        <div className="h-16 bg-[#f4f2e4] border-2 border-black/10 rounded-xs mb-8 animate-pulse" />

        {/* Post Skeleton Feed */}
        <PostSkeletonFeed count={3} />
      </main>
    </div>
  );
}

