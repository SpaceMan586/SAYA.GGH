"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Page() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<
    "loading" | "ready" | "missing" | "error"
  >("loading");

  useEffect(() => {
    let cancelled = false;
    const maxAttempts = 3;
    const baseDelayMs = 1000;

    async function fetchSlideshowProjects(attempt: number) {
      // 1. Fetch the hero content which contains the list of project IDs
      const { data: heroData, error: heroError } = await supabase
        .from("page_content")
        .select("body")
        .eq("section", "home_hero")
        .maybeSingle();

      if (heroError) {
        console.error("Could not fetch slideshow config (query error):", {
          section: "home_hero",
          heroError,
        });
        if (!cancelled) {
          setStatus("error");
          scheduleRetry(attempt);
        }
        return;
      }
      if (!heroData) {
        console.warn("Slideshow config missing (no row found):", {
          section: "home_hero",
        });
        if (!cancelled) {
          setStatus("missing");
          scheduleRetry(attempt);
        }
        return;
      }
      if (!heroData.body) {
        console.warn("Slideshow config missing (empty body):", {
          section: "home_hero",
        });
        if (!cancelled) {
          setStatus("missing");
          scheduleRetry(attempt);
        }
        return;
      }

      try {
        const projectIds = JSON.parse(heroData.body);
        if (!Array.isArray(projectIds) || projectIds.length === 0) {
          if (!cancelled) {
            setStatus("missing");
            scheduleRetry(attempt);
          }
          return;
        }

        // 2. Fetch the projects corresponding to the IDs
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("id, title, location, image_url, image_url_mobile")
          .in("id", projectIds);

        if (projectError) {
          console.error(
            "Could not fetch projects for slideshow:",
            projectError,
          );
          if (!cancelled) {
            setStatus("error");
            scheduleRetry(attempt);
          }
          return;
        }

        // 3. Reorder the fetched projects to match the admin-defined order
        const orderedSlides = projectIds
          .map((id) => projectData.find((p) => p.id === id))
          .filter(Boolean); // Filter out any nulls if a project was deleted

        if (!cancelled) {
          setSlides(orderedSlides);
          setStatus(orderedSlides.length > 0 ? "ready" : "missing");
        }
      } catch (e) {
        console.error("Error parsing slideshow project IDs:", e);
        if (!cancelled) {
          setStatus("error");
          scheduleRetry(attempt);
        }
      }
    }

    function scheduleRetry(attempt: number) {
      if (attempt >= maxAttempts - 1) return;
      const delay = baseDelayMs * Math.pow(2, attempt);
      setTimeout(() => {
        if (!cancelled) {
          fetchSlideshowProjects(attempt + 1);
        }
      }, delay);
    }

    setStatus("loading");
    fetchSlideshowProjects(0);
    return () => {
      cancelled = true;
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const slideInterval = setInterval(nextSlide, 5000); // Auto-play every 5 seconds
    return () => clearInterval(slideInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, slides.length]);

  if (status === "loading") {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center text-white px-6">
          <div className="mb-6 h-3 w-36 rounded-full bg-white/20 animate-pulse" />
          <div className="h-10 w-2/3 max-w-xl rounded-md bg-white/10 animate-pulse" />
          <div className="mt-8 h-10 w-40 rounded-sm border border-white/20 bg-white/5 animate-pulse" />
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-white/60">
            Loading slideshow
          </p>
        </div>
      </main>
    );
  }
  if (status === "missing") {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center text-white px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-4">
            Slideshow unavailable
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Featured projects are being prepared
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/70">
            The homepage slideshow isn&apos;t configured yet. Check back soon or
            browse our projects directly.
          </p>
          <Link
            href="/project"
            className="mt-8 inline-block px-8 py-3 border border-white/30 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
          >
            Browse Projects
          </Link>
        </div>
      </main>
    );
  }
  if (status === "error") {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center text-white px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-4">
            Something went wrong
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            We couldn&apos;t load the slideshow
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/70">
            Please refresh the page. If the issue persists, browse projects
            directly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-8 py-3 border border-white/30 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
            >
              Retry
            </button>
            <Link
              href="/project"
              className="inline-block px-8 py-3 border border-white/30 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentSlide = slides[currentIndex];

  const variants = {
    enter: {
      opacity: 0,
      scale: 1.05,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      scale: 0.95,
    },
  };

  return (
    <>
      <main className="relative h-screen w-full overflow-hidden bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
            }}
            className="absolute inset-0 h-full w-full"
          >
            {/* Background Image */}
            <>
              <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center transition-transform duration-[6000ms] ease-linear md:hidden"
                style={{
                  backgroundImage: `url(${currentSlide.image_url_mobile || currentSlide.image_url})`,
                  transform: `scale(1)`,
                }}
              />
              <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center transition-transform duration-[6000ms] ease-linear hidden md:block"
                style={{
                  backgroundImage: `url(${currentSlide.image_url})`,
                  transform: `scale(1)`,
                }}
              />
            </>
          </motion.div>
        </AnimatePresence>

        {/* Content removed per request */}

        {/* Controls */}
        <div className="absolute z-20 top-1/2 left-4 -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <HiChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute z-20 top-1/2 right-4 -translate-y-1/2">
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <HiChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${currentIndex === index ? "bg-white w-4" : "bg-white/50"}`}
            />
          ))}
        </div>
      </main>

      {/* Spacer to make page scrollable below the hero */}
      <div className="h-20 bg-white" />
    </>
  );
}
