"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminContextProvider, useAdminContext } from "./AdminContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useAdminContext();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-10 overflow-y-auto sm:ml-64 transition-all">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminContextProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminContextProvider>
  );
}
