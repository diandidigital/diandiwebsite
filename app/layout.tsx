import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://diandidigital.tech"),
  title: "Diandi Digital — Développement web & applications Android",
  description:
    "Diandi Digital développe des applications web et Android sur-mesure, ainsi que des sites et des identités de marque modernes qui font grandir votre activité.",
  icons: {
    icon: "/LOGO-DIANDIDIGITAL 100.png",
  },
  openGraph: {
    title: "Diandi Digital — Développement web & applications Android",
    description:
      "Diandi Digital développe des applications web et Android sur-mesure, ainsi que des sites et des identités de marque modernes qui font grandir votre activité.",
    url: "https://diandidigital.tech",
    siteName: "Diandi Digital",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={sora.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
