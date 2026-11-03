import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set. Please check .env.local");
  process.exit(1);
}

// Schemas
const GenreSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
  order: Number,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
}, { timestamps: true });

const BookSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  slug: { type: String, unique: true },
  author: String,
  translator: String,
  description: String,
  synopsis: [String],
  coverImage: String,
  price: { type: Number, default: 0 },
  accessType: { type: String, default: "free" },
  publishedYear: Number,
  edition: String,
  pageCount: Number,
  language: String,
  genre: String,
  genreSlug: String,
  category: String,
  categorySlug: String,
  featured: Boolean,
  recentlyAdded: Boolean,
  rating: Number,
  publisher: String,
  tableOfContents: [String],
  published: { type: Boolean, default: true },
}, { timestamps: true });

const AudiobookSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  slug: { type: String, unique: true },
  author: String,
  narrator: String,
  narratorBio: String,
  duration: String,
  durationSeconds: Number,
  audioUrl: String,
  coverImage: String,
  description: String,
  synopsis: [String],
  transcript: String,
  category: String,
  categorySlug: String,
  copyrightType: String,
  copyrightNote: String,
  chapters: [{
    chapterNumber: Number,
    title: String,
    duration: String,
    durationSeconds: Number,
    audioUrl: String,
    narrator: String,
  }],
  featured: Boolean,
  recentlyAdded: Boolean,
  publishedYear: Number,
  language: String,
  readBookSlug: String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  passwordHash: String,
  role: { type: String, default: "user" },
  status: { type: String, default: "active" },
}, { timestamps: true });

