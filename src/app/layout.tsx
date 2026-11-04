import type { Metadata } from "next";
import "./globals.css";
import { SiteContentProvider } from "@/context/SiteContentContext";

export const metadata: Metadata = {
  title: "Puthipix (পুঁথিপিক্স) — ডিজিটাল লাইব্রেরি ও বুক রিডিং প্ল্যাটফর্ম",
  description:
    "একটি minimalist, editorial-style digital library যেখানে পাঠকরা বিনামূল্যে বই পড়তে পারবে এবং প্রিমিয়াম বই সংগ্রহ করতে পারবে।",
  keywords: ["digital library", "bengali books", "puthipix", "পুঁথিপিক্স", "বই পড়া", "অনলাইন লাইব্রেরি"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+Bengali:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#eeeddb] text-[#171717] selection:bg-[#8a493b] selection:text-[#eeeddb]">
        <SiteContentProvider>{children}</SiteContentProvider>
      </body>
    </html>
  );
}
