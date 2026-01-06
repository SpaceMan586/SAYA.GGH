import { LandingNavbar } from "./components/LandingNavbar";
import { LiveChat } from "./components/LiveChat";
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
      <LiveChat />
    </>
  );
}
