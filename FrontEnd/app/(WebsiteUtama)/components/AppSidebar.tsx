"use client";

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";

import {
  HiOutlineMinusSm,
  HiOutlinePlusSm,
} from "react-icons/hi";

import { BsFillBuildingsFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export function AppSidebar() {
  return (
    <Sidebar
      aria-label="Sidebar navigation"
      className="hidden md:block fixed top-[64px] left-0 z-40 h-[calc(100vh-112px)] w-64 overflow-hidden bg-white text-gray-900 border-r border-gray-100"
    >
      <SidebarItems className="h-full p-0">
        <div className="flex flex-col h-full">

          <div className="flex flex-col justify-end flex-1 gap-0">
            
            <SidebarItemGroup className="border-t-0 p-0">
              <div className="mb-4 px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 italic">
                Type
              </div>
              <SidebarItem href="#" className="rounded-none hover:bg-gray-50 px-6 py-3 text-[10px] font-bold tracking-widest uppercase">RESIDENTIAL</SidebarItem>
              <SidebarItem href="#" className="rounded-none hover:bg-gray-50 px-6 py-3 text-[10px] font-bold tracking-widest uppercase">KOMERSIAL</SidebarItem>
              <SidebarItem href="#" className="rounded-none hover:bg-gray-50 px-6 py-3 text-[10px] font-bold tracking-widest uppercase">LANDSCAPE</SidebarItem>
              <SidebarItem href="#" className="rounded-none hover:bg-gray-50 px-6 py-3 text-[10px] font-bold tracking-widest uppercase">DETAILS</SidebarItem>
            </SidebarItemGroup>

          </div>

        </div>
      </SidebarItems>
    </Sidebar>
  );
}
