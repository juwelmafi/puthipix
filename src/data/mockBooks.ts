import { Book, Genre, Category } from "@/types/book";

export const GENRES: Genre[] = [
  { id: "1", name: "উপন্যাস (Novels)", slug: "novels", count: 32, description: "বাংলা সাহিত্যের কালজয়ী ধ্রুপদী উপন্যাস" },
  { id: "2", name: "ছোটগল্প (Short Stories)", slug: "stories", count: 45, description: "জীবনের গভীর দর্শন ও সমাজচিত্রের আখ্যান" },
  { id: "3", name: "কবিতা ও পদাবলি (Poetry)", slug: "poetry", count: 28, description: "বাংলা কবিতার অনুপম ছন্দ ও ভাবসম্ভার" },
  { id: "4", name: "প্রবন্ধ ও দর্শন (Essays)", slug: "essays", count: 18, description: "সমাজ, সংস্কৃতি, নন্দনতত্ত্ব ও দার্শনিক ভাবনা" },
  { id: "5", name: "নাটক ও প্রহসন (Plays)", slug: "drama", count: 14, description: "মঞ্চসফল নাটক ও সমাজ সংস্কারের ইতিবৃত্ত" },
  { id: "6", name: "শিশু ও কিশোর সাহিত্য (Children)", slug: "children", count: 20, description: "হাস্যকৌতুক, কল্পবিজ্ঞান ও শিশুতোষ ক্লাসিক" },
];

export const CATEGORIES: Category[] = [
  { id: "c1", name: "রবীন্দ্র রচনাসম্ভার", slug: "rabindranath", description: "রবীন্দ্রনাথ ঠাকুরের কালজয়ী সাহিত্যকর্ম" },
  { id: "c2", name: "শরৎচন্দ্র সংগ্রহ", slug: "saratchandra", description: "শরৎচন্দ্র চট্টোপাধ্যায়ের হৃদয়স্পর্শী উপন্যাস ও গল্প" },
  { id: "c3", name: "বাংলার জাগরণ ও নারীচেতনা", slug: "renaissance", description: "উনিশ ও বিশ শতকের সমাজ রূপান্তরের আকরগ্রন্থ" },
  { id: "c4", name: "ধ্রুপদী কাব্য ও সাহিত্য", slug: "classics", description: "কালোত্তীর্ণ সাহিত্য সৃষ্টি" },
];

export const MOCK_BOOKS: Book[] = [
  {
    id: "bk-01",
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
    publicDomain: true,
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
    id: "bk-02",
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
    publicDomain: true,
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
    id: "bk-03",
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
    publicDomain: true,
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
    id: "bk-04",
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
    publicDomain: true,
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
    id: "bk-05",
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
    publicDomain: true,
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
    id: "bk-06",
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
    publicDomain: true,
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
