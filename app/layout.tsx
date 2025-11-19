import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import NextAuthSessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: "TravelDom - Discover Amazing Domestic Adventures",
  description:
    "Explore breathtaking destinations across the country with our curated travel experiences. From mountain retreats to coastal escapes, find your perfect domestic getaway.",
  keywords:
    "domestic travel, tours, vacation packages, adventure travel, family trips, USA destinations",
  authors: [{ name: "TravelDom" }],
  creator: "TravelDom",
  publisher: "TravelDom",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://traveldom.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TravelDom - Discover Amazing Domestic Adventures",
    description:
      "Explore breathtaking destinations across the country with our curated travel experiences.",
    url: "https://traveldom.com",
    siteName: "TravelDom",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TravelDom - Domestic Travel Adventures",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelDom - Discover Amazing Domestic Adventures",
    description:
      "Explore breathtaking destinations across the country with our curated travel experiences.",
    images: ["/og-image.jpg"],
    creator: "@traveldom",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  generator: "v0.app",
};

// 2. Add the viewport export here
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Ngăn người dùng zoom làm vỡ giao diện
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "TravelDom",
              description:
                "Discover amazing domestic adventures with curated travel experiences",
              url: "https://traveldom.com",
              telephone: "1-800-TRAVEL",
              email: "info@traveldom.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Travel St",
                addressLocality: "Adventure City",
                addressCountry: "US",
              },
              sameAs: [
                "https://facebook.com/traveldom",
                "https://twitter.com/traveldom",
                "https://instagram.com/traveldom",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <NextAuthSessionProvider>
          <Suspense fallback={null}>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
            >
              Skip to main content
            </a>
            {children}
          </Suspense>
          <Analytics />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
