import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

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

async function seedCommunity() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const users = await db.collection("users").find({}).toArray();
  if (users.length === 0) {
    console.error("No users found. Run npm run seed first.");
    process.exit(1);
  }

  const admin = users.find((u) => u.role === "admin") || users[0];
  const reader = users.find((u) => u.role === "user") || users[1] || users[0];

  console.log("Cleaning old community posts...");
  await db.collection("posts").deleteMany({});
  await db.collection("comments").deleteMany({});
  await db.collection("notifications").deleteMany({});

  const samplePosts = [
    {
      author: admin._id,
      authorName: admin.name,
      userAvatar: "",
      bookTitle: "পথের পাঁচালী",
      bookAuthor: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
      postTitle: "অপুর বিস্ময় ও নিশ্চিন্দিপুরের নিসর্গ: এক চিরন্তন আত্মদর্শন",
      genre: "বই পর্যালোচনা",
      content: `বিভূতিভূষণ বন্দ্যোপাধ্যায়ের 'পথের পাঁচালী' কেবল অপুর শৈশবের আখ্যান নয়, এটি বাংলার পল্লীপ্রকৃতির সাথে মানবহৃদয়ের আদিম সংযোগের এক অনবদ্য দলিল।

রেললাইন দেখার রোমাঞ্চ, দুর্গার বনফুল কুড়োনো, আর সর্বজয়ার নীরবে দারিদ্র্যের সাথে লড়াই—প্রতিটি দৃশ্য যেন কোনো তুলিতে আঁকা নিঃশব্দ চলচ্চিত্র। বাংলা সাহিত্যে এত বিশুদ্ধ বিষাদ ও সরল বিস্ময় বোধহয় খুব কমই রূপ পেয়েছে। যারা এখনও পড়েননি, পুঁথিপিক্সের রিডিং রুমে বইটি নিবিষ্ট মনে পড়ার অনুরোধ রইল।`,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
      imageKey: "",
      likes: [reader._id],
      likesCount: 1,
      commentsCount: 2,
      status: "active",
      adminDeletionNote: "",
      createdAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
      updatedAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      author: reader._id,
      authorName: reader.name,
      userAvatar: "",
      bookTitle: "গীতাঞ্জলি",
      bookAuthor: "রবীন্দ্রনাথ ঠাকুর",
      postTitle: "রবীন্দ্রনাথের আধ্যাত্মিক আকুলতা ও নৈবেদ্যের সুর",
      genre: "কবিতা ও গান",
      content: `"আমার মাথা নত করে দাও হে তোমার চরণধূলার তলে।"

গীতাঞ্জলির প্রতিটি পঙক্তি পাঠ করার সময় মনে হয়, অহংকার ঝেড়ে ফেলে এক পরম সত্তার কাছে নিজেকে সঁপে দেওয়ার চেয়ে শান্তিময় অভিজ্ঞতা আর কিছু হতে পারে না। পুঁথিপিক্সে এই ধ্রুপদী সৃষ্টিগুলো এত পরিচ্ছন্নভাবে ডিজিটাইজ করায় মহাফেজখানার সকলকে আন্তরিক ধন্যবাদ।`,
      image: "",
      imageKey: "",
      likes: [admin._id],
      likesCount: 1,
      commentsCount: 1,
      status: "active",
      adminDeletionNote: "",
      createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      updatedAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      author: reader._id,
      authorName: reader.name,
      userAvatar: "",
      bookTitle: "",
      bookAuthor: "",
      postTitle: "বৃষ্টিভেজা বিকেলে পুরোনো বইয়ের ঘ্রাণ ও একাকীত্ব",
      genre: "সাহিত্য ভাবনা",
      content: `ডিজিটাল যুগে কাগজের বই হয়তো কিছুটা দূরবর্তী হয়ে পড়েছে, কিন্তু সাহিত্যের গভীরতা কখনো ফিকে হয় না। আজ জানালার পাশে বসে রবীন্দ্রনাথের ছোটগল্প পড়তে পড়তে মনে হচ্ছিল—সময়ের আবর্তে মানুষ বদলেছে, কিন্তু মানুষের নিঃসঙ্গতা, প্রেম আর বিরহের রূপ একই রয়ে গেছে।

আপনারা আজকের অলস বিকেলে কোন বইটি পড়ছেন? মন্তব্যে জানান!`,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
      imageKey: "",
      likes: [admin._id],
      likesCount: 1,
      commentsCount: 0,
      status: "active",
      adminDeletionNote: "",
      createdAt: new Date(Date.now() - 1800000), // 30 mins ago
      updatedAt: new Date(Date.now() - 1800000),
    },
  ];

  const inserted = await db.collection("posts").insertMany(samplePosts);
  const post1Id = inserted.insertedIds[0];
  const post2Id = inserted.insertedIds[1];

  // Insert sample comments
  const sampleComments = [
    {
      postId: post1Id,
      user: reader._id,
      userName: reader.name,
      userAvatar: "",
      content: "চমৎকার লিখেছেন! অপুর সাথে দুর্গার রেলগাড়ি দেখার অংশটি পড়ে আমারও শৈশবের কথা মনে পড়ে যায়।",
      createdAt: new Date(Date.now() - 3600000 * 3),
      updatedAt: new Date(Date.now() - 3600000 * 3),
    },
    {
      postId: post1Id,
      user: admin._id,
      userName: admin.name,
      userAvatar: "",
      content: "ধন্যবাদ পাঠক। পুঁথিপিক্সে পথের পাঁচালী ছাড়াও বিভূতিভূষণের 'আরণ্যক' খুব শীঘ্রই অডিওবুক আকারে যুক্ত হতে যাচ্ছে!",
      createdAt: new Date(Date.now() - 3600000 * 2.5),
      updatedAt: new Date(Date.now() - 3600000 * 2.5),
    },
    {
      postId: post2Id,
      user: admin._id,
      userName: admin.name,
      userAvatar: "",
      content: "গীতাঞ্জলি বাংলা সাহিত্যের এক অমর কীর্তি। আপনার চমৎকার পর্যালোচনার জন্য সাধুবাদ।",
      createdAt: new Date(Date.now() - 3600000 * 1),
      updatedAt: new Date(Date.now() - 3600000 * 1),
    },
  ];

  await db.collection("comments").insertMany(sampleComments);

  // Insert sample notifications for Admin & Reader
  const sampleNotifications = [
    {
      recipient: admin._id,
      sender: reader._id,
      senderName: reader.name,
      type: "comment",
      postId: post1Id,
      postTitle: "অপুর বিস্ময় ও নিশ্চিন্দিপুরের নিসর্গ",
      message: `${reader.name} আপনার "অপুর বিস্ময় ও নিশ্চিন্দিপুর..." পোস্টে একটি মন্তব্য করেছেন।`,
      note: "",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 3),
      updatedAt: new Date(Date.now() - 3600000 * 3),
    },
    {
      recipient: reader._id,
      sender: admin._id,
      senderName: admin.name,
      type: "like",
      postId: post2Id,
      postTitle: "রবীন্দ্রনাথের আধ্যাত্মিক আকুলতা",
      message: `${admin.name} আপনার "রবীন্দ্রনাথের আধ্যাত্মিক আকুলতা..." পোস্টে লাইক দিয়েছেন।`,
      note: "",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 1.5),
      updatedAt: new Date(Date.now() - 3600000 * 1.5),
    },
  ];

  await db.collection("notifications").insertMany(sampleNotifications);

  console.log("✅ 3 Community Posts, 3 Comments, and 2 Notifications successfully seeded!");
  await mongoose.disconnect();
}

seedCommunity().catch(console.error);
