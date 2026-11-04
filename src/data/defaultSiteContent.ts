export interface SiteContent {
  // Brand & General SEO
  seo: {
    siteTitle: string;
    siteDescription: string;
    keywords: string;
    siteLogo: string;
    faviconUrl: string;
    ogImage: string;
    pages: {
      home: { title: string; description: string };
      library: { title: string; description: string };
      audiobooks: { title: string; description: string };
      amarPuthi: { title: string; description: string };
      about: { title: string; description: string };
    };
  };

  // Header & Masthead
  header: {
    topBarLocation: string;
    topBarVolume: string;
    topBarArchiveText: string;
    topBarBadge: string;
    brandNameBn: string;
    brandTagline: string;
    mastheadQuote: string;
    announcementEnabled: boolean;
    announcementText: string;
    announcementLink?: string;
  };

  // Homepage Hero
  hero: {
    eyebrow: string;
    headline: string;
    subtext: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    pillars: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };

  // Homepage Shelves & Sections
  sections: {
    featuredBooks: {
      eyebrow: string;
      heading: string;
      linkText: string;
    };
    genres: {
      eyebrow: string;
      heading: string;
    };
    audiobooks: {
      eyebrow: string;
      heading: string;
      linkText: string;
    };
    recentBooks: {
      eyebrow: string;
      heading: string;
      linkText: string;
    };
    editorialQuote: {
      quote: string;
      author: string;
    };
  };

  // Footer Content
  footer: {
    brandTitle: string;
    aboutText: string;
    tagline: string;
    copyrightText: string;
    bottomNote: string;
  };

  // About / Manifesto Page
  about: {
    eyebrow: string;
    headline: string;
    quote: string;
    p1: string;
    p2: string;
    quoteCallout: string;
    quoteAttribution: string;
    copyrightHeading: string;
    copyrightText: string;
    audiobookHeading: string;
    audiobookText: string;
    noDownloadHeading: string;
    noDownloadText: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  seo: {
    siteTitle: "Puthipix (পুঁথিপিক্স) — ডিজিটাল লাইব্রেরি ও বুক রিডিং প্ল্যাটফর্ম",
    siteDescription: "একটি minimalist, editorial-style digital library যেখানে পাঠকরা বিনামূল্যে বই পড়তে পারবে এবং প্রিমিয়াম বই সংগ্রহ করতে পারবে।",
    keywords: "digital library, bengali books, puthipix, পুঁথিপিক্স, বই পড়া, অনলাইন লাইব্রেরি, বাংলা সাহিত্য, অডিওবুক",
    siteLogo: "/logo.png",
    faviconUrl: "/favicon.ico",
    ogImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    pages: {
      home: {
        title: "পুঁথিপিক্স — বাংলা সাহিত্যের উন্মুক্ত ডিজিটাল মহাফেজখানা ও পাঠাগার",
        description: "রবীন্দ্রনাথ, শরৎচন্দ্র, বঙ্কিম, বেগম রোকেয়া সহ বাংলা সাহিত্যের কালজয়ী ধ্রুপদী সৃষ্টিকর্ম সম্পূর্ণ বিনামূল্যে অনলাইনে পাঠ করুন।",
      },
      library: {
        title: "লাইব্রেরি ও সংকলন সূচি — পুঁথিপিক্স",
        description: "উপন্যাস, ছোটগল্প, কবিতা, নাটক ও প্রবন্ধ সহ বাংলা সাহিত্যের সুবিশাল উন্মুক্ত ডিজিটাল আর্কাইভ।",
      },
      audiobooks: {
        title: "শ্রুতিপাঠ ও অডিওবুক মহাফেজখানা — পুঁথিপিক্স",
        description: "ধ্রুপদী ও মুক্ত স্বত্বাধিকারী বাংলা সাহিত্যের উচ্চমানের অডিওবুক ও নাট্যরূপ শুনুন সম্পূর্ণ বিনামূল্যে।",
      },
      amarPuthi: {
        title: "আমার পুঁথি — উন্মুক্ত পাঠক চত্বর ও সাহিত্য আড্ডা",
        description: "পাঠকদের স্বরচিত সাহিত্য ভাবনা, কবিতা, বই পর্যালোচনা ও গভীর অনুভূতির উন্মুক্ত সাহিত্য চত্বর।",
      },
      about: {
        title: "পুঁথিপিক্স মেনিফেস্টো — একটি শান্ত পাঠাগার ও মহাফেজখানা",
        description: "পুঁথিপিক্সের লক্ষ্য, পাবলিক ডোমেইন সংরক্ষণ দর্শন ও শান্ত নিভৃত পাঠাগার ভাবনার সম্পূর্ণ বিবরণ।",
      },
    },
  },

  header: {
    topBarLocation: "ঢাকা, বাংলাদেশ",
    topBarVolume: "ভলিউম ০১ / সংখ্যা ২০২৬",
    topBarArchiveText: "উন্মুক্ত মহাফেজখানা",
    topBarBadge: "শতভাগ বিনামূল্যে উন্মুক্ত পাঠ",
    brandNameBn: "পুঁথিপিক্স",
    brandTagline: "PUTHIPIX • OPEN LITERARY ARCHIVE & READING ROOM",
    mastheadQuote: "“জ্ঞান ও সাহিত্যের উন্মুক্ত বিস্তার, যেখানে পাঠক সরাসরি পর্দায় নিমগ্ন হয়ে পাঠ করতে পারেন।”",
    announcementEnabled: false,
    announcementText: "",
    announcementLink: "/amar-puthi",
  },

  hero: {
    eyebrow: "বাংলা সাহিত্যের উন্মুক্ত ডিজিটাল মহাফেজখানা",
    headline: "চিন্তাশীল পাঠকের জন্য এক নিভৃত পাঠাগার",
    subtext: "রবীন্দ্রনাথ, শরৎচন্দ্র, বঙ্কিম, বেগম রোকেয়া সহ বাংলা সাহিত্যের কালজয়ী ধ্রুপদী সৃষ্টিকর্মসমূহ কোনো পে-ওয়াল বা বিজ্ঞাপন ছাড়াই সম্পূর্ণ বিনামূল্যে সরাসরি ব্রাউজারে নিবিষ্ট হয়ে পাঠ করুন।",
    primaryCtaText: "সম্পূর্ণ মহাফেজখানা ব্রাউজ করুন",
    primaryCtaLink: "/library",
    secondaryCtaText: "আমাদের উদ্দেশ্য ও দর্শন",
    secondaryCtaLink: "/about",
    pillars: [
      {
        number: "০১ • শতভাগ উন্মুক্ত",
        title: "সকল বই বিনামূল্যে সবার জন্য পাঠযোগ্য",
        description: "সকল বই বিনামূল্যে সবার জন্য পাঠযোগ্য",
      },
      {
        number: "০২ • পাবলিক ডোমেইন",
        title: "কপিরাইট মুক্ত ধ্রুপদী সাহিত্যের সংগ্রহ",
        description: "কপিরাইট মুক্ত ধ্রুপদী সাহিত্যের সংগ্রহ",
      },
      {
        number: "০৩ • আধুনিক রিডার",
        title: "ফন্ট স্কেলিং ও পৃষ্ঠা চিহ্নিতকরণ সুবিধা",
        description: "ফন্ট স্কেলিং ও পৃষ্ঠা চিহ্নিতকরণ সুবিধা",
      },
      {
        number: "০৪ • ধ্রুপদী শ্রুতিপাঠ",
        title: "পেশাদার কণ্ঠে রেকর্ডেড অডিওবুক",
        description: "পেশাদার কণ্ঠে রেকর্ডেড অডিওবুক",
      },
    ],
  },

  sections: {
    featuredBooks: {
      eyebrow: "CURATED CLASSICS",
      heading: "কালজয়ী সাহিত্য সম্ভার",
      linkText: "সবগুলো দেখুন →",
    },
    genres: {
      eyebrow: "LITERARY CLASSIFICATION",
      heading: "সাহিত্যধারা অনুযায়ী অন্বেষণ",
    },
    audiobooks: {
      eyebrow: "AUDIOBOOK ARCHIVE • শ্রুতিপাঠ",
      heading: "নির্বাচিত শ্রুতিপাঠ ও অডিওবুক",
      linkText: "সকল শ্রুতিপাঠ শুনুন →",
    },
    recentBooks: {
      eyebrow: "RECENT DIGITIZATIONS",
      heading: "সদ্য ডিজিটাইজড গ্রন্থসমূহ",
      linkText: "লাইব্রেরিতে যান →",
    },
    editorialQuote: {
      quote: "একটি বই কেবল তথ্য নয়, এটি এক নির্জন কথোপকথন। পুঁথিপিক্সের উদ্দেশ্য পাঠককে স্ক্রিনের কৃত্রিম কোলাহল থেকে মুক্ত রেখে এক নিবিষ্ট পাঠের অভিজ্ঞতা দেওয়া।",
      author: "— পুঁথিপিক্স সম্পাদকীয় নীতিমালা",
    },
  },

  footer: {
    brandTitle: "পুঁথিপিক্স / Puthipix",
    aboutText: "বাংলা ভাষা ও সাহিত্যের ধ্রুপদী সৃষ্টিসমূহের এক উন্মুক্ত ও নিভৃত ডিজিটাল পাঠাগার। রবীন্দ্রনাথ, শরৎচন্দ্র, বঙ্কিম, রোকেয়া সহ কালজয়ী সাহিত্যিকদের লেখা কোনো বিজ্ঞাপন বা আর্থিক লেনদেন ছাড়াই সম্পূর্ণ বিনামূল্যে যে কেউ অনলাইনে পাঠ করতে পারেন।",
    tagline: "উন্মুক্ত মহাফেজখানা • শতভাগ বিনামূল্যে মুক্তপাঠ • পাবলিক ডোমেইন সংরক্ষণ",
    copyrightText: "© 2026 পুঁথিপিক্স। বাংলা সাহিত্যের উন্মুক্ত মহাফেজখানা।",
    bottomNote: "জ্ঞান ও সাহিত্যের সর্বজনীন প্রসারে নিবেদিত এক শান্ত পাঠাগার।",
  },

  about: {
    eyebrow: "পুঁথিপিক্স মেনিফেস্টো",
    headline: "একটি শান্ত পাঠাগার ও মহাফেজখানা",
    quote: "“জ্ঞান কেবল সংরক্ষণ করার বিষয় নয়, এটি নিভৃতে অনুধাবন ও উত্তরপ্রজন্মের মাঝে ছড়িয়ে দেওয়ার এক সাধনা।”",
    p1: "ইন্টারনেট যখন শুরু হয়েছিল, তখন এর মূল উদ্দেশ্য ছিল জ্ঞানের সার্বজনীন বিস্তার। কিন্তু সময়ের সাথে সাথে আমাদের ডিজিটাল জীবন বিজ্ঞাপনের কোলাহল, বিভ্রান্তিকর নোটিফিকেশন এবং বাণিজ্যিক স্বার্থে ভারাক্রান্ত হয়ে উঠেছে। বই পড়ার যে চিরায়ত প্রশান্তি—একটি নির্জন পাতার গভীর নিস্তব্ধতা, পরিপাটি মার্জিন এবং চিন্তার গভীর মনোযোগ—ডিজিটাল স্ক্রিনে তা ক্রমশ হারিয়ে যাচ্ছিল।",
    p2: "পুঁথিপিক্স (Puthipix) সেই হারানো প্রশান্তি ফিরিয়ে আনার একটি আন্তরিক প্রয়াস। এটি কোনো বাণিজ্যিক ই-কমার্স শপ নয়; এটি বাংলা ভাষা ও সাহিত্যের ধ্রুপদী সৃষ্টিসমূহের এক মুক্ত মহাফেজখানা। এখানে আমরা রবীন্দ্রনাথ ঠাকুর, শরৎচন্দ্র চট্টোপাধ্যায়, বঙ্কিমচন্দ্র চট্টোপাধ্যায়, বেগম রোকেয়া, জীবনানন্দ দাশ সহ বাংলা সাহিত্যের পথিকৃৎদের অমর রচনাগুলোকে ডিজিটাল মাধ্যমে সংরক্ষণ করছি।",
    quoteCallout: "“আমাদের লক্ষ্য এমন একটি পাঠপরিবেশ তৈরি করা যা পুরোনো সাহিত্য সাময়িকীর মতো শান্ত, রুচিশীল এবং পড়ার টেবিলে আসল বই খুলে বসার মতোই স্বাভাবিক ও নির্ভার।”",
    quoteAttribution: "— পুঁথিপিক্স নকশা ও শিল্প ভাবনা",
    copyrightHeading: "কপিরাইট ও পাবলিক ডোমেইন সংরক্ষণ",
    copyrightText: "পুঁথিপিক্স বৌদ্ধিক সম্পত্তি ও কপিরাইট আইনের প্রতি শ্রদ্ধাশীল। বাংলাদেশের কপিরাইট আইন, ২০২৩ অনুযায়ী লেখকের মৃত্যুর ৬০ বছর পর সাহিত্যকর্ম সাধারণ নিয়মে পাবলিক ডোমেইন (Public Domain)-এ উন্মুক্ত হয়।",
    audiobookHeading: "শ্রুতিপাঠ ও অডিওবুক সংরক্ষণ নীতি",
    audiobookText: "মুদ্রিত সাহিত্যের পাশাপাশি শ্রবণমনস্ক পাঠকদের জন্য পুঁথিপিক্সে সংযোজিত হয়েছে শ্রুতিপাঠ (Audiobooks)। ধ্রুপদী গল্প, উপন্যাস ও কবিতার বাচিক রূপায়ণ এখানে সংরক্ষিত হয়।",
    noDownloadHeading: "কেন সরাসরি ডাউনলোড লিংক নেই?",
    noDownloadText: "একটি সাধারণ প্রশ্ন হতে পারে: পুঁথিপিক্সে বই বা অডিওর কোনো ডাউনলোড বাটন রাখা হয়নি কেন? এর কারণ হলো—আমরা চাই পাঠক স্ক্রিনে ফাইল জমিয়ে ভুলে না গিয়ে সরাসরি একটি শান্ত পাঠাগারে পড়ার এবং শোনার অনুভূতি পান।",
  },
};
