"use client";

import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { localizeContent } from "@/lib/i18n";
import type { News } from "@/src/types/db";

type NewsDetailClientProps = {
  news: News;
  galleryUrls: string[];
};

const formatDate = (dateString: string | null, language: "en" | "id") => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function NewsDetailClient({
  news,
  galleryUrls,
}: NewsDetailClientProps) {
  const { language, t } = useLanguage();
  const title = localizeContent(news.title, language);

  return (
    <main className="min-h-screen bg-white pb-24 pt-24">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <Link
          href="/news"
          className="group mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-900"
        >
          <HiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          {t("news.backToJournal")}
        </Link>

        <header className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            {formatDate(news.date, language) || t("news.dateUnavailable")}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-gray-900 md:text-5xl">
            {title}
          </h1>
        </header>

        {news.image_url && (
          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
            <ResponsiveImage
              desktopSrc={news.image_url}
              mobileSrc={news.image_url_mobile || news.image_url}
              alt={title || t("news.imageAlt")}
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
            />
          </div>
        )}

        {galleryUrls.length > 0 && (
          <section className="mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              {t("news.gallery")}
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {galleryUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={url}
                    alt={`${title || t("news.imageAlt")} ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <article className="prose prose-lg lg:prose-xl max-w-none font-serif text-gray-800 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight">
          {localizeContent(news.content, language)}
        </article>
      </div>
    </main>
  );
}
