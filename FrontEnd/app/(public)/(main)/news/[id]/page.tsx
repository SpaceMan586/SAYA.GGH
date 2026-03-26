import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { supabaseServer } from "@/lib/supabaseServer";
import type { News } from "@/src/types/db";

export const dynamic = "force-dynamic";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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

const renderNotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
    <p className="text-lg font-bold uppercase tracking-widest text-red-500">
      Article Not Found
    </p>
    <Link
      href="/news"
      className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-black"
    >
      <HiArrowLeft /> Back to News
    </Link>
  </div>
);

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const newsId = parseNewsId(rawId);
  if (!newsId) {
    return renderNotFound();
  }

  const news = await fetchNewsById(newsId);
  if (!news) {
    return renderNotFound();
  }

  const galleryUrls = parseGalleryUrls(news.gallery_urls);

  return (
    <main className="min-h-screen bg-white pb-24 pt-24">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <Link
          href="/news"
          className="group mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-900"
        >
          <HiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Back to Journal
        </Link>

        <header className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            {formatDate(news.date)}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-gray-900 md:text-5xl">
            {news.title}
          </h1>
        </header>

        {news.image_url && (
          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
            <ResponsiveImage
              desktopSrc={news.image_url}
              mobileSrc={news.image_url_mobile || news.image_url}
              alt={news.title || "News image"}
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
            />
          </div>
        )}

        {galleryUrls.length > 0 && (
          <section className="mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Gallery
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {galleryUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={url}
                    alt={`${news.title || "News"} image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <article className="prose prose-lg lg:prose-xl max-w-none font-serif text-gray-800 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight">
          {news.content}
        </article>
      </div>
    </main>
  );
}
