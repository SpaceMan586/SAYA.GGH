"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";

export function LandingNavbar() {
  return (
    <Navbar
      fluid
      rounded={false}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent border-none py-6 transition-all duration-300 backdrop-blur-[2px]"
    >
      {/* Brand */}
      <NavbarBrand as="div">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/Logo.svg" className="h-14 sm:h-16 transition-transform duration-500 group-hover:scale-105" alt="Logo" />
          <div className="flex flex-col">
            <span className="self-center whitespace-nowrap text-lg font-black tracking-tighter text-white uppercase leading-none">
              SAYA.GGH
            </span>
            <span className="text-[6px] tracking-[0.3em] text-gray-400 font-bold uppercase">Architecture & Design</span>
          </div>
        </Link>
      </NavbarBrand>

      {/* Toggle Button */}
      <NavbarToggle className="focus:ring-0 hover:bg-transparent" />

      {/* COLLAPSE / MENU */}
      <NavbarCollapse
        className="
          /* MOBILE (drawer kanan) */
          absolute top-full right-0   
          w-1/2
          h-screen
          bg-white dark:bg-gray-900
          shadow-2xl
          p-8
          flex flex-col
          items-start
          gap-8
          transition-all duration-300
          
          /* DESKTOP NORMAL */
          md:static md:w-auto md:h-auto md:bg-transparent md:shadow-none 
          md:p-0 md:flex-row md:items-center md:gap-8
        "
      >
        <NavbarLink
          as={Link}
          href="/"
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
        >
          HOME
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/about"
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
        >
          ABOUT
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/project"
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
        >
          PROJECT
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/news"
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
        >
          NEWS
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
