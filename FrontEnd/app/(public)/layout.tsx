import { LandingNavbar } from "@/components/public/LandingNavbar";
import LandingBottomBar from "@/components/public/LandingBottomBar";
import PageTransition from "@/components/shared/PageTransition";

const shouldUsePageTransition = process.env.NODE_ENV === "production";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      {shouldUsePageTransition ? (
        <PageTransition>{children}</PageTransition>
      ) : (
        children
      )}
      <LandingBottomBar />
    </>
  );
}
