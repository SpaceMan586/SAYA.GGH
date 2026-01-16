"use client";

import { AppSidebar } from "../components/AppSidebar";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HiPhotograph } from "react-icons/hi";

export default function ProjectPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <>
      <AppSidebar />
      <main className="min-h-screen pt-24 md:pt-32 pb-28 md:pb-20 bg-white pl-0 md:pl-64">
        
        {/* Header Section */}
        <div className="px-6 md:px-12 mb-8 md:mb-12 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter uppercase text-black mb-2">Selected Works</h1>
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-gray-400">Architecture & Interior Design</p>
        </div>

        {/* Grid Section - Masonry Style */}
        <div className="px-6 md:px-6 max-w-[1920px] mx-auto">
          {loading ? (
            <div className="flex h-64 w-full items-center justify-center text-gray-400 font-semibold uppercase tracking-widest animate-pulse">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="flex h-64 w-full items-center justify-center text-gray-400 font-semibold uppercase tracking-widest border-2 border-dashed rounded-3xl">
              No projects found.
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`} className="break-inside-avoid group cursor-pointer block mb-6">
                  {/* Image Container */}
                  <div className="relative w-full bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700 rounded-2xl md:rounded-none">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-[1.5s] ease-out block"
                      />
                    ) : (
                      <div className="aspect-[4/3] flex items-center justify-center text-gray-300">
                          <HiPhotograph className="w-16 h-16 opacity-20" />
                      </div>
                    )}
                    
                    {/* Overlay - Always visible on mobile, hover on desktop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Text Info */}
                    <div className="absolute bottom-0 left-0 p-6 w-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-0 md:translate-y-4 group-hover:translate-y-0 flex flex-col gap-1 items-start z-10">
                      <h3 className="text-xl font-semibold tracking-tighter uppercase text-white leading-none">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-300 mt-1">
                        <span>{project.location}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span> 
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
      </main>
    </>
  );
}