import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { AudioPlayerView } from "@/components/audio/AudioPlayerView";
import { AudioCard } from "@/components/audio/AudioCard";
import { MOCK_AUDIOBOOKS } from "@/data/mockAudiobooks";
import { Headphones } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MOCK_AUDIOBOOKS.map((audio) => ({
    slug: audio.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const audiobook = MOCK_AUDIOBOOKS.find((a) => a.slug === slug);

  if (!audiobook) {
    return {
      title: "শ্রুতিপাঠ পাওয়া যায়নি | পুঁথিপিক্স",
    };
  }

  return {
    title: `${audiobook.title} (শ্রুতিপাঠ) — ${audiobook.author} | পুঁথিপিক্স`,
    description: audiobook.description,
  };
}

export default async function AudiobookDetailPage({ params }: Props) {
  const { slug } = await params;
  const audiobook = MOCK_AUDIOBOOKS.find((a) => a.slug === slug);

  if (!audiobook) {
    notFound();
  }

  const relatedAudiobooks = MOCK_AUDIOBOOKS.filter(
    (a) => a.id !== audiobook.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-12">
        {/* Main Audio Player Component */}
        <AudioPlayerView audiobook={audiobook} />

        {/* Narrator & Literary Background Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Narrator Bio */}
          <div className="bg-[#f4f2e4] p-4 sm:p-6 border border-[rgba(23,23,23,0.14)]">
            <h3 className="font-serif-bengali text-base sm:text-lg font-bold text-[#171717] mb-2">
              বাচিক শিল্পী পরিচিতি
            </h3>
            <p className="font-serif-bengali text-xs sm:text-sm text-[#53514a] leading-relaxed">
              {audiobook.narratorBio || `${audiobook.narrator} একজন নিষ্ঠাবান বাচিক শিল্পী ও কণ্ঠশিল্পী।`}
            </p>
          </div>

          {/* Literary Context */}
          <div className="bg-[#f4f2e4] p-4 sm:p-6 border border-[rgba(23,23,23,0.14)]">
            <h3 className="font-serif-bengali text-base sm:text-lg font-bold text-[#171717] mb-2">
              সাহিত্য পরিচয় ও প্রাসঙ্গিকতা
            </h3>
            <p className="font-serif-bengali text-xs sm:text-sm text-[#53514a] leading-relaxed">
              {audiobook.description}
            </p>
          </div>
        </div>

        {/* Related Audiobooks Section (2 columns on mobile, 4 on desktop) */}
        {relatedAudiobooks.length > 0 && (
          <section className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-[rgba(23,23,23,0.18)]">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#8a493b]" />
                <h2 className="font-serif-bengali text-lg sm:text-2xl font-bold text-[#171717]">
                  আরও শ্রুতিপাঠ শুনুন
                </h2>
              </div>
              <Link
                href="/audiobooks"
                className="font-serif-bengali text-xs text-[#8a493b] hover:underline"
              >
                সকল শ্রুতিপাঠ দেখুন →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-6">
              {relatedAudiobooks.map((item) => (
                <AudioCard key={item.id} audiobook={item} compact />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

