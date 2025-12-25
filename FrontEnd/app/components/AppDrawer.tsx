"use client";

import { Drawer } from "flowbite-react";
import Link from "next/link";

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  return (
    <Drawer open={isOpen} onClose={onClose} className="w-64">
      <div className="h-full flex flex-col bg-white">
        <nav className="p-8 space-y-6 flex-1">
          <Link 
            href="#" 
            className="block text-sm font-medium hover:text-gray-600 transition"
            onClick={onClose}
          >
            RESIDENCIAL
          </Link>
          <Link 
            href="#" 
            className="block text-sm font-medium hover:text-gray-600 transition"
            onClick={onClose}
          >
            KOMERSIAL
          </Link>
          <Link 
            href="#" 
            className="block text-sm font-medium hover:text-gray-600 transition"
            onClick={onClose}
          >
            LANDSCAPE
          </Link>
          <Link 
            href="#" 
            className="block text-sm font-medium hover:text-gray-600 transition"
            onClick={onClose}
          >
            DETAILS
          </Link>
        </nav>
        <div className="p-8">
          <button className="w-full bg-gray-800 text-white px-6 py-2 text-sm font-medium hover:bg-gray-700 transition">
            REACH US
          </button>
        </div>
      </div>
    </Drawer>
  );
}
