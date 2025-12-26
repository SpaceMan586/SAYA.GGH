"use client";

import LandingBottomBar from "./components/landing/LandingBottomBar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";



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
          title: data.title || "",
          subtitle: data.subtitle || "",
          image_url: data.image_url || "",
        });
      }
    }
    fetchHero();
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-900">
      {/* Background Image */}
      {heroData.image_url && (
        <div
          className="absolute inset-0 z-0 transition-opacity duration-1000 animate-slow-zoom"
          style={{
            backgroundImage: `url(${heroData.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        </div>
      )}

      {/* Hero Text */}
      {(heroData.title || heroData.subtitle) && (
        <div className="absolute bottom-20 left-6 md:bottom-28 md:left-16 z-20 max-w-xl animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="flex flex-col gap-4 border-l-4 border-white/80 pl-6 md:pl-8 py-2 backdrop-blur-sm">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] italic drop-shadow-2xl">
              {heroData.title}
            </h2>

            <p className="text-xs md:text-sm font-semibold text-gray-200 uppercase tracking-[0.3em] opacity-90 text-justify leading-relaxed max-w-md drop-shadow-md">
              {heroData.subtitle}
            </p>

            {/* ✅ FIXED LINK */}
            <Link
              href="/project"
              className="mt-4 w-fit group flex items-center gap-3 text-white uppercase text-[10px] font-bold tracking-[0.4em] hover:text-blue-400 transition-colors"
            >
              <span className="w-8 h-[1px] bg-white group-hover:bg-blue-400 transition-colors" />
              View Project
            </Link>
          </div>
        </div>
      )}

      <LandingBottomBar />
    </main>
  );
}
