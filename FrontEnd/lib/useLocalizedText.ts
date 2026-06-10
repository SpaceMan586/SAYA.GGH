"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getLocalizedContentForLanguage,
  getKnownLocalizedContent,
  hasLocalizedContent,
  localizeDataContent,
  type Language,
} from "@/lib/i18n";

const memoryCache = new Map<string, string>();
const STORAGE_PREFIX = "saya_ggh_translation:";

const isBrowser = () => typeof window !== "undefined";

const createCacheKey = (language: Language, text: string) => {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) | 0;
  }
  return `${STORAGE_PREFIX}${language}:${text.length}:${hash.toString(36)}`;
};

const shouldSkipAutoTranslation = (text: string) => {
  const trimmed = text.trim();
  if (trimmed.length < 2) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^[\d\s.,:/\\|-]+$/.test(trimmed)) return true;
  if (/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(trimmed)) return true;
  return false;
};

const readCachedTranslation = (cacheKey: string) => {
  const memoryValue = memoryCache.get(cacheKey);
  if (memoryValue) return memoryValue;
  if (!isBrowser()) return null;

  try {
    const storedValue = window.localStorage.getItem(cacheKey);
    if (storedValue) {
      memoryCache.set(cacheKey, storedValue);
    }
    return storedValue;
  } catch {
    return null;
  }
};

const writeCachedTranslation = (cacheKey: string, value: string) => {
  memoryCache.set(cacheKey, value);
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(cacheKey, value);
  } catch {
    // Ignore storage quota and privacy-mode failures.
  }
};

const normalizeForCompare = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

export const useLocalizedText = (
  value: unknown,
  language: Language,
  fallback = "",
) => {
  const immediateText = useMemo(() => {
    return localizeDataContent(value, language) || fallback;
  }, [fallback, language, value]);

  const [text, setText] = useState(immediateText);

  useEffect(() => {
    setText(immediateText);

    if (value == null || (typeof value === "string" && !value.trim())) return;
    const valueHasLocalizedContent = hasLocalizedContent(value);
    if (
      valueHasLocalizedContent &&
      getLocalizedContentForLanguage(value, language)
    ) {
      return;
    }

    const sourceText =
      typeof value === "string" && !valueHasLocalizedContent
        ? value.trim()
        : immediateText.trim();
    const knownTranslation = getKnownLocalizedContent(sourceText, language);
    if (knownTranslation) {
      setText(knownTranslation);
      return;
    }

    if (shouldSkipAutoTranslation(sourceText)) return;

    const cacheKey = createCacheKey(language, sourceText);
    const cachedTranslation = readCachedTranslation(cacheKey);
    if (
      cachedTranslation &&
      normalizeForCompare(cachedTranslation) !== normalizeForCompare(sourceText)
    ) {
      setText(cachedTranslation);
      return;
    }

    const controller = new AbortController();

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: sourceText, targetLanguage: language }),
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { translation?: unknown } | null) => {
        if (controller.signal.aborted) return;
        const translation =
          typeof data?.translation === "string" ? data.translation.trim() : "";
        if (!translation) return;

        if (
          normalizeForCompare(translation) !== normalizeForCompare(sourceText)
        ) {
          writeCachedTranslation(cacheKey, translation);
        }
        setText(translation);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [immediateText, language, value]);

  return text;
};
