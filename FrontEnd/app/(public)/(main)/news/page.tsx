import NewsGridClient from "@/components/public/NewsGridClient";
import { supabaseServer } from "@/lib/supabaseServer";
import type { News } from "@/src/types/db";

export const dynamic = "force-dynamic";

const fetchNewsList = async (): Promise<News[]> => {
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
  const newsList = await fetchNewsList();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="mb-3 text-4xl font-bold tracking-tighter text-gray-900 md:text-5xl">
            Journal & Updates
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
            Insights from our studio
          </p>
        </div>

        <div className="w-full">
          {newsList.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center">
              <p className="font-bold uppercase tracking-widest text-gray-400">
                No updates published yet.
              </p>
            </div>
          ) : (
            <NewsGridClient newsList={newsList} />
          )}
        </div>
      </div>
    </div>
  );
}
