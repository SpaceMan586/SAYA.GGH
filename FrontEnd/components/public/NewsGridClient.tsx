"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import type { News } from "@/src/types/db";

interface NewsGridClientProps {
  newsList: News[];
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function NewsGridClient({ newsList }: NewsGridClientProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {newsList.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.05 }}
        >
          <Link
            href={`/news/${item.id}`}
            className="group block h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {item.image_url ? (
                <ResponsiveImage
                  desktopSrc={item.image_url}
                  mobileSrc={item.image_url_mobile || item.image_url}
                  alt={item.title || "News image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-300">
                  No Image
                </div>
              )}
            </div>
            <div className="flex flex-col p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {formatDate(item.date)}
              </p>
              <h2 className="line-clamp-3 text-lg font-bold leading-snug tracking-tight text-gray-900">
                {item.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm text-gray-600 font-serif">
                {item.content}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
