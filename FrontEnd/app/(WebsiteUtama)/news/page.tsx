"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";

export default function NewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase.from('news').select('*').order('date', { ascending: false });
      if (data) setNewsList(data);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <>
      <main className="min-h-screen pt-32 pb-24 bg-white pl-64">
        {/* Header Section */}
        <div className="px-6 md:px-12 mb-16 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter uppercase text-black mb-2">Journal & Updates</h1>
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-gray-400">Insights from our studio</p>
        </div>

        <div className="px-6 md:px-12 max-w-[1920px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3].map(i => (
                 <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
               ))}
            </div>
          ) : newsList.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
               <p className="text-gray-400 font-bold uppercase tracking-widest">No updates published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {newsList.map((item, idx) => (
                <motion.div 
                   key={item.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: idx * 0.1 }}
                   className="group flex flex-col gap-4 cursor-pointer"
                >
                  {/* Image Card */}
                  <Link href={`/news/${item.id}`} className="block overflow-hidden rounded-2xl bg-gray-100 relative aspect-[4/3] shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-bold tracking-widest uppercase text-xs">No Image</div>
                    )}
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-black z-10">
                      {item.date}
                    </div>
                  </Link>

                  {/* Text Content */}
                  <div className="flex flex-col gap-2 px-2">
                     <Link href={`/news/${item.id}`}>
                        <h2 className="text-2xl font-semibold leading-tight text-black group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight">
                          {item.title}
                        </h2>
                     </Link>
                     <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-serif">
                       {item.content}
                     </p>
                     
                     <Link href={`/news/${item.id}`} className="mt-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b border-gray-200 pb-1 w-fit group-hover:border-blue-600 transition-all">
                       Read Article <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}