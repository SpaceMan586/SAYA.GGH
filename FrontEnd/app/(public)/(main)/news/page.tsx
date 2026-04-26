import NewsGridClient from "@/components/public/NewsGridClient";
import NewsEmptyState from "@/components/public/NewsEmptyState";
import NewsPageHeader from "@/components/public/NewsPageHeader";
import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";
import type { News } from "@/src/types/db";

const fetchNewsListUncached = async (): Promise<News[]> => {
  const { data, error } = await supabaseServer
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
};

const fetchNewsList = unstable_cache(fetchNewsListUncached, ["news-list"], {
  revalidate: 120,
});

export default async function NewsPage() {
  const newsList = await fetchNewsList();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <NewsPageHeader />

        <div className="w-full">
          {newsList.length === 0 ? (
            <NewsEmptyState />
          ) : (
            <NewsGridClient newsList={newsList} />
          )}
        </div>
      </div>
    </div>
  );
}
