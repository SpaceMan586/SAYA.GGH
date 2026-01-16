"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";



import { motion } from "framer-motion";

export default function Page() {
  const [heroData, setHeroData] = useState({
    title: "", 
    subtitle: "", 
    image_url: "" 
  });

  useEffect(() => {
    async function fetchHero() {
      const { data } = await supabase
        .from("page_content")
        .select("*")
        .eq("section", "home_hero")
        .maybeSingle();

      if (data) {
        setHeroData({
          title: data.title || "SAYA.GGH",
          subtitle: data.subtitle || "Architecture & Design Studio",
          image_url: data.image_url || "",
        });
      }
    }
    fetchHero();
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      {heroData.image_url && (
        <div
          className="absolute inset-0 z-0 transition-opacity duration-1000 animate-slow-zoom"
          style={{
            backgroundImage: `url(${heroData.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle Overlay to make text readable */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-5xl md:text-8xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-2xl italic">
            {heroData.title}
          </h1>
          
          <div className="w-24 h-[1px] bg-white/60 my-2" />

          <p className="text-xs md:text-sm font-semibold tracking-[0.5em] text-white/90 uppercase drop-shadow-lg">
            {heroData.subtitle}
          </p>
          
          <Link 
            href="/project"
            className="mt-8 px-8 py-3 border border-white/30 text-white text-[10px] tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all duration-500 rounded-sm"
          >
            Explore Projects
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
