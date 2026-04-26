"use client";

import {
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { SocialLinks } from "@/lib/publicContent";
import { useLanguage } from "@/components/shared/LanguageProvider";
import LanguageToggle from "@/components/shared/LanguageToggle";

const LiveChat = dynamic(
  () => import("@/components/shared/LiveChat").then((mod) => mod.LiveChat),
  {
    ssr: false,
    loading: () => null,
  },
);

type LandingBottomBarProps = {
  initialSocialLinks: SocialLinks;
};

export default function LandingBottomBar({
  initialSocialLinks,
}: LandingBottomBarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chat visibility
  const [shouldRenderChat, setShouldRenderChat] = useState(false);
  const { t } = useLanguage();
  const socialLinks = initialSocialLinks;

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const whatsappHref = normalizeUrl(socialLinks.whatsapp);
  const instagramHref = normalizeUrl(socialLinks.instagram);
  const mapHref = normalizeUrl(socialLinks.map);

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full flex items-center justify-between px-6 md:px-12 py-4 pb-4 md:pb-4 bg-white border-t border-gray-100 transition-all duration-300 supports-[padding:0_safe-area-inset-bottom]:pb-[calc(1rem+env(safe-area-inset-bottom))]">
      {/* LEFT SECTION (Visible on Mobile & Desktop) */}
      <div className="flex items-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-semibold tracking-[0.3em] md:tracking-[0.4em] uppercase">
        <LanguageToggle />
        <Link href="/admin/login" aria-label={t("bottom.adminLogin")}>
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
          onClick={() => {
            setShouldRenderChat(true);
            setIsChatOpen(true);
          }}
          className="bg-gray-900 hover:bg-black text-white text-[9px] md:text-[10px] font-semibold tracking-[0.3em] md:tracking-[0.4em] px-5 py-2.5 md:px-10 md:py-3 uppercase transition-all active:scale-95 rounded-sm flex items-center justify-center gap-2"
        >
          {t("bottom.chatUs")}
        </button>
      </div>
      {/* Render LiveChat component */}
      {shouldRenderChat ? (
        <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      ) : null}
    </div>
  );
}
