import { LandingNavbar } from "@/components/public/LandingNavbar";
import LandingBottomBar from "@/components/public/LandingBottomBar";
import { getPublicSocialLinks } from "@/lib/publicContent";

const shouldUsePageTransition = process.env.NODE_ENV === "production";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socialLinks = await getPublicSocialLinks();
  let content = children;

  if (shouldUsePageTransition) {
    const PageTransition =
      (await import("@/components/shared/PageTransition")).default;
    content = <PageTransition>{children}</PageTransition>;
  }

  return (
    <>
      <LandingNavbar />
      {content}
      <LandingBottomBar initialSocialLinks={socialLinks} />
    </>
  );
}
