"use client";

import { useState } from "react";
import {
  HiChartPie,
  HiViewBoards,
  HiArrowSmRight,
  HiDocumentText,
  HiLightningBolt,
  HiCog,
  HiMenuAlt2,
  HiX,
} from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => Promise<void>;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onSignOut,
}: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const handleSignOut = async () => {
    setIsMobileOpen(false);
    await onSignOut();
  };

  return (
    <>
      {!isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg active:scale-95 sm:hidden"
          aria-label="Open admin menu"
          aria-expanded={isMobileOpen}
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
      )}

      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
          aria-label="Close admin menu"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform sm:translate-x-0 dark:border-gray-700 dark:bg-gray-800 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col">
          <div className="relative px-2 py-4 mb-8 text-center border-b pb-8">
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 sm:hidden"
              aria-label="Close admin menu"
            >
              <HiX className="h-5 w-5" />
            </button>
            <Image
              src="/BlackLogo.png"
              width={128}
              height={128}
              className="h-16 mx-auto mb-2"
              alt="SAYA.GGH Logo"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              SAYA.GGH
            </span>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-bold">
              Content Manager
            </p>
          </div>
          <ul className="space-y-2 font-medium flex-1">
            <li>
              <a
                onClick={() => handleTabChange("overview")}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === "overview" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <HiChartPie className="w-5 h-5" />
                <span className="ml-3">Overview</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => handleTabChange("projects")}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === "projects" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <HiViewBoards className="w-5 h-5" />
                <span className="ml-3">Portfolio</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => handleTabChange("pages")}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === "pages" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <HiDocumentText className="w-5 h-5" />
                <span className="ml-3">Pages</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => handleTabChange("training")}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === "training" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <HiLightningBolt className="w-5 h-5" />
                <span className="ml-3">AI Training</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => handleTabChange("inbox")}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === "inbox" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <HiDocumentText className="w-5 h-5" />
                <span className="ml-3">Inbox</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => handleTabChange("settings")}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === "settings" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <HiCog className="w-5 h-5" />
                <span className="ml-3">Settings</span>
              </a>
            </li>
          </ul>
          <div className="mt-auto pt-4 border-t">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center p-3 text-gray-500 rounded-xl hover:bg-gray-100"
            >
              <HiArrowSmRight className="w-5 h-5" />
              <span className="ml-3">Sign Out</span>
            </button>
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center p-3 text-gray-500 rounded-xl hover:bg-gray-100"
            >
              <HiArrowSmRight className="w-5 h-5" />
              <span className="ml-3">Exit CMS</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
