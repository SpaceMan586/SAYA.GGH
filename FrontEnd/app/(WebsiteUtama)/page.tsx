"use client";

import LandingBottomBar from "./components/LandingBottomBar";
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
    <main className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Background Image */}
      {heroData.image_url && (
        <div
          className="absolute inset-0 z-0 transition-opacity duration-1000 animate-slow-zoom"
          style={{
            backgroundImage: `url(${heroData.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <LandingBottomBar />
    </main>
  );
}
