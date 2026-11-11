import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { AgeGate } from "@/components/ui/age-gate";
import { BUSINESS } from "@/lib/business";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: "Smoke & Vape Shop in Coral Springs, FL | VaporTech USA",
    template: "%s | VaporTech USA",
  },
  description:
    "VaporTech USA is Coral Springs' premier smoke and vape destination. Every major brand in stock at 8005 W Sample Rd. Disposables, glass, hookah, Delta-8, kratom and more.",
  keywords: [
    "smoke shop Coral Springs",
    "vape shop Coral Springs",
    "disposable vapes",
    "Raz vapes",
    "Lost Mary",
    "Delta-8 Coral Springs",
    "hookah Coral Springs",
    "VaporTech USA",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Smoke & Vape Shop in Coral Springs, FL | VaporTech USA",
    description:
      "Every major brand in stock at 8005 W Sample Rd, Coral Springs FL. Open 7 days a week.",
    url: BUSINESS.url,
    siteName: "VaporTech USA",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smoke & Vape Shop in Coral Springs, FL | VaporTech USA",
    description:
      "Every major brand in stock at 8005 W Sample Rd, Coral Springs FL. Open 7 days a week.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <LocalBusinessSchema />
        {children}
        <Footer />
        <AgeGate />
      </body>
    </html>
  );
}
