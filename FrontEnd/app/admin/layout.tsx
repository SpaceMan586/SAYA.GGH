"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { AdminContextProvider, useAdminContext } from "./AdminContext";

function AdminLayoutContent({
  children,
  onSignOut,
}: {
  children: React.ReactNode;
  onSignOut: () => Promise<void>;
}) {
  const { activeTab, setActiveTab } = useAdminContext();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden font-sans">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={onSignOut}
      />
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
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === "/admin/login";
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const syncAdminCookies = async (session: Session | null) => {
      if (!session?.access_token || !session.refresh_token) {
        await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
        return;
      }

      await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        }),
      }).catch(() => {});
    };

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      const session = error ? null : data.session;
      const hasSession = Boolean(session);
      setIsAuthenticated(hasSession);
      setAuthChecked(true);
      await syncAdminCookies(session);

      if (isLoginRoute) {
        if (hasSession) router.replace("/admin/dashboard");
        return;
      }

      if (!hasSession) router.replace("/admin/login");
    };

    syncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        const hasSession = Boolean(session);
        setIsAuthenticated(hasSession);
        void syncAdminCookies(session);

        if (isLoginRoute && hasSession) {
          router.replace("/admin/dashboard");
        }

        if (!isLoginRoute && !hasSession) {
          router.replace("/admin/login");
        }
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [isLoginRoute, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    router.replace("/admin/login");
  };

  if (!authChecked && !isLoginRoute) {
    return (
      <div className="flex h-screen items-center justify-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
        Checking session...
      </div>
    );
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
        Redirecting...
      </div>
    );
  }

  return (
    <AdminContextProvider>
      <AdminLayoutContent onSignOut={handleSignOut}>
        {children}
      </AdminLayoutContent>
    </AdminContextProvider>
  );
}
