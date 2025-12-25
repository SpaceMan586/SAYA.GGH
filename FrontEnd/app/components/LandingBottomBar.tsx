"use client";

import { Button, DarkThemeToggle } from "flowbite-react";
import { FaInstagram, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Link from "next/link";

export default function LandingBottomBar() {
  return (
    // fixed: Membuat posisi elemen tetap relatif terhadap viewport
    // bottom-0: Menempelkan elemen tepat di garis bawah
    // left-0: Memastikan elemen mulai dari kiri
    // z-50: Memastikan elemen berada di atas konten lain (agar tidak tertutup)
    <div className="fixed bottom-0 left-0 z-50 w-full bg-transparent flex items-center justify-between px-6 md:px-12 py-8 transition-all duration-300">

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