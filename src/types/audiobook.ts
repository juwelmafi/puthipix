export type CopyrightStatus = "public-domain" | "open-license" | "authorized";

export interface AudiobookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  audioUrl: string;
  narrator?: string;
}

export interface Audiobook {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  author: string;
  narrator: string; // বাচিক শিল্পী / কণ্ঠ
  narratorBio?: string;
  duration: string; // e.g. "৩৫ মিনিট"
  durationSeconds: number;
  audioUrl: string; // Primary streaming URL
  coverImage: string;
  description: string;
  synopsis?: string[];
  transcript?: string; // Text for read-along listening room
  category: string;
  categorySlug: string;
  copyrightType: CopyrightStatus;
  copyrightNote?: string;
  chapters: AudiobookChapter[];
  featured?: boolean;
  recentlyAdded?: boolean;
  publishedYear: number;
  language: string;
  readBookSlug?: string; // Links directly to reader if the text exists in Puthipix
}

