"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { Feather, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে");
      }

      router.push("/account");
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
              <span>নতুন পাঠক নিবন্ধন</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-bengali font-bold text-[#171717]">
              পুঁথিপিক্সে যুক্ত হোন
            </h1>
            <p className="text-xs font-serif-bengali text-[#53514a]">
              একটি অ্যাকাউন্টের মাধ্যমে আপনি আপনার বই সংগ্রহ ও পাঠের ইতিহাস সংরক্ষণ করতে পারবেন।
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
                আপনার নাম
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: আহমদ ছফা"
                  className="w-full bg-[#eeeddb] border border-[rgba(23,23,23,0.25)] px-3 py-2 pl-9 text-xs sm:text-sm font-serif-bengali text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <UserIcon className="w-4 h-4 text-[#7a776e] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

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
              <label className="block text-xs font-mono-meta uppercase text-[#53514a] mb-1">
                পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
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
              <span>{loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[11px] font-mono-meta text-[#7a776e] pt-2">
            <ShieldCheck className="w-4 h-4 text-[#8a493b] shrink-0" />
            <span>আপনার তথ্যের সুরক্ষা ও গোপনীয়তা কঠোরভাবে সংরক্ষিত।</span>
          </div>

          {/* Bottom links */}
          <div className="pt-4 border-t border-[rgba(23,23,23,0.12)] text-center text-xs font-serif-bengali text-[#53514a]">
            ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-[#8a493b] font-bold hover:underline">
              লগইন করুন →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

