"use client";

import { useLanguage } from "@/components/shared/LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-2 text-[9px] md:text-[10px] font-semibold tracking-[0.3em] md:tracking-[0.4em] uppercase"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("id")}
        className={`transition-colors ${
          language === "id" ? "text-black" : "text-black/40 hover:text-black"
        }`}
        aria-pressed={language === "id"}
      >
        IND
      </button>
      <span className="text-black/30">/</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`transition-colors ${
          language === "en" ? "text-black" : "text-black/40 hover:text-black"
        }`}
        aria-pressed={language === "en"}
      >
        ENG
      </button>
    </div>
  );
}
