import { LandingNavbar } from "@/components/public/LandingNavbar";
import LandingBottomBar from "@/components/public/LandingBottomBar";
import PageTransition from "@/components/shared/PageTransition";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      <PageTransition>{children}</PageTransition>
      <LandingBottomBar />
    </>
  );
}
