"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import ResponsiveImage from "@/components/shared/ResponsiveImage";

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

export default function NewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      // Fetch data from Supabase
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      if (data) setNewsList(data);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen pb-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-3">
            Journal & Updates
          </h1>
          <p className="text-sm font-medium tracking-widest uppercase text-gray-400">
            Insights from our studio
          </p>
        </div>

        {/* Content Section */}
        <div className="w-full">
          {loading ? (
            // Loading State Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm h-96 animate-pulse"
                ></div>
              ))}
            </div>
          ) : newsList.length === 0 ? (
            // Empty State
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
              <p className="text-gray-400 font-bold uppercase tracking-widest">
                No updates published yet.
              </p>
            </div>
          ) : (
            // News Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsList.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/news/${item.id}`}
                    className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden h-full"
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
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-bold tracking-widest uppercase text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        {formatDate(item.date)}
                      </p>
                      <h2 className="text-lg font-bold tracking-tight text-gray-900 leading-snug line-clamp-3">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3 font-serif">
                        {item.content}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
