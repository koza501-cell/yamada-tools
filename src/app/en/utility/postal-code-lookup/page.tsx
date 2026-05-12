import type { Metadata } from "next";
import PostalCodeClient from "./client";
import { FAQS } from "./faqs";

export const metadata: Metadata = {
  metadataBase: new URL("https://yamada-tools.jp"),
  title:
    "Japan Postal Code Lookup (English) — Free Address ⇄ Zip Code | Yamada Tools",
  description:
    "Look up any Japanese postal code (郵便番号) in English. Free instant lookup of all 120,000+ Japanese zip codes with romaji address. Reverse search by address also supported. No signup.",
  keywords: [
    "japan postal code english",
    "japan zip code lookup",
    "郵便番号 english",
    "japan address postal code",
    "find japan zipcode",
    "japan mail address english",
    "japanese address romaji",
    "japan postal code format",
    "are japan postal codes 5 or 7 digits",
    "japan postal code by ward",
    "what is yuubin bangou",
    "shipping to japan postal code",
    "japan address to postal code english",
    "japan postal code reverse lookup",
    "tokyo postal code english",
    "japan zip code 7 digit",
  ],
  authors: [{ name: "Yamada Tools", url: "https://yamada-tools.jp" }],
  creator: "合同会社山田トレード (Yamada Trade LLC)",
  publisher: "合同会社山田トレード",
  category: "Utility",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://yamada-tools.jp/en/utility/postal-code-lookup",
    languages: {
      "en-US": "https://yamada-tools.jp/en/utility/postal-code-lookup",
      "en-GB": "https://yamada-tools.jp/en/utility/postal-code-lookup",
      en: "https://yamada-tools.jp/en/utility/postal-code-lookup",
      "x-default": "https://yamada-tools.jp/en/utility/postal-code-lookup",
    },
  },
  openGraph: {
    title: "Japan Postal Code Lookup (English) — Free Address ⇄ Zip Code",
    description:
      "Instant lookup for any Japanese postal code in English. Reverse search by address too. Free, no signup. 120,000+ zip codes.",
    url: "https://yamada-tools.jp/en/utility/postal-code-lookup",
    siteName: "Yamada Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://yamada-tools.jp/og-image.png",
        width: 1200,
        height: 630,
        alt: "Japan Postal Code Lookup (English) — Free Zip Code Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YamadaToolsJP",
    creator: "@YamadaToolsJP",
    title: "Japan Postal Code Lookup (English) — Free",
    description:
      "Instant lookup for any Japanese postal code in English. Reverse search by address. Free, no signup.",
    images: ["https://yamada-tools.jp/og-image.png"],
  },
};

export default function PostalCodePage() {
  const pageUrl = "https://yamada-tools.jp/en/utility/postal-code-lookup";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    inLanguage: "en",
    mainEntity: FAQS.map((f: { q: string; a: string }) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yamada-tools.jp/" },
      { "@type": "ListItem", position: 2, name: "English Tools", item: "https://yamada-tools.jp/en" },
      { "@type": "ListItem", position: 3, name: "Utility", item: "https://yamada-tools.jp/en/utility" },
      { "@type": "ListItem", position: 4, name: "Japan Postal Code Lookup", item: pageUrl },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: "How to Look Up a Japanese Postal Code in English",
    description:
      "Step-by-step guide to find the English address for any Japanese postal code (郵便番号), or find the postal code for any Japanese address.",
    inLanguage: "en",
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose lookup direction",
        text: "Select 'Postal code → Address' to convert a 7-digit Japanese zip code to an English address, or select 'Address → Postal code' to find the zip code for a Japanese address.",
        url: `${pageUrl}#step1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter the postal code or address",
        text: "For postal code lookup: enter the 7-digit code in any format (100-0001, 1000001, or 〒100-0001 — the tool normalizes automatically). For reverse lookup: enter the Japanese address including the ward/city name (e.g., 東京都千代田区千代田).",
        url: `${pageUrl}#step2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read the English result",
        text: "The result shows the full English romaji address, the Japanese kanji address, prefecture name, and formatted postal code. Use the copy button to copy to clipboard. Click 'Check in Property Report' to run a full due diligence on the address.",
        url: `${pageUrl}#step3`,
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${pageUrl}#software`,
    name: "Japan Postal Code Lookup (English)",
    alternateName: ["Japan Zip Code Lookup", "郵便番号 英語", "Japanese Address Romaji Converter"],
    url: pageUrl,
    description:
      "Free English lookup tool for all 120,000+ Japanese postal codes. Enter a 7-digit zip code to get the English romaji address, or enter a Japanese address to find the postal code. Data from JapanPost via zipcloud public API.",
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "Postal Code Lookup",
    operatingSystem: "Any (Web Browser)",
    browserRequirements: "Requires JavaScript.",
    inLanguage: "en",
    isAccessibleForFree: true,
    permissions: "No registration required",
    featureList: [
      "7-digit Japanese postal code → English romaji address",
      "Japanese address → postal code (reverse lookup)",
      "All 47 prefectures covered",
      "120,000+ postal codes in database",
      "Accepts 100-0001, 1000001, 〒100-0001 formats",
      "One-click copy to clipboard",
      "Link to property due diligence report per address",
      "Free, no registration, data from JapanPost via zipcloud",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY", availability: "https://schema.org/InStock" },
    provider: {
      "@type": "Organization",
      "@id": "https://yamada-tools.jp/#organization",
      name: "Yamada Trade LLC (合同会社山田トレード)",
      url: "https://yamada-tools.jp",
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: "Japan Postal Code Lookup (English) — Free Address ⇄ Zip Code",
    description:
      "Free English tool to look up any Japanese postal code or find the postal code for any Japanese address. 120,000+ zip codes, instant results.",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", "@id": "https://yamada-tools.jp/#website", name: "Yamada Tools", url: "https://yamada-tools.jp" },
    primaryImageOfPage: { "@type": "ImageObject", url: "https://yamada-tools.jp/og-image.png" },
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".direct-answer-block", ".faq-answer", "h1", "h2"] },
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PostalCodeClient />
    </>
  );
}
