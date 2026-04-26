import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { LanguageProvider } from "@/components/shared/LanguageProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SAYA.GGH",
  description: "Architecture and Design Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-sans antialiased bg-white text-black`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
