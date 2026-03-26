import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";

export type SocialLinks = {
  whatsapp: string;
  instagram: string;
  map: string;
};

const createEmptySocialLinks = (): SocialLinks => ({
  whatsapp: "",
  instagram: "",
  map: "",
});

const parseSocialLinks = (rawBody: string | null): SocialLinks => {
  if (!rawBody) {
    return createEmptySocialLinks();
  }

  try {
    const parsed = JSON.parse(rawBody) as {
      whatsapp?: unknown;
      instagram?: unknown;
      map?: unknown;
    };

    return {
      whatsapp: typeof parsed.whatsapp === "string" ? parsed.whatsapp : "",
      instagram: typeof parsed.instagram === "string" ? parsed.instagram : "",
      map: typeof parsed.map === "string" ? parsed.map : "",
    };
  } catch {
    return createEmptySocialLinks();
  }
};

const getPublicSocialLinksCached = unstable_cache(
  async (): Promise<SocialLinks> => {
    const { data } = await supabaseServer
      .from("page_content")
      .select("body")
      .eq("section", "social_links")
      .maybeSingle();

    return parseSocialLinks((data as { body: string | null } | null)?.body ?? null);
  },
  ["public-social-links"],
  { revalidate: 120 },
);

export const getPublicSocialLinks = async (): Promise<SocialLinks> =>
  getPublicSocialLinksCached();
