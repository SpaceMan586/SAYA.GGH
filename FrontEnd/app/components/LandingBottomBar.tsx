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
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white dark:bg-gray-900 flex items-center justify-between px-8 py-3 shadow-md transition-all duration-300">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-6 text-[10px] font-black tracking-widest uppercase">
        <span className="text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">IND / ENG</span>
        <Link href="/admin/login" aria-label="Admin Login">
          <FaUser className="text-gray-400 text-lg hover:text-black dark:hover:text-white transition-all hover:scale-110 cursor-pointer" />
        </Link>
      </div>

      {/* ICONS SECTION */}
      <div className="flex items-center gap-12 text-xl text-gray-400 dark:text-gray-500">
        <FaPhone className="hover:text-black dark:hover:text-white hover:scale-125 transition-all cursor-pointer" />
        <FaInstagram className="hover:text-black dark:hover:text-white hover:scale-125 transition-all cursor-pointer" />
        <FaMapMarkerAlt className="hover:text-black dark:hover:text-white hover:scale-125 transition-all cursor-pointer" />
      </div>

      {/* RIGHT SECTION (TOGGLE + BUTTON) */}
      <div className="flex items-center gap-8">
        <DarkThemeToggle className="focus:ring-0 hover:bg-black/5 rounded-full p-2 transition-colors" />
        <button className="bg-gray-900 hover:bg-black text-white text-[10px] font-black tracking-[0.3em] px-8 py-2.5 uppercase transition-all shadow-md active:scale-95 rounded-full">
          Reach Us
        </button>
      </div>
    </div>
  );
}