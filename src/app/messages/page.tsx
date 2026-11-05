"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { Loader2 } from "lucide-react";

function MessagesRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUserId = searchParams.get("user");
  const { openChatWithUser, openChat } = useChat();

  useEffect(() => {
    if (targetUserId) {
      openChatWithUser({ _id: targetUserId, name: "পাঠক" });
    } else {
      openChat();
    }

    // Go back to previous page or default to /amar-puthi
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/amar-puthi");
    }
  }, [targetUserId, openChat, openChatWithUser, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#eeeddb] font-serif-bengali text-xs text-[#53514a]">
      <Loader2 className="w-6 h-6 animate-spin text-[#8a493b] mb-2" />
      <span>মহাফেজখানা ডাকঘর উন্মুক্ত হচ্ছে...</span>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#eeeddb]">
          <Loader2 className="w-6 h-6 animate-spin text-[#8a493b]" />
        </div>
      }
    >
      <MessagesRedirect />
    </Suspense>
  );
}
