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
      rounded
      className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white dark:bg-gray-900 transition-all duration-300 py-2"
    >
      {/* Brand */}
      <NavbarBrand as="div">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/Logo.svg" className="h-14 sm:h-16 transition-transform duration-500 group-hover:scale-105" alt="Logo" />
          <div className="flex flex-col">
            <span className="self-center whitespace-nowrap text-lg font-black tracking-tighter dark:text-white uppercase leading-none">
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
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase hover:text-blue-600 transition-colors"
        >
          HOME
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/about"
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase hover:text-blue-600 transition-colors"
        >
          ABOUT
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/project"
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase hover:text-blue-600 transition-colors"
        >
          PROJECT
        </NavbarLink>

        <NavbarLink
          as={Link}
          href="/news"
          className="text-left w-full md:w-auto text-[10px] font-black tracking-[0.2em] uppercase hover:text-blue-600 transition-colors"
        >
          NEWS
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
