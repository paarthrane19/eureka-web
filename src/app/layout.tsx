import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";

import { SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";
import { Providers } from "./providers";

// Inter Tight — the closest free match to Claude's Styrene geometric grotesque.
// Used for both body and display so the whole app shares one typeface.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const interTightDisplay = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-512.png` },
      description:
        "The social platform for science, where every discovery is published with its sources.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Supasift — the social platform for science",
    template: "%s · Supasift",
  },
  description:
    "Supasift is the social platform for science — where discoveries are verified, curiosity is the currency, and going deeper is one swipe away.",
  keywords: [
    "science",
    "social platform",
    "verified science",
    "research",
    "discovery",
    "study circles",
  ],
  openGraph: {
    title: "Supasift — the social platform for science",
    description:
      "Where discoveries are verified, curiosity is the currency, and going deeper is one swipe away.",
    url: SITE_URL,
    siteName: "Supasift",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "Supasift" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Supasift — the social platform for science",
    description:
      "Where discoveries are verified, curiosity is the currency, and going deeper is one swipe away.",
    images: ["/og"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#262624" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${interTightDisplay.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Set theme before paint to avoid a flash of the wrong mode. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('eureka-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
