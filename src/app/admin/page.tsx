"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { MOCK_AUDIOBOOKS } from "@/data/mockAudiobooks";
import {
  BookOpen,
  Users,
  Layers,
  Plus,
  Eye,
  CheckCircle,
  ArrowLeft,
  X,
  AlertCircle,
  Feather,
  Headphones,
  Mic,
  Database,
  Volume2,
  UploadCloud,
  FileText,
  Edit,
  Trash2,
  Sliders,
  Globe,
  Shield,
  ExternalLink,
} from "lucide-react";
import { FileUploadZone } from "@/components/admin/FileUploadZone";
import { CmsContentEditor } from "@/components/admin/CmsContentEditor";
import { SeoSettingsEditor } from "@/components/admin/SeoSettingsEditor";
import { DEFAULT_SITE_CONTENT, SiteContent } from "@/data/defaultSiteContent";

export default function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<"books" | "audiobooks" | "community" | "cms" | "seo">("books");
  const [books, setBooks] = useState<any[]>(MOCK_BOOKS);
  const [audiobooks, setAudiobooks] = useState<any[]>(MOCK_AUDIOBOOKS);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isSavingCms, setIsSavingCms] = useState(false);
  const [deleteModalPost, setDeleteModalPost] = useState<any | null>(null);
  const [deletionNote, setDeletionNote] = useState("");
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [deletingBook, setDeletingBook] = useState<any | null>(null);
  const [isDeletingBook, setIsDeletingBook] = useState(false);
  const [editingAudiobook, setEditingAudiobook] = useState<any | null>(null);
  const [deletingAudiobook, setDeletingAudiobook] = useState<any | null>(null);
  const [isDeletingAudiobook, setIsDeletingAudiobook] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Admin Auth & Session State
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; role: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("admin@puthipix.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("puthipix_session_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const checkAuth = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("puthipix_session_token") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/auth/me", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          return data.user;
        }
      }
      setCurrentUser(null);
      return null;
    } catch {
      setCurrentUser(null);
      return null;
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "লগইন ব্যর্থ হয়েছে");
      }

      if (data.user?.role !== "admin") {
        throw new Error("এই অ্যাকাউন্টে অ্যাডমিন পারমিশন নেই। admin@puthipix.com দিয়ে লগইন করুন।");
      }

      if (data.token) {
        localStorage.setItem("puthipix_session_token", data.token);
      }

      setCurrentUser(data.user);
      setShowLoginModal(false);
      setFormError("");
      setSuccessMsg("✅ অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছেন!");
      fetchCmsContent();
    } catch (err: any) {
      setLoginError(err.message || "লগইন করতে সমস্যা হয়েছে");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("puthipix_session_token");
    setCurrentUser(null);
    setShowLoginModal(true);
  };

  // New Book Form State
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    author: "",
    translator: "",
    description: "",
    coverImage: "",
    coverKey: "",
    pdfUrl: "",
    pdfKey: "",
    genre: "উপন্যাস (Novels)",
    genreSlug: "novels",
    pageCount: 200,
    language: "বাংলা",
    edition: "উন্মুক্ত মহাফেজখানা সংস্করণ",
    publishedYear: 1920,
    publicDomain: true,
  });

  // New Audiobook Form State
  const [audioFormData, setAudioFormData] = useState({
    title: "",
    titleEn: "",
    author: "",
    narrator: "",
    duration: "২৫ মিনিট",
    audioUrl: "",
    audioKey: "",
    coverImage: "",
    coverKey: "",
    category: "ছোটগল্প ও কথাসাহিত্য",
    categorySlug: "stories",
    copyrightType: "public-domain",
    description: "",
  });

  // Load books from API
  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books?limit=100");
      if (res.ok) {
        const data = await res.json();
        if (data.books && data.books.length > 0) {
          setBooks(data.books);
        }
      }
    } catch (e) {
      console.warn("Using mock books");
    }
  };

  // Load audiobooks from API
  const fetchAudiobooks = async () => {
    try {
      const res = await fetch("/api/audiobooks");
      if (res.ok) {
        const data = await res.json();
        if (data.audiobooks && data.audiobooks.length > 0) {
          setAudiobooks(data.audiobooks);
        }
      }
    } catch (e) {
      console.warn("Using mock audiobooks");
    }
  };

  // Load community posts from API
  const fetchCommunityPosts = async () => {
    try {
      const res = await fetch("/api/admin/community/posts");
      if (res.ok) {
        const data = await res.json();
        setCommunityPosts(data.posts || []);
      }
    } catch (e) {
      console.warn("Failed to fetch community posts");
    }
  };

  // Load site CMS & SEO content
  const fetchCmsContent = async () => {
    try {
      const res = await fetch("/api/admin/site-settings", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.content) {
          setCmsContent(data.content);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch site settings, using default");
    }
  };

  const handleSaveCmsSettings = async () => {
    setIsSavingCms(true);
    setFormError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: cmsContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setShowLoginModal(true);
        }
        throw new Error(data.error || "সংরক্ষণ করতে সমস্যা হয়েছে");
      }
      setSuccessMsg("সাইটের সম্পূর্ণ কনটেন্ট ও এসইও সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
    } catch (err: any) {
      setFormError(err.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setIsSavingCms(false);
    }
  };

  const handleResetCmsDefaults = () => {
    if (confirm("আপনি কি নিশ্চিতভাবে সাইটের সকল কনটেন্ট মূল ডিফল্ট লেখায় ফিরিয়ে নিতে চান?")) {
      setCmsContent(DEFAULT_SITE_CONTENT);
      setSuccessMsg("সকল ফিল্ড মূল ডিফল্ট লেখায় পুনরুদ্ধার করা হয়েছে। পরিবর্তন কার্যকর করতে 'সংরক্ষণ করুন' বাটনে ক্লিক করুন।");
    }
  };

  useEffect(() => {
    checkAuth();
    fetchBooks();
    fetchAudiobooks();
    fetchCommunityPosts();
    fetchCmsContent();
  }, []);

  const handleDeletePostWithNote = async () => {
    if (!deleteModalPost) return;
    if (!deletionNote.trim()) {
      setFormError("পোস্ট অপসারণের কারণ বা ব্যাখ্যা লেখা আবশ্যক।");
      return;
    }
    setIsDeletingPost(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/community/posts", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          postId: deleteModalPost._id,
          note: deletionNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "পোস্ট মুছতে ব্যর্থ হয়েছে");
      }

      setSuccessMsg("পোস্টটি সফলভাবে অপসারণ করা হয়েছে এবং লেখককে কারণসহ নোটিফিকেশন পাঠানো হয়েছে।");
      setCommunityPosts((prev) =>
        prev.map((p) =>
          p._id === deleteModalPost._id
            ? { ...p, status: "deleted_by_admin", adminDeletionNote: deletionNote.trim() }
            : p
        )
      );
      setDeleteModalPost(null);
      setDeletionNote("");
      fetchCommunityPosts();
    } catch (err: any) {
      setFormError(err.message || "পোস্ট মুছতে সমস্যা হয়েছে");
    } finally {
      setIsDeletingPost(false);
    }
  };

  const openAddBookModal = () => {
    setEditingBook(null);
    setFormError("");
    setFormData({
      title: "",
      titleEn: "",
      author: "",
      translator: "",
      description: "",
      coverImage: "",
      coverKey: "",
      pdfUrl: "",
      pdfKey: "",
      genre: "উপন্যাস (Novels)",
      genreSlug: "novels",
      pageCount: 200,
      language: "বাংলা",
      edition: "উন্মুক্ত মহাফেজখানা সংস্করণ",
      publishedYear: 1920,
      publicDomain: true,
    });
    setShowModal(true);
  };

  const openEditBookModal = (book: any) => {
    setEditingBook(book);
    setFormError("");
    setFormData({
      title: book.title || "",
      titleEn: book.titleEn || "",
      author: book.author || "",
      translator: book.translator || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      coverKey: book.coverKey || "",
      pdfUrl: book.pdfUrl || "",
      pdfKey: book.pdfKey || "",
      genre: book.genre || "উপন্যাস (Novels)",
      genreSlug: book.genreSlug || "novels",
      pageCount: book.pageCount || 200,
      language: book.language || "বাংলা",
      edition: book.edition || "উন্মুক্ত মহাফেজখানা সংস্করণ",
      publishedYear: book.publishedYear || 1920,
      publicDomain: true,
    });
    setShowModal(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.coverImage) {
      setFormError("অনুগ্রহ করে বইয়ের একটি প্রচ্ছদ ছবি আপলোড করুন (Cloudinary-তে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে)।");
      return;
    }

    setLoading(true);

    try {
      if (editingBook) {
        const bookId = editingBook._id || editingBook.id || editingBook.slug;
        const res = await fetch(`/api/admin/books/${bookId}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...formData,
            price: 0,
            accessType: "free",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) setShowLoginModal(true);
          throw new Error(data.error || "বইয়ের তথ্য আপডেট করতে সমস্যা হয়েছে");
        }

        setBooks((prev) =>
          prev.map((b) =>
            (b._id || b.id || b.slug) === bookId ? { ...b, ...formData } : b
          )
        );
        setSuccessMsg(`"${formData.title}" গ্রন্থটির তথ্য সফলভাবে হালনাগাদ করা হয়েছে!`);
      } else {
        const res = await fetch("/api/admin/books", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...formData,
            price: 0,
            accessType: "free",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) setShowLoginModal(true);
          throw new Error(data.error || "বইটি তৈরি করতে ব্যর্থ হয়েছে");
        }

        setSuccessMsg("নতুন ধ্রুপদী গ্রন্থ সফলভাবে মহাফেজখানায় যুক্ত হয়েছে!");
      }

      setShowModal(false);
      setEditingBook(null);
      fetchBooks();
    } catch (err: any) {
      setFormError(err.message || "কার্যক্রম সম্পন্ন করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    setIsDeletingBook(true);
    setFormError("");

    try {
      const bookId = deletingBook._id || deletingBook.id || deletingBook.slug;
      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) setShowLoginModal(true);
        throw new Error(data.error || "বই মুছতে সমস্যা হয়েছে");
      }

      setBooks((prev) =>
        prev.filter((b) => (b._id || b.id || b.slug) !== bookId)
      );
      setSuccessMsg(`"${deletingBook.title}" গ্রন্থটি সফলভাবে মহাফেজখানা থেকে মুছে ফেলা হয়েছে!`);
      setDeletingBook(null);
      fetchBooks();
    } catch (err: any) {
      setFormError(err.message || "বই মুছতে সমস্যা হয়েছে");
    } finally {
      setIsDeletingBook(false);
    }
  };

  const openAddAudiobookModal = () => {
    setEditingAudiobook(null);
    setFormError("");
    setAudioFormData({
      title: "",
      titleEn: "",
      author: "",
      narrator: "",
      duration: "২৫ মিনিট",
      audioUrl: "",
      audioKey: "",
      coverImage: "",
      coverKey: "",
      category: "ছোটগল্প ও কথাসাহিত্য",
      categorySlug: "stories",
      copyrightType: "public-domain",
      description: "",
    });
    setShowAudioModal(true);
  };

  const openEditAudiobookModal = (audio: any) => {
    setEditingAudiobook(audio);
    setFormError("");
    setAudioFormData({
      title: audio.title || "",
      titleEn: audio.titleEn || "",
      author: audio.author || "",
      narrator: audio.narrator || "",
      duration: audio.duration || "২৫ মিনিট",
      audioUrl: audio.audioUrl || "",
      audioKey: audio.audioKey || "",
      coverImage: audio.coverImage || "",
      coverKey: audio.coverKey || "",
      category: audio.category || "ছোটগল্প ও কথাসাহিত্য",
      categorySlug: audio.categorySlug || "stories",
      copyrightType: audio.copyrightType || "public-domain",
      description: audio.description || "",
    });
    setShowAudioModal(true);
  };

  const handleSaveAudiobook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!audioFormData.audioUrl) {
      setFormError("অনুগ্রহ করে শ্রুতিপাঠের অডিও ফাইলটি আপলোড করুন (Cloudflare R2-তে সরাসরি সংরক্ষিত হবে)।");
      return;
    }

    setLoading(true);

    try {
      if (editingAudiobook) {
        const audioId = editingAudiobook._id || editingAudiobook.id || editingAudiobook.slug;
        const res = await fetch(`/api/admin/audiobooks/${audioId}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(audioFormData),
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) setShowLoginModal(true);
          throw new Error(data.error || "শ্রুতিপাঠ আপডেট করতে সমস্যা হয়েছে");
        }

        setAudiobooks((prev) =>
          prev.map((a) =>
            (a._id || a.id || a.slug) === audioId ? { ...a, ...audioFormData } : a
          )
        );
        setSuccessMsg(`"${audioFormData.title}" শ্রুতিপাঠটির তথ্য সফলভাবে হালনাগাদ করা হয়েছে!`);
      } else {
        const res = await fetch("/api/audiobooks", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(audioFormData),
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) setShowLoginModal(true);
          throw new Error(data.error || "শ্রুতিপাঠ যুক্ত করতে সমস্যা হয়েছে");
        }

        setSuccessMsg("নতুন শ্রুতিপাঠ সফলভাবে মহাফেজখানায় যুক্ত হয়েছে!");
      }

      setShowAudioModal(false);
      setEditingAudiobook(null);
      fetchAudiobooks();
    } catch (err: any) {
      setFormError(err.message || "কার্যক্রম সম্পন্ন করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAudiobook = async () => {
    if (!deletingAudiobook) return;
    setIsDeletingAudiobook(true);
    setFormError("");

    try {
      const audioId = deletingAudiobook._id || deletingAudiobook.id || deletingAudiobook.slug;
      const res = await fetch(`/api/admin/audiobooks/${audioId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) setShowLoginModal(true);
        throw new Error(data.error || "শ্রুতিপাঠ মুছতে সমস্যা হয়েছে");
      }

      setAudiobooks((prev) =>
        prev.filter((a) => (a._id || a.id || a.slug) !== audioId)
      );
      setSuccessMsg(`"${deletingAudiobook.title}" শ্রুতিপাঠটি সফলভাবে মুছে ফেলা হয়েছে!`);
      setDeletingAudiobook(null);
      fetchAudiobooks();
    } catch (err: any) {
      setFormError(err.message || "শ্রুতিপাঠ মুছতে সমস্যা হয়েছে");
    } finally {
      setIsDeletingAudiobook(false);
    }
  };

  const totalBooks = books.length;
  const totalPages = books.reduce((acc, b) => acc + (b.pageCount || 100), 0);

  return (
    <div className="min-h-screen bg-[#eeeddb] flex flex-col font-serif-bengali">
      {/* Admin Top Navigation */}
      <header className="bg-[#171717] text-[#eeeddb] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold font-serif-bengali tracking-tight">
              পুঁথিপিক্স • মহাফেজখানা নিয়ন্ত্রণ প্যানেল
            </span>
          </Link>
          <span className="hidden sm:inline text-xs font-mono-meta opacity-60">
            | পাবলিক ডোমেইন আর্কাইভ
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-meta">
          <Link
            href="/"
            className="hover:text-amber-200 transition-colors flex items-center gap-1 opacity-80 hover:opacity-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল পাঠাগারে ফিরুন</span>
          </Link>
          <span className="opacity-40">•</span>
          {currentUser && currentUser.role === "admin" ? (
            <div className="flex items-center gap-2">
              <span className="bg-emerald-900 border border-emerald-500/40 text-emerald-100 px-2.5 py-0.5 rounded text-[10px] font-mono-meta uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{currentUser.name}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[10px] text-red-300 hover:text-white underline font-mono-meta uppercase"
                title="লগআউট করুন"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-amber-900/80 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono-meta uppercase">
                লগইন করা নেই
              </span>
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="bg-[#8a493b] hover:bg-[#a05545] text-white px-2.5 py-1 rounded text-xs font-serif-bengali font-bold transition-colors shadow-xs"
              >
                অ্যাডমিন লগইন
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Unauthenticated / Reader Warning Notice */}
      {(!currentUser || currentUser.role !== "admin") && (
        <div className="bg-amber-100 border-b-2 border-amber-500 px-4 sm:px-8 py-2.5 text-amber-950 text-xs font-serif-bengali flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>অ্যাডমিন প্রমাণীকরণ প্রয়োজন:</strong> আপনি বর্তমানে অ্যাডমিন হিসেবে লগইন করা নেই। সাইটের কনটেন্ট, বই বা সেটিংস সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন।
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="px-3 py-1 bg-[#8a493b] text-white text-xs font-bold shrink-0 hover:bg-[#171717] transition-colors rounded-xs shadow-xs"
          >
            অ্যাডমিন লগইন করুন →
          </button>
        </div>
      )}

      {/* Main Admin 2-Column Workspace with Left Sticky Sidebar */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 flex-grow">
        {/* Left Sticky Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-4 self-start space-y-4">
          <div className="bg-[#f4f2e4] border-2 border-[#171717] p-4 shadow-sm space-y-3">
            <div className="border-b border-black/15 pb-2 flex items-center justify-between">
              <div>
                <span className="font-mono-meta text-[10px] text-[#8a493b] uppercase tracking-wider block font-bold">
                  ADMIN NAVIGATION
                </span>
                <h3 className="font-serif-bengali font-bold text-sm text-[#171717]">
                  ড্যাশবোর্ড নিয়ন্ত্রণ
                </h3>
              </div>
              <Shield className="w-4 h-4 text-[#8a493b]" />
            </div>

            {/* Vertical Tabs List */}
            <nav className="space-y-1.5 font-serif-bengali text-xs">
              <button
                type="button"
                onClick={() => setAdminTab("books")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  adminTab === "books"
                    ? "bg-[#171717] text-[#eeeddb] font-bold shadow-xs"
                    : "bg-[#e8e6d3] text-[#262626] hover:bg-[#dedbc5]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#e8c078]" />
                  <span>গ্রন্থ মহাফেজখানা</span>
                </div>
                <span
                  className={`text-[10px] font-mono-meta px-1.5 py-0.2 rounded font-bold ${
                    adminTab === "books" ? "bg-[#8a493b] text-white" : "bg-black/10 text-[#171717]"
                  }`}
                >
                  {totalBooks}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("audiobooks")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  adminTab === "audiobooks"
                    ? "bg-[#171717] text-[#eeeddb] font-bold shadow-xs"
                    : "bg-[#e8e6d3] text-[#262626] hover:bg-[#dedbc5]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#e8c078]" />
                  <span>শ্রুতিপাঠ ও অডিওবুক</span>
                </div>
                <span
                  className={`text-[10px] font-mono-meta px-1.5 py-0.2 rounded font-bold ${
                    adminTab === "audiobooks" ? "bg-[#8a493b] text-white" : "bg-black/10 text-[#171717]"
                  }`}
                >
                  {audiobooks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("community")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  adminTab === "community"
                    ? "bg-[#171717] text-[#eeeddb] font-bold shadow-xs"
                    : "bg-[#e8e6d3] text-[#262626] hover:bg-[#dedbc5]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Feather className="w-4 h-4 text-[#e8c078]" />
                  <span>আমার পুঁথি নিয়ন্ত্রণ</span>
                </div>
                <span
                  className={`text-[10px] font-mono-meta px-1.5 py-0.2 rounded font-bold ${
                    adminTab === "community" ? "bg-[#8a493b] text-white" : "bg-black/10 text-[#171717]"
                  }`}
                >
                  {communityPosts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("cms")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  adminTab === "cms"
                    ? "bg-[#171717] text-[#eeeddb] font-bold shadow-xs"
                    : "bg-[#e8e6d3] text-[#262626] hover:bg-[#dedbc5]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#e8c078]" />
                  <span>সাইট কনটেন্ট সিএমএস</span>
                </div>
                <span className="text-[9px] uppercase font-mono-meta bg-amber-600/30 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  CMS
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("seo")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  adminTab === "seo"
                    ? "bg-[#171717] text-[#eeeddb] font-bold shadow-xs"
                    : "bg-[#e8e6d3] text-[#262626] hover:bg-[#dedbc5]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#e8c078]" />
                  <span>এসইও ও ব্র্যান্ডিং</span>
                </div>
                <span className="text-[9px] uppercase font-mono-meta bg-indigo-600/20 text-indigo-900 px-1.5 py-0.2 rounded font-bold">
                  SEO
                </span>
              </button>
            </nav>

            {/* Quick Metrics */}
            <div className="pt-3 border-t border-black/15 space-y-1.5 text-[11px] font-mono-meta text-[#53514a]">
              <div className="flex justify-between items-center">
                <span>সংরক্ষিত গ্রন্থ:</span>
                <span className="font-bold text-[#171717]">{totalBooks} টি</span>
              </div>
              <div className="flex justify-between items-center">
                <span>শ্রুতিপাঠ:</span>
                <span className="font-bold text-[#8a493b]">{audiobooks.length} টি</span>
              </div>
              <div className="flex justify-between items-center">
                <span>কমিউনিটি পোস্ট:</span>
                <span className="font-bold text-[#171717]">{communityPosts.length} টি</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-black/10">
                <span>স্টোরেজ ক্লাউড:</span>
                <span className="font-bold text-emerald-800">Cloudflare R2</span>
              </div>
            </div>

            {/* Live Website Preview Link */}
            <div className="pt-2">
              <Link
                href="/"
                target="_blank"
                className="w-full text-center py-2 px-3 border border-black/30 hover:border-black text-[11px] font-serif-bengali font-semibold text-[#171717] bg-[#e8e6d3] hover:bg-[#dedbc5] transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#8a493b]" />
                <span>লাইভ ওয়েবসাইট দেখুন</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Main Content Workspace */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Success Alert */}
          {successMsg && (
            <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-serif-bengali flex items-center justify-between">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg("")} className="text-emerald-800 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form Error Alert */}
          {formError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-serif-bengali flex items-center justify-between">
              <span>{formError}</span>
              <button onClick={() => setFormError("")} className="text-red-800 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

        {/* Books Management View */}
        {adminTab === "books" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.18)]">
              <div>
                <h2 className="text-2xl font-bold text-[#171717]">গ্রন্থ মহাফেজখানা ব্যবস্থাপনা</h2>
                <p className="text-xs text-[#53514a]">
                  ক্লাসিক বাংলা সাহিত্যকর্মসমূহ যুক্ত করুন এবং পাঠাগারে উন্মুক্ত রাখুন।
                </p>
              </div>

              <button
                onClick={openAddBookModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-[#eeeddb] text-xs font-serif-bengali font-bold hover:bg-[#8a493b] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন গ্রন্থ যুক্ত করুন</span>
              </button>
            </div>

            {/* Books Table */}
            <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs font-mono-meta border-collapse">
                <thead className="bg-[#e8e6d3] border-b border-[rgba(23,23,23,0.15)] text-[#171717]">
                  <tr>
                    <th className="p-3">প্রচ্ছদ</th>
                    <th className="p-3">শিরোনাম ও লেখক</th>
                    <th className="p-3">সাহিত্যধারা</th>
                    <th className="p-3">আদি প্রকাশকাল</th>
                    <th className="p-3">পৃষ্ঠা</th>
                    <th className="p-3">কপিরাইট স্ট্যাটাস</th>
                    <th className="p-3 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(23,23,23,0.1)]">
                  {books.map((b) => (
                    <tr key={b.id || b._id} className="hover:bg-[#ebe8d5] transition-colors">
                      <td className="p-3 w-14">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-10 h-14 object-cover border border-black/20"
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-serif-bengali font-bold text-sm text-[#171717] block">
                          {b.title}
                        </span>
                        <span className="text-[#53514a] font-serif-bengali text-xs">
                          {b.author}
                        </span>
                      </td>
                      <td className="p-3 text-[#53514a] font-serif-bengali">
                        {b.genre}
                      </td>
                      <td className="p-3 font-mono-meta">
                        {b.publishedYear} সাল
                      </td>
                      <td className="p-3">{b.pageCount}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle className="w-2.5 h-2.5" />
                          পাবলিক ডোমেইন (উন্মুক্ত)
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/books/${b.slug}`}
                            target="_blank"
                            className="p-1.5 hover:text-[#8a493b] text-[#53514a] hover:bg-[#e8e6d3] rounded transition-colors"
                            title="বিবরণী দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditBookModal(b)}
                            className="p-1.5 hover:text-[#8a493b] text-[#53514a] hover:bg-[#e8e6d3] rounded transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingBook(b)}
                            className="p-1.5 hover:text-red-700 text-[#53514a] hover:bg-red-50 rounded transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audiobooks Management View */}
        {adminTab === "audiobooks" && (
          <div className="space-y-6">
            {/* Storage Architecture Explanation Notice */}
            <div className="bg-[#ede9d6] border-l-4 border-[#8a493b] p-4 text-xs font-serif-bengali space-y-1.5">
              <div className="flex items-center gap-2 text-[#171717] font-bold">
                <Database className="w-4 h-4 text-[#8a493b]" />
                <span>অডিও ফাইল সংরক্ষণ ও MongoDB সীমাবদ্ধতা সমাধানের নির্দেশিকা</span>
              </div>
              <p className="text-[#53514a] leading-relaxed">
                MongoDB-র ফ্রি টিয়ারে মেমোরি মাত্র <strong>৫০০ মেগাবাইট</strong>। কয়েকটি এমপি৩ (MP3) ফাইল রাখলেই পুরো ডেটাবেজ বন্ধ হয়ে যাবে।
                তাই পুঁথিপিক্সে আমরা <strong>Cloudflare R2 Object Storage</strong> ব্যবহার করছি—যেখানে ১০ জিবি পর্যন্ত অডিও ফাইল সম্পূর্ণ বিনামূল্যে রাখা যায় এবং কোনো ব্যান্ডউইথ ফি কাটে না।
                MongoDB-তে কেবল অডিওর শিরোনাম, বাচিক শিল্পী ও R2 স্ট্রিমিং লিঙ্ক সংরক্ষিত থাকবে।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.18)]">
              <div>
                <h2 className="text-2xl font-bold text-[#171717]">শ্রুতিপাঠ মহাফেজখানা ব্যবস্থাপনা</h2>
                <p className="text-xs text-[#53514a]">
                  ধ্রুপদী ও উন্মুক্ত আধুনিক সাহিত্যের শ্রুতিপাঠ ও অডিওবুক যুক্ত করুন।
                </p>
              </div>

              <button
                onClick={openAddAudiobookModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8a493b] text-[#eeeddb] text-xs font-serif-bengali font-bold hover:bg-[#171717] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন শ্রুতিপাঠ যুক্ত করুন</span>
              </button>
            </div>

            {/* Audiobooks Table */}
            <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs font-mono-meta border-collapse">
                <thead className="bg-[#e8e6d3] border-b border-[rgba(23,23,23,0.15)] text-[#171717]">
                  <tr>
                    <th className="p-3">প্রচ্ছদ</th>
                    <th className="p-3">শিরোনাম ও মূল রচয়িতা</th>
                    <th className="p-3">বাচিক শিল্পী (কণ্ঠ)</th>
                    <th className="p-3">সময়কাল</th>
                    <th className="p-3">ক্যাটাগরি</th>
                    <th className="p-3">কপিরাইট মর্যাদা</th>
                    <th className="p-3 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(23,23,23,0.1)]">
                  {audiobooks.map((a) => (
                    <tr key={a.id || a._id} className="hover:bg-[#ebe8d5] transition-colors">
                      <td className="p-3 w-14">
                        <img
                          src={a.coverImage}
                          alt={a.title}
                          className="w-12 h-12 object-cover border border-black/20"
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-serif-bengali font-bold text-sm text-[#171717] block">
                          {a.title}
                        </span>
                        <span className="text-[#53514a] font-serif-bengali text-xs">
                          {a.author}
                        </span>
                      </td>
                      <td className="p-3 text-[#171717] font-serif-bengali">
                        <div className="flex items-center gap-1">
                          <Mic className="w-3 h-3 text-[#8a493b]" />
                          <span>{a.narrator}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono-meta">
                        {a.duration}
                      </td>
                      <td className="p-3 text-[#53514a] font-serif-bengali">
                        {a.category}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          a.copyrightType === "open-license"
                            ? "bg-emerald-100 text-emerald-800"
                            : a.copyrightType === "authorized"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-stone-200 text-stone-800"
                        }`}>
                          <CheckCircle className="w-2.5 h-2.5" />
                          {a.copyrightType === "open-license"
                            ? "উন্মুক্ত স্বত্ব"
                            : a.copyrightType === "authorized"
                            ? "অনুমোদিত"
                            : "পাবলিক ডোমেইন"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/audiobooks/${a.slug}`}
                            target="_blank"
                            className="p-1.5 hover:text-[#8a493b] text-[#53514a] hover:bg-[#e8e6d3] rounded transition-colors"
                            title="প্লেয়ার শুনুন"
                          >
                            <Headphones className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditAudiobookModal(a)}
                            className="p-1.5 hover:text-[#8a493b] text-[#53514a] hover:bg-[#e8e6d3] rounded transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingAudiobook(a)}
                            className="p-1.5 hover:text-red-700 text-[#53514a] hover:bg-red-50 rounded transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Community Posts Management View */}
        {adminTab === "community" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(23,23,23,0.18)]">
              <div>
                <h2 className="text-2xl font-bold text-[#171717]">আমার পুঁথি — কমিউনিটি মডারেশন</h2>
                <p className="text-xs text-[#53514a]">
                  পাঠকদের প্রকাশিত বই পর্যালোচনা ও স্বরচিত সাহিত্যকর্ম তদারকি করুন। আপত্তিকর পোস্ট কারণসহ অপসারণ করতে পারেন।
                </p>
              </div>

              <Link
                href="/amar-puthi"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-[#eeeddb] text-xs font-serif-bengali font-bold hover:bg-[#8a493b] transition-colors"
              >
                <Feather className="w-4 h-4 text-[#e8c078]" />
                <span>লাইভ সাহিত্য চত্বর দেখুন →</span>
              </Link>
            </div>

            {/* Posts Table */}
            <div className="bg-[#f4f2e4] border border-[rgba(23,23,23,0.18)] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs font-mono-meta border-collapse">
                <thead className="bg-[#e8e6d3] border-b border-[rgba(23,23,23,0.15)] text-[#171717]">
                  <tr>
                    <th className="p-3">লেখক ও তারিখ</th>
                    <th className="p-3">শিরোনাম ও বিষয়</th>
                    <th className="p-3">ছবি</th>
                    <th className="p-3">এনগেজমেন্ট</th>
                    <th className="p-3">অবস্থা (Status)</th>
                    <th className="p-3 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(23,23,23,0.1)]">
                  {communityPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#7a776e] font-serif-bengali">
                        এখনও কোনো কমিউনিটি পোস্ট প্রকাশিত হয়নি।
                      </td>
                    </tr>
                  ) : (
                    communityPosts.map((p) => (
                      <tr key={p._id} className="hover:bg-[#ebe8d5] transition-colors">
                        <td className="p-3">
                          <span className="font-serif-bengali font-bold text-sm text-[#171717] block">
                            {p.authorName}
                          </span>
                          <span className="text-[#7a776e] text-[10px]">
                            {new Date(p.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs">
                          <span className="font-serif-bengali font-semibold text-[#171717] block truncate">
                            {p.postTitle}
                          </span>
                          <span className="inline-block text-[10px] text-[#8a493b] font-serif-bengali bg-[#ede9d6] px-1.5 py-0.2 rounded mt-0.5">
                            {p.genre}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt="Post"
                              className="w-10 h-10 object-cover border border-black/20"
                            />
                          ) : (
                            <span className="text-[10px] text-[#a29f95]">নেই</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span>❤️ {p.likesCount || 0}</span>
                          <span className="ml-2">💬 {p.commentsCount || 0}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] rounded font-bold ${
                              p.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.status === "active" ? "সক্রিয়" : "অপসারিত"}
                          </span>
                          {p.adminDeletionNote && (
                            <span className="block text-[9px] text-red-700 italic mt-0.5 max-w-xs truncate" title={p.adminDeletionNote}>
                              নোট: {p.adminDeletionNote}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Link
                            href={`/amar-puthi#post-${p._id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-[#8a493b] hover:underline font-serif-bengali"
                          >
                            দেখুন
                          </Link>
                          {p.status === "active" && (
                            <button
                              onClick={() => {
                                setDeleteModalPost(p);
                                setDeletionNote("");
                              }}
                              className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 font-serif-bengali font-bold underline"
                            >
                              অপসারণ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Website CMS View */}
        {adminTab === "cms" && (
          <CmsContentEditor
            content={cmsContent}
            onChange={setCmsContent}
            onSave={handleSaveCmsSettings}
            onResetDefaults={handleResetCmsDefaults}
            isSaving={isSavingCms}
          />
        )}

        {/* SEO & Branding View */}
        {adminTab === "seo" && (
          <SeoSettingsEditor
            content={cmsContent}
            onChange={setCmsContent}
            onSave={handleSaveCmsSettings}
            onResetDefaults={handleResetCmsDefaults}
            isSaving={isSavingCms}
          />
        )}
      </main>
    </div>

      {/* Book Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#eeeddb] border-2 border-[#171717] p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-[rgba(23,23,23,0.18)] mb-4">
              <h3 className="text-xl font-serif-bengali font-bold text-[#171717] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#8a493b]" />
                <span>
                  {editingBook
                    ? `ধ্রুপদী গ্রন্থ সম্পাদনা — ${editingBook.title}`
                    : "নতুন ধ্রুপদী গ্রন্থ সংযোজন"}
                </span>
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingBook(null);
                }}
                className="text-[#53514a] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-serif-bengali flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs font-serif-bengali">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    বইয়ের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: পথের পাঁচালী"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    ইংরেজি শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. Pather Panchali"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 font-mono-meta text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    লেখকের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="যেমন: বিভূতিভূষণ বন্দ্যোপাধ্যায়"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    আদি প্রকাশকাল (বছর)
                  </label>
                  <input
                    type="number"
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: Number(e.target.value) })}
                    placeholder="যেমন: 1929"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 font-mono-meta text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                  বইয়ের সংক্ষিপ্ত প্রেক্ষাপট ও বিবরণ *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="বইয়ের বিষয়বস্তু ও গুরুত্ব সংক্ষেপে বর্ণনা করুন..."
                  className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    সাহিত্যধারা (Genre)
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717]"
                  >
                    <option value="উপন্যাস (Novels)">উপন্যাস (Novels)</option>
                    <option value="ছোটগল্প (Short Stories)">ছোটগল্প (Short Stories)</option>
                    <option value="কবিতা ও পদাবলি (Poetry)">কবিতা ও পদাবলি (Poetry)</option>
                    <option value="প্রবন্ধ ও দর্শন (Essays)">প্রবন্ধ ও দর্শন (Essays)</option>
                    <option value="নাটক ও প্রহসন (Plays)">নাটক ও প্রহসন (Plays)</option>
                    <option value="শিশু ও কিশোর সাহিত্য (Children)">শিশু ও কিশোর সাহিত্য (Children)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    পৃষ্ঠা সংখ্যা
                  </label>
                  <input
                    type="number"
                    value={formData.pageCount}
                    onChange={(e) => setFormData({ ...formData, pageCount: Number(e.target.value) })}
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 font-mono-meta text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <FileUploadZone
                  label="বইয়ের প্রচ্ছদ ছবি (Cloudinary Image Upload) *"
                  accept="image/jpeg,image/png,image/webp"
                  type="image"
                  destination="cloudinary"
                  currentValue={formData.coverImage}
                  helperText="ছবি আপলোড করলে স্বয়ংক্রিয়ভাবে Cloudinary CDN-এ অপ্টিমাইজ হয়ে সংরক্ষিত হবে"
                  onUploadComplete={(url, key) =>
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: url,
                      coverKey: key || "",
                    }))
                  }
                />

                <FileUploadZone
                  label="বইয়ের মূল পিডিএফ ফাইল (Cloudflare R2 Direct Upload)"
                  accept="application/pdf,.pdf"
                  type="pdf"
                  destination="r2"
                  currentValue={formData.pdfUrl}
                  helperText="সম্পূর্ণ বইয়ের মূল পিডিএফ সরাসরি Cloudflare R2 বাকেটে সংরক্ষিত হবে ($0 ব্যান্ডউইথ খরচ)"
                  onUploadComplete={(url, key) =>
                    setFormData((prev) => ({
                      ...prev,
                      pdfUrl: url,
                      pdfKey: key || "",
                    }))
                  }
                />
              </div>

              <div className="pt-4 border-t border-[rgba(23,23,23,0.18)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBook(null);
                  }}
                  className="px-4 py-2 border border-black/30 hover:bg-black/5"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#171717] text-[#eeeddb] font-bold hover:bg-[#8a493b] transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "সংরক্ষণ করা হচ্ছে..."
                    : editingBook
                    ? "পরিবর্তন সংরক্ষণ করুন"
                    : "মহাফেজখানায় যুক্ত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audiobook Add/Edit Modal */}
      {showAudioModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#eeeddb] border-2 border-[#171717] p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-[rgba(23,23,23,0.18)] mb-4">
              <h3 className="text-xl font-serif-bengali font-bold text-[#171717] flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#8a493b]" />
                <span>
                  {editingAudiobook
                    ? `শ্রুতিপাঠ সম্পাদনা — ${editingAudiobook.title}`
                    : "নতুন শ্রুতিপাঠ / অডিওবুক সংযোজন"}
                </span>
              </h3>
              <button
                onClick={() => {
                  setShowAudioModal(false);
                  setEditingAudiobook(null);
                }}
                className="text-[#53514a] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-serif-bengali flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAudiobook} className="space-y-4 text-xs font-serif-bengali">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    শ্রুতিপাঠের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={audioFormData.title}
                    onChange={(e) => setAudioFormData({ ...audioFormData, title: e.target.value })}
                    placeholder="যেমন: কাবুলিওয়ালা"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    মূল লেখক / রচয়িতা *
                  </label>
                  <input
                    type="text"
                    required
                    value={audioFormData.author}
                    onChange={(e) => setAudioFormData({ ...audioFormData, author: e.target.value })}
                    placeholder="যেমন: রবীন্দ্রনাথ ঠাকুর"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    বাচিক শিল্পী (কণ্ঠদান) *
                  </label>
                  <input
                    type="text"
                    required
                    value={audioFormData.narrator}
                    onChange={(e) => setAudioFormData({ ...audioFormData, narrator: e.target.value })}
                    placeholder="যেমন: সামিউল ইসলাম পুলক"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    মোট সময়কাল
                  </label>
                  <input
                    type="text"
                    value={audioFormData.duration}
                    onChange={(e) => setAudioFormData({ ...audioFormData, duration: e.target.value })}
                    placeholder="যেমন: ২৮ মিনিট"
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 font-mono-meta text-[#171717] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={audioFormData.categorySlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const name =
                        slug === "stories"
                          ? "ছোটগল্প ও কথাসাহিত্য"
                          : slug === "poetry"
                          ? "কবিতা ও আবৃত্তি"
                          : slug === "children"
                          ? "কিশোর ও কৌতুক সাহিত্য"
                          : "আধুনিক উন্মুক্ত সাহিত্য";
                      setAudioFormData({
                        ...audioFormData,
                        categorySlug: slug,
                        category: name,
                      });
                    }}
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717]"
                  >
                    <option value="stories">ছোটগল্প ও কথাসাহিত্য</option>
                    <option value="poetry">কবিতা ও আবৃত্তি</option>
                    <option value="children">কিশোর ও কৌতুক সাহিত্য</option>
                    <option value="modern">আধুনিক উন্মুক্ত সাহিত্য</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                    কপিরাইট মর্যাদা
                  </label>
                  <select
                    value={audioFormData.copyrightType}
                    onChange={(e) => setAudioFormData({ ...audioFormData, copyrightType: e.target.value })}
                    className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717]"
                  >
                    <option value="public-domain">পাবলিক ডোমেইন ক্লাসিক</option>
                    <option value="open-license">ক্রিয়েটিভ কমন্স / আধুনিক উন্মুক্ত</option>
                    <option value="authorized">অনুমোদিত সমকালীন প্রযোজনা</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <FileUploadZone
                  label="শ্রুতিপাঠের অডিও ফাইল (Cloudflare R2 Direct Upload) *"
                  accept="audio/mpeg,audio/mp3,audio/m4a,audio/wav,audio/aac"
                  type="audio"
                  destination="r2"
                  currentValue={audioFormData.audioUrl}
                  helperText="অডিও ফাইল সরাসরি Cloudflare R2 বাকেটে সংরক্ষিত ও স্ট্রিম হবে"
                  onUploadComplete={(url, key) =>
                    setAudioFormData((prev) => ({
                      ...prev,
                      audioUrl: url,
                      audioKey: key || "",
                    }))
                  }
                />

                <FileUploadZone
                  label="শ্রুতিপাঠের প্রচ্ছদ ছবি (Cloudinary Image Upload)"
                  accept="image/jpeg,image/png,image/webp"
                  type="image"
                  destination="cloudinary"
                  currentValue={audioFormData.coverImage}
                  helperText="Cloudinary CDN-এ স্বয়ংক্রিয়ভাবে প্রচ্ছদ ছবি আপলোড ও অপ্টিমাইজ হবে"
                  onUploadComplete={(url) =>
                    setAudioFormData((prev) => ({
                      ...prev,
                      coverImage: url,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-mono-meta uppercase text-[#53514a] mb-1">
                  সংক্ষিপ্ত পরিচিতি ও সারসংক্ষেপ
                </label>
                <textarea
                  rows={3}
                  value={audioFormData.description}
                  onChange={(e) => setAudioFormData({ ...audioFormData, description: e.target.value })}
                  placeholder="শ্রুতিপাঠের বিষয়বস্তু সংক্ষেপে বর্ণনা করুন..."
                  className="w-full bg-[#f4f2e4] border border-black/20 p-2 text-[#171717]"
                />
              </div>

              <div className="pt-4 border-t border-[rgba(23,23,23,0.18)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAudioModal(false);
                    setEditingAudiobook(null);
                  }}
                  className="px-4 py-2 border border-black/30 hover:bg-black/5"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#8a493b] text-[#eeeddb] font-bold hover:bg-[#171717] transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "সংরক্ষণ করা হচ্ছে..."
                    : editingAudiobook
                    ? "পরিবর্তন সংরক্ষণ করুন"
                    : "শ্রুতিপাঠ মহাফেজখানায় যুক্ত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Post Modal With Note */}
      {deleteModalPost && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#eeeddb] border-2 border-[#171717] p-6 shadow-2xl font-serif-bengali space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/15">
              <h3 className="text-base font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-700" />
                <span>পোস্ট অপসারণ নিশ্চিতকরণ</span>
              </h3>
              <button
                onClick={() => setDeleteModalPost(null)}
                className="text-[#53514a] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#262626] space-y-1 bg-[#ede9d6] p-3 border border-black/10">
              <p>
                <strong className="text-[#171717]">শিরোনাম:</strong> {deleteModalPost.postTitle}
              </p>
              <p>
                <strong className="text-[#171717]">লেখক:</strong> {deleteModalPost.authorName}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                অপসারণের কারণ / মডারেশন নোট * (বাধ্যতামূলক)
              </label>
              <textarea
                required
                rows={3}
                value={deletionNote}
                onChange={(e) => setDeletionNote(e.target.value)}
                placeholder="যেমন: অনাকাঙ্ক্ষিত বিজ্ঞাপন, কপিরাইট লঙ্ঘন, অনুপযুক্ত ভাষা ইত্যাদি..."
                className="w-full bg-[#f4f2e4] border border-black/30 p-2 text-xs text-[#171717] focus:outline-none focus:border-black font-serif-bengali"
              />
              <p className="text-[10px] text-[#7a776e] mt-1 font-mono-meta">
                * এই নোটটি পোস্টদাতার নোটিফিকেশন বক্সে সরাসরি প্রেরিত হবে।
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteModalPost(null)}
                className="px-4 py-2 border border-black/30 hover:bg-black/5"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isDeletingPost || !deletionNote.trim()}
                onClick={handleDeletePostWithNote}
                className="px-4 py-2 bg-red-700 text-white font-bold hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {isDeletingPost ? "অপসারিত হচ্ছে..." : "নোটসহ অপসারণ করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Book Modal */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#eeeddb] border-2 border-[#171717] p-6 shadow-2xl font-serif-bengali space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/15">
              <h3 className="text-base font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-700" />
                <span>গ্রন্থ অপসারণ নিশ্চিতকরণ</span>
              </h3>
              <button
                onClick={() => setDeletingBook(null)}
                className="text-[#53514a] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#262626] space-y-1 bg-[#ede9d6] p-3 border border-black/10">
              <p>
                <strong className="text-[#171717]">বইয়ের নাম:</strong> {deletingBook.title}
              </p>
              <p>
                <strong className="text-[#171717]">লেখক:</strong> {deletingBook.author}
              </p>
            </div>

            <p className="text-xs text-red-700 font-semibold">
              সতর্কতা: এই বইটি মহাফেজখানা থেকে সম্পূর্ণ মুছে ফেলা হবে। আপনি কি নিশ্চিত?
            </p>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="px-4 py-2 border border-black/30 hover:bg-black/5"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isDeletingBook}
                onClick={handleDeleteBook}
                className="px-4 py-2 bg-red-700 text-white font-bold hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {isDeletingBook ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Audiobook Modal */}
      {deletingAudiobook && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#eeeddb] border-2 border-[#171717] p-6 shadow-2xl font-serif-bengali space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/15">
              <h3 className="text-base font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-700" />
                <span>শ্রুতিপাঠ অপসারণ নিশ্চিতকরণ</span>
              </h3>
              <button
                onClick={() => setDeletingAudiobook(null)}
                className="text-[#53514a] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#262626] space-y-1 bg-[#ede9d6] p-3 border border-black/10">
              <p>
                <strong className="text-[#171717]">শ্রুতিপাঠ:</strong> {deletingAudiobook.title}
              </p>
              <p>
                <strong className="text-[#171717]">বাচিক শিল্পী:</strong> {deletingAudiobook.narrator}
              </p>
            </div>

            <p className="text-xs text-red-700 font-semibold">
              সতর্কতা: এই শ্রুতিপাঠটি মহাফেজখানা থেকে মুছে ফেলা হবে। আপনি কি নিশ্চিত?
            </p>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeletingAudiobook(null)}
                className="px-4 py-2 border border-black/30 hover:bg-black/5"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isDeletingAudiobook}
                onClick={handleDeleteAudiobook}
                className="px-4 py-2 bg-red-700 text-white font-bold hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {isDeletingAudiobook ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#f4f2e4] border-2 border-[#171717] max-w-md w-full p-6 space-y-4 shadow-2xl font-serif-bengali animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-black/15 pb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#8a493b]" />
                <h3 className="font-bold text-base text-[#171717]">অ্যাডমিন প্রমাণীকরণ</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="text-black/50 hover:text-black p-1"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#53514a] leading-relaxed">
              মহাফেজখানা নিয়ন্ত্রণ প্যানেলে কনটেন্ট বা সেটিংস সংরক্ষণ করতে অনুমোদিত অ্যাডমিন হিসেবে লগইন সম্পন্ন করুন।
            </p>

            {loginError && (
              <div className="p-2.5 bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-mono-meta text-[#53514a] uppercase mb-1">
                  অ্যাডমিন ইমেইল
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/20 p-2 text-xs font-mono-meta text-[#171717] focus:outline-none focus:border-black"
                  placeholder="admin@puthipix.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-meta text-[#53514a] uppercase mb-1">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#eeeddb] border border-black/20 p-2 text-xs font-mono-meta text-[#171717] focus:outline-none focus:border-black"
                  placeholder="ডিফল্ট পাসওয়ার্ড: admin123"
                  autoFocus
                />
                <p className="text-[10px] text-[#7a776e] mt-1 font-mono-meta">
                  * সিস্টেমে সংরক্ষিত ডিফল্ট অ্যাডমিন পাসওয়ার্ড: <strong>admin123</strong>
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-3 py-1.5 border border-black/30 hover:bg-black/5"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="px-5 py-1.5 bg-[#8a493b] text-white font-bold hover:bg-[#171717] transition-colors disabled:opacity-50"
                >
                  {loginLoading ? "যাচাই হচ্ছে..." : "লগইন সম্পন্ন করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="border-t border-[rgba(23,23,23,0.15)] py-4 text-center text-xs font-mono-meta text-[#7a776e] bg-[#e8e6d3]">
        পুঁথিপিক্স উন্মুক্ত মহাফেজখানা অ্যাডমিনিস্ট্রেশন • সংস্করণ ১.০ • সুরক্ষিত সেশন
      </footer>
    </div>
  );
}
