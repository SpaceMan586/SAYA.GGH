import { LandingNavbar } from "./components/LandingNavbar";
import { LiveChat } from "./components/LiveChat";
import LandingBottomBar from "./components/LandingBottomBar";
import PageTransition from "../components/PageTransition";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      <PageTransition>
        {children}
      </PageTransition>
      <LandingBottomBar />
      <LiveChat />
    </>
  );
}
