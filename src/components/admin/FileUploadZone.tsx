"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  UploadCloud,
  FileText,
  Headphones,
  CheckCircle,
  Loader2,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface FileUploadZoneProps {
  label: string;
  accept: string;
  type: "image" | "pdf" | "audio";
  destination: "cloudinary" | "r2";
  currentValue?: string;
  onUploadComplete: (url: string, key?: string) => void;
  helperText?: string;
}

export function FileUploadZone({
  label,
  accept,
  type,
  destination,
  currentValue,
  onUploadComplete,
  helperText,
}: FileUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>(currentValue || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPreviewUrl(currentValue || "");
    if (!currentValue) {
      setFileName("");
      setFileSize("");
    }
  }, [currentValue]);

  const getDisplayFileName = (fallback: string) => {
    if (fileName) return fileName;
    if (!previewUrl) return fallback;
    const parts = previewUrl.split("/");
    const lastPart = parts[parts.length - 1] || "";
    try {
      const decoded = decodeURIComponent(lastPart).replace(/^\d+-/, "");
      return decoded || fallback;
    } catch {
      return lastPart || fallback;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploading(true);
    setFileName(file.name);
    setFileSize(formatSize(file.size));

    // Show instant local preview for images
    if (type === "image") {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("puthipix_session_token") : null;
      const authHeaders: Record<string, string> = {};
      if (token) authHeaders["Authorization"] = `Bearer ${token}`;

      // 1. Direct Presigned Upload for Cloudflare R2 (Bypasses Vercel 4.5MB limit)
      if (destination === "r2") {
        const presignRes = await fetch("/api/admin/uploads/presign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          credentials: "include",
          body: JSON.stringify({
            filename: file.name,
            type,
            contentType: file.type || (type === "pdf" ? "application/pdf" : "audio/mpeg"),
          }),
        });

        const presignContentType = presignRes.headers.get("content-type") || "";
        let presignData: any = {};
        if (presignContentType.includes("application/json")) {
          presignData = await presignRes.json().catch(() => ({}));
        } else {
          const rawText = await presignRes.text().catch(() => "");
          if (presignRes.status === 413 || rawText.includes("Request Entity Too Large")) {
            throw new Error("ফাইলের নাম বা রিকোয়েস্ট সাইজ অত্যধিক বড়।");
          }
          throw new Error(rawText || `সার্ভার ত্রুটি: ${presignRes.status}`);
        }

        if (!presignRes.ok) {
          throw new Error(presignData.error || "প্রিসাইন ইউআরএল পেতে সমস্যা হয়েছে");
        }

        if (presignData.direct && presignData.uploadUrl) {
          try {
            const r2Res = await fetch(presignData.uploadUrl, {
              method: "PUT",
              headers: {
                "Content-Type": file.type || (type === "pdf" ? "application/pdf" : "audio/mpeg"),
              },
              body: file,
            });

            if (!r2Res.ok) {
              throw new Error(`Cloudflare R2 আপলোড ব্যর্থ হয়েছে (HTTP ${r2Res.status})`);
            }

            const uploadedUrl = presignData.url || presignData.key;
            setPreviewUrl(uploadedUrl);
            onUploadComplete(uploadedUrl, presignData.key);
            return;
          } catch (r2Err: any) {
            console.error("Direct R2 upload error:", r2Err);
            if (
              r2Err.name === "TypeError" &&
              (r2Err.message?.includes("fetch") || r2Err.message?.includes("NetworkError"))
            ) {
              throw new Error(
                "Cloudflare R2 বাকেটে সরাসরি আপলোড করতে ব্রাউজার অনুমতি দেয়নি (CORS)। Cloudflare ড্যাশবোর্ডে R2 Bucket Settings > CORS Policy সক্রিয় আছে কিনা পরীক্ষা করুন।"
              );
            }
            throw r2Err;
          }
        }

        // If direct is false (e.g. R2 credentials not configured on server)
        if (file.size > 4.5 * 1024 * 1024) {
          throw new Error(
            "ফাইলের সাইজ ৪.৫ MB-এর বেশি। Vercel সার্ভারলেসের সীমাবদ্ধতার কারণে এত বড় ফাইল আপলোড করতে Cloudflare R2 এনভায়রনমেন্ট ভেরিয়েবল সেট করা আবশ্যক।"
          );
        }
      }

      // 2. Server-side upload route (for Cloudinary images or fallback)
      const formData = new FormData();
      formData.append("file", file);

      let endpoint = "/api/admin/uploads";
      if (destination === "cloudinary") {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।");
        }
        endpoint = "/api/admin/uploads/image";
        formData.append("folder", "puthipix/covers");
      } else {
        formData.append("type", type);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: formData,
      });

      const contentTypeHeader = res.headers.get("content-type") || "";
      let data: any = {};
      if (contentTypeHeader.includes("application/json")) {
        data = await res.json().catch(() => ({}));
      } else {
        const text = await res.text().catch(() => "");
        if (res.status === 413 || text.includes("Request Entity Too Large") || text.startsWith("Request En")) {
          throw new Error("ফাইলের সাইজ ৪.৫ MB-এর বেশি (Request Entity Too Large)। সরাসরি Cloudflare R2 কনফিগারেশন প্রয়োজন।");
        }
        throw new Error(text || `সার্ভার এরর: ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "ফাইল আপলোড করতে সমস্যা হয়েছে");
      }

      const uploadedUrl = data.url || data.key;
      setPreviewUrl(uploadedUrl);
      onUploadComplete(uploadedUrl, data.key);
    } catch (err: any) {
      setUploadError(err.message || "আপলোড ব্যর্থ হয়েছে");
      setPreviewUrl(currentValue || "");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5 font-serif-bengali">
      <div className="flex items-center justify-between">
        <label className="block font-mono-meta text-[11px] uppercase tracking-wider text-[#53514a]">
          {label}
        </label>
        <span className="text-[10px] font-mono-meta text-[#7a776e]">
          {destination === "cloudinary" ? "Cloudinary CDN" : "Cloudflare R2"}
        </span>
      </div>

      {uploadError && (
        <div className="p-2 bg-red-100 border border-red-300 text-red-800 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Empty State / Upload Trigger Box */}
      {!previewUrl && !isUploading && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-[#171717]/30 hover:border-[#8a493b] hover:bg-[#ede9d6] transition-all p-4 text-center bg-[#f4f2e4] space-y-1 group"
        >
          <div className="w-9 h-9 mx-auto rounded-full bg-[#eeeddb] border border-black/10 flex items-center justify-center text-[#53514a] group-hover:text-[#8a493b] group-hover:scale-105 transition-all">
            {type === "image" && <UploadCloud className="w-4 h-4" />}
            {type === "pdf" && <FileText className="w-4 h-4" />}
            {type === "audio" && <Headphones className="w-4 h-4" />}
          </div>
          <p className="text-xs text-[#171717] font-semibold">
            {type === "image" && "ক্লিক করে প্রচ্ছদ ছবি আপলোড করুন"}
            {type === "pdf" && "ক্লিক করে মূল PDF ফাইল আপলোড করুন"}
            {type === "audio" && "ক্লিক করে অডিও (.mp3, .m4a) আপলোড করুন"}
          </p>
          <p className="text-[10px] text-[#7a776e] font-mono-meta">
            {helperText ||
              (type === "image"
                ? "JPEG, PNG, WebP • সর্বোচ্চ ১০ মেগাবাইট"
                : type === "pdf"
                ? "বইয়ের সম্পূর্ণ পিডিএফ • সরাসরি R2 তে যাবে"
                : "MP3, M4A, WAV • সরাসরি R2 তে যাবে")}
          </p>
        </div>
      )}

      {/* Uploading State */}
      {isUploading && (
        <div className="p-4 bg-[#ede9d6] border border-black/20 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#8a493b]" />
          <p className="text-xs text-[#171717] font-semibold">
            {destination === "cloudinary"
              ? "Cloudinary CDN-এ ছবি আপলোড হচ্ছে..."
              : "Cloudflare R2-তে ফাইল আপলোড ও স্ট্রিমিং প্রস্তুত হচ্ছে..."}
          </p>
          {fileName && (
            <p className="text-[10px] font-mono-meta text-[#7a776e]">
              {fileName} ({fileSize})
            </p>
          )}
        </div>
      )}

      {/* Uploaded / Preview State */}
      {previewUrl && !isUploading && (
        <div className="p-3 bg-[#f4f2e4] border border-[#171717] space-y-2">
          {/* Image Preview */}
          {type === "image" && (
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-[#e5e2cd] border border-black/20 shrink-0 overflow-hidden shadow-xs">
                <Image
                  src={previewUrl}
                  alt="Uploaded Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex-grow space-y-1 min-w-0">
                <div className="flex items-center gap-1 text-emerald-800 text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Cloudinary-তে সংরক্ষিত</span>
                </div>
                {fileName && (
                  <p className="text-[11px] font-mono-meta text-[#171717] truncate">
                    {fileName} ({fileSize})
                  </p>
                )}
                <p className="text-[9px] font-mono-meta text-[#7a776e] truncate">
                  {previewUrl.slice(0, 45)}...
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-[11px] font-serif-bengali text-[#8a493b] hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>অন্য ছবি নির্বাচন করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* PDF Preview */}
          {type === "pdf" && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-9 h-9 rounded bg-[#8a493b] text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1 text-emerald-800 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>পিডিএফ ক্লাউডফ্লেয়ার R2-তে সংরক্ষিত</span>
                  </div>
                  <p className="text-[11px] font-mono-meta text-[#171717] truncate">
                    {getDisplayFileName("uploaded-book.pdf")} {fileSize ? `(${fileSize})` : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-[#8a493b] hover:underline shrink-0 font-serif-bengali"
              >
                বদলান
              </button>
            </div>
          )}

          {/* Audio Preview */}
          {type === "audio" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-8 h-8 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4 text-[#e8c078]" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1 text-emerald-800 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>অডিও Cloudflare R2-তে আপলোড হয়েছে</span>
                    </div>
                    <p className="text-[10px] font-mono-meta text-[#171717] truncate">
                      {getDisplayFileName("audio-track.mp3")} {fileSize ? `(${fileSize})` : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-[#8a493b] hover:underline shrink-0 font-serif-bengali"
                >
                  বদলান
                </button>
              </div>

              {/* In-modal Audio Preview Player */}
              <audio
                src={previewUrl}
                controls
                className="w-full h-8 accent-[#8a493b]"
                controlsList="nodownload"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

