import { AppSidebar } from "@/components/public/AppSidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <AppSidebar />

      {/* Content */}
      <main className="flex-1 md:pl-64 min-h-screen pt-20">{children}</main>
    </div>
  );
}
