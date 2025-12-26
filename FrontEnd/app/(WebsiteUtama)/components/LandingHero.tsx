"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import { HiPhotograph } from "react-icons/hi";

export default function LandingHero({ customTitle, customSubtitle }: { customTitle?: string, customSubtitle?: string }) {
  return (
    <section className="bg-transparent relative overflow-hidden py-10 md:py-20">
      {/* Visual Decoration for HD feel */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="grid max-w-screen-xl px-6 py-8 mx-auto lg:gap-12 xl:gap-0 lg:py-24 lg:grid-cols-12 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl shadow-black/5 animate-in fade-in zoom-in duration-1000">
        <div className="mr-auto place-self-center lg:col-span-7 p-8 md:p-12">
          <h1 className="max-w-2xl mb-6 text-5xl font-black tracking-tight leading-[1.1] md:text-6xl xl:text-7xl dark:text-white uppercase italic decoration-blue-600/30 underline-offset-8">
            {customTitle || "Welcome to SAYA.GGH"}
          </h1>
          <p className="max-w-2xl mb-10 font-medium text-gray-600 lg:mb-12 md:text-xl lg:text-2xl dark:text-gray-400 leading-relaxed">
            {customSubtitle || "We build amazing experiences. Explore our projects and get in touch to learn more about what we do."}
          </p>
          <div className="flex flex-wrap gap-6">
            <Button as={Link} href="/project" color="dark" size="xl" className="rounded-2xl px-8 shadow-xl shadow-black/10 transition-transform hover:-translate-y-1 active:scale-95 duration-300">
              View Projects
              <svg className="w-6 h-6 ml-3 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </Button>
            <Button as={Link} href="/about" color="gray" size="xl" className="rounded-2xl px-8 border-gray-200 transition-transform hover:-translate-y-1 active:scale-95 duration-300">
              About Us
            </Button>
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex p-12">
             <div className="relative h-full w-full group">
                <div className="absolute inset-0 bg-blue-600/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden shadow-inner">
                   <HiPhotograph className="text-gray-200 dark:text-gray-700 w-32 h-32 animate-pulse" />
                   <div className="absolute bottom-8 text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">Premium Portfolio</div>
                </div>
             </div>
        </div>
      </div>
    </section>
  );
}