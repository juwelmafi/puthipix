import { Masthead } from "@/components/layout/Masthead";
import { PostSkeletonFeed } from "@/components/ui/Skeletons";

export default function AmarPuthiLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl font-serif-bengali opacity-85">
        {/* Header Skeleton */}
        <div className="border-b border-black/10 pb-4 mb-6 text-center">
          <div className="h-3.5 w-36 mx-auto bg-black/[0.06] animate-pulse rounded-xs mb-2" />
          <div className="h-8 w-48 mx-auto bg-black/[0.09] animate-pulse rounded-xs mb-3" />
          <div className="h-3.5 w-80 max-w-full mx-auto bg-black/[0.05] animate-pulse rounded-xs" />
        </div>

        {/* Post Composer placeholder */}
        <div className="h-14 bg-black/[0.03] border border-black/10 rounded-xs mb-8 animate-pulse" />

        {/* Post Skeleton Feed */}
        <PostSkeletonFeed count={3} />
      </main>
    </div>
  );
}
