"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminPage) return null;

  // Compact if scrolled OR if not on home page
  // Trigger redeploy
  const isCompact = scrolled || !isHome;

  return (
    <Navbar
      fluid
      rounded={false}
      className={`fixed top-0 left-0 w-full z-50 border-none transition-all duration-500 px-6 md:px-20 py-4 ${
        scrolled || !isHome
          ? "bg-black/90 backdrop-blur-md shadow-xl" 
          : "bg-transparent"
      }`}
    >
      {/* Brand */}
      <NavbarBrand as="div">
        <Link href="/" className="flex items-center gap-3 md:gap-4 group">
          <img 
            src="/Logo.svg" 
            className="transition-all duration-500 group-hover:rotate-6 h-8 md:h-10" 
            alt="Logo" 
          />
          <div className="flex flex-col">
            <span className="self-center whitespace-nowrap font-black tracking-tighter text-white uppercase leading-none transition-all duration-500 text-sm md:text-base">
              SAYA.GGH
            </span>
            {isHome && !scrolled && (
              <span className="text-[5px] tracking-[0.5em] text-gray-400 font-bold uppercase mt-1 animate-in fade-in duration-700">
                EST. 2025
              </span>
            )}
          </div>
        </Link>
      </NavbarBrand>

      {/* TOGGLE (MOBILE) */}
      <NavbarToggle className="md:hidden text-white focus:ring-0 ml-auto" />

      {/* DESKTOP MENU (RIGHT ALIGNED) */}
      <div className="hidden md:flex items-center gap-16 lg:gap-24 ml-auto">
        <Link
          href="/"
          className="text-[10px] lg:text-xs font-bold tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
        >
          HOME
        </Link>
        <Link
          href="/about"
          className="text-[10px] lg:text-xs font-bold tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
        >
          ABOUT
        </Link>
        <Link
          href="/project"
          className="text-[10px] lg:text-xs font-bold tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
        >
          PROJECT
        </Link>
        <Link
          href="/news"
          className="text-[10px] lg:text-xs font-bold tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
        >
          NEWS
        </Link>
      </div>

      {/* MOBILE MENU (COLLAPSIBLE) */}
      <NavbarCollapse className="md:hidden">
        <div className="flex flex-col gap-6 py-4 bg-black/90 backdrop-blur-xl p-6 rounded-xl mt-4 border border-white/10">
          <Link href="/" className="text-sm font-bold tracking-[0.2em] text-white uppercase">Home</Link>
          <Link href="/about" className="text-sm font-bold tracking-[0.2em] text-white uppercase">About</Link>
          <Link href="/project" className="text-sm font-bold tracking-[0.2em] text-white uppercase">Project</Link>
          <Link href="/news" className="text-sm font-bold tracking-[0.2em] text-white uppercase">News</Link>
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
