"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NewsDetail() {
  const params = useParams();
  const id = params?.id;
  
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
      if (!error) setNews(data);
      setLoading(false);
    }
    getNews();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold tracking-widest animate-pulse">LOADING ARTICLE...</div>;
  if (!news) return <div className="min-h-screen flex items-center justify-center font-bold tracking-widest text-red-500">ARTICLE NOT FOUND</div>;

  return (
    <>
      <main className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/news" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black mb-12 transition-colors group">
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to News
          </Link>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
               <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full">News</span>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{news.date}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-tighter text-black leading-tight mb-12">
              {news.title}
            </h1>
          </motion.div>

          {/* Featured Image */}
          {news.image_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-gray-100 shadow-2xl"
            >
              <img src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Content Body */}
          <motion.article 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-justify font-serif"
          >
            {news.content}
          </motion.article>

        </div>
      </main>
    </>
  );
}
