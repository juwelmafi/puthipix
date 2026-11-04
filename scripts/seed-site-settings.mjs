import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

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

const DIRECT_ATLAS_URI =
  "mongodb://puthipix_user:Fe5EdTxyN511Ml7N@ac-96hlkqd-shard-00-00.1nozz7u.mongodb.net:27017,ac-96hlkqd-shard-00-01.1nozz7u.mongodb.net:27017,ac-96hlkqd-shard-00-02.1nozz7u.mongodb.net:27017/puthipix?ssl=true&replicaSet=atlas-sgcr0x-shard-0&authSource=admin&retryWrites=true&w=majority";

const uri = process.env.MONGODB_URI || DIRECT_ATLAS_URI;

// Default site content object
const defaultContent = {
  seo: {
    siteTitle: "Puthipix (পুঁথিপিক্স) — ডিজিটাল লাইব্রেরি ও বুক রিডিং প্ল্যাটফর্ম",
    siteDescription: "একটি minimalist, editorial-style digital library যেখানে পাঠকরা বিনামূল্যে বই পড়তে পারবে এবং প্রিমিয়াম বই সংগ্রহ করতে পারবে।",
    keywords: "digital library, bengali books, puthipix, পুঁথিপিক্স, বই পড়া, অনলাইন লাইব্রেরি, বাংলা সাহিত্য, অডিওবুক",
    siteLogo: "/logo.png",
    faviconUrl: "/favicon.ico",
    ogImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200",
    pages: {
      home: {
        title: "Puthipix — বাংলা সাহিত্য ও জ্ঞানকোষ",
        description: "বিনামূল্যে শত শত বাংলা সাহিত্যগ্রন্থ ও ক্লাসিক বই অনলাইনে পড়ুন বা সংরক্ষণ করুন।"
      },
      library: {
        title: "গ্রন্থ মহাফেজখানা — পুথিপিক্স ডিজিটাল লাইব্রেরি",
        description: "উপন্যাস, গল্প, প্রবন্ধ, ইতিহাস ও কাব্যগ্রন্থের সুবিন্যস্ত সংগ্রহশালা।"
      },
      audiobooks: {
        title: "শ্রুতিপাঠ ও অডিওবুক — পুথিপিক্স",
        description: "ক্লান্ত চোখে বিশ্রাম দিন, মার্জিত কণ্ঠের কথামালায় শুনুন প্রিয় সব গল্প ও আখ্যান।"
      },
      amarPuthi: {
        title: "আমার পুঁথি — উন্মুক্ত পাঠক আড্ডা ও সাহিত্য সমাজ",
        description: "পাঠকদের নিজস্ব সাহিত্য ভাবনা, স্বরচিত লেখা, বই পর্যালোচনা এবং সাহিত্যিক আড্ডা।"
      },
      about: {
        title: "আমাদের কথা ও ইশতেহার — পুথিপিক্স",
        description: "বাংলা সাহিত্যের ঐতিহ্য সংরক্ষণ ও জ্ঞানকে সর্বজনীন করার ডিজিটাল অঙ্গীকার।"
      }
    }
  },
  header: {
    topBarLocation: "কলকাতা • ঢাকা • লন্ডন",
    topBarVolume: "খণ্ড: ৩য় • সংখ্যা: ২৪",
    topBarArchiveText: "ডিজিটাল মহাফেজখানা • সর্বস্বত্ব মুক্ত সংস্করণ",
    topBarBadge: "বিনামূল্যে পাঠোপযোগী",
    brandNameBn: "পুঁথিপিক্স",
    brandTagline: "ঐতিহ্য ও আধুনিকতার মেলবন্ধনে ডিজিটাল গ্রন্থশালা",
    mastheadQuote: "‘গ্রন্থগত বিদ্যা আর পরহস্তে ধন — নহে বিদ্যা নহে ধন হলে প্রয়োজন’ — জ্ঞান হোক মুক্ত ও সুলভ",
    announcementEnabled: true,
    announcementText: "✨ ‘আমার পুঁথি’ সাহিত্য আড্ডা উন্মুক্ত করা হয়েছে! আপনার সাহিত্য ভাবনা বা বই পর্যালোচনা লিখুন।",
    announcementLink: "/amar-puthi"
  },
  hero: {
    eyebrow: "ডিজিটাল বাংলা সাহিত্যের সংরক্ষণাগার",
    headline: "শব্দের ভাঁজে সংরক্ষিত ঐতিহ্য, আধুনিক পাঠকের জন্য উন্মুক্ত মহাফেজখানা",
    subtext: "উপন্যাস, কবিতা, প্রবন্ধ থেকে শ্রুতিপাঠ — এক শতাব্দী প্রাচীন ক্লাসিক সাহিত্য থেকে সমকালীন জ্ঞানভাবনা। বিজ্ঞাপনহীন, নিখাদ পাঠের এক নীরব নিভৃত নিকেতন।",
    primaryCtaText: "মহাফেজখানা উন্মোচন করুন",
    primaryCtaLink: "/library",
    secondaryCtaText: "আমার পুঁথি আড্ডা",
    secondaryCtaLink: "/amar-puthi",
    pillars: [
      {
        number: "০১",
        title: "শতভাগ বিজ্ঞাপনমুক্ত পাঠাভিজ্ঞতা",
        description: "চোখের আরামদায়ক প্রাচীন কাগজের রঙ এবং পরিচ্ছন্ন ব্রডশিট নকশায় অবিরত পাঠের প্রশান্তি।"
      },
      {
        number: "০২",
        title: "উন্নত ডিজিটাল রিডার ও শ্রুতিপাঠ",
        description: "পিডিএফ রিডার, ফন্ট পরিবর্তন, বুকমার্ক এবং উচ্চমানের স্টুডিও কণ্ঠের শ্রুতিপাঠ সংবলিত।"
      },
      {
        number: "০৩",
        title: "উন্মুক্ত সাহিত্য সমাজ ‘আমার পুঁথি’",
        description: "পাঠকের নিজস্ব বই পর্যালোচনা, সাহিত্য ভাবনা প্রকাশ, মন্তব্য ও সাহিত্যপ্রেমীদের পারস্পরিক মেলবন্ধন।"
      }
    ]
  },
  sections: {
    featuredBooksEyebrow: "বিশেষ নির্বাচন",
    featuredBooksTitle: "সম্পাদকীয় বাছাই ও কালোত্তীর্ণ পাঠ",
    featuredBooksSubtitle: "যেসব সাহিত্যগ্রন্থ কালের সীমানা পেরিয়ে আজও মানবমনকে আলোড়িত করে।",
    audiobooksEyebrow: "শ্রুতিসুধা",
    audiobooksTitle: "কর্ণকুহরে ধ্বনিত সাহিত্যের সুর",
    audiobooksSubtitle: "ক্লান্ত চোখে বিশ্রাম দিন, মার্জিত কণ্ঠের কথামালায় শুনুন প্রিয় সব গল্প ও আখ্যান।",
    genresEyebrow: "শ্রেণিবিভাগ",
    genresTitle: "বিষয়ভিত্তিক সাহিত্য সম্ভার",
    communityEyebrow: "উন্মুক্ত পাঠক আড্ডা",
    communityTitle: "‘আমার পুঁথি’ — পাঠকদের নিজস্ব সাহিত্যচর্চা",
    communitySubtitle: "পাঠকদের লেখা পর্যালোচনা, বইয়ের অনুভূতি ও সাহিত্যিক মতামতের উন্মুক্ত প্রাঙ্গণ।"
  },
  footer: {
    aboutText: "পুঁথিপিক্স একটি অলাভজনক সাহিত্য ও জ্ঞানভিত্তিক ডিজিটাল উদ্যোগ। বাংলা সাহিত্যের সমৃদ্ধ ভাণ্ডারকে প্রযুক্তির সহায়তায় চিরস্থায়ী রূপ দেওয়া এবং বিশ্বব্যাপী বাংলাভাষী পাঠকদের কাছে সুলভ করাই এর ব্রত।",
    copyrightText: "© ২০২৬ পুঁথিপিক্স ডিজিটাল মহাফেজখানা। সর্বস্বত্ব সংরক্ষিত।",
    newsletterTitle: "সাহিত্য সংবাদ ও নতুন প্রকাশনা",
    newsletterSubtitle: "প্রতি শুক্রবারে নতুন সংযোজিত বই ও সাহিত্য পর্যালোচনার সারসংক্ষেপ পান সরাসরি আপনার ইনবক্সে।",
    newsletterButton: "সাবস্ক্রাইব করুন"
  },
  about: {
    title: "পুথিপিক্স-এর ইশতেহার ও পথচলা",
    tagline: "কাগজের গন্ধ হয়তো স্ক্রিনে পাওয়া যায় না, কিন্তু অক্ষরের আত্মাকে জীবন্ত রাখার দায় আমাদের সকলের।",
    storyHeading: "যেভাবে শুরু হলো এই মহাফেজখানা",
    storyParagraphs: [
      "ধুলো জমা প্রাচীন বইয়ের পাতার পরতে পরতে লুকিয়ে থাকে আমাদের শতবর্ষের ইতিহাস, অনুভূতি আর বুদ্ধিবৃত্তিক অর্জন। সময়ের স্রোতে অনেক মূল্যবান পাণ্ডুলিপি ও ক্লাসিক সাহিত্য আজ বিলুপ্তপ্রায়। আধুনিক ইন্টারনেটের ক্লিকবেইট আর কোলাহলের ভিড়ে গভীর মনোনিবেশে বই পড়ার পরিবেশ ক্রমশ বিরল হয়ে উঠেছে।",
      "এই ভাবনা থেকেই ২০২৬ সালে জন্ম নেয় ‘পুঁথিপিক্স’। আমাদের লক্ষ্য কেবল বই পিডিএফ আকারে রাখা নয়; বরং একটি ঐতিহ্যমণ্ডিত ব্রডশিট নিউজপ্রিন্ট নান্দনিকতায় বই পড়া এবং পাঠকদের একত্র করে সাহিত্যিক সমাজ গড়ে তোলার এক সার্বিক প্ল্যাটফর্ম নির্মাণ করা।"
    ],
    missionHeading: "আমাদের মূল মূল্যবোধ",
    missions: [
      {
        title: "বিনামূল্যে জ্ঞান বিতরণের অঙ্গীকার",
        desc: "জ্ঞান বা সাহিত্য কোনো বিশেষ শ্রেণির সম্পত্তি নয়। সর্বস্তরের পাঠকের জন্য সাহিত্যের দ্বার অবারিত।"
      },
      {
        title: "নকশায় সাহিত্যের ক্লাসিক সৌন্দর্য",
        desc: "আধুনিক ফ্ল্যাট ডিজাইনের বিপরীতে খাঁটি উনিশ শতকী বাংলা সংবাদপত্রের মার্জিত নকশায় তৈরি।"
      },
      {
        title: "পাঠক ও লেখকের মেলবন্ধন",
        desc: "‘আমার পুঁথি’ প্ল্যাটফর্মের মাধ্যমে প্রতিটি পাঠকই একজন সমালোচক ও সাহিত্যিক হিসেবে আত্মপ্রকাশ করেন।"
      }
    ]
  }
};

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log("Connected to MongoDB!");

  const schema = new mongoose.Schema(
    { key: String, content: mongoose.Schema.Types.Mixed },
    { timestamps: true }
  );
  const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", schema);

  const res = await SiteSettings.findOneAndUpdate(
    { key: "global_site_settings" },
    { $set: { content: defaultContent } },
    { upsert: true, returnDocument: "after" }
  );

  console.log("✅ SiteSettings seeded successfully in MongoDB Atlas! Document ID:", res._id);
  console.log("Title in DB:", res.content.seo.siteTitle);
  await mongoose.disconnect();
}

main().catch(console.error);

