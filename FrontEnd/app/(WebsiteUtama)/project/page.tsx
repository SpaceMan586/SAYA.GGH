"use client";

import LandingBottomBar from "../components/LandingBottomBar";
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
      <main className="min-h-screen pt-32 pb-20 bg-white pl-64">
        
        {/* Header Section - Centered for Gallery Feel */}
        <div className="px-6 md:px-12 mb-12 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter uppercase text-black mb-2">Selected Works</h1>
            <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-gray-400">Architecture & Interior Design</p>
        </div>

        {/* Grid Section */}
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
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`} className="group cursor-pointer block">
                  {/* Image Container with HD hover effect */}
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-black/20 transition-all duration-700">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-[1.5s]">
                          <HiPhotograph className="w-16 h-16 opacity-20" />
                      </div>
                    )}
                    
                    {/* Overlay Gradient for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Text Info - Instagram Style (Bottom Left, appearing on hover) */}
                    <div className="absolute bottom-0 left-0 p-6 w-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex flex-col gap-1 items-start z-10">
                      <h3 className="text-xl font-semibold tracking-tighter uppercase text-white leading-none drop-shadow-md">
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
      <LandingBottomBar />
    </>
  );
}