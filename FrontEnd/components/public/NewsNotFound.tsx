"use client";

import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { useLanguage } from "@/components/shared/LanguageProvider";

export default function NewsNotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <p className="text-lg font-bold uppercase tracking-widest text-red-500">
        {t("news.articleNotFound")}
      </p>
      <Link
        href="/news"
        className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black"
      >
        <HiArrowLeft /> {t("news.backToNews")}
      </Link>
    </div>
  );
}
