"use client";

import { useLanguage } from "@/components/shared/LanguageProvider";

export default function NewsEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center">
      <p className="font-bold uppercase tracking-widest text-gray-400">
        {t("news.empty")}
      </p>
    </div>
  );
}
