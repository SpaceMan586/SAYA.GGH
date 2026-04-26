import NewsDetailClient from "@/components/public/NewsDetailClient";
import NewsNotFound from "@/components/public/NewsNotFound";
import { supabaseServer } from "@/lib/supabaseServer";
import type { News } from "@/src/types/db";

export const dynamic = "force-dynamic";

const parseGalleryUrls = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0,
    );
  }

  if (typeof value === "string" && value.trim().length > 0) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (url): url is string =>
            typeof url === "string" && url.trim().length > 0,
        );
      }
    } catch {
      return [];
    }
  }

  return [];
};

const parseNewsId = (value: string): number | null => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};

const fetchNewsById = async (id: number): Promise<News | null> => {
  const { data, error } = await supabaseServer
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
};

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const newsId = parseNewsId(rawId);
  if (!newsId) {
    return <NewsNotFound />;
  }

  const news = await fetchNewsById(newsId);
  if (!news) {
    return <NewsNotFound />;
  }

  return (
    <NewsDetailClient news={news} galleryUrls={parseGalleryUrls(news.gallery_urls)} />
  );
}
