"use client";

import { LandingNavbar } from "../components/LandingNavbar";
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
      <LandingNavbar />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 min-h-screen pt-24 pb-20 bg-white dark:bg-gray-900 dark:text-white ml-64 transition-all duration-300">
          
          {/* Header Section */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 mb-6">
            <h1 className="text-4xl font-light tracking-widest uppercase">Projects</h1>
          </div>

          {/* Grid Section */}
          <div className="px-8">
            {loading ? (
              <div className="flex h-64 w-full items-center justify-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="flex h-64 w-full items-center justify-center text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed rounded-3xl">
                No projects found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {projects.map((project) => (
                  <Link key={project.id} href={`/project/${project.id}`} className="group cursor-pointer block">
                    {/* Image Container with HD hover effect */}
                    <div className="relative w-full aspect-[16/10] bg-gray-100 dark:bg-gray-800 overflow-hidden mb-6 rounded-2xl shadow-sm group-hover:shadow-2xl group-hover:shadow-black/10 transition-all duration-700">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-[1.5s]">
                           <HiPhotograph className="w-16 h-16 opacity-20" />
                        </div>
                      )}
                      {/* Subtle Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700"></div>
                    </div>
                    
                    {/* Refined Text Info */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black tracking-tighter uppercase text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <span className="text-[10px] font-black px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded uppercase tracking-widest text-gray-400">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        {project.location} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {project.year}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
        </main>
      </div>
      <LandingBottomBar />
    </>
  );
}