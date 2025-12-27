"use client";

import { useParams } from "next/navigation";
import LandingBottomBar from "../../components/LandingBottomBar";

import Link from "next/link";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id;
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState({ prev: null, next: null, prevTitle: '', nextTitle: '' });

  useEffect(() => {
    async function getData() {
      if (!id) return;
      setLoading(true);

      // 1. Fetch current project
      const { data: current, error } = await supabase.from('projects').select('*').eq('id', id).single();
      
      if (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } else {
        setProject(current);

        // 2. Fetch all IDs to determine prev/next
        const { data: all } = await supabase.from('projects').select('id, title').order('created_at', { ascending: false });
        
        if(all && all.length > 0) {
           const currentIndex = all.findIndex(p => p.id == id);
           
           if (currentIndex !== -1) {
             const prev = all[currentIndex - 1] || all[all.length - 1]; // Circular (Previous is older/next in array)
             const next = all[currentIndex + 1] || all[0]; // Circular (Next is newer/prev in array)
             
             // Logic adjustment: usually 'prev' means newer post in blog logic, but 'prev' button is left.
             // Let's assume standard array navigation: index-1 is previous item.
             
             setNav({
               prev: prev.id,
               prevTitle: prev.title,
               next: next.id,
               nextTitle: next.title
             });
           }
        }
      }
      setLoading(false);
    }

    getData();
  }, [id]);

  if (loading) {
     return (
        <>
            <div className="flex h-screen items-center justify-center">Loading...</div>
        </>
     );
  }

  if (!project) {
    return (
        <>
            <div className="flex h-screen items-center justify-center">Project not found.</div>
        </>
     );
  }

  return (
    <>
      <main className="min-h-screen bg-white pt-24 pb-20">
        
        {/* Top Navigation (Prev/Next) */}
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center text-sm font-medium uppercase tracking-widest text-gray-500">
          {nav.prev ? (
              <Link href={`/project/${nav.prev}`} className="flex items-center gap-2 hover:text-black transition-colors">
                <HiArrowLeft /> {nav.prevTitle}
              </Link>
          ) : <div></div>}
          
          {nav.next ? (
              <Link href={`/project/${nav.next}`} className="flex items-center gap-2 hover:text-black transition-colors">
                {nav.nextTitle} <HiArrowRight />
              </Link>
          ) : <div></div>}
        </div>

        {/* Content Layout: Left Text, Right Image */}
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 h-[calc(100vh-14rem)]">
          
          {/* Left Column: Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-light mb-8 uppercase tracking-wide text-black">
              {project.title}
            </h1>
            
            <div className="space-y-1 text-lg font-light text-gray-600 mb-12">
              <p><span className="w-32 inline-block">Status</span> : {project.status}</p>
              <p><span className="w-32 inline-block">Lokasi</span> : {project.location}</p>
              <p><span className="w-32 inline-block">Tahun</span> : {project.year}</p>
            </div>

            <div className="text-xl font-light text-gray-500 text-justify">
              {project.description || "No description available."}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="h-full w-full bg-gray-200 relative overflow-hidden">
             {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
             ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-gray-400 text-2xl font-light tracking-widest">NO IMAGE</span>
                 </div>
             )}
          </div>

        </div>

      </main>
      <LandingBottomBar />
    </>
  );
}