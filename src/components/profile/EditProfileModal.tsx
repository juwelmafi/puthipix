"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Camera, Loader2, Check, AlertCircle, User as UserIcon } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    _id: string;
    name: string;
    bio?: string;
    avatar?: string;
  };
  onProfileUpdated: (updatedUser: { name: string; bio: string; avatar: string }) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("অনুগ্রহ করে একটি বৈধ ছবি ফাইল (JPEG, PNG, WebP) নির্বাচন করুন।");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("ছবির আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("নামের ঘরটি ফাঁকা রাখা যাবে না।");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      let finalAvatarUrl = avatar;

      // 1. Upload new picture if user picked a file
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/users/avatar", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setError(uploadData.error || "ছবি সংরক্ষণ করতে সমস্যা হয়েছে।");
          setIsSaving(false);
          return;
        }

        finalAvatarUrl = uploadData.avatarUrl;
        setAvatar(finalAvatarUrl);
      }

      // 2. Update user name & bio
      const updateRes = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          avatar: finalAvatarUrl,
        }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        setError(updateData.error || "প্রোফাইল আপডেট ব্যর্থ হয়েছে।");
        setIsSaving(false);
        return;
      }

      onProfileUpdated({
        name: name.trim(),
        bio: bio.trim(),
        avatar: finalAvatarUrl,
      });

      onClose();
    } catch (err) {
      setError("নেটওয়ার্ক ত্রুটি! অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#f4f2e4] border-3 border-[#171717] shadow-2xl overflow-hidden font-serif-bengali">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#e8e6d3] border-b-2 border-[#171717] flex items-center justify-between">
          <div>
            <h3 id="edit-profile-title" className="font-bold text-base text-[#171717]">
              পাঠক প্রোফাইল সম্পাদনা
            </h3>
            <p className="text-[11px] font-mono-meta text-[#7a776e]">
              আপনার নাম, প্রোফাইল ছবি ও সাহিত্য পরিচিতি পরিবর্তন করুন
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#53514a] hover:text-[#171717] hover:bg-black/10 rounded-xs transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-100/80 border border-red-300 text-red-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Picture Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#ede9d6] border border-black/15 rounded-xs">
            {/* Avatar Preview */}
            <div className="relative w-20 h-20 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-2xl border-2 border-[#8a493b] overflow-hidden shrink-0 shadow-sm">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                name?.charAt(0) || "পা"
              )}
            </div>

            {/* Upload Buttons & Notes (NO mention of cloudflare) */}
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-[#171717] text-[#eeeddb] hover:bg-[#8a493b] font-bold text-xs flex items-center justify-center sm:justify-start gap-1.5 transition-colors border border-black cursor-pointer mx-auto sm:mx-0"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>নতুন ছবি নির্বাচন করুন</span>
              </button>
              <p className="text-[10px] font-mono-meta text-[#7a776e]">
                গ্রহণযোগ্য ফরম্যাট: JPEG, PNG, WebP (সর্বোচ্চ ৫ মেগাবাইট)
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#171717]">
              আপনার নাম <span className="text-[#8a493b]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম লিখুন..."
              className="w-full bg-[#eeeddb] border-2 border-[#171717] p-2.5 text-xs text-[#171717] font-serif-bengali focus:outline-none focus:border-[#8a493b]"
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#171717]">
                সাহিত্য পরিচিতি ও দর্শন (Bio)
              </label>
              <span className="text-[10px] font-mono-meta text-[#7a776e]">
                {bio.length}/300
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="আপনার সাহিত্য পাঠের আগ্রহ, দৃষ্টিভঙ্গি বা পরিচিতি সংক্ষেপে লিখুন..."
              className="w-full bg-[#eeeddb] border-2 border-[#171717] p-2.5 text-xs text-[#171717] font-serif-bengali focus:outline-none focus:border-[#8a493b] leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-black/15">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-[#ede9d6] hover:bg-[#ded9c2] text-[#171717] text-xs font-bold transition-colors border border-black/20 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#8a493b] hover:bg-[#723a2e] text-[#eeeddb] text-xs font-bold flex items-center gap-1.5 border-2 border-[#171717] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

