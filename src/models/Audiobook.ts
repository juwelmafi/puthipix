import mongoose, { Schema, Document } from "mongoose";

export interface IAudiobookChapter {
  chapterNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  audioKey: string; // Cloudflare R2 key
  audioUrl: string;
  narrator?: string;
}

export interface IAudiobook extends Document {
  title: string;
  titleEn?: string;
  slug: string;
  author: string;
  narrator: string;
  narratorBio?: string;
  duration: string;
  durationSeconds: number;
  coverImage: string;
  description: string;
  synopsis?: string[];
  transcript?: string;
  category: string;
  categorySlug: string;
  copyrightType: "public-domain" | "open-license" | "authorized";
  copyrightNote?: string;
  chapters: IAudiobookChapter[];
  audioKey?: string; // Cloudflare R2 key for single-file audio
  audioUrl: string;
  featured: boolean;
  publishedYear: number;
  language: string;
  readBookSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AudiobookChapterSchema = new Schema<IAudiobookChapter>({
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  durationSeconds: { type: Number, default: 0 },
  audioKey: { type: String },
  audioUrl: { type: String, required: true },
  narrator: { type: String },
});

const AudiobookSchema = new Schema<IAudiobook>(
  {
    title: { type: String, required: true, trim: true },
    titleEn: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    author: { type: String, required: true, index: true },
    narrator: { type: String, required: true },
    narratorBio: { type: String },
    duration: { type: String, required: true },
    durationSeconds: { type: Number, default: 0 },
    coverImage: { type: String, required: true },
    description: { type: String, required: true },
    synopsis: [{ type: String }],
    transcript: { type: String },
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    copyrightType: {
      type: String,
      enum: ["public-domain", "open-license", "authorized"],
      default: "public-domain",
    },
    copyrightNote: { type: String },
    chapters: [AudiobookChapterSchema],
    audioKey: { type: String },
    audioUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    publishedYear: { type: Number, default: 1900 },
    language: { type: String, default: "বাংলা" },
    readBookSlug: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Audiobook ||
  mongoose.model<IAudiobook>("Audiobook", AudiobookSchema);

