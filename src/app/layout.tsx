import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BetaBanner from "@/components/common/BetaBanner";
import FeedbackButton from "@/components/common/FeedbackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import BackToTop from "@/components/BackToTop";

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
    "日本国内サーバーで安全に使える71の無料オンラインツール。PDF編集、画像変換、文書作成など、登録不要・完全無料でご利用いただけます。",
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
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    title: "山田ツール | 日本国内サーバーの無料オンラインツール",
    description:
      "日本国内サーバーで安全に使える71の無料オンラインツール。PDF編集、画像変換、文書作成など、登録不要・完全無料。",
    siteName: "山田ツール",
  },
  twitter: {
    card: "summary_large_image",
    title: "山田ツール | 日本国内サーバーの無料オンラインツール",
    description:
      "日本国内サーバーで安全に使える71の無料オンラインツール。PDF編集、画像変換、文書作成など、登録不要・完全無料。",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "google499885782131bde1",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "山田ツール",
  url: siteUrl,
  description:
    "日本国内サーバーで安全に使える無料オンラインツール集。PDF編集、画像変換、文書作成など71種類のツールを提供。",
  publisher: {
    "@type": "Organization",
    name: "合同会社山田トレード",
    address: {
      "@type": "PostalAddress",
      streetAddress: "台方937番地13",
      addressLocality: "東金市",
      addressRegion: "千葉県",
      postalCode: "283-0811",
      addressCountry: "JP",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <BetaBanner />
        <Header />
        <Breadcrumbs />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FeedbackButton />
        <BackToTop />
      </body>
    </html>
  );
}
