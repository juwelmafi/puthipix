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

import { Post } from "../src/models/Post.ts";
import { connectToDatabase } from "../src/lib/mongodb.ts";

async function testApi() {
  console.log("Connecting to database via connectToDatabase()...");
  try {
    await connectToDatabase();
    console.log("Connected successfully!");

    console.log("\n1. Querying Post.find({ status: 'active' })...");
    const posts = await Post.find({ status: "active" }).lean();
    console.log(`Found ${posts.length} posts!`);
    posts.forEach((p, i) => {
      console.log(`  [${i + 1}] ${p.postTitle} by ${p.authorName} (${p.genre})`);
    });

    console.log("\n2. Testing Post.create()...");
    const users = await mongoose.connection.db.collection("users").find({}).toArray();
    console.log(`Found ${users.length} users in DB`);
    const testUser = users[0];

    const newPost = await Post.create({
      author: testUser._id,
      authorName: testUser.name,
      userAvatar: "",
      bookTitle: "টেস্ট বই",
      bookAuthor: "টেস্ট লেখক",
      postTitle: "টেস্ট পোস্ট শিরোনাম",
      genre: "বই পর্যালোচনা",
      content: "এটি একটি টেস্ট পোস্ট।",
      image: "",
      imageKey: "",
      likes: [],
      likesCount: 0,
      commentsCount: 0,
      status: "active",
    });

    console.log("Created post successfully with ID:", newPost._id);
    await Post.findByIdAndDelete(newPost._id);
    console.log("Cleaned up test post.");
  } catch (err) {
    console.error("ERROR OCCURRED:", err);
  } finally {
    await mongoose.disconnect();
  }
}

testApi();
