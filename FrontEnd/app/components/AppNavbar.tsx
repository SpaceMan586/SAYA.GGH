"use client";

import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";

export function AppNavbar() {
  return (
    // Tambahkan relative di sini agar posisi absolute menu mengacu pada navbar ini
    <Navbar fluid rounded className="fixed top-0 left-0 w-full z-50 border-b bg-white dark:bg-gray-800">
      
      <NavbarBrand as="div">
        <Link href="/" className="flex items-center gap-3">
          <img src="/Logo.svg" className="h-20 sm:h-20" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            SAYA.GGH
          </span>
        </Link>
      </NavbarBrand>

      <NavbarToggle />

      <NavbarCollapse 
        className="
          /* --- TAMPILAN MOBILE (Custom) --- */
          absolute top-full right-0     /* Posisi: menempel di kiri bawah navbar */
          w-1/4                        /* Lebar: 50% layar */
          h-screen                     /* Tinggi: setinggi layar (opsional, biar keren kayak sidebar) */
          bg-white dark:bg-gray-800    /* Background: Putih (wajib ada agar tidak transparan) */
          
          shadow-lg                    /* Shadow: agar terlihat mengambang */
          p-4                          /* Padding: jarak dalam */
          pr-10                        /* Padding Kanan diperbesar  */
          
          /* --- TAMPILAN DESKTOP (Reset ke normal) --- */
          md:static md:w-auto md:h-auto md:bg-transparent md:border-none md:shadow-none md:p-0
        "
      >
        {/* Kita tambahkan items-start agar teks menempel ke KIRI */ }
        <div className="flex flex-col md:flex-row md:gap-10 items-start md:items-end">
            <NavbarLink as={Link} href="/" className="w-full text-left md:w-auto mb-4 md:mb-0">
            HOME
            </NavbarLink>
            <NavbarLink as={Link} href="/about" className="w-full text-left md:w-auto mb-4 md:mb-0">
            ABOUT
            </NavbarLink>
            <NavbarLink as={Link} href="/project" className="w-full text-left md:w-auto mb-4 md:mb-0">
            PROJECT
            </NavbarLink>
            <NavbarLink as={Link} href="/news" className="w-full text-left md:w-auto">
            NEWS
            </NavbarLink>
        </div>
      </NavbarCollapse>

    </Navbar>
  );
}