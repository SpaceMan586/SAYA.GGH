"use client";

import { useParams } from "next/navigation";

import Link from "next/link";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { AnimatePresence, motion } from "framer-motion";

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id;
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState({ prev: null, next: null, prevTitle: '', nextTitle: '' });
  
  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function getData() {
      if (!id) return;
      setLoading(true);

      const { data: current, error } = await supabase.from('projects').select('*').eq('id', id).single();
      
      if (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } else {
        setProject(current);

        const { data: all } = await supabase.from('projects').select('id, title').order('created_at', { ascending: false });
        
        if(all && all.length > 0) {
           const currentIndex = all.findIndex(p => p.id == id);
           
           if (currentIndex !== -1) {
             const prev = all[currentIndex - 1] || all[all.length - 1]; 
             const next = all[currentIndex + 1] || all[0]; 
             
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

  // Gallery hanya berisi foto-foto dari gallery_urls (Thumbnail dipisahkan)
  const images = project ? (project.gallery_urls || []) : [];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold tracking-[0.3em] uppercase animate-pulse">Loading project details...</div>;
  if (!project) return <div className="flex h-screen items-center justify-center font-bold uppercase tracking-widest text-red-400">Project not found.</div>;

  return (
    <>
      <main className="min-h-screen bg-white pt-20 md:pt-24 pb-28 md:pb-20">
        
        {/* Top Navigation (Prev/Next) */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-6 flex justify-between items-center text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 border-b border-gray-100 mb-8 md:mb-12">
          {nav.prev ? (
              <Link href={`/project/${nav.prev}`} className="flex items-center gap-2 md:gap-4 hover:text-black transition-all group max-w-[120px] md:max-w-none">
                <HiArrowLeft className="shrink-0 group-hover:-translate-x-1 transition-transform" /> 
                <span className="truncate">{nav.prevTitle}</span>
              </Link>
          ) : <div></div>}
          
          <Link href="/project" className="hover:text-black transition-colors shrink-0">GALLERY</Link>

          {nav.next ? (
              <Link href={`/project/${nav.next}`} className="flex items-center gap-2 md:gap-4 hover:text-black transition-all group max-w-[120px] md:max-w-none">
                <span className="truncate">{nav.nextTitle}</span> 
                <HiArrowRight className="shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
          ) : <div></div>}
        </div>

        {/* Content Layout: Left Text (Sticky), Right Gallery (Carousel) */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 pb-12 items-start">
          
          {/* Left Column (Mobile: Order 2) - Info (Sticky on Desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col justify-start pt-0 lg:pt-8 lg:sticky lg:top-32">
            <h1 className="text-4xl md:text-6xl font-semibold mb-6 md:mb-10 uppercase tracking-tighter text-black leading-[0.9]">
              {project.title}
            </h1>
            
            <div className="grid grid-cols-2 gap-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 md:mb-12 border-y py-6 md:py-8 border-gray-100">
              <div>
                <span className="block text-gray-300 mb-1">Status</span>
                <span className="text-black">{project.status}</span>
              </div>
              <div>
                <span className="block text-gray-300 mb-1">Location</span>
                <span className="text-black">{project.location}</span>
              </div>
              <div>
                <span className="block text-gray-300 mb-1">Year</span>
                <span className="text-black">{project.year}</span>
              </div>
              <div>
                <span className="block text-gray-300 mb-1">Category</span>
                <span className="text-black">{(project.tags || []).join(", ") || "Uncategorized"}</span>
              </div>
            </div>

            <div className="text-sm font-medium text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {project.description || "No narrative available for this selected work."}
            </div>
          </div>

          {/* Right Column (Mobile: Order 1) - Carousel */}
          <div className="order-1 lg:order-2 lg:col-span-3 w-full">
             <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-square xl:aspect-[4/3] w-full bg-gray-50 overflow-hidden shadow-xl group rounded-2xl md:rounded-none">
                {images.length > 0 ? (
                   <>
                     <AnimatePresence mode="wait">
                       <motion.img 
                         key={currentSlide}
                         src={images[currentSlide]} 
                         alt={`${project.title} - Slide ${currentSlide + 1}`} 
                         initial={{ opacity: 0, scale: 0.98 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 1.02 }}
                         transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                         className="w-full h-full object-contain p-4 cursor-grab active:cursor-grabbing"
                         drag="x"
                         dragConstraints={{ left: 0, right: 0 }}
                         dragElastic={0.2}
                         onDragEnd={(e, { offset, velocity }) => {
                           const swipe = offset.x;

                           if (swipe < -50 || velocity.x < -500) {
                             nextSlide();
                           } else if (swipe > 50 || velocity.x > 500) {
                             prevSlide();
                           }
                         }}
                       />
                     </AnimatePresence>
                     
                     {/* Navigation Control Bar */}
                     {images.length > 1 && (
                       <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                           <div className="flex items-center gap-6 px-5 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl pointer-events-auto">
                               {/* Prev Button - Larger Touch Target */}
                               <button 
                                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }} 
                                 className="p-3 -ml-2 rounded-full text-white/70 hover:text-white transition-colors active:scale-95 touch-manipulation cursor-pointer"
                                 aria-label="Previous Slide"
                               >
                                 <HiArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
                               </button>

                               {/* Dots Indicator */}
                               <div className="flex gap-1.5 px-2">
                                 {images.map((_, idx) => (
                                   <button 
                                     key={idx}
                                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide(idx); }}
                                     className={`h-1.5 md:h-1 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 md:w-5 bg-white' : 'w-2 md:w-1 bg-white/30 hover:bg-white/60'} cursor-pointer touch-manipulation`}
                                     aria-label={`Go to slide ${idx + 1}`}
                                   />
                                 ))}
                               </div>

                               {/* Next Button - Larger Touch Target */}
                               <button 
                                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }} 
                                 className="p-3 -mr-2 rounded-full text-white/70 hover:text-white transition-colors active:scale-95 touch-manipulation cursor-pointer"
                                 aria-label="Next Slide"
                               >
                                 <HiArrowRight className="w-5 h-5 md:w-4 md:h-4" />
                               </button>
                           </div>
                       </div>
                     )}
                   </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <span className="text-gray-300 text-xs font-bold tracking-[0.5em] uppercase">NO IMAGES AVAILABLE</span>
                    </div>
                )}
             </div>
          </div>

        </div>

      </main>
    </>
  );
}