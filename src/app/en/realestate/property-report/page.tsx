import type { Metadata } from "next";
import PropertyReportClient from "./client";
import { FAQS } from "./faqs";

export const metadata: Metadata = {
  metadataBase: new URL("https://yamada-tools.jp"),
  title:
    "Japan Property Due Diligence Report (English) — Free Address Check | Yamada Tools",
  description:
    "Check any Japan address before buying — free. Hazard map, zoning, land price, transaction history & population trend in English. For foreign buyers, akiya investors, and B2B partners.",
  keywords: [
    "japan property due diligence english",
    "japan property hazard map english",
    "check japanese address before buying",
    "akiya due diligence english",
    "japan zoning regulations english",
    "foreign buyer japan property checklist",
    "japan flood risk address english",
    "is this japan address safe to buy",
    "japan land price english",
    "japan building coverage ratio english",
    "japan floor area ratio english",
    "japan property report free",
    "reinfolib english",
    "japan real estate due diligence",
    "youto chiiki english",
    "japan hazard map english free",
  ],
  authors: [{ name: "Yamada Tools", url: "https://yamada-tools.jp" }],
  creator: "合同会社山田トレード (Yamada Trade LLC)",
  publisher: "合同会社山田トレード",
  category: "Real Estate",
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
    canonical: "https://yamada-tools.jp/en/realestate/property-report",
    languages: {
      "en-US": "https://yamada-tools.jp/en/realestate/property-report",
      "en-GB": "https://yamada-tools.jp/en/realestate/property-report",
      en: "https://yamada-tools.jp/en/realestate/property-report",
      "ja-JP": "https://yamada-tools.jp/realestate/yoto-chiiki-checker",
      ja: "https://yamada-tools.jp/realestate/yoto-chiiki-checker",
      "x-default": "https://yamada-tools.jp/en/realestate/property-report",
    },
  },
  openGraph: {
    title:
      "Japan Property Due Diligence Report (English) — Free Address Check",
    description:
      "Hazard map, zoning, land price & population trend in English for any Japan address. Free, no signup. For foreign buyers and akiya investors.",
    url: "https://yamada-tools.jp/en/realestate/property-report",
    siteName: "Yamada Tools",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    type: "website",
    images: [
      {
        url: "https://yamada-tools.jp/og-image.png",
        width: 1200,
        height: 630,
        alt: "Japan Property Due Diligence Report — Free English Address Check (Yamada Tools)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YamadaToolsJP",
    creator: "@YamadaToolsJP",
    title: "Japan Property Due Diligence Report (English) — Free",
    description:
      "Hazard map, zoning, land price & population trend in English for any Japan address. Free, no signup.",
    images: ["https://yamada-tools.jp/og-image.png"],
  },
};

export default function PropertyReportPage() {
  const pageUrl = "https://yamada-tools.jp/en/realestate/property-report";

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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://yamada-tools.jp/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Business Tools",
        item: "https://yamada-tools.jp/en/business",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Japan Property Report",
        item: pageUrl,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: "How to Check a Japan Property Address Before Buying (English, Free)",
    description:
      "Step-by-step guide to run due diligence on any Japanese property address in English — covering hazard risks, zoning, land prices, and population trends using free official government data.",
    inLanguage: "en",
    totalTime: "PT3M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: "Japanese property address (kanji, kana, or postal code)",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Yamada Tools — Japan Property Due Diligence Report",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter the property address",
        text:
          "Type the Japanese address in the search field — kanji (e.g. 東京都千代田区千代田1-1), romaji, or postal code are all accepted. The tool uses Japan's official GSI geocoding service to pinpoint the exact location.",
        url: `${pageUrl}#step1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review the hazard assessment",
        text:
          "Check the Hazard Summary section. Each of five hazards (flood inundation depth, landslide warning zone, liquefaction risk, tsunami zone, storm surge zone) is rated None / Low / Medium / High. Any 'High' rating means the address is in a government-designated danger zone requiring serious consideration.",
        url: `${pageUrl}#step2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Check the zoning classification",
        text:
          "Review the Zoning Summary. Japan's 13-category zoning system determines what can be built and operated. Note the building coverage ratio (max footprint %) and floor area ratio (max total floor space %). Zones 12–13 prohibit housing; zones 1–4 restrict commercial use.",
        url: `${pageUrl}#step3`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Analyze land prices and transaction history",
        text:
          "Review the Land Price section for the official benchmark price per ㎡ and year-on-year change. Then check Recent Transaction Prices for actual completed sales in the area — this shows whether the listing price is in line with the market.",
        url: `${pageUrl}#step4`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Review population trends and school districts",
        text:
          "Check the Population Trend section for 50-year projections. A 'Declining significantly' result in a rural area signals structural demand risk for long-term investment. School district data identifies the nearest public elementary and junior high schools.",
        url: `${pageUrl}#step5`,
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${pageUrl}#software`,
    name: "Japan Property Due Diligence Report (English)",
    alternateName: [
      "Japan Property Hazard Map English",
      "Japan Address Due Diligence",
      "用途地域チェッカー (英語版)",
    ],
    url: pageUrl,
    description:
      "Free English property due diligence report for any Japanese address. Covers hazard map, zoning classification, land prices, transaction history, school districts, and 50-year population projections using official MLIT REINFOLIB government data.",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Real Estate Due Diligence",
    operatingSystem: "Any (Web Browser)",
    browserRequirements: "Requires JavaScript.",
    softwareVersion: "1.0",
    inLanguage: "en",
    isAccessibleForFree: true,
    permissions: "No registration required",
    featureList: [
      "Flood inundation risk (5 depth levels)",
      "Landslide warning zone check",
      "Liquefaction risk assessment",
      "Tsunami and storm surge zone check",
      "13-category zoning classification in English",
      "Building coverage ratio and FAR lookup",
      "Official land price benchmark (ground level) with YoY trend",
      "Recent real estate transaction price statistics",
      "Nearest school district identification",
      "50-year population projection trend",
      "All data in English, raw Japanese data also available",
      "Free, no registration, data from official MLIT REINFOLIB",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      "@id": "https://yamada-tools.jp/#organization",
      name: "Yamada Trade LLC (合同会社山田トレード)",
      url: "https://yamada-tools.jp",
      address: {
        "@type": "PostalAddress",
        addressCountry: "JP",
        addressRegion: "Chiba",
      },
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "Foreign buyers, akiya investors, real estate professionals, B2B partners, relocation consultants, due diligence analysts",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: "Japan Property Due Diligence Report (English) — Free Address Check",
    description:
      "Check any Japan address before buying — hazard map, zoning, land price, and population trend fully in English. Free, official MLIT government data.",
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://yamada-tools.jp/#website",
      name: "Yamada Tools",
      url: "https://yamada-tools.jp",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://yamada-tools.jp/og-image.png",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".direct-answer-block", ".faq-answer", "h1", "h2"],
    },
    breadcrumb: {
      "@id": `${pageUrl}#breadcrumb`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PropertyReportClient />
    </>
  );
}
