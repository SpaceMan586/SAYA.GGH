"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Start transition animation
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 500); // Durasi animasi
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