const Genre = mongoose.models.Genre || mongoose.model("Genre", GenreSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
const Audiobook = mongoose.models.Audiobook || mongoose.model("Audiobook", AudiobookSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const GENRES = [
  { id: "1", name: "উপন্যাস (Novels)", slug: "novels", count: 32, description: "বাংলা সাহিত্যের কালজয়ী ধ্রুপদী উপন্যাস" },
  { id: "2", name: "ছোটগল্প (Short Stories)", slug: "stories", count: 45, description: "জীবনের গভীর দর্শন ও সমাজচিত্রের আখ্যান" },
  { id: "3", name: "কবিতা ও পদাবলি (Poetry)", slug: "poetry", count: 28, description: "বাংলা কবিতার অনুপম ছন্দ ও ভাবসম্ভার" },
  { id: "4", name: "প্রবন্ধ ও দর্শন (Essays)", slug: "essays", count: 18, description: "সমাজ, সংস্কৃতি, নন্দনতত্ত্ব ও দার্শনিক ভাবনা" },
  { id: "5", name: "নাটক ও প্রহসন (Plays)", slug: "drama", count: 14, description: "মঞ্চসফল নাটক ও সমাজ সংস্কারের ইতিবৃত্ত" },
  { id: "6", name: "শিশু ও কিশোর সাহিত্য (Children)", slug: "children", count: 20, description: "হাস্যকৌতুক, কল্পবিজ্ঞান ও শিশুতোষ ক্লাসিক" },
];

const CATEGORIES = [
  { id: "c1", name: "রবীন্দ্র রচনাসম্ভার", slug: "rabindranath", description: "রবীন্দ্রনাথ ঠাকুরের কালজয়ী সাহিত্যকর্ম" },
  { id: "c2", name: "শরৎচন্দ্র সংগ্রহ", slug: "saratchandra", description: "শরৎচন্দ্র চট্টোপাধ্যায়ের হৃদয়স্পর্শী উপন্যাস ও গল্প" },
  { id: "c3", name: "বাংলার জাগরণ ও নারীচেতনা", slug: "renaissance", description: "উনিশ ও বিশ শতকের সমাজ রূপান্তরের আকরগ্রন্থ" },
  { id: "c4", name: "ধ্রুপদী কাব্য ও সাহিত্য", slug: "classics", description: "কালোত্তীর্ণ সাহিত্য সৃষ্টি" },
];

const BOOKS = [
  {
    slug: "gora-rabindranath-tagore",
    title: "গোরা",
    titleEn: "Gora",
    author: "রবীন্দ্রনাথ ঠাকুর",
    description: "স্বদেশপ্রেম, সনাতন ধর্মচেতনা এবং মানবমুক্তির এক বিশাল দার্শনিক ও সমাজতাত্ত্বিক উপন্যাস। রবীন্দ্র-উপন্যাসের অন্যতম শিখর।",
    synopsis: [
      "উনিশ শতকের কলকাতার সামাজিক ও রাজনৈতিক টানাপোড়েনের পটভূমিতে রচিত এই উপন্যাসের কেন্দ্রীয় চরিত্র গোরা।",
      "গোরা কেবল একটি চরিত্রের গল্প নয়, এটি আত্মপরিচয় ও সর্বজনীন মানবতার এক গভীর অন্বেষণ।"
    ],
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    price: 0,
    accessType: "free",
    publishedYear: 1910,
    edition: "মহাফেজখানা ডিজিটাইজড সংস্করণ",
    pageCount: 460,
    language: "বাংলা",
    genre: "উপন্যাস (Novels)",
    genreSlug: "novels",
    category: "রবীন্দ্র রচনাসম্ভার",
    categorySlug: "rabindranath",
    featured: true,
    recentlyAdded: true,
    rating: 4.95,
    publisher: "পুঁথিপিক্স উন্মুক্ত মহাফেজখানা",
    tableOfContents: [
      "প্রথম খণ্ড: বিনয় ও গোরার পরিচয়",
      "দ্বিতীয় খণ্ড: আনন্দময়ীর মাতৃত্ব",
      "তৃতীয় খণ্ড: ব্রাহ্ম সমাজ ও হিন্দু মেলা",
      "চতুর্থ খণ্ড: সূচরিতার উপলব্ধি",
      "উপসংহার: 'আজ আমি মুক্ত ভারতবাসী'"
    ]
  },
  {
    slug: "srikanta-sarat-chandra-chattopadhyay",
    title: "শ্রীকান্ত (প্রথম পর্ব)",
    titleEn: "Srikanta (Part 1)",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    description: "বাংলা সাহিত্যের অবিসংবাদিত ভবঘুরে চরিত্র শ্রীকান্ত ও ইন্দ্রনাথের অবিস্মরণীয় রোমাঞ্চ এবং রাজলক্ষ্মীর আত্মত্যাগের অমর গাথা।",
    synopsis: [
      "গঙ্গার উত্তাল স্রোতে মাছ শিকার, শ্মশানের ভৌতিক অভিজ্ঞতা এবং সমাজের প্রান্তিক মানুষের প্রতি অপার মমত্ববোধে ভাস্বর এই আখ্যান।"
    ],
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    price: 0,
    accessType: "free",
    publishedYear: 1917,
    edition: "উন্মুক্ত মহাফেজখানা সংস্করণ",
    pageCount: 220,
    language: "বাংলা",
    genre: "উপন্যাস (Novels)",
    genreSlug: "novels",
    category: "শরৎচন্দ্র সংগ্রহ",
    categorySlug: "saratchandra",
    featured: true,
    recentlyAdded: false,
    rating: 4.9,
    publisher: "পুঁথিপিক্স উন্মুক্ত মহাফেজখানা",
    tableOfContents: [
      "অধ্যায় ০১: বাল্যস্মৃতি ও ইন্দ্রনাথের দেখা",
      "অধ্যায় ০২: মালোপাড়ার অভিযান",
      "অধ্যায় ০৩: গোঁসাইজির আখড়া",
      "অধ্যায় ০৪: রাজলক্ষ্মী ও আত্মনিবেদন"
    ]
  },
  {
    slug: "sultanas-dream-begum-rokeya",
    title: "সুলতানার স্বপ্ন (Sultana's Dream)",
    titleEn: "Sultana's Dream",
    author: "বেগম রোকেয়া সাখাওয়াত হোসেন",
    description: "বিশ্ব সাহিত্যের অন্যতম প্রথম নারীবাদী কল্পবিজ্ঞান রচনা। এক নারীপ্রধান ইউটোপিয়ার কাল্পনিক চিত্র যেখানে বিজ্ঞান ও শান্তিই সমাজের ভিত্তি।",
    synopsis: [
      "১৯০৫ সালে রচিত এই স্বপ্নদৃশ্যে সৌরশক্তির ব্যবহার ও মেঘের বৃষ্টি নিয়ন্ত্রণের মতো অগ্রগামী বৈজ্ঞানিক ভাবনার প্রকাশ ঘটেছে।"
    ],
    coverImage: "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800&auto=format&fit=crop",
    price: 0,
    accessType: "free",
    publishedYear: 1905,
    edition: "দ্বিভাষিক সংস্করণ",
    pageCount: 84,
    language: "বাংলা ও ইংরেজি",
    genre: "প্রবন্ধ ও দর্শন (Essays)",
    genreSlug: "essays",
    category: "বাংলার জাগরণ ও নারীচেতনা",
    categorySlug: "renaissance",
    featured: true,
    recentlyAdded: true,
    rating: 4.88,
    publisher: "পুঁথিপিক্স উন্মুক্ত মহাফেজখানা",
    tableOfContents: [
      "ভূমিকা: বেগম রোকেয়ার দূরদৃষ্টি",
      "মূল রচনা: লেডিল্যান্ডে সুলতানা",
      "বিজ্ঞান ও সৌরশক্তি",
      "পুরুষমর্দানা বনাম অন্তঃপুর"
    ]
  },
  {
    slug: "abol-tabol-sukumar-ray",
    title: "আবোল তাবোল",
    titleEn: "Abol Tabol (Rhymes of Nonsense)",
    author: "সুকুমার রায়",
    description: "বাংলা ননসেন্স ছড়ার অনন্য শিখর। শব্দ নিয়ে অদ্ভুত খেলা, তীক্ষ্ণ ব্যঙ্গ এবং অমর সব চরিত্রের সমাবেশ—খিচুড়ি, কুমড়োপটাশ, বমভোলা।",
    synopsis: [
      "সুকুমার রায়ের মৃত্যুর মাত্র কয়েকদিন পূর্বে প্রকাশিত এই ছড়াগ্রন্থ বাংলা সাহিত্যের অন্যতম শ্রেষ্ঠ আনন্দভাণ্ডার।"
    ],
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop",
    price: 0,
    accessType: "free",
    publishedYear: 1923,
    edition: "সচিত্র ক্লাসিক সংস্করণ",
    pageCount: 96,
    language: "বাংলা",
    genre: "শিশু ও কিশোর সাহিত্য (Children)",
    genreSlug: "children",
    category: "ধ্রুপদী কাব্য ও সাহিত্য",
    categorySlug: "classics",
    featured: true,
    recentlyAdded: true,
    rating: 4.98,
    publisher: "পুঁথিপিক্স উন্মুক্ত মহাফেজখানা",
    tableOfContents: [
      "খিচুড়ি",
      "দাঁড়ে দাঁড়ে দ্রুম",
      "হুঁকোমুখো হ্যাংলা",
      "কুমড়োপটাশ",
      "বোম্বাগড়ের রাজা",
      "আবোল তাবোল"
    ]
  },
  {
    slug: "kapalkundala-bankim-chandra",
    title: "কপালকুণ্ডলা",
    titleEn: "Kapalkundala",
    author: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়",
    description: "সমুদ্র উপকূলের অরণ্য, কাপালিকের তান্ত্রিক আরাধনা এবং নবকুমার ও কপালকুণ্ডলার রোমাঞ্চকর প্রণয়কাহিনি নিয়ে বাংলা সাহিত্যের প্রথম সার্থক রোমান্টিক উপন্যাস।",
    synopsis: [
      "হিজলির সমুদ্রতীরে পথভ্রষ্ট নবকুমারের সাথে বনবাসিনী কপালকুণ্ডলার আকস্মিক সাক্ষাৎ এবং সেই অমর উক্তি: 'পথিক, তুমি পথ হারাইয়াছ?'"
    ],
    coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?q=80&w=800&auto=format&fit=crop",
    price: 0,
    accessType: "free",
    publishedYear: 1866,
    edition: "ঐতিহাসিক ক্লাসিক সংস্করণ",
    pageCount: 168,
    language: "বাংলা",
    genre: "উপন্যাস (Novels)",
    genreSlug: "novels",
    category: "ধ্রুপদী কাব্য ও সাহিত্য",
    categorySlug: "classics",
    featured: false,
    recentlyAdded: true,
    rating: 4.85,
    publisher: "পুঁথিপিক্স উন্মুক্ত মহাফেজখানা"
  },
  {
    slug: "bonolota-sen-jibanananda-das",
    title: "বনলতা সেন",
    titleEn: "Banalata Sen",
    author: "জীবনানন্দ দাশ",
    description: "হাজার বছর ধরে পথহাঁটা ক্লান্ত এক পথিকের দু'দণ্ড শান্তির চিরন্তন আশ্রয়। আধুনিক বাংলা কবিতার সর্বাধিক পঠিত ও আলোচিত কাব্যগ্রন্থ।",
    synopsis: [
      "সিংহল সমুদ্র থেকে মালয় সাগর পর্যন্ত পরিভ্রমণ শেষে নাটোরের বনলতা সেনের চোখ ও অন্ধকারের আখ্যান।"
    ],
    coverImage: "https://images.unsplash.com/photo-1507842229451-7f01be723466?q=80&w=800&auto=format&fit=crop",
    price: 0,
    accessType: "free",
    publishedYear: 1942,
    edition: "পরিমার্জিত সংকলন",
    pageCount: 64,
    language: "বাংলা",
    genre: "কবিতা ও পদাবলি (Poetry)",
    genreSlug: "poetry",
    category: "ধ্রুপদী কাব্য ও সাহিত্য",
    categorySlug: "classics",
    featured: true,
    recentlyAdded: false,
    rating: 4.96,
    publisher: "পুঁথিপিক্স উন্মুক্ত মহাফেজখানা"
  }
];

const AUDIOBOOKS = [
  {
    slug: "kabuliwala-audiobook",
    title: "কাবুলিওয়ালা",
    titleEn: "Kabuliwala",
    author: "রবীন্দ্রনাথ ঠাকুর",
    narrator: "সামিউল ইসলাম পুলক",
    narratorBio: "বেতার ও মঞ্চের বাচিক শিল্পী। ধ্রুপদী বাংলা কথাসাহিত্যের সংবেদনশীল পাঠের জন্য পরিচিত।",
    duration: "২৮ মিনিট",
    durationSeconds: 1680,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    description: "আফগান সওদাগর রহমত ও ছোট্ট মেয়ে মিনির ভেতর গড়ে ওঠা অপার্থিব স্নেহ ও পিতৃভালোবাসার এক অমর আখ্যান। রবীন্দ্রনাথের অমর ছোটগল্পের সম্পূর্ণ শ্রুতিনাট্য।",
    synopsis: [
      "আমার পাঁচ বছর বয়সের ছোট মেয়ে মিনি এক দণ্ড কথা না কহিয়া থাকিতে পারে না...",
      "একদিন সকালে আমার ঘরের জানালার ধারে বসিয়া কাবুলিওয়ালা রহমতের সঙ্গে তাহার প্রথম পরিচয় হইয়াছিল।"
    ],
    transcript: `আমার পাঁচ বছর বয়সের ছোট মেয়ে মিনি এক দণ্ড কথা না কহিয়া থাকিতে পারে না। পৃথিবীতে জন্মগ্রহণ করিয়া ভাষা শিক্ষা করিতে সে কেবল একটি বৎসর কাল ব্যয় করিয়াছিল, তাহার পর হইতে যতক্ষণ সে জাগিয়া থাকে এক মুহূর্তও মৌনভাবে কাটায় না...`,
    category: "ছোটগল্প ও কথাসাহিত্য",
    categorySlug: "stories",
    copyrightType: "public-domain",
    copyrightNote: "রবীন্দ্রনাথ ঠাকুরের মূল সাহিত্যকর্ম পাবলিক ডোমেইন।",
    publishedYear: 1892,
    language: "বাংলা",
    readBookSlug: "gora-rabindranath-tagore",
    featured: true,
    recentlyAdded: true,
    chapters: [
      { chapterNumber: 1, title: "প্রথম পর্ব: মিনির বাল্যচপলতা ও কাবুলিওয়ালার আগমন", duration: "০৭:১৫", durationSeconds: 435, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3", narrator: "সামিউল ইসলাম পুলক" },
      { chapterNumber: 2, title: "দ্বিতীয় পর্ব: বাদাম-কিশমিশ ও অসম বন্ধুত্ব", duration: "০৬:৪৫", durationSeconds: 405, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3", narrator: "সামিউল ইসলাম পুলক" },
      { chapterNumber: 3, title: "তৃতীয় পর্ব: আকস্মিক সংঘাত ও দীর্ঘ কারাবাস", duration: "০৬:২০", durationSeconds: 380, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3", narrator: "সামিউল ইসলাম পুলক" },
      { chapterNumber: 4, title: "চতুর্থ পর্ব: বিয়ের সানাই ও পিতার অশ্রু", duration: "০৭:৪০", durationSeconds: 460, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3", narrator: "সামিউল ইসলাম পুলক" }
    ]
  },
  {
    slug: "mahesh-audiobook",
    title: "মহেশ",
    titleEn: "Mahesh",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    narrator: "ফারহানা জামান",
    narratorBio: "নাট্যকর্মী ও বিশিষ্ট আবৃত্তিশিল্পী। সামাজিক ট্র্যাজেডি রূপায়ণে পারদর্শী।",
    duration: "৩৫ মিনিট",
    durationSeconds: 2100,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    description: "বাংলার সামন্তবাদী শাসনব্যবস্থায় এক দরিদ্র কৃষক গফুর এবং তার প্রিয় পোষা বলদ মহেশের মর্মস্পর্শী বন্ধন ও করুণ পরিণতির সমাজচিত্র।",
    category: "ছোটগল্প ও কথাসাহিত্য",
    categorySlug: "stories",
    copyrightType: "public-domain",
    publishedYear: 1926,
    language: "বাংলা",
    readBookSlug: "srikanta-sarat-chandra-chattopadhyay",
    featured: true,
    recentlyAdded: true,
    chapters: [
      { chapterNumber: 1, title: "পর্ব ১: খরাক্লিষ্ট কাশিপুর ও গফুরের কুটির", duration: "১১:০০", durationSeconds: 660, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" },
      { chapterNumber: 2, title: "পর্ব ২: তর্করত্নের রোষ ও মহেশের ক্ষুধার্ত কান্না", duration: "১২:১৫", durationSeconds: 735, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" },
      { chapterNumber: 3, title: "পর্ব ৩: চরম বিচ্ছেদ ও ফুলবেড়ের চটকলের পথ", duration: "১১:৪৫", durationSeconds: 705, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" }
    ]
  },
  {
    slug: "banalata-sen-audiobook",
    title: "বনলতা সেন ও নির্বাচিত কবিতা",
    titleEn: "Banalata Sen & Poems",
    author: "জীবনানন্দ দাশ",
    narrator: "অনির্বাণ সেনগুপ্ত",
    duration: "১৮ মিনিট",
    durationSeconds: 1080,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
    description: "হাজার বছরের ক্লান্তি, অন্ধকার এবং নাটোরের বনলতা সেনের পাখির নীড়ের মতো চোখ। জীবনানন্দের অতীন্দ্রিয় কবিতার শান্ত আবৃত্তিমালা।",
    category: "কবিতা ও আবৃত্তি",
    categorySlug: "poetry",
    copyrightType: "public-domain",
    publishedYear: 1942,
    language: "বাংলা",
    readBookSlug: "bonolota-sen-jibanananda-das",
    featured: true,
    chapters: [
      { chapterNumber: 1, title: "কবিতা ১: বনলতা সেন", duration: "০৪:৩০", durationSeconds: 270, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" },
      { chapterNumber: 2, title: "কবিতা ২: আবার আসিব ফিরে", duration: "০৪:১৫", durationSeconds: 255, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" },
      { chapterNumber: 3, title: "কবিতা ৩: কুড়ি বছর পরে ও রূপসী বাংলা", duration: "০৯:১৫", durationSeconds: 555, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" }
    ]
  },
  {
    slug: "abol-tabol-audiobook",
    title: "বোম্বাগড়ের রাজা ও আবোল তাবোল",
    titleEn: "Abol Tabol",
    author: "সুকুমার রায়",
    narrator: "শামীম রেজা ও দল",
    duration: "২২ মিনিট",
    durationSeconds: 1320,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
    description: "ননসেন্স রাইম ও কৌতুকরসের অনন্য শিখর। বোম্বাগড়ের রাজা, কুমড়োপটাশ এবং কাঠবুড়োর জীবন্ত শ্রুতিরঙ্গ।",
    category: "কিশোর ও কৌতুক সাহিত্য",
    categorySlug: "children",
    copyrightType: "public-domain",
    publishedYear: 1923,
    language: "বাংলা",
    readBookSlug: "abol-tabol-sukumar-ray",
    featured: false,
    chapters: [
      { chapterNumber: 1, title: "১. বোম্বাগড়ের রাজা ও খিচুড়ি", duration: "০৬:২০", durationSeconds: 380, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" },
      { chapterNumber: 2, title: "২. কুমড়োপটাশ ও হুঁকোমুখো হ্যাংলা", duration: "০৭:৪০", durationSeconds: 460, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" }
    ]
  },
  {
    slug: "silent-river-bend-audiobook",
    title: "নিঃশব্দ নদীর বাঁক (আধুনিক মুক্ত কথিকা)",
    titleEn: "Silent River Bend",
    author: "মুক্ত সাহিত্য বৃত্ত (Open Creative Authors)",
    narrator: "তানজিনা রহমান",
    duration: "২৪ মিনিট",
    durationSeconds: 1440,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    description: "আধুনিক বাংলা গদ্যের এক শান্ত আত্মমগ্ন আখ্যান। গ্রামবাংলার নদীর রূপান্তর, মানুষের নিঃসঙ্গতা ও আশার আলো নিয়ে সমকালীন উন্মুক্ত রচনা।",
    category: "আধুনিক উন্মুক্ত সাহিত্য",
    categorySlug: "modern",
    copyrightType: "open-license",
    publishedYear: 2024,
    language: "বাংলা",
    featured: true,
    recentlyAdded: true,
    chapters: [
      { chapterNumber: 1, title: "অধ্যায় ১: কুয়াশাঢাকা চরের জীবন", duration: "০৮:০০", durationSeconds: 480, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" },
      { chapterNumber: 2, title: "অধ্যায় ২: পুরোনো ডাকঘরের স্মৃতি", duration: "০৮:১৫", durationSeconds: 495, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" }
    ]
  },
  {
    slug: "meghmallar-audiobook",
    title: "মেঘমল্লার",
    titleEn: "Meghmallar",
    author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    narrator: "সৌমেন চক্রবর্তী",
    duration: "৪০ মিনিট",
    durationSeconds: 2400,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop",
    description: "প্রাচীন ভারতের সংগীতসাধনা, বর্ষার মেঘমল্লার রাগ ও অলৌকিক প্রেমভাবনার এক অপার্থিব রূপকথাধর্মী সাহিত্যসৃষ্টি।",
    category: "ধ্রুপদী আখ্যান",
    categorySlug: "classics",
    copyrightType: "public-domain",
    publishedYear: 1931,
    language: "বাংলা",
    featured: false,
    chapters: [
      { chapterNumber: 1, title: "প্রথম পর্ব: বিদিশার তীরে সংগীত সাধনা", duration: "১৩:০০", durationSeconds: 780, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" },
      { chapterNumber: 2, title: "দ্বিতীয় পর্ব: মেঘমল্লারের স্বরলিপি ও পরীক্ষা", duration: "১৪:৩০", durationSeconds: 870, audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3" }
    ]
  }
];

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // 1. Genres
  console.log("Seeding Genres...");
  for (const g of GENRES) {
    await Genre.findOneAndUpdate(
      { slug: g.slug },
      { name: g.name, description: g.description, order: parseInt(g.id, 10) || 0 },
      { upsert: true }
    );
  }

  // 2. Categories
  console.log("Seeding Categories...");
  for (const c of CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: c.slug },
      { name: c.name, description: c.description },
      { upsert: true }
    );
  }

  // 3. Books
  console.log("Seeding Books...");
  for (const b of BOOKS) {
    await Book.findOneAndUpdate({ slug: b.slug }, b, { upsert: true });
  }

  // 4. Audiobooks
  console.log("Seeding Audiobooks...");
  for (const a of AUDIOBOOKS) {
    await Audiobook.findOneAndUpdate({ slug: a.slug }, a, { upsert: true });
  }

  // 5. Users
  console.log("Seeding Admin & Demo User accounts...");
  const adminPasswordHash = await bcrypt.hash("admin123456", 10);
  await User.findOneAndUpdate(
    { email: "admin@puthipix.com" },
    {
      name: "পুঁথিপিক্স অ্যাডমিন",
      email: "admin@puthipix.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      status: "active",
    },
    { upsert: true }
  );

  const readerPasswordHash = await bcrypt.hash("reader123456", 10);
  await User.findOneAndUpdate(
    { email: "reader@puthipix.com" },
    {
      name: "আহমেদ জাহিদ",
      email: "reader@puthipix.com",
      passwordHash: readerPasswordHash,
      role: "user",
      status: "active",
    },
    { upsert: true }
  );

  const totalBooks = await Book.countDocuments();
  const totalAudiobooks = await Audiobook.countDocuments();
  const totalGenres = await Genre.countDocuments();
  const totalCategories = await Category.countDocuments();
  const totalUsers = await User.countDocuments();

  console.log("\n=================================");
  console.log(" DATABASE SEEDING COMPLETED!");
  console.log("=================================");
  console.log(`- Total Books:       ${totalBooks}`);
  console.log(`- Total Audiobooks:  ${totalAudiobooks}`);
  console.log(`- Total Genres:      ${totalGenres}`);
  console.log(`- Total Categories:  ${totalCategories}`);
  console.log(`- Total Users:       ${totalUsers}`);
  console.log("\nDefault Logins:");
  console.log("  Admin:  admin@puthipix.com  / admin123456");
  console.log("  Reader: reader@puthipix.com / reader123456");

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

