import { Noto_Sans_JP } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
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
import StagingBanner from "@/components/common/StagingBanner";
import { AuthProvider } from "@/contexts/AuthContext";
import { PricingTriggerProvider } from "@/components/common/PricingTriggerProvider";
import AdSenseLoader from "@/components/AdSenseLoader";
import SupportChatbot from "@/components/SupportChatbot";
import GlobalSearchModal from "@/components/common/GlobalSearchModal";
import GlobalToolTracker from "@/components/common/GlobalToolTracker";
import { homepageItemListSchema, homepageFaqSchema } from "./homepage-schemas";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

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
    default: "山田ツール｜インボイス・全銀・電子印鑑など200種の無料業務ツール",
    template: "%s | 山田ツール",
  },
  description:
    "日本国内サーバーで安全に使える無料オンラインツール200種。インボイス制度・全銀フォーマット・電子印鑑・PDF編集・書類作成・画像変換・財務計算など、日本の中小企業・フリーランスのビジネスに特化。登録不要・60分自動削除で安心。",
  keywords: [
    "インボイス制度",
    "全銀フォーマット",
    "電子印鑑",
    "確定申告",
    "宛名印刷",
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
      "日本国内サーバーで安全に使える無料オンラインツール。インボイス制度・全銀・電子印鑑など日本特化。登録不要・完全無料。",
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
      "日本国内サーバーで安全に使える無料オンラインツール。インボイス制度・全銀・電子印鑑など日本特化。登録不要・完全無料。",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ja": siteUrl,
      "x-default": siteUrl,
    },
  },
  verification: {
    google: "google499885782131bde1",
  },
  manifest: "/manifest.json",
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
    "https://x.com/YamadaToolsJP",
    "https://www.yamadatrade.com/"
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
    "日本国内サーバーで安全に使える無料オンラインツール集。PDF編集、画像変換、文書作成など200種類以上のツールを提供。",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const isProduction = !host.includes('staging');
  const pathname = headersList.get('x-pathname') ?? '/';
  const isHomepage = pathname === '/';

  return (
    <html lang="ja" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{__html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`}} />
      <script dangerouslySetInnerHTML={{__html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')});}`}} />
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        {isHomepage && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageItemListSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
            />
          </>
        )}
      </head>
      <body className={`antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${notoSansJP.className}`}>
        <GoogleAnalytics />
        <StagingBanner />
        <AuthProvider>
        <PricingTriggerProvider>
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
        <AdSenseLoader />
        <SupportChatbot />
        <GlobalSearchModal />
        <GlobalToolTracker />
        </ThemeProvider>
        </PricingTriggerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
