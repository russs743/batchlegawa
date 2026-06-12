import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legawa — Cretivox Internship Experience II · Batch 4",
  description:
    "Legawa: a state of calm liberation — a moment when acceptance turns into freedom, where you move and breathe without resistance, and growth feels effortless and true. Cretivox Internship Experience II, Batch 4.",
  openGraph: {
    title: "Legawa — Cretivox Internship Experience II",
    description: "A state of calm liberation. Batch 4 of Cretivox Internship Experience.",
    type: "website",
  },
};

import GlobalPreloader from "@/components/GlobalPreloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalPreloader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <ThemeToggle />
      </body>
    </html>
  );
}
