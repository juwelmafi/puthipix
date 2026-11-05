"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import {
  Shield,
  BookOpen,
  Headphones,
  Sliders,
  Feather,
  UserCheck,
  ChevronRight,
  LogIn,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { AccountSkeleton } from "@/components/ui/Skeletons";

export default function AccountPage() {
  const [user, setUser] = useState<{
    id?: string;
    userId?: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("puthipix_session_token")
        : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    fetch("/api/auth/me", { headers: getAuthHeaders(), credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");
  const isSuper = user && user.role === "super_admin";

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-14 font-serif-bengali">
        {loading && <AccountSkeleton />}

        {!loading && (
          <>
            {/* When logged in as Admin or Super Admin: Render Dedicated Admin Profile */}
            {isAdmin ? (
              <div className="space-y-6">
                {/* Admin Header Box */}
                <div className="p-5 sm:p-7 bg-[#e8e6d3] border-2 border-[#171717] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#171717] text-[#eeeddb] flex items-center justify-center text-2xl font-bold shrink-0 border border-black/20 shadow-xs">
                      {user.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
                          {user.name}
                        </h1>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-mono-meta uppercase tracking-wider font-bold ${
                            isSuper
                              ? "bg-amber-600 text-amber-50 border border-amber-800"
                              : "bg-[#8a493b] text-[#f7f6ec]"
                          }`}
                        >
                          {isSuper ? "প্রধান সুপার অ্যাডমিন" : "পুঁথিপিক্স অ্যাডমিন"}
                        </span>
                      </div>
                      <p className="text-xs font-mono-meta text-[#7a776e] mt-0.5">
                        ইমেইল: {user.email}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono-meta uppercase tracking-wider text-[#8a493b] font-bold px-3 py-1 bg-black/5 border border-black/10 self-start sm:self-auto">
                    প্রশাসনিক প্রোফাইল সক্রিয়
                  </span>
                </div>

                {/* Primary Admin Control Center Card */}
                <div className="bg-[#f4f2e4] border-2 border-[#171717] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/15">
                    <div className="space-y-2 max-w-xl">
                      <span className="text-[10px] font-mono-meta uppercase tracking-wider text-[#8a493b] font-bold">
                        {isSuper ? "SUPER ADMIN PRIVILEGES ACTIVE" : "ADMINISTRATIVE ACCESS"}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
                        পুঁথিপিক্স প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র
                      </h2>
                      <p className="text-xs sm:text-sm text-[#53514a] leading-relaxed">
                        আপনি পুঁথিপিক্সের অনুমোদিত{" "}
                        <strong className="text-[#171717]">
                          {isSuper ? "প্রধান সুপার অ্যাডমিন" : "অ্যাডমিন"}
                        </strong>{" "}
                        হিসেবে লগইন আছেন। সাইটের সম্পূর্ণ কনটেন্ট সিএমএস, মহাফেজখানার
                        গ্রন্থাবলি, শ্রুতিপাঠ এবং পাঠক সমাজ পরিচালনা করতে নিচের বাটনে
                        ক্লিক করে মূল ড্যাশবোর্ডে প্রবেশ করুন।
                      </p>
                    </div>

                    {/* Prominent Go to Dashboard Button (Admin Only) */}
                    <div className="shrink-0">
                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-3 px-6 py-4 bg-[#8a493b] hover:bg-[#171717] text-[#f7f6ec] text-sm sm:text-base font-bold uppercase tracking-wider transition-all shadow-md group"
                      >
                        <Shield className="w-5 h-5 text-[#e8c078] group-hover:rotate-12 transition-transform" />
                        <span>অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Capabilities Overview */}
                  <div>
                    <h3 className="text-xs font-mono-meta uppercase tracking-wider text-[#7a776e] mb-4">
                      আপনার প্রশাসনিক নিয়ন্ত্রণ ক্ষমতাসমূহ:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      <div className="p-3.5 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <BookOpen className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">গ্রন্থ মহাফেজখানা</h4>
                          <p className="text-[11px] text-[#53514a]">
                            বই সংযোজন, তথ্য সম্পাদনা ও ক্লাউডফ্লেয়ার R2 পিডিএফ আপলোড।
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <Headphones className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">শ্রুতিপাঠ ক্যাটালগ</h4>
                          <p className="text-[11px] text-[#53514a]">
                            অডিওবুক ফাইল ও প্লেলিস্ট ব্যবস্থাপনা।
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <Sliders className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">কনটেন্ট সিএমএস ও এসইও</h4>
                          <p className="text-[11px] text-[#53514a]">
                            সাইটের প্রতিটি টেক্সট, ব্যানার ও মেটাট্যাগ সরাসরি পরিবর্তন।
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                        <Feather className="w-4 h-4 text-[#8a493b] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">‘আমার পুঁথি’ মডারেশন</h4>
                          <p className="text-[11px] text-[#53514a]">
                            পাঠক পোস্ট পর্যালোচনা ও প্রয়োজনবোধে অপসারণ।
                          </p>
                        </div>
                      </div>

                      {isSuper ? (
                        <div className="p-3.5 bg-amber-100/70 border border-amber-400 sm:col-span-2 flex items-start gap-2.5">
                          <UserCheck className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-amber-950">একক সুপার অ্যাডমিন ক্ষমতা</h4>
                            <p className="text-[11px] text-amber-900">
                              /admin-apply পেজে আবেদনকারীদের আবেদন পর্যালোচনা ও নতুন অ্যাডমিন অনুমোদনের একক ক্ষমতা।
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-[#ede9d6] border border-black/10 flex items-start gap-2.5">
                          <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-[#171717]">সাধারণ অ্যাডমিন পদ</h4>
                            <p className="text-[11px] text-[#53514a]">
                              কনটেন্ট পরিচালনা করতে পারবেন (অনুমোদন ক্ষমতা সুপার অ্যাডমিনের)।
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Non-Admin / Guest Notice (All regular user profiles removed as requested) */
              <div className="bg-[#f4f2e4] border-2 border-[#171717] p-8 sm:p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
                <AlertCircle className="w-12 h-12 text-[#8a493b] mx-auto" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-meta uppercase tracking-wider text-[#8a493b] font-bold">
                    ACCESS RESTRICTED
                  </span>
                  <h2 className="text-2xl font-bold text-[#171717]">
                    সাধারণ পাঠক প্রোফাইল সাময়িকভাবে স্থগিত
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#53514a] leading-relaxed max-w-lg mx-auto">
                  বর্তমানে শুধুমাত্র অনুমোদিত অ্যাডমিন ও সুপার অ্যাডমিন প্রোফাইল সক্রিয় রয়েছে। সাধারণ পাঠক প্রোফাইল ফিচারটি এখন বন্ধ আছে।
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/login?redirect=/account"
                    className="px-5 py-2.5 bg-[#171717] hover:bg-[#8a493b] text-[#eeeddb] text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>অ্যাডমিন হিসেবে লগইন করুন</span>
                  </Link>
                  <Link
                    href="/"
                    className="px-5 py-2.5 border border-[#171717] hover:bg-black/5 text-xs text-[#171717] flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>মূল পাঠাগারে ফিরুন</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
