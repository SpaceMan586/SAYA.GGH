"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  // Close mobile menu on route change
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (isAdminPage) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white px-6 md:px-20 h-20 flex items-center font-semibold">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/BlackLogo.png"
              width={128}
              height={128}
              className="h-14 md:h-16 w-auto"
              alt="SAYA GGH Logo"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-10">
            <Link
              href="/"
              className="text-xs tracking-[0.3em] uppercase text-black/70 hover:text-black"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-xs tracking-[0.3em] uppercase text-black/70 hover:text-black"
            >
              ABOUT
            </Link>
            <Link
              href="/project"
              className="text-xs tracking-[0.3em] uppercase text-black/70 hover:text-black"
            >
              PROJECT
            </Link>
            <Link
              href="/news"
              className="text-xs tracking-[0.3em] uppercase text-black/70 hover:text-black"
            >
              NEWS
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="fixed left-0 right-0 top-20 z-[60] px-6">
          <div className="mx-auto max-w-sm rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 py-6">
            <Link
              href="/"
              className="text-lg tracking-[0.3em] uppercase text-black"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-lg tracking-[0.3em] uppercase text-black"
            >
              ABOUT
            </Link>
            <Link
              href="/project"
              className="text-lg tracking-[0.3em] uppercase text-black"
            >
              PROJECT
            </Link>
            <Link
              href="/news"
              className="text-lg tracking-[0.3em] uppercase text-black"
            >
              NEWS
            </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
