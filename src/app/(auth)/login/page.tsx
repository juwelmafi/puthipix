"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { Feather, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "লগইন করতে সমস্যা হয়েছে");
      }

      // Check role
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-[#f4f2e4] border-2 border-[#171717] p-8 shadow-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[rgba(23,23,23,0.2)] bg-[#e6e4cf] text-[10px] font-mono-meta uppercase tracking-wider text-[#53514a]">
              <Feather className="w-3 h-3 text-[#8a493b]" />
              <span>পাঠক প্রবেশদ্বার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-bengali font-bold text-[#171717]">
              অ্যাকাউন্টে লগইন করুন
            </h1>
            <p className="text-xs font-serif-bengali text-[#53514a]">
              আপনার কেনা বইসমূহ পড়তে ও রিডিং প্রগ্রেস সিঙ্ক করতে লগইন করুন।
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-serif-bengali flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-meta uppercase text-[#53514a] mb-1">
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@domain.com"
                  className="w-full bg-[#eeeddb] border border-[rgba(23,23,23,0.25)] px-3 py-2 pl-9 text-xs sm:text-sm font-mono-meta text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Mail className="w-4 h-4 text-[#7a776e] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono-meta uppercase text-[#53514a]">
                  পাসওয়ার্ড
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#eeeddb] border border-[rgba(23,23,23,0.25)] px-3 py-2 pl-9 text-xs sm:text-sm font-mono-meta text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Lock className="w-4 h-4 text-[#7a776e] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#171717] text-[#eeeddb] font-serif-bengali text-sm font-bold hover:bg-[#8a493b] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom links */}
          <div className="pt-4 border-t border-[rgba(23,23,23,0.12)] text-center text-xs font-serif-bengali text-[#53514a]">
            নতুন পাঠক?{" "}
            <Link href="/register" className="text-[#8a493b] font-bold hover:underline">
              অ্যাকাউন্ট তৈরি করুন →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

