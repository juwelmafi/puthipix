# পুঁথিপিক্স (Puthipix)
### বাংলা সাহিত্যের উন্মুক্ত ডিজিটাল মহাফেজখানা ও অডিওবুক প্ল্যাটফর্ম
**Open Literary Archive, Digital Reading Room & Audiobooks Platform**

---

## 📖 পরিচিতি (Overview)

**পুঁথিপিক্স** হলো বাংলা সাহিত্যের ক্লাসিক ও কপিরাইট-মুক্ত সৃষ্টিকর্মের এক অনন্য উন্মুক্ত মহাফেজখানা। রবীন্দ্রনাথ ঠাকুর, শরৎচন্দ্র চট্টোপাধ্যায়, বঙ্কিমচন্দ্র, কাজী নজরুল ইসলাম, জীবনানন্দ দাশ এবং বেগম রোকেয়াসহ বাংলা সাহিত্যের কালজয়ী লেখকদের উপন্যাস, গল্প, কবিতা ও প্রবন্ধ কোনো প্রকার পে-ওয়াল বা বাণিজ্যিক বিজ্ঞাপন ছাড়াই পাঠকদের জন্য উন্মুক্ত রাখা হয়েছে।

ডিজিটাল বই পাঠের পাশাপাশি এতে যুক্ত রয়েছে আধুনিক শ্রুতিপাঠ (Audiobook) অভিজ্ঞতা—যেখানে পাঠকরা সরাসরি ব্রাউজারে উচ্চমানের বাচিক শিল্পীদের কণ্ঠে ক্লাসিক গল্প ও কবিতা শুনতে পারবেন।

---

## 🌟 মূল বৈশিষ্ট্যসমূহ (Features)

- 📜 **শতভাগ উন্মুক্ত ক্লাসিক সাহিত্য:** কোনো সাবস্ক্রিপশন ফি বা লকড কন্টেন্ট নেই; জ্ঞান ও সাহিত্যের উন্মুক্ত বিস্তার।
- 🎙️ **শ্রুতিপাঠ ও অডিওবুক স্ট্রিমিং:** ক্লাউডফ্লেয়ার R2 ব্যাকড নিরবচ্ছিন্ন অডিও স্ট্রিমিং ডেক, চ্যাপ্টার নেভিগেশন ও প্লেয়ার কন্ট্রোল।
- 📖 **নিভৃত পাঠাগার ও রিডার:** ব্রাউজারে নিবিষ্ট হয়ে পড়ার জন্য অপ্টিমাইজড ব্রডশিট নকশা।
- ☁️ **ডুয়েল ক্লাউড স্টোরেজ আর্কিটেকচার:**
  - **Cloudinary:** প্রচ্ছদ ছবি ও পোর্ট্রেট ছবির তাৎক্ষণিক WebP কম্প্রেশন ও গ্লোবাল সিডিএন ডেলিভারি।
  - **Cloudflare R2:** বইয়ের মূল পিডিএফ ও অডিওবুক MP3 ফাইল স্টোরেজ ($০ ব্যান্ডউইথ খরচ)।
- 🗄️ **MongoDB Atlas ইন্টিগ্রেশন:** নিরাপদ ক্লাউড ডেটাবেজে মেটাডেটা, ইউজার একাউন্ট ও লাইব্রেরি রেকর্ড সংরক্ষণ।
- 📱 **মোবাইল অপ্টিমাইজড:** টু-কলাম গ্রিড বুক কার্ড, সুবিন্যস্ত ফন্ট সাইজিং এবং মোবাইল ফ্রেন্ডলি ফিল্টারিং।
- 🛠️ **শক্তিশালী অ্যাডমিন ড্যাশবোর্ড:** ম্যানুয়াল লিঙ্ক টাইপ করার ঝামেলাহীন—সরাসরি ড্র্যাগ-অ্যান্ড-ড্রপ ফাইল আপলোড সুবিধা।

---

## 🛠️ প্রযুক্তি কাঠামো (Tech Stack)

- **ফ্রেমওয়ার্ক:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **ইউজার ইন্টারফেস:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), Lucide Icons
- **ডাটাবেজ:** [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **মিডিয়া স্টোরেজ:** [Cloudinary](https://cloudinary.com/) (Images) & [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (PDFs & Audio)
- **অথেনটিকেশন:** JWT (HTTP-Only Secure Cookie) & Bcrypt

---

## 🚀 লোকাল সেটআপ নির্দেশিকা (Getting Started)

### ১. ক্লোন ও ডিপেন্ডেন্সি ইনস্টলেশন
```bash
git clone https://github.com/juwelmafi/puthipix.git
cd puthipix
npm install
```

### ২. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ
প্রজেক্টের রুটে `.env.local` ফাইল তৈরি করে নিচের ভেরিয়েবলগুলো যুক্ত করুন:

```env
# MongoDB Atlas Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/puthipix?retryWrites=true&w=majority

# JWT Secret
AUTH_SECRET=puthipix_secret_key_change_in_production

# Cloudinary (Direct Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cloudflare R2 (PDFs & Audiobooks)
R2_ACCOUNT_ID=your_account_id
R2_BUCKET_NAME=puthipix-media
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_PUBLIC_DOMAIN=https://pub-xxxxxx.r2.dev
```

### ৩. সিড ডাটাবেজ (ঐচ্ছিক)
ক্লাসিক বই ও অডিওবুক দিয়ে ডাটাবেজ ইনিশিয়ালাইজ করতে:
```bash
npm run seed
```

### ৪. ক্লাউড সার্ভিস সংযোগ পরীক্ষা
```bash
npm run test:cloud
```

### ৫. ডেভেলপমেন্ট সার্ভার চালু
```bash
npm run dev
```
ব্রাউজারে খুলুন: [http://localhost:3000](http://localhost:3000)

---

## 📜 স্বত্ব ও নীতিমালা (Copyright & License)
পুঁথিপিক্সে সংকলিত অধিকাংশ ধ্রুপদী সাহিত্যকর্ম পাবলিক ডোমেইনের আওতাভুক্ত। আধুনিক সংকলন ও শ্রুতিপাঠসমূহ মুক্ত লাইসেন্স বা রচয়িতার অনুমোদন সাপেক্ষে উন্মুক্ত রাখা হয়েছে।
