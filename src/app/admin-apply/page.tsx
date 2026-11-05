"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import {
  Shield,
  Feather,
  CheckCircle,
  AlertCircle,
  Clock,
  LogIn,
  XCircle,
  Send,
  BookOpen,
} from "lucide-react";

export default function AdminApplyPage() {
  const [user, setUser] = useState<{
    id?: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Application state
  const [hasApplied, setHasApplied] = useState(false);
  const [application, setApplication] = useState<any | null>(null);
  const [loadingApp, setLoadingApp] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
          setName(data.user.name || "");
          fetchApplicationStatus();
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  const fetchApplicationStatus = async () => {
    setLoadingApp(true);
    try {
      const res = await fetch("/api/admin-apply", {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hasApplied && data.application) {
          setHasApplied(true);
          setApplication(data.application);
        }
      }
    } catch {
      // Continue
    } finally {
      setLoadingApp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!user) {
      setFormError("আবেদন জমা দিতে অনুগ্রহ করে প্রথমে লগইন করুন।");
      return;
    }

    if (!name.trim()) {
      setFormError("অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!reason.trim() || reason.trim().length < 15) {
      setFormError(
        "অ্যাডমিন হওয়ার কারণটি কিছুটা বিস্তারিতভাবে ব্যাখ্যা করুন (কমপক্ষে ১৫ অক্ষর)।"
      );
      return;
    }

    if (!agreed) {
      setFormError("পুঁথিপিক্সের নিয়ম ও শর্তাবলীর সাথে সম্মতি প্রদান আবশ্যক।");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin-apply", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          reason: reason.trim(),
          experience: experience.trim(),
          agreed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "আবেদন জমা দিতে সমস্যা হয়েছে।");
      }

      setSuccessMsg(data.message || "আপনার আবেদন সফলভাবে জমা হয়েছে!");
      setHasApplied(true);
      setApplication(data.application);
    } catch (err: any) {
      setFormError(err.message || "আবেদন জমা দিতে সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 sm:py-14 max-w-3xl font-serif-bengali">
        {/* Header Breadcrumb Banner */}
        <div className="text-center space-y-2 mb-8 pb-5 border-b-2 border-[#171717]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8a493b] text-[#f7f6ec] text-[10px] font-mono-meta uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>গোপন প্রশাসনিক পোর্টাল • শুধুমাত্র আমন্ত্রিতদের জন্য</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#171717]">
            পুঁথিপিক্স অ্যাডমিন পদের আবেদন
          </h1>
          <p className="text-xs sm:text-sm text-[#53514a] max-w-xl mx-auto">
            বাংলা সাহিত্যের এই উন্মুক্ত মহাফেজখানা ও পাঠক সমাজকে সুশৃঙ্খল ও সমৃদ্ধ
            রাখতে দায়িত্বশীল অ্যাডমিন প্রয়োজন। আপনার আবেদন সরাসরি সুপার অ্যাডমিন
            পর্যালোচনা করে অনুমোদন করবেন।
          </p>
        </div>

        {/* Loading State */}
        {loadingUser && (
          <div className="p-8 bg-[#f4f2e4] border border-black/15 text-center text-xs text-[#53514a]">
            ব্যবহারকারীর বিবরণ যাচাই করা হচ্ছে...
          </div>
        )}

        {/* Not Logged In Notice */}
        {!loadingUser && !user && (
          <div className="bg-[#f4f2e4] border-2 border-[#8a493b] p-6 sm:p-8 space-y-4 shadow-sm text-center">
            <AlertCircle className="w-10 h-10 text-[#8a493b] mx-auto" />
            <h2 className="text-xl font-bold text-[#171717]">
              আবেদন করার পূর্বে অ্যাকাউন্টে লগইন আবশ্যক
            </h2>
            <p className="text-xs text-[#53514a] max-w-md mx-auto">
              অ্যাডমিন আবেদনটি আপনার স্থায়ী পাঠক অ্যাকাউন্টের সাথে যুক্ত থাকবে। লগইন
              করার পর স্বয়ংক্রিয়ভাবে ফর্মটি সক্রিয় হবে।
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/login?redirect=/admin-apply"
                className="px-5 py-2.5 bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] transition-colors text-xs font-bold flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </Link>
              <Link
                href="/register?redirect=/admin-apply"
                className="px-5 py-2.5 border border-[#171717] hover:bg-black/5 text-xs text-[#171717] transition-colors"
              >
                নতুন অ্যাকাউন্ট খুলুন
              </Link>
            </div>
          </div>
        )}

        {/* Already an Admin */}
        {!loadingUser && user && (user.role === "admin" || user.role === "super_admin") && (
          <div className="bg-[#f4f2e4] border-2 border-emerald-600 p-6 sm:p-8 space-y-4 shadow-sm text-center">
            <CheckCircle className="w-12 h-12 text-emerald-700 mx-auto" />
            <h2 className="text-2xl font-bold text-[#171717]">
              {user.role === "super_admin"
                ? "আপনি পুঁথিপিক্সের প্রধান সুপার অ্যাডমিন"
                : "আপনি ইতোমধ্যে একজন অনুমোদিত অ্যাডমিন"}
            </h2>
            <p className="text-xs text-[#53514a] max-w-md mx-auto">
              আপনার অ্যাকাউন্টে পূর্ণ প্রশাসনিক নিয়ন্ত্রণ রয়েছে। আপনার নতুন করে আবেদন
              করার প্রয়োজন নেই।
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8a493b] text-[#f7f6ec] hover:bg-[#171717] transition-colors text-xs font-bold uppercase tracking-wider"
              >
                <Shield className="w-4 h-4" />
                <span>অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
              </Link>
            </div>
          </div>
        )}

        {/* Existing Application Status Card (If pending or approved/rejected) */}
        {!loadingUser &&
          user &&
          user.role === "user" &&
          hasApplied &&
          application && (
            <div className="mb-8 p-6 bg-[#f4f2e4] border-2 border-[#171717] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <div className="flex items-center gap-2">
                  {application.status === "pending" && (
                    <Clock className="w-5 h-5 text-amber-700" />
                  )}
                  {application.status === "approved" && (
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                  )}
                  {application.status === "rejected" && (
                    <XCircle className="w-5 h-5 text-red-700" />
                  )}
                  <h3 className="text-lg font-bold text-[#171717]">
                    আপনার আবেদনের বর্তমান অবস্থা
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-mono-meta uppercase tracking-wider font-bold ${
                    application.status === "pending"
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : application.status === "approved"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "bg-red-100 text-red-900 border border-red-300"
                  }`}
                >
                  {application.status === "pending"
                    ? "বিচারাধীন (Pending Approval)"
                    : application.status === "approved"
                    ? "অনুমোদিত (Approved)"
                    : "প্রত্যাখ্যাত (Rejected)"}
                </span>
              </div>

              <div className="text-xs space-y-2 text-[#53514a]">
                <p>
                  <strong>আবেদনকারী:</strong> {application.name} ({application.email})
                </p>
                <p>
                  <strong>আবেদনের তারিখ:</strong>{" "}
                  {new Date(application.createdAt).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <strong>অ্যাডমিন হওয়ার কারণ:</strong> {application.reason}
                </p>
                {application.reviewNote && (
                  <div className="p-3 bg-black/5 border border-black/10 mt-2">
                    <p className="font-semibold text-[#171717]">সুপার অ্যাডমিনের মন্তব্য:</p>
                    <p>{application.reviewNote}</p>
                  </div>
                )}
              </div>

              {application.status === "pending" && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  আপনার আবেদনটি সুপার অ্যাডমিনের নিকট সংরক্ষিত আছে। পর্যালোচনা সম্পন্ন
                  হলে আপনাকে নোটিফিকেশনের মাধ্যমে অবহিত করা হবে।
                </div>
              )}

              {application.status === "rejected" && (
                <p className="text-xs text-[#7a776e] italic">
                  প্রয়োজনে আপনি আপনার দক্ষতা ও কারণ বিস্তারিতভাবে লিখে নিচের ফর্মের
                  মাধ্যমে পুনরায় আবেদন করতে পারেন।
                </p>
              )}
            </div>
          )}

        {/* Application Form for Eligible Regular Users */}
        {!loadingUser &&
          user &&
          user.role === "user" &&
          (!hasApplied || (application && application.status === "rejected")) && (
            <div className="bg-[#f4f2e4] border-2 border-[#171717] p-6 sm:p-8 shadow-sm space-y-6">
              {/* Messages */}
              {formError && (
                <div className="p-3.5 bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  <span>{formError}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono-meta uppercase tracking-wider text-[#53514a] mb-1">
                      পূর্ণ নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার নাম"
                      className="w-full bg-[#eeeddb] border border-black/25 px-3 py-2 text-xs font-serif-bengali text-[#171717] focus:outline-none focus:border-[#171717]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono-meta uppercase tracking-wider text-[#53514a] mb-1">
                      ইমেইল ঠিকানা (নিবন্ধিত)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-black/5 border border-black/15 px-3 py-2 text-xs font-mono-meta text-[#7a776e] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-mono-meta uppercase tracking-wider text-[#53514a] mb-1">
                    মোবাইল / হোয়াটসঅ্যাপ নম্বর (জরুরি যোগাযোগের জন্য)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১XXXXXXXXX"
                    className="w-full bg-[#eeeddb] border border-black/25 px-3 py-2 text-xs font-mono-meta text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-mono-meta uppercase tracking-wider text-[#53514a] mb-1">
                    কেন আপনি পুঁথিপিক্সের অ্যাডমিন হতে চান? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="বাংলা সাহিত্যের সংরক্ষণ, নতুন বই আপলোড, বা কমিউনিটি মডারেশনে আপনার আগ্রহ বিস্তারিত লিখুন..."
                    className="w-full bg-[#eeeddb] border border-black/25 p-3 text-xs font-serif-bengali text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-mono-meta uppercase tracking-wider text-[#53514a] mb-1">
                    সাহিত্য, বই সম্পাদনা বা ডিজিটাল কনটেন্ট বিষয়ে পূর্ব অভিজ্ঞতা
                  </label>
                  <textarea
                    rows={3}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="পূর্বে কোনো ফেসবুক গ্রুপ, ব্লগ, পাবলিকেশন বা সাহিত্যের কাজে যুক্ত ছিলেন কিনা উল্লেখ করুন (ঐচ্ছিক)..."
                    className="w-full bg-[#eeeddb] border border-black/25 p-3 text-xs font-serif-bengali text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                {/* Policy Agreement */}
                <div className="p-3 bg-[#ede9d6] border border-black/15 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="agreed"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-[#8a493b] cursor-pointer"
                  />
                  <label
                    htmlFor="agreed"
                    className="text-xs text-[#53514a] leading-relaxed cursor-pointer select-none"
                  >
                    আমি স্বীকার করছি যে, পুঁথিপিক্সের সার্বিক শৃঙ্খলা, কপিরাইট-মুক্ত
                    সাহিত্য সংরক্ষণ এবং পাঠক সমাজের শালীনতা বজায় রাখতে আমি সচেষ্ট
                    থাকব। অপব্যবহারের দায়ে সুপার অ্যাডমিন যেকোনো সময় প্রশাসনিক পদ বাতিল
                    করতে পারবেন।
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#171717] hover:bg-[#8a493b] text-[#eeeddb] text-xs font-bold font-serif-bengali uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting ? "আবেদন জমা হচ্ছে..." : "সুপার অ্যাডমিনের নিকট আবেদন জমা দিন"}
                  </span>
                </button>
              </form>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
}

