"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useLanguage } from "@/components/shared/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";

const navItems = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/project", labelKey: "nav.project" },
  { href: "/news", labelKey: "nav.news" },
] satisfies { href: string; labelKey: TranslationKey }[];

const navTextClass =
  "text-xs tracking-[0.3em] uppercase text-black/70 hover:text-black";

const mobileNavTextClass = "text-lg tracking-[0.3em] uppercase text-black";

const useNavItems = () => {
  const { t } = useLanguage();
  return navItems.map((item) => ({ ...item, label: t(item.labelKey) }));
};

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const localizedNavItems = useNavItems();

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
            {localizedNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navTextClass}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm active:scale-95"
              aria-label={t("nav.toggleMenu")}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenuAlt3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="fixed left-0 right-0 top-20 z-[60] px-6">
          <div className="mx-auto max-w-sm rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 py-6">
              {localizedNavItems.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className={mobileNavTextClass}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
