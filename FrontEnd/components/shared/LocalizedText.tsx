"use client";

import { useLocalizedText } from "@/lib/useLocalizedText";
import type { Language } from "@/lib/i18n";

type LocalizedTextProps = {
  value: unknown;
  language: Language;
  fallback?: string;
};

export default function LocalizedText({
  value,
  language,
  fallback = "",
}: LocalizedTextProps) {
  return <>{useLocalizedText(value, language, fallback)}</>;
}
