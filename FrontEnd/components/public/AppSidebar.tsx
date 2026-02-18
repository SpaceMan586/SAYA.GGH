"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HiMenuAlt2 } from "react-icons/hi";
import { AppDrawer } from "../ui/AppDrawer";

// New component for reusable sidebar content
interface SidebarContentProps {
  onClose?: () => void; // Optional onClose for mobile drawer
}

function SidebarContent({ onClose }: SidebarContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  const isActive = (tag: string | null) => {
    if (pathname !== "/project") return false;
    return currentTag === tag;
  };

  const navItems = [
    { name: "All", tag: null },
    { name: "Residential", tag: "residential" },
    { name: "Public", tag: "public" },
    { name: "Details", tag: "details" },
  ];

  return (
    <SidebarItems className="h-full p-0">
      <div className="flex flex-col h-full pb-10">
        <div className="flex flex-col justify-end flex-1">
          <SidebarItemGroup className="p-0">
            <div className="mb-4 px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 italic">
              Type
            </div>
            {navItems.map((item) => (
              <Sidebar.Item
                key={item.name}
                as={Link}
                href={item.tag ? `/project?tag=${item.tag}` : "/project"}
                active={isActive(item.tag)}
                className="rounded-none hover:bg-gray-50 px-6 py-3 text-[10px] font-bold tracking-widest uppercase"
                onClick={onClose} // Close drawer on item click
              >
                {item.name}
              </Sidebar.Item>
            ))}
          </SidebarItemGroup>
        </div>
      </div>
    </SidebarItems>
  );
}

export function AppSidebar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Hamburger icon for mobile */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={handleOpenDrawer}
          className="p-2 text-gray-700 bg-white rounded-md shadow-md"
          aria-label="Open sidebar"
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <Sidebar
        aria-label="Sidebar navigation"
        className="
          hidden md:block
          sticky
          top-0
          left-0
          z-30  // Lower z-index than navbar
          h-screen
          pt-20 // Start below navbar
          w-64
          bg-white
          text-gray-900
          border-r
          border-gray-100
        "
      >
        <SidebarContent />
      </Sidebar>

      {/* Mobile Drawer */}
      <AppDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <SidebarContent onClose={handleCloseDrawer} />
      </AppDrawer>
    </>
  );
}
