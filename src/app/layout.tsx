import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import FloatingActions from "@/components/common/FloatingActions";
import FavoritePrompt from "@/components/common/FavoritePrompt";
import PWAInstallPrompt from "@/components/common/PWAInstallPrompt";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";

// Base URL for the site
const siteUrl = "https://yamada-tools.jp";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#223A70",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "山田ツール | 日本国内サーバーの無料オンラインツール【安全・安心】",
    template: "%s | 山田ツール",
  },
  description:
    "日本国内サーバーで安全に使える89の無料オンラインツール。PDF編集、画像変換、文書作成など、登録不要・完全無料でご利用いただけます。",
  keywords: [
    "オンラインツール",
    "無料",
    "PDF編集",
    "画像変換",
    "日本国内サーバー",
    "安全",
    "登録不要",
  ],
  authors: [{ name: "合同会社山田トレード" }],
  creator: "合同会社山田トレード",
  publisher: "合同会社山田トレード",
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    title: "山田ツール | 日本国内サーバーの無料オンラインツール",
    description:
      "日本国内サーバーで安全に使える89の無料オンラインツール。PDF編集、画像変換、文書作成など、登録不要・完全無料。",
    siteName: "山田ツール",
    images: [
      {
        url: "https://yamada-tools.jp/og-image.png",
        width: 1200,
        height: 630,
        alt: "山田ツール - 日本国内サーバーの無料オンラインツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://yamada-tools.jp/og-image.png"],
    title: "山田ツール | 日本国内サーバーの無料オンラインツール",
    description:
      "日本国内サーバーで安全に使える89の無料オンラインツール。PDF編集、画像変換、文書作成など、登録不要・完全無料。",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "google499885782131bde1",
  },
};

// Organization Schema (standalone)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "合同会社山田トレード",
  alternateName: "山田ツール",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/logo-icon.webp`,
    width: 512,
    height: 512,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "台方937番地13",
    addressLocality: "東金市",
    addressRegion: "千葉県",
    postalCode: "283-0811",
    addressCountry: "JP",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@yamada-tools.jp",
    availableLanguage: ["Japanese"],
  },
  foundingDate: "2024",
  sameAs: [
    "https://www.facebook.com/yamada.tools/",
    "https://x.com/YamadaToolsJP"
  ],
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 1,
  },
};

// WebSite Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "山田ツール",
  url: siteUrl,
  description:
    "日本国内サーバーで安全に使える無料オンラインツール集。PDF編集、画像変換、文書作成など70種類のツールを提供。",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "ja-JP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <GoogleAnalytics />
        <AuthProvider>
        <ThemeProvider>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-kon focus:text-white focus:rounded-md focus:top-2 focus:left-2">メインコンテンツへスキップ</a>
        <Header />
        <Breadcrumbs />
        <main id="main-content" className="flex-grow pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <FloatingActions />
        <FavoritePrompt />
        <PWAInstallPrompt />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
