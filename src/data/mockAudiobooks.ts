import { Audiobook } from "@/types/audiobook";

export const AUDIO_CATEGORIES = [
  { id: "all", name: "সকল শ্রুতিপাঠ", slug: "all", count: 6 },
  { id: "stories", name: "ছোটগল্প ও কথাসাহিত্য", slug: "stories", count: 2 },
  { id: "poetry", name: "কবিতা ও আবৃত্তি", slug: "poetry", count: 1 },
  { id: "children", name: "কিশোর ও কৌতুক সাহিত্য", slug: "children", count: 1 },
  { id: "modern", name: "আধুনিক উন্মুক্ত সাহিত্য", slug: "modern", count: 1 },
  { id: "classics", name: "ধ্রুপদী আখ্যান", slug: "classics", count: 1 },
];

export const MOCK_AUDIOBOOKS: Audiobook[] = [
  {
    id: "ab-01",
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
      "আমার পাঁচ বছর বয়সের ছোট মেয়ে মিনি এক দণ্ড কথা না কহিয়া থাকিতে পারে না। পৃথিবীতে জন্মগ্রহণ করিয়া ভাষা শিক্ষা করিতে সে কেবল একটি বৎসর কাল ব্যয় করিয়াছিল, তাহার পর হইতে যতক্ষণ সে জাগিয়া থাকে এক মুহূর্তও মৌনভাবে কাটায় না।",
      "একদিন সকালে আমার ঘরের জানালার ধারে বসিয়া কাবুলিওয়ালা রহমতের সঙ্গে তাহার প্রথম পরিচয় হইয়াছিল।"
    ],
    transcript: `আমার পাঁচ বছর বয়সের ছোট মেয়ে মিনি এক দণ্ড কথা না কহিয়া থাকিতে পারে না। পৃথিবীতে জন্মগ্রহণ করিয়া ভাষা শিক্ষা করিতে সে কেবল একটি বৎসর কাল ব্যয় করিয়াছিল, তাহার পর হইতে যতক্ষণ সে জাগিয়া থাকে এক মুহূর্তও মৌনভাবে কাটায় না।

একদিন সকালবেলায় আমার ঘরের জানালার কাছে বসিয়া লিখিতেছি, এমন সময় মিনি আসিয়া বলিল, “বাবা, রামদয়াল দরোয়ান কাকাকে কাওয়া বলছিল, সে কিছু জানে না। না?”

আমি তাহাকে জগতের বিচিত্র বিষয়ের পার্থক্য বুঝাইয়া দেওয়ার পূর্বেই সে অন্য কথা পাড়িয়া বসিল— “বাবা, ভোলা বলছিল আকাশে মেঘে হাতি শুঁড় দিয়ে জল ঢালে, তাই বৃষ্টি হয়। আচ্ছা বাবা, ভোলা কেমন মিথ্যা কথা বলে!”

এমন সময় হঠাৎ কাবুলিওয়ালা রহমতের ডাক শোনা গেল— “কাবুলিওয়ালা, ও কাবুলিওয়ালা!” ময়লা ঢিলেঢালা জামা, মাথায় পাগড়ি, পিঠে ঝুলানো ঝোলা আর হাতে আঙুরের পেটি। মিনি জানলা দিয়া তাকে দেখিতে পাইয়াই ভয়ে মায়ের কাছে পলাইল। সে ভাবিত রহমতের ওই ঝোলার ভেতর তারই মত দু-তিনটে জ্যান্ত বাচ্চা লুকানো আছে...`,
    category: "ছোটগল্প ও কথাসাহিত্য",
    categorySlug: "stories",
    copyrightType: "public-domain",
    copyrightNote: "রবীন্দ্রনাথ ঠাকুরের মূল সাহিত্যকর্ম পাবলিক ডোমেইন। বাচিক পাঠটি পুঁথিপিক্সের উন্মুক্ত ডিজিটাল লাইব্রেরির জন্য ধারণকৃত।",
    publishedYear: 1892,
    language: "বাংলা",
    readBookSlug: "gora-rabindranath-tagore",
    featured: true,
    recentlyAdded: true,
    chapters: [
      {
        id: "c-01",
        chapterNumber: 1,
        title: "প্রথম পর্ব: মিনির বাল্যচপলতা ও কাবুলিওয়ালার আগমন",
        duration: "০৭:১৫",
        durationSeconds: 435,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
        narrator: "সামিউল ইসলাম পুলক",
      },
      {
        id: "c-02",
        chapterNumber: 2,
        title: "দ্বিতীয় পর্ব: বাদাম-কিশমিশ ও অসম বন্ধুত্ব",
        duration: "০৬:৪৫",
        durationSeconds: 405,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
        narrator: "সামিউল ইসলাম পুলক",
      },
      {
        id: "c-03",
        chapterNumber: 3,
        title: "তৃতীয় পর্ব: আকস্মিক সংঘাত ও দীর্ঘ কারাবাস",
        duration: "০৬:২০",
        durationSeconds: 380,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
        narrator: "সামিউল ইসলাম পুলক",
      },
      {
        id: "c-04",
        chapterNumber: 4,
        title: "চতুর্থ পর্ব: বিয়ের সানাই ও পিতার অশ্রু",
        duration: "০৭:৪০",
        durationSeconds: 460,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
        narrator: "সামিউল ইসলাম পুলক",
      },
    ],
  },
  {
    id: "ab-02",
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
    description: "বাংলার সামন্তবাদী শাসনব্যবস্থায় এক দরিদ্র কৃষক গফুর এবং তার প্রিয় পোষা বলদ মহেশের মর্মস্পর্শী নিবিড় বন্ধন ও করুণ পরিণতির সমাজচিত্র।",
    synopsis: [
      "গ্রামের নাম কাশিপুর। ছোট গ্রাম, কিন্তু জমিদারটি বড়ই কঠিন। মাঠের পর মাঠ ফাটিয়া চৌচির হইয়া গিয়াছে, কোথাও এক ফোঁটা জল নাই।",
      "সেই গ্রীষ্মের খররোদে নিজের অন্ন না জোটা সত্ত্বেও মহেশকে বাঁচাইয়া রাখিতে গফুরের আকুল সংগ্রামের গল্প।"
    ],
    transcript: `কাশিপুর গ্রামের প্রান্তে ভাঙা খড়ের চালার নীচে বসিয়া ছিল গফুর। অনাবৃষ্টির চোটে মাঠের ধান নষ্ট হইয়া গিয়াছে, ঘরে এক ছটাক চাল নাই। দশ বছরের মাতৃহীন মেয়ে আমিনা জল আনিবার জন্য কলসি কাঁখে পুকুরের দিকে গিয়াছে।

উঠোনের এক কোণে বাঁধা বলদ মহেশ। চামড়ার নীচে হাড়ের খাঁচা স্পষ্ট দেখা যাইতেছে। গফুর কাছে আসিয়া মহেশের পিঠে হাত বুলাইয়া বলিল, “মহেশ রে, তোকে আজ একটু বিচুলির খড়ও দিতে পারলুম না বাপ। জমিদার তর্করত্ন মশাই খড় দিলেন না, মারধর করে তাড়িয়ে দিলেন।”

মহেশ যেন চোখের জলে মালিকের যন্ত্রণা বুঝিতে পারিল। তাহার বড় বড় শান্ত চোখ দুটিতে অবলা জীবের নির্বাক আকুতি ঝরিয়া পড়িল...`,
    category: "ছোটগল্প ও কথাসাহিত্য",
    categorySlug: "stories",
    copyrightType: "public-domain",
    copyrightNote: "শরৎচন্দ্র চট্টোপাধ্যায়ের মূল রচনা পাবলিক ডোমেইনের আওতাভুক্ত। কণ্ঠস্বরের উন্মুক্ত পরিবেশনা।",
    publishedYear: 1926,
    language: "বাংলা",
    readBookSlug: "srikanta-sarat-chandra-chattopadhyay",
    featured: true,
    recentlyAdded: true,
    chapters: [
      {
        id: "m-01",
        chapterNumber: 1,
        title: "পর্ব ১: খরাক্লিষ্ট কাশিপুর ও গফুরের কুটির",
        duration: "১১:০০",
        durationSeconds: 660,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "m-02",
        chapterNumber: 2,
        title: "পর্ব ২: তর্করত্নের রোষ ও মহেশের ক্ষুধার্ত কান্না",
        duration: "১২:১৫",
        durationSeconds: 735,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "m-03",
        chapterNumber: 3,
        title: "পর্ব ৩: চরম বিচ্ছেদ ও ফুলবেড়ের চটকলের পথ",
        duration: "১১:৪৫",
        durationSeconds: 705,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
    ],
  },
  {
    id: "ab-03",
    slug: "banalata-sen-audiobook",
    title: "বনলতা সেন ও নির্বাচিত কবিতা",
    titleEn: "Banalata Sen & Poems",
    author: "জীবনানন্দ দাশ",
    narrator: "অনির্বাণ সেনগুপ্ত",
    narratorBio: "ধ্রুপদী সাহিত্যের আবৃত্তিকার ও গবেষক।",
    duration: "১৮ মিনিট",
    durationSeconds: 1080,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
    description: "হাজার বছরের ক্লান্তি, অন্ধকার এবং নাটোরের বনলতা সেনের পাখির নীড়ের মতো চোখ। জীবনানন্দের অতীন্দ্রিয় কবিতার শান্ত আবৃত্তিমালা।",
    synopsis: [
      "হাজার বছর ধরে আমি পথ হাঁটিতেছি পৃথিবীর পথে,",
      "সিংহল সমুদ্র থেকে নিশীথের অন্ধকারে মালয় সাগরে অনেক ঘুরিয়াছি আমি;",
      "বিম্বিসার অশোকের ধূসর জগতে সেখানে ছিলাম আমি; আরও দূর অন্ধকারে বিদর্ভ নগরে..."
    ],
    transcript: `হাজার বছর ধরে আমি পথ হাঁটিতেছি পৃথিবীর পথে,
সিংহল সমুদ্র থেকে নিশীথের অন্ধকারে মালয় সাগরে
অনেক ঘুরিয়াছি আমি; বিম্বিসার অশোকের ধূসর জগতে
সেখানে ছিলাম আমি; আরো দূর অন্ধকারে বিদর্ভ নগরে;
আমি ক্লান্ত প্রাণ এক, চারিদিকে জীবনের সমুদ্র সফেন,
আমারে দু-দণ্ড শান্তি দিয়েছিল নাটোরের বনলতা সেন।

চুল তার কবেকার অন্ধকার বিদিশার নিশা,
মুখ তার শ্রাবস্তীর কারুকার্য; অতিদূর সমুদ্রের ’পর
হাল ভেঙে যে-নাবিক হারায়েছে দিশা
সবুজ ঘাসের দেশ যখন সে চোখে দেখে দারুচিনি-দ্বীপের ভিতর,
তেমনি দেখেছি তারে অন্ধকারে; বলেছে সে, ‘এতদিন কোথায় ছিলেন?’
পাখির নীড়ের মত চোখ তুলে নাটোরের বনলতা সেন।`,
    category: "কবিতা ও আবৃত্তি",
    categorySlug: "poetry",
    copyrightType: "public-domain",
    copyrightNote: "জীবনানন্দ দাশের কালজয়ী কবিতা সংগ্রহ। পাবলিক ডোমেইন ঐতিহ্য।",
    publishedYear: 1942,
    language: "বাংলা",
    readBookSlug: "banalata-sen-jibanananda-das",
    featured: true,
    chapters: [
      {
        id: "b-01",
        chapterNumber: 1,
        title: "কবিতা ১: বনলতা সেন",
        duration: "০৪:৩০",
        durationSeconds: 270,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "b-02",
        chapterNumber: 2,
        title: "কবিতা ২: আবার আসিব ফিরে",
        duration: "০৪:১৫",
        durationSeconds: 255,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "b-03",
        chapterNumber: 3,
        title: "কবিতা ৩: কুড়ি বছর পরে ও রূপসী বাংলা",
        duration: "০৯:১৫",
        durationSeconds: 555,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
    ],
  },
  {
    id: "ab-04",
    slug: "abol-tabol-audiobook",
    title: "বোম্বাগড়ের রাজা ও আবোল তাবোল",
    titleEn: "Abol Tabol",
    author: "সুকুমার রায়",
    narrator: "শামীম রেজা ও দল",
    narratorBio: "শিশু-কিশোর নাট্য প্রশিক্ষক ও কণ্ঠশিল্পী।",
    duration: "২২ মিনিট",
    durationSeconds: 1320,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
    description: "ননসেন্স রাইম ও কৌতুকরসের অনন্য শিখর। বোম্বাগড়ের রাজা, কুমড়োপটাশ এবং কাঠবুড়োর জীবন্ত শ্রুতিরঙ্গ।",
    synopsis: [
      "কেউ কি জানে বোম্বাগড়ের রাজার পিসির কথা?",
      "কিংবা হুঁকোমুখো হ্যাংলার গম্ভীর মুখের রহস্য? শিশুদের আনন্দলোকের কালজয়ী শব্দচিত্র।"
    ],
    transcript: `রাজার খুড়ো নাচেন কেন ঝুলিয়ে দিয়ে পা?
রানী কেন মাথায় বাঁধেন বালিশ কিংবা ছা?
পণ্ডিতেরা ডাক ছেড়ে কন “বোম্বাগড়ের রাজা,
আমের আঁটি ভাজিয়ে খান, মুচমুচে খাস্তা খাজা!”`,
    category: "কিশোর ও কৌতুক সাহিত্য",
    categorySlug: "children",
    copyrightType: "public-domain",
    copyrightNote: "সুকুমার রায়ের সমগ্র সাহিত্যকর্ম মুক্ত বিশ্ব ঐতিহ্যের অন্তর্গত।",
    publishedYear: 1923,
    language: "বাংলা",
    readBookSlug: "abol-tabol-sukumar-ray",
    featured: false,
    chapters: [
      {
        id: "at-01",
        chapterNumber: 1,
        title: "১. বোম্বাগড়ের রাজা ও খিচুড়ি",
        duration: "০৬:২০",
        durationSeconds: 380,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "at-02",
        chapterNumber: 2,
        title: "২. কুমড়োপটাশ ও হুঁকোমুখো হ্যাংলা",
        duration: "০৭:৪০",
        durationSeconds: 460,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "at-03",
        chapterNumber: 3,
        title: "৩. ট্যাঁশ গরু ও অবাক কাণ্ড",
        duration: "০৮:০০",
        durationSeconds: 480,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
    ],
  },
  {
    id: "ab-05",
    slug: "silent-river-bend-audiobook",
    title: "নিঃশব্দ নদীর বাঁক (আধুনিক মুক্ত কথিকা)",
    titleEn: "Silent River Bend",
    author: "মুক্ত সাহিত্য বৃত্ত (Open Creative Authors)",
    narrator: "তানজিনা রহমান",
    narratorBio: "স্বাধীন পডকাস্টার ও অডিও কনটেন্ট ক্রিয়েটর।",
    duration: "২৪ মিনিট",
    durationSeconds: 1440,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    description: "আধুনিক বাংলা গদ্যের এক শান্ত আত্মমগ্ন আখ্যান। গ্রামবাংলার নদীর রূপান্তর, মানুষের নিঃসঙ্গতা ও আশার আলো নিয়ে সমকালীন উন্মুক্ত রচনা।",
    synopsis: [
      "ভোরের কুয়াশায় ঢেকে থাকা চরের জীবনে আধুনিকতার ছোঁয়া এবং স্মৃতিমন্থন।",
      "ক্রিয়েটিভ কমন্স মুক্ত লাইসেন্সে রচিত সমকালীন কথাসাহিত্য।"
    ],
    transcript: `নদীটির কোনো অহংকার ছিল না। শীতের দিনে সে বড় শান্ত, যেন কোন গভীর ধ্যানমগ্ন সাধকের মত বালুচরের মাঝখান দিয়া নিঃশব্দে বহিয়া চলিয়াছে।

ঘাটে বাঁধা নৌকাগুলো কুয়াশার সাদা চাদরে আবৃত। দূরে এক বৃদ্ধ মাঝি বৈঠা হাতে ধীর পদক্ষেপে আসিতেছে। এই নদীর সঙ্গে তার পঞ্চাশ বছরের নিবিড় সখ্য...`,
    category: "আধুনিক উন্মুক্ত সাহিত্য",
    categorySlug: "modern",
    copyrightType: "open-license",
    copyrightNote: "ক্রিয়েটিভ কমন্স (CC BY-NC-SA 4.0) লাইসেন্সভুক্ত আধুনিক সাহিত্য। শিক্ষামূলক ও অলাভজনক উদ্দেশ্যে উন্মুক্ত।",
    publishedYear: 2024,
    language: "বাংলা",
    featured: true,
    recentlyAdded: true,
    chapters: [
      {
        id: "sr-01",
        chapterNumber: 1,
        title: "অধ্যায় ১: কুয়াশাঢাকা চরের জীবন",
        duration: "০৮:০০",
        durationSeconds: 480,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "sr-02",
        chapterNumber: 2,
        title: "অধ্যায় ২: পুরোনো ডাকঘরের স্মৃতি",
        duration: "০৮:১৫",
        durationSeconds: 495,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "sr-03",
        chapterNumber: 3,
        title: "অধ্যায় ৩: সন্ধ্যা নামার গান",
        duration: "০৭:৪৫",
        durationSeconds: 465,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
    ],
  },
  {
    id: "ab-06",
    slug: "meghmallar-audiobook",
    title: "মেঘমল্লার",
    titleEn: "Meghmallar",
    author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    narrator: "সৌমেন চক্রবর্তী",
    narratorBio: "ঐতিহাসিক কথন ও সুরশ্রুতির প্রবীণ বাচিক শিল্পী।",
    duration: "৪০ মিনিট",
    durationSeconds: 2400,
    audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
    coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop",
    description: "প্রাচীন ভারতের সংগীতসাধনা, বর্ষার মেঘমল্লার রাগ ও অলৌকিক প্রেমভাবনার এক অপার্থিব রূপকথাধর্মী সাহিত্যসৃষ্টি।",
    synopsis: [
      "উজ্জয়িনী নগরীর সংগীতবিদ প্রদ্যুম্নের মেঘমল্লার রাগ সিদ্ধ করার অবর্ণনীয় ব্যাকুলতা।",
      "যে রাগ গাইলে অনাবৃষ্টির দেশে মেঘ নামে, নদী উথলে ওঠে—সেই রাগের করুণ অন্তর্দাহ।"
    ],
    transcript: `সে এক প্রাচীনকালের কথা। বিদিশা নদীর তীরে ঋষি শৌনকের আশ্রমে তখন বর্ষার আগমন ঘটিয়াছে। চারিদিকে মেঘমেদুর আকাশ, শ্যামল বনের পল্লবে বৃষ্টির ধারা ঝরিয়া পড়িতেছে।

তরুণ সাধক প্রদ্যুম্ন তানপুরাটি কোলে লইয়া স্তব্ধ হইয়া বসিয়াছিল। তাহার গুরু বলিয়াছিলেন, “বৎস, মেঘমল্লার রাগের সম্পূর্ণ সিদ্ধি লাভ না হইলে সংগীতের পরমরহস্য উন্মোচিত হইবে না...”`,
    category: "ধ্রুপদী আখ্যান",
    categorySlug: "classics",
    copyrightType: "public-domain",
    copyrightNote: "বিভূতিভূষণ বন্দ্যোপাধ্যায়ের ধ্রুপদী সাহিত্যকর্ম। উন্মুক্ত মহাফেজখানা সংরক্ষণ।",
    publishedYear: 1931,
    language: "বাংলা",
    featured: false,
    chapters: [
      {
        id: "mm-01",
        chapterNumber: 1,
        title: "প্রথম পর্ব: বিদিশার তীরে সংগীত সাধনা",
        duration: "১৩:০০",
        durationSeconds: 780,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "mm-02",
        chapterNumber: 2,
        title: "দ্বিতীয় পর্ব: মেঘমল্লারের স্বরলিপি ও পরীক্ষা",
        duration: "১৪:৩০",
        durationSeconds: 870,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
      {
        id: "mm-03",
        chapterNumber: 3,
        title: "তৃতীয় পর্ব: অলৌকিক বর্ষা ও আত্মোৎসর্গ",
        duration: "১২:৩০",
        durationSeconds: 750,
        audioUrl: "https://ia800204.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3",
      },
    ],
  },
];

