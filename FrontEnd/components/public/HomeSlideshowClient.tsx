"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export type HomeSlide = {
  id: number;
  image_url: string;
  image_url_mobile: string;
};

export type HomeSlideStatus = "ready" | "missing" | "error";

interface HomeSlideshowClientProps {
  initialSlides: HomeSlide[];
  initialStatus: HomeSlideStatus;
}

export default function HomeSlideshowClient({
  initialSlides,
  initialStatus,
}: HomeSlideshowClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [initialSlides.length]);

  useEffect(() => {
    if (initialStatus !== "ready" || initialSlides.length === 0) {
      return;
    }

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % initialSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [initialSlides.length, initialStatus]);

  const nextSlide = () => {
    if (initialSlides.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % initialSlides.length);
  };

  const prevSlide = () => {
    if (initialSlides.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + initialSlides.length) % initialSlides.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (initialStatus === "missing") {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/60">
            Slideshow unavailable
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Homepage slides are being prepared
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/70">
            The homepage slideshow isn&apos;t configured yet. Check back soon or
            browse our projects directly.
          </p>
          <Link
            href="/project"
            className="mt-8 inline-block rounded-sm border border-white/30 px-8 py-3 text-xs uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            Browse Projects
          </Link>
        </div>
      </main>
    );
  }

  if (initialStatus === "error") {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/60">
            Something went wrong
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            We couldn&apos;t load the slideshow
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/70">
            Please refresh the page. If the issue persists, browse projects
            directly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="inline-block rounded-sm border border-white/30 px-8 py-3 text-xs uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Retry
            </button>
            <Link
              href="/project"
              className="inline-block rounded-sm border border-white/30 px-8 py-3 text-xs uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentSlide = initialSlides[currentIndex] || initialSlides[0];
  if (!currentSlide) {
    return null;
  }

  return (
    <>
      <main className="relative h-screen w-full overflow-hidden bg-black">
        <div
          key={currentIndex}
          className="absolute inset-0 h-full w-full home-slide-enter"
        >
          <div
            className="absolute inset-0 z-0 h-full w-full bg-cover bg-center transition-transform duration-[6000ms] ease-linear md:hidden"
            style={{
              backgroundImage: `url(${currentSlide.image_url_mobile || currentSlide.image_url})`,
              transform: "scale(1)",
            }}
          />
          <div
            className="absolute inset-0 z-0 hidden h-full w-full bg-cover bg-center transition-transform duration-[6000ms] ease-linear md:block"
            style={{
              backgroundImage: `url(${currentSlide.image_url})`,
              transform: "scale(1)",
            }}
          />
        </div>

        <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <HiChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2">
          <button
            onClick={nextSlide}
            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <HiChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {initialSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                currentIndex === index ? "w-4 bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </main>

      <div className="h-20 bg-white" />
    </>
  );
}
