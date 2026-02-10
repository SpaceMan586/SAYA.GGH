"use client";

import {
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isAdminPage) return null;

  // Compact if scrolled OR if not on home page
  // Trigger redeploy
  const isCompact = scrolled || !isHome;

  return (
    <Navbar
      fluid
      rounded={false}
      className={`fixed top-0 left-0 w-full z-50 border-none transition-all duration-500 px-6 md:px-20 py-0 bg-white`}
    >
      {/* Brand */}
      <NavbarBrand as="div">
        <Link href="/" className="flex items-center gap-3 md:gap-4 group">
          <img 
            src="/BlackLogo.png" 
            className="transition-all duration-500 h-14 md:h-20" 
            alt="SAYA GGH Logo" 
          />
        </Link>
      </NavbarBrand>

      {/* TOGGLE (MOBILE) */}
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="md:hidden text-black focus:ring-0 ml-auto p-2"
      >
        <span className="sr-only">Toggle menu</span>
        {menuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
      </button>

      {/* DESKTOP MENU (RIGHT ALIGNED) */}
      <div className="hidden md:flex flex-1 justify-end items-center gap-16 lg:gap-10">
        <Link
          href="/"
          className="text-[10px] lg:text-xs font-semibold tracking-[0.3em] uppercase text-black/70 hover:text-black transition-colors"
        >
          HOME
        </Link>
        <Link
          href="/about"
          className="text-[10px] lg:text-xs font-semibold tracking-[0.3em] uppercase text-black/70 hover:text-black transition-colors"
        >
          ABOUT
        </Link>
        <Link
          href="/project"
          className="text-[10px] lg:text-xs font-semibold tracking-[0.3em] uppercase text-black/70 hover:text-black transition-colors"
        >
          PROJECT
        </Link>
        <Link
          href="/news"
          className="text-[10px] lg:text-xs font-semibold tracking-[0.3em] uppercase text-black/70 hover:text-black transition-colors"
        >
          NEWS
        </Link>
      </div>

      {/* MOBILE MENU (COLLAPSIBLE) */}
      <div
        id="mobile-menu"
        className={`md:hidden ${menuOpen ? "block" : "hidden"}`}
      >
        <div className="flex flex-col gap-6 py-4 bg-white p-6 rounded-xl mt-4 shadow-xl">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] text-black uppercase">Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] text-black uppercase">About</Link>
          <Link href="/project" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] text-black uppercase">Project</Link>
          <Link href="/news" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-[0.2em] text-black uppercase">News</Link>
        </div>
      </div>
    </Navbar>
  );
}
