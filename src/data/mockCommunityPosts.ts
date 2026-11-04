export interface MockCommunityPost {
  _id: string;
  author: string;
  authorName: string;
  userAvatar?: string;
  bookTitle?: string;
  bookAuthor?: string;
  postTitle: string;
  genre: string;
  content: string;
  image?: string;
  imageKey?: string;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  status: "active" | "deleted_by_admin";
  createdAt: string;
  updatedAt: string;
  isLikedByMe?: boolean;
}

export const MOCK_COMMUNITY_POSTS: MockCommunityPost[] = [
  {
    _id: "cp-01",
    author: "user-admin",
    authorName: "পুঁথিপিক্স সম্পাদক",
    userAvatar: "",
    bookTitle: "পথের পাঁচালী",
    bookAuthor: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    postTitle: "অপুর বিস্ময় ও নিশ্চিন্দিপুরের নিসর্গ: এক চিরন্তন আত্মদর্শন",
    genre: "বই পর্যালোচনা",
    content: `বিভূতিভূষণ বন্দ্যোপাধ্যায়ের 'পথের পাঁচালী' কেবল অপুর শৈশবের আখ্যান নয়, এটি বাংলার পল্লীপ্রকৃতির সাথে মানবহৃদয়ের আদিম সংযোগের এক অনবদ্য দলিল।

রেললাইন দেখার সেই অবিস্মরণীয় রোমাঞ্চ, কাশফুলের দোলা, দুর্গার কাঁচামিঠে আম খাওয়ার আনন্দ আর সর্বজয়ার নীরবে দারিদ্র্যের সাথে লড়াই—প্রতিটি দৃশ্য যেন কোনো তুলিতে আঁকা নিঃশব্দ চলচ্চিত্র। বাংলা সাহিত্যে এত বিশুদ্ধ বিষাদ ও সরল বিস্ময় বোধহয় খুব কমই রূপ পেয়েছে। যারা এখনও পড়েননি, পুঁথিপিক্সের রিডিং রুমে বইটি নিবিষ্ট মনে পড়ার অনুরোধ রইল।`,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    imageKey: "",
    likes: ["user-reader-1"],
    likesCount: 14,
    commentsCount: 3,
    status: "active",
    createdAt: "2026-11-04T07:30:00.000Z",
    updatedAt: "2026-11-04T07:30:00.000Z",
    isLikedByMe: false,
  },
  {
    _id: "cp-02",
    author: "user-reader-1",
    authorName: "আহমেদ জাহিদ",
    userAvatar: "",
    bookTitle: "গীতাঞ্জলি",
    bookAuthor: "রবীন্দ্রনাথ ঠাকুর",
    postTitle: "রবীন্দ্রনাথের আধ্যাত্মিক আকুলতা ও গীতাঞ্জলির মর্মবাণী",
    genre: "কবিতা ও গান",
    content: `"আমার মাথা নত করে দাও হে তোমার চরণধূলার তলে।
সকল অহংকার হে আমার ডুবাও চোখের জলে।"

গীতাঞ্জলির প্রতিটি পঙক্তি পাঠ করার সময় মনে হয়, অহংকার ঝেড়ে ফেলে এক পরম সত্তার কাছে নিজেকে সঁপে দেওয়ার চেয়ে শান্তিময় অভিজ্ঞতা আর কিছু হতে পারে না। পুঁথিপিক্সে এই ধ্রুপদী সৃষ্টিগুলো এত পরিচ্ছন্নভাবে ডিজিটাইজ করায় মহাফেজখানার সকলকে আন্তরিক ধন্যবাদ।`,
    image: "",
    imageKey: "",
    likes: ["user-admin", "user-reader-2"],
    likesCount: 9,
    commentsCount: 2,
    status: "active",
    createdAt: "2026-11-04T06:15:00.000Z",
    updatedAt: "2026-11-04T06:15:00.000Z",
    isLikedByMe: false,
  },
  {
    _id: "cp-03",
    author: "user-reader-2",
    authorName: "সুমাইয়া ফারহানা",
    userAvatar: "",
    bookTitle: "",
    bookAuthor: "",
    postTitle: "বৃষ্টিভেজা বিকেলে পুরোনো বইয়ের ঘ্রাণ ও একাকীত্ব",
    genre: "সাহিত্য ভাবনা",
    content: `ডিজিটাল যুগে কাগজের বই হয়তো কিছুটা দূরবর্তী হয়ে পড়েছে, কিন্তু সাহিত্যের গভীরতা কখনো ফিকে হয় না। আজ জানালার পাশে বসে রবীন্দ্রনাথের ছোটগল্প পড়তে পড়তে মনে হচ্ছিল—সময়ের আবর্তে মানুষ বদলেছে, কিন্তু মানুষের নিঃসঙ্গতা, প্রেম আর বিরহের রূপ একই রয়ে গেছে।

আপনারা আজকের অলস বিকেলে কোন বইটি পড়ছেন? মন্তব্যে জানান!`,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    imageKey: "",
    likes: ["user-admin"],
    likesCount: 18,
    commentsCount: 5,
    status: "active",
    createdAt: "2026-11-04T04:45:00.000Z",
    updatedAt: "2026-11-04T04:45:00.000Z",
    isLikedByMe: false,
  },
  {
    _id: "cp-04",
    author: "user-reader-3",
    authorName: "তানভীর হাসান",
    userAvatar: "",
    bookTitle: "কপালকুণ্ডলা",
    bookAuthor: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়",
    postTitle: "বঙ্কিমচন্দ্রের কপালকুণ্ডলা: ট্র্যাজেডি নাকি নিয়তির অমোঘ পরিহাস?",
    genre: "বই পর্যালোচনা",
    content: `"পথিক, তুমি পথ হারাইয়াছ?"—বাংলা সাহিত্যের এই একটি বাক্য যেভাবে পাঠককে রোমাঞ্চিত করে, তা আর কোনো সংলাপে আছে কি না সন্দেহ।

নবকুমারের দ্বিধা আর কপালকুণ্ডলার অরণ্যচারী মুক্ত স্বভাবের সংঘাত শেষ পর্যন্ত যে ট্র্যাজিক পরিণতির দিকে এগিয়ে যায়, তা আজও পাঠককে স্তব্ধ করে দেয়। বঙ্কিমের রোমান্টিক কল্পনার এক অনন্য শিখর এই উপন্যাস।`,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    imageKey: "",
    likes: ["user-reader-1"],
    likesCount: 11,
    commentsCount: 1,
    status: "active",
    createdAt: "2026-11-03T22:30:00.000Z",
    updatedAt: "2026-11-03T22:30:00.000Z",
    isLikedByMe: false,
  },
  {
    _id: "cp-05",
    author: "user-reader-4",
    authorName: "নাসরীন জাহান",
    userAvatar: "",
    bookTitle: "বনলতা সেন",
    bookAuthor: "জীবনানন্দ দাশ",
    postTitle: "জীবনানন্দের সুরঞ্জনা ও হাজার বছর ধরে হেঁটে চলা পথ",
    genre: "উদ্ধৃতি ও দর্শন",
    content: `"হাজার বছর ধরে আমি পথ হাঁটিতেছি পৃথিবীর পথে,
সিংহল সমুদ্র থেকে নিশীথের অন্ধকারে মালয় সাগরে
অনেক ঘুরিয়াছি আমি; বিম্বিসার অশোকের ধূসর জগতে
সেখানে ছিলাম আমি; আরও দূর অন্ধকারে বিদর্ভ নগরে..."

জীবনানন্দের কবিতায় যে গভীর ক্লান্তির মাঝেও শান্তির আশ্রয় খোঁজা হয়েছে, তা প্রতিদিনের ক্লান্তি ভুলে মনে এক প্রশান্তির সৃষ্টি করে।`,
    image: "",
    imageKey: "",
    likes: ["user-admin", "user-reader-1", "user-reader-2"],
    likesCount: 22,
    commentsCount: 4,
    status: "active",
    createdAt: "2026-11-03T18:10:00.000Z",
    updatedAt: "2026-11-03T18:10:00.000Z",
    isLikedByMe: false,
  },
  {
    _id: "cp-06",
    author: "user-reader-5",
    authorName: "মাহমুদুল হক",
    userAvatar: "",
    bookTitle: "",
    bookAuthor: "",
    postTitle: "স্বরচিত অনুগল্প: কুয়াশার চিঠি",
    genre: "স্বরচিত সাহিত্য",
    content: `সকালের ডাকপিয়ন যখন দরজায় টোকা দিল, বাইরে তখন ঘন কুয়াশা। খামটা খুলতেই ঝরে পড়ল কয়েকটি শুকনো শিউলি ফুল। কোনো ঠিকানা নেই, প্রেরকের নামও লেখা নেই। শুধু নিচে পেনসিলে লেখা—"যে কথা বলা হয়নি, তা কুয়াশার দলেই রেখে গেলাম।"

চিঠিটা পড়তে পড়তে ট্রেনের দূরপাল্লার হুইসিল শোনা গেল। কিছু চিঠির কোনো উত্তর থাকে না, কেবল স্মৃতি হয়ে থেকে যায়।`,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop",
    imageKey: "",
    likes: ["user-reader-3", "user-reader-4"],
    likesCount: 16,
    commentsCount: 7,
    status: "active",
    createdAt: "2026-11-03T14:00:00.000Z",
    updatedAt: "2026-11-03T14:00:00.000Z",
    isLikedByMe: false,
  },
];
