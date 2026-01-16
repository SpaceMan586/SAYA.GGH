"use client";

import { FaInstagram, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LandingBottomBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full flex items-center justify-between px-6 md:px-12 py-4 pb-4 md:pb-4 bg-white border-t border-gray-100 transition-all duration-300 supports-[padding:0_safe-area-inset-bottom]:pb-[calc(1rem+env(safe-area-inset-bottom))]">

      {/* LEFT SECTION (Visible on Mobile & Desktop) */}
      <div className="flex items-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-semibold tracking-[0.3em] md:tracking-[0.4em] uppercase">
        <span className="text-black/60 hover:text-black cursor-pointer transition-colors">IND / ENG</span>
        <Link href="/admin/login" aria-label="Admin Login">
          <FaUser className="text-black/40 text-sm md:text-base hover:text-black transition-all hover:scale-110 cursor-pointer" />
        </Link>
      </div>

      {/* ICONS SECTION - HIDDEN ON MOBILE */}
      <div className="hidden md:flex items-center gap-16 text-lg text-black/40">
        <FaPhone className="hover:text-black hover:scale-110 transition-all cursor-pointer" />
        <FaInstagram className="hover:text-black hover:scale-110 transition-all cursor-pointer" />
        <FaMapMarkerAlt className="hover:text-black hover:scale-110 transition-all cursor-pointer" />
      </div>

      {/* RIGHT SECTION (REACH US - Not Full Width on Mobile) */}
      <div className="flex items-center justify-end">
        <a 
          href="https://wa.me/628123456789?text=Halo,%20saya%20tertarik%20dengan%20jasa%20arsitektur%20Anda." 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gray-900 hover:bg-black text-white text-[9px] md:text-[10px] font-semibold tracking-[0.3em] md:tracking-[0.4em] px-5 py-2.5 md:px-10 md:py-3 uppercase transition-all active:scale-95 rounded-sm flex items-center justify-center gap-2"
        >
          REACH US
        </a>
      </div>
    </div>
  );
}