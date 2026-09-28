import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { seo, siteUrl } from "@/config/site";
import { tracking } from "@/config/tracking";
import { SITE_ENV } from "@/config/validation";
import { businessJsonLd, jsonLd, websiteJsonLd } from "@/lib/schema";
import "./globals.css";

const inter = localFont({
  src: "./inter-latin-wght.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: seo.titleTemplate },
  description: seo.description,
  applicationName: "HDF Bâti",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: "/",
    siteName: "HDF Bâti",
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "HDF Bâti — Votre énergie, mieux maîtrisée." }],
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.ogImage] },
  robots: SITE_ENV === "production" ? { index: true, follow: true } : { index: false, follow: false },
  verification: tracking.searchConsoleVerification ? { google: tracking.searchConsoleVerification } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: seo.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} no-js`} suppressHydrationWarning>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-deep focus:px-4 focus:py-3 focus:font-semibold focus:text-white">
          Aller au contenu
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([businessJsonLd(), websiteJsonLd()])} />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <MobileActionBar />
        <ConsentBanner />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
