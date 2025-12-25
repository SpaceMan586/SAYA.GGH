"use client";

import { 
  HiChartPie, 
  HiViewBoards, 
  HiArrowSmRight, 
  HiDocumentText,
} from "react-icons/hi";
import Link from "next/link";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white transition-transform sm:translate-x-0 dark:border-gray-700 dark:bg-gray-800" aria-label="Sidebar">
      <div className="h-full px-4 py-6 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col">
        <div className="px-2 py-4 mb-8 text-center border-b pb-8">
            <img src="/Logo.svg" className="h-16 mx-auto mb-2" alt="SAYA.GGH Logo" />
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">SAYA.GGH</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-bold">Content Manager</p>
        </div>
        <ul className="space-y-2 font-medium flex-1">
            <li>
              <a onClick={() => setActiveTab('overview')} className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <HiChartPie className="w-5 h-5" />
                  <span className="ml-3">Overview</span>
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab('projects')} className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'projects' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <HiViewBoards className="w-5 h-5" />
                  <span className="ml-3">Portfolio</span>
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab('pages')} className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'pages' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <HiDocumentText className="w-5 h-5" />
                  <span className="ml-3">Pages</span>
              </a>
            </li>
        </ul>
        <div className="mt-auto pt-4 border-t">
            <Link href="/" className="flex items-center p-3 text-gray-500 rounded-xl hover:bg-gray-100">
              <HiArrowSmRight className="w-5 h-5" />
              <span className="ml-3">Exit CMS</span>
            </Link>
        </div>
      </div>
    </aside>
  );
}
