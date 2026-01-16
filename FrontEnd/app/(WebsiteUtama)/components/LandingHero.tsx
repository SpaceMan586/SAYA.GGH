"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import { HiPhotograph } from "react-icons/hi";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";

export default function LandingHero({ customTitle, customSubtitle }: { customTitle?: string, customSubtitle?: string }) {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchBackgrounds() {
      const { data } = await supabase.from('page_content').select('gallery_urls').eq('section', 'home_hero').maybeSingle();
      if (data && data.gallery_urls && data.gallery_urls.length > 0) {
        setBackgroundImages(data.gallery_urls);
      }
    }
    fetchBackgrounds();
  }, []);

  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [backgroundImages]);

  return (
    <section className="bg-transparent relative overflow-hidden py-10 md:py-20 min-h-[85vh] md:min-h-[90vh] flex items-center">
      
      {/* BACKGROUND SLIDESHOW */}
      <div className="absolute inset-0 -z-20 bg-gray-50">
         <AnimatePresence mode="popLayout">
            {backgroundImages.length > 0 ? (
                <motion.img 
                  key={currentSlide}
                  src={backgroundImages[currentSlide]}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-full h-full object-cover absolute inset-0 opacity-40 md:opacity-50 grayscale-[10%] md:grayscale-[20%]"
                />
            ) : (
                <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            )}
         </AnimatePresence>
         {/* Gradient Overlay for Text Readability */}
         <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/95 via-white/80 md:via-white/60 to-transparent dark:from-gray-900/95 dark:via-gray-900/80 z-[-15]"></div>
      </div>

      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="grid max-w-screen-xl px-6 py-12 mx-auto lg:gap-12 xl:gap-0 lg:py-24 lg:grid-cols-12 relative z-10">
        <div className="mr-auto place-self-center lg:col-span-7 p-4 md:p-12">
          <h1 className="max-w-2xl mb-6 text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] md:text-6xl dark:text-white uppercase italic decoration-blue-600/30 underline-offset-8 drop-shadow-sm">
            {customTitle || "Welcome to SAYA.GGH"}
          </h1>
          <p className="max-w-2xl mb-10 font-medium text-gray-700 md:text-gray-600 lg:mb-12 text-lg md:text-xl lg:text-2xl dark:text-gray-300 leading-relaxed drop-shadow-sm">
            {customSubtitle || "We build amazing experiences. Explore our projects and get in touch to learn more about what we do."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button as={Link} href="/project" color="dark" size="xl" className="rounded-2xl px-8 shadow-xl shadow-black/10 transition-transform hover:-translate-y-1 active:scale-95 duration-300 w-full sm:w-auto">
              View Projects
              <svg className="w-6 h-6 ml-3 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </Button>
            <Button as={Link} href="/about" color="gray" size="xl" className="rounded-2xl px-8 border-gray-200 transition-transform hover:-translate-y-1 active:scale-95 duration-300 bg-white/50 backdrop-blur-sm w-full sm:w-auto">
              About Us
            </Button>
          </div>
        </div>
        
        {/* RIGHT SIDE DECORATION (Hidden on mobile) */}
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex p-12 justify-end">
             <div className="relative h-96 w-80 group rotate-6 hover:rotate-0 transition-all duration-700 ease-out">
                <div className="absolute inset-0 bg-blue-600/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative flex h-full w-full items-center justify-center bg-white/30 backdrop-blur-md dark:bg-gray-800/30 rounded-[2.5rem] border border-white/40 dark:border-gray-700 overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                   <HiPhotograph className="text-gray-800/20 dark:text-white/20 w-32 h-32 animate-pulse z-10" />
                   <div className="absolute bottom-8 text-[10px] font-bold tracking-[0.4em] text-gray-600 dark:text-gray-300 uppercase z-10">Premium Portfolio</div>
                </div>
             </div>
        </div>
      </div>
    </section>
  );
}