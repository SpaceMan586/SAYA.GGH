import HomeSlideshowClient, {
  type HomeSlide,
  type HomeSlideStatus,
} from "@/components/public/HomeSlideshowClient";
import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";
import type { Project } from "@/src/types/db";

const parseUrlArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (url): url is string => typeof url === "string" && url.trim().length > 0,
  );
};

const toProjectIdArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => Number(entry))
    .filter((entry) => Number.isInteger(entry) && entry > 0);
};

const normalizeUrlSlides = (desktopUrls: string[], mobileUrls: string[]) => {
  const totalSlides = Math.max(desktopUrls.length, mobileUrls.length);
  if (totalSlides === 0) return [];

  return Array.from({ length: totalSlides }, (_, index) => ({
    id: index + 1,
    image_url: desktopUrls[index] || mobileUrls[index] || "",
    image_url_mobile: mobileUrls[index] || desktopUrls[index] || "",
  })).filter((slide) => slide.image_url || slide.image_url_mobile);
};

const fetchLegacyProjectSlides = async (projectIds: number[]): Promise<HomeSlide[]> => {
  if (projectIds.length === 0) return [];

  const { data: projectData, error: projectError } = await supabaseServer
    .from("projects")
    .select("id, image_url, image_url_mobile")
    .in("id", projectIds);

  if (projectError || !projectData) {
    return [];
  }

  type ProjectSlideRecord = Pick<Project, "id" | "image_url" | "image_url_mobile">;
  const projectRows = projectData as ProjectSlideRecord[];
  const projectById = new Map(projectRows.map((project) => [project.id, project]));

  return projectIds
    .map((id) => {
      const project = projectById.get(id);
      if (!project) return null;

      const imageUrl = project.image_url || project.image_url_mobile || "";
      const imageUrlMobile = project.image_url_mobile || project.image_url || "";
      if (!imageUrl && !imageUrlMobile) return null;

      return {
        id: project.id,
        image_url: imageUrl,
        image_url_mobile: imageUrlMobile,
      };
    })
    .filter((slide): slide is HomeSlide => slide !== null);
};

const fetchHomeSlidesUncached = async (): Promise<{
  status: HomeSlideStatus;
  slides: HomeSlide[];
}> => {
  const { data: heroDataRaw, error: heroError } = await supabaseServer
    .from("page_content")
    .select("body")
    .eq("section", "home_hero")
    .maybeSingle();

  const heroData = heroDataRaw as { body: string | null } | null;

  if (heroError) {
    return { status: "error", slides: [] };
  }
  if (!heroData?.body) {
    return { status: "missing", slides: [] };
  }

  try {
    const parsedBody = JSON.parse(heroData.body);

    if (parsedBody && typeof parsedBody === "object" && !Array.isArray(parsedBody)) {
      const desktopUrls = parseUrlArray(
        (parsedBody as { desktop_urls?: unknown }).desktop_urls,
      );
      const mobileUrls = parseUrlArray(
        (parsedBody as { mobile_urls?: unknown }).mobile_urls,
      );
      const slides = normalizeUrlSlides(desktopUrls, mobileUrls);
      return { status: slides.length > 0 ? "ready" : "missing", slides };
    }

    const projectIds = toProjectIdArray(parsedBody);
    if (projectIds.length === 0) {
      return { status: "missing", slides: [] };
    }

    const slides = await fetchLegacyProjectSlides(projectIds);
    return { status: slides.length > 0 ? "ready" : "missing", slides };
  } catch {
    return { status: "error", slides: [] };
  }
};

const fetchHomeSlides = unstable_cache(
  fetchHomeSlidesUncached,
  ["home-slides"],
  { revalidate: 120 },
);

export default async function Page() {
  const { status, slides } = await fetchHomeSlides();
  return <HomeSlideshowClient initialSlides={slides} initialStatus={status} />;
}
