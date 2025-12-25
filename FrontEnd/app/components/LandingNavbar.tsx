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
      className="fixed top-0 left-0 w-full z-50 bg-transparent border-none py-4 md:py-6 transition-all duration-300"
    >
      {/* Brand */}
      <NavbarBrand as="div">
        <Link href="/" className="flex items-center gap-3 group px-4 md:px-8">
          <img src="/Logo.svg" className="h-10 sm:h-12 transition-transform duration-500 group-hover:rotate-6" alt="Logo" />
          <div className="flex flex-col">
            <span className="self-center whitespace-nowrap text-base md:text-lg font-black tracking-tighter text-white uppercase leading-none">
              SAYA.GGH
            </span>
            <span className="text-[5px] tracking-[0.5em] text-gray-400 font-bold uppercase mt-0.5">EST. 2025</span>
          </div>
        </Link>
      </NavbarBrand>

      {/* Toggle Button */}
      <NavbarToggle className="focus:ring-0 hover:bg-transparent text-white border-none mr-4" />

      {/* COLLAPSE / MENU */}
      <NavbarCollapse
        className="
          /* MOBILE */
          absolute top-0 right-0   
          w-64
          h-screen
          bg-black/95 backdrop-blur-xl
          p-12
          flex flex-col
          items-start
          gap-10
          transition-all duration-500
          
          /* DESKTOP */
          md:static md:w-auto md:h-auto md:bg-transparent md:backdrop-blur-none
          md:p-0 md:flex-row md:items-center md:gap-12 md:pr-12
        "
      >
        <NavbarLink
          as={Link}
          href="/"
          className="text-left w-full md:w-auto text-[10px] font-bold tracking-[0.4em] uppercase text-white/60 hover:text-white transition-all hover:tracking-[0.5em]"
        >
          HOME
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/about"
          className="text-left w-full md:w-auto text-[10px] font-bold tracking-[0.4em] uppercase text-white/60 hover:text-white transition-all hover:tracking-[0.5em]"
        >
          ABOUT
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/project"
          className="text-left w-full md:w-auto text-[10px] font-bold tracking-[0.4em] uppercase text-white/60 hover:text-white transition-all hover:tracking-[0.5em]"
        >
          WORK
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/news"
          className="text-left w-full md:w-auto text-[10px] font-bold tracking-[0.4em] uppercase text-white/60 hover:text-white transition-all hover:tracking-[0.5em]"
        >
          JOURNAL
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
