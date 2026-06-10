import NewsGridClient from "@/components/public/NewsGridClient";
import NewsEmptyState from "@/components/public/NewsEmptyState";
import NewsPageHeader from "@/components/public/NewsPageHeader";
import { supabaseServer } from "@/lib/supabaseServer";
import type { News } from "@/src/types/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function NewsPage() {
  const newsList = await fetchNewsListUncached();

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
