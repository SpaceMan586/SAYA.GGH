"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/project", label: "PROJECT" },
  { href: "/news", label: "NEWS" },
];

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs tracking-[0.3em] uppercase text-black/70 hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black"
              aria-label="Toggle menu"
            >
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase">
                {isOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="fixed left-0 right-0 top-20 z-[60] px-6">
          <div className="mx-auto max-w-sm rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 py-6">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="text-lg tracking-[0.3em] uppercase text-black"
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
