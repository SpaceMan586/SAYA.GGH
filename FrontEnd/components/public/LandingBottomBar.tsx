"use client";

import {
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LiveChat } from "@/components/shared/LiveChat"; // Import LiveChat
import { supabase } from "@/lib/supabase";

export default function LandingBottomBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdminPage = pathname?.startsWith("/admin");
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chat visibility
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    instagram: "",
    map: "",
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data } = await supabase
        .from("page_content")
        .select("body")
        .eq("section", "social_links")
        .maybeSingle();
      if (data?.body) {
        try {
          const parsed = JSON.parse(data.body);
          setSocialLinks({
            whatsapp: parsed?.whatsapp || "",
            instagram: parsed?.instagram || "",
            map: parsed?.map || "",
          });
        } catch (e) {
          console.error("Error parsing social links:", e);
        }
      }
    };
    fetchSocialLinks();
  }, []);

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const whatsappHref = normalizeUrl(socialLinks.whatsapp);
  const instagramHref = normalizeUrl(socialLinks.instagram);
  const mapHref = normalizeUrl(socialLinks.map);

  if (isAdminPage) return null;

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full flex items-center justify-between px-6 md:px-12 py-4 pb-4 md:pb-4 bg-white border-t border-gray-100 transition-all duration-300 supports-[padding:0_safe-area-inset-bottom]:pb-[calc(1rem+env(safe-area-inset-bottom))]">
      {/* LEFT SECTION (Visible on Mobile & Desktop) */}
      <div className="flex items-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-semibold tracking-[0.3em] md:tracking-[0.4em] uppercase">
        <span className="text-black/60 hover:text-black cursor-pointer transition-colors">
          IND / ENG
        </span>
        <Link href="/admin/login" aria-label="Admin Login">
          <FaUser className="text-black/40 text-sm md:text-base hover:text-black transition-all hover:scale-110 cursor-pointer" />
        </Link>
      </div>

      {/* ICONS SECTION - HIDDEN ON MOBILE */}
      <div className="hidden md:flex items-center gap-16 text-lg text-black/40">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-black hover:scale-110 transition-all"
          >
            <FaWhatsapp />
          </a>
        ) : (
          <FaWhatsapp className="opacity-30 cursor-not-allowed" />
        )}
        {instagramHref ? (
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-black hover:scale-110 transition-all"
          >
            <FaInstagram />
          </a>
        ) : (
          <FaInstagram className="opacity-30 cursor-not-allowed" />
        )}
        {mapHref ? (
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Map"
            className="hover:text-black hover:scale-110 transition-all"
          >
            <FaMapMarkerAlt />
          </a>
        ) : (
          <FaMapMarkerAlt className="opacity-30 cursor-not-allowed" />
        )}
      </div>

      {/* RIGHT SECTION (REACH US - Not Full Width on Mobile) */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsChatOpen(true)} // Open chat on click
          className="bg-gray-900 hover:bg-black text-white text-[9px] md:text-[10px] font-semibold tracking-[0.3em] md:tracking-[0.4em] px-5 py-2.5 md:px-10 md:py-3 uppercase transition-all active:scale-95 rounded-sm flex items-center justify-center gap-2"
        >
          CHAT US
        </button>
      </div>
      {/* Render LiveChat component */}
      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
