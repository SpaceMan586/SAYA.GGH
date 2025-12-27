"use client";

import LandingBottomBar from "../components/LandingBottomBar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
      <main className="min-h-screen p-8 pt-32 pb-24 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter text-black">Latest News</h1>
          
          {loading ? <p>Loading news...</p> : newsList.length === 0 ? <p>No news yet.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsList.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  {item.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">{item.date}</p>
                    <h3 className="text-xl font-bold mb-4 line-clamp-2 text-black">{item.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 text-justify">{item.content}</p>
                    <button className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-blue-600 transition-colors">Read More</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <LandingBottomBar />
    </>
  );
}