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
    <div className="fixed bottom-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-12 py-4 bg-white transition-all duration-300">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.4em] uppercase">
        <span className="text-black/60 hover:text-black cursor-pointer transition-colors">IND / ENG</span>
        <Link href="/admin/login" aria-label="Admin Login">
          <FaUser className="text-black/40 text-base hover:text-black transition-all hover:scale-110 cursor-pointer" />
        </Link>
      </div>

      {/* ICONS SECTION - HIDDEN ON MOBILE FOR MINIMALISM */}
      <div className="hidden md:flex items-center gap-16 text-lg text-black/40">
        <FaPhone className="hover:text-black hover:scale-110 transition-all cursor-pointer" />
        <FaInstagram className="hover:text-black hover:scale-110 transition-all cursor-pointer" />
        <FaMapMarkerAlt className="hover:text-black hover:scale-110 transition-all cursor-pointer" />
      </div>

      {/* RIGHT SECTION (BUTTON) */}
      <div className="flex items-center gap-8">
        <button className="bg-gray-900 hover:bg-black text-white text-[10px] font-bold tracking-[0.4em] px-10 py-3 uppercase transition-all active:scale-95 rounded-sm">
          REACH US
        </button>
      </div>
    </div>
  );
}