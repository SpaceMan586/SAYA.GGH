"use client";

import { useLanguage } from "@/components/shared/LanguageProvider";

export default function NewsPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="mb-3 text-4xl font-bold tracking-tighter text-gray-900 md:text-5xl">
        {t("news.title")}
      </h1>
      <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
        {t("news.subtitle")}
      </p>
    </div>
  );
}

