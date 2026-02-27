"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import { motion } from "framer-motion";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import Image from "next/image";

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const parseGalleryUrls = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0,
    );
  }

  if (typeof value === "string" && value.trim().length > 0) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (url): url is string =>
            typeof url === "string" && url.trim().length > 0,
        );
      }
    } catch {
      return [];
    }
  }

  return [];
};

export default function NewsDetail() {
  const params = useParams();
  const id = params?.id;

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setNews(data);
      setLoading(false);
    }
    getNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm font-bold tracking-widest uppercase animate-pulse">
          Loading Article...
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold tracking-widest text-red-500 uppercase">
          Article Not Found
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors group"
        >
          <HiArrowLeft /> Back to News
        </Link>
      </div>
    );
  }

  const galleryUrls = parseGalleryUrls(news.gallery_urls);

  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      <motion.div
        className="max-w-4xl mx-auto px-6 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 mb-12 transition-colors group"
        >
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {formatDate(news.date)}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 leading-tight">
            {news.title}
          </h1>
        </header>

        {/* Featured Image */}
        {news.image_url && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 bg-gray-100 shadow-lg relative">
            <ResponsiveImage
              desktopSrc={news.image_url}
              mobileSrc={news.image_url_mobile || news.image_url}
              alt={news.title || "News image"}
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
            />
          </div>
        )}

        {galleryUrls.length > 0 && (
          <section className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Gallery
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={url}
                    alt={`${news.title || "News"} image ${idx + 1}`}
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

        {/* Content Body */}
        <article className="prose prose-lg lg:prose-xl max-w-none font-serif text-gray-800 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight">
          {news.content}
        </article>
      </motion.div>
    </main>
  );
}
