"use client";

import { DarkThemeToggle } from "flowbite-react";
import { FaInstagram, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LandingBottomBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;

  return (
    <div className={`fixed bottom-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
      isHome 
        ? "bg-transparent" 
        : "bg-black/90 backdrop-blur-md shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]"
    }`}>

      {/* LEFT SECTION */}
      <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.4em] uppercase">
        <span className="text-white/60 hover:text-white cursor-pointer transition-colors">IND / ENG</span>
        <Link href="/admin/login" aria-label="Admin Login">
          <FaUser className="text-white/40 text-base hover:text-white transition-all hover:scale-110 cursor-pointer" />
        </Link>
      </div>

      {/* ICONS SECTION - HIDDEN ON MOBILE FOR MINIMALISM */}
      <div className="hidden md:flex items-center gap-16 text-lg text-white/40">
        <FaPhone className="hover:text-white hover:scale-110 transition-all cursor-pointer" />
        <FaInstagram className="hover:text-white hover:scale-110 transition-all cursor-pointer" />
        <FaMapMarkerAlt className="hover:text-white hover:scale-110 transition-all cursor-pointer" />
      </div>

      {/* RIGHT SECTION (TOGGLE + BUTTON) */}
      <div className="flex items-center gap-8">
        <DarkThemeToggle className="focus:ring-0 text-white/40 hover:text-white rounded-full p-2 transition-colors" />
        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold tracking-[0.4em] px-10 py-3 uppercase transition-all active:scale-95 rounded-sm">
          CONTACT
        </button>
      </div>
    </div>
  );
}