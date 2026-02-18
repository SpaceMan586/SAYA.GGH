"use client";

import { Drawer } from "flowbite-react";

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Add children prop
}

export function AppDrawer({ isOpen, onClose, children }: AppDrawerProps) {
  return (
    <Drawer open={isOpen} onClose={onClose} className="w-64">
      <Drawer.Header title="Navigation" /> {/* Optional: Add a drawer header */}
      <div className="h-full flex flex-col bg-white">
        {children} {/* Render children here */}
      </div>
    </Drawer>
  );
}
