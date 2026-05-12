import type { Metadata } from "next";
import CompanySearchClient from "./client";
import { FAQS } from "./faqs";

/**
 * SAVE THIS FILE AS (REPLACE EXISTING):
 *   ~/projects/3websitepassive_income/yamada-tools/frontend-staging/src/app/en/business/company-search/page.tsx
 *
 * Changes vs. old file:
 *   - Title rewritten: 71 chars, keyword-front, "Free METI" trust signal
 *   - Description rewritten: verb-first, B2B intent keywords
 *   - Keywords expanded: 16 long-tail terms (was 8)
 *   - hreflang: added en, en-GB, ja variants
 *   - OG: added alternateLocale, image, alt text
 *   - Twitter: added site/creator handles, image
 *   - NEW: BreadcrumbList JSON-LD
 *   - NEW: HowTo JSON-LD (5 steps, big GEO win)
 *   - NEW: SoftwareApplication JSON-LD with full feature list
 *   - NEW: WebPage JSON-LD with speakable spec
 *   - PRESERVED: FAQPage JSON-LD (untouched, from existing FAQS export)
 *   - PRESERVED: CompanySearchClient import (no breakage)
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://yamada-tools.jp"),
  title:
    "Japan Company Search (English) — Free METI Verification | 5M+ Companies",
  description:
    "Verify any Japanese company in English — free. Instant lookup of 5M+ corporations using official METI gBizINFO government data. Check suppliers, partners, or 株式会社 in seconds. No signup.",
  keywords: [
    "Japan company search",
    "Japanese company search english",
    "verify Japanese company",
    "Japan corporation lookup",
    "japan corporate number lookup",
    "houjin bangou lookup",
    "kabushiki kaisha search",
    "japan business directory english",
    "japan company registry english",
    "check Japanese supplier",
    "verify japan business",
    "METI gBizINFO english",
    "japan KYB free",
    "japan due diligence tool",
    "find japanese company by name",
    "japan business verification",
  ],
  authors: [{ name: "Yamada Tools", url: "https://yamada-tools.jp" }],
  creator: "合同会社山田トレード (Yamada Trade LLC)",
  publisher: "合同会社山田トレード",
  category: "Business",
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
    canonical: "https://yamada-tools.jp/en/business/company-search",
    languages: {
      "en-US": "https://yamada-tools.jp/en/business/company-search",
      "en-GB": "https://yamada-tools.jp/en/business/company-search",
      en: "https://yamada-tools.jp/en/business/company-search",
      "ja-JP": "https://yamada-tools.jp/business/houjin-search",
      ja: "https://yamada-tools.jp/business/houjin-search",
      "x-default": "https://yamada-tools.jp/en/business/company-search",
    },
  },
  openGraph: {
    title:
      "Japan Company Search (English) — Free METI Verification | 5M+ Companies",
    description:
      "Verify any Japanese company in English — free. Instant lookup of 5M+ corporations using official METI gBizINFO data. No signup.",
    url: "https://yamada-tools.jp/en/business/company-search",
    siteName: "Yamada Tools",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    type: "website",
    images: [
      {
        url: "https://yamada-tools.jp/og-image.png",
        width: 1200,
        height: 630,
        alt: "Japan Company Search — Free English Verification (Yamada Tools)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YamadaToolsJP",
    creator: "@YamadaToolsJP",
    title: "Japan Company Search (English) — Free METI Verification",
    description:
      "Verify any Japanese company in English. Free, instant, no signup. 5M+ corporations from official government data.",
    images: ["https://yamada-tools.jp/og-image.png"],
  },
};

export default function CompanySearchPage() {
  const pageUrl = "https://yamada-tools.jp/en/business/company-search";

  // ─── FAQPage schema (preserved from original) ─────────────────────────
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

  // ─── BreadcrumbList schema (NEW) ──────────────────────────────────────
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
        item: "https://yamada-tools.jp/business",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Japan Company Search",
        item: pageUrl,
      },
    ],
  };

  // ─── HowTo schema (NEW — major GEO signal) ────────────────────────────
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: "How to Verify a Japanese Company in English (Free)",
    description:
      "Step-by-step guide to verify any Japanese company using free official METI government data. Confirm company existence, registration number, and business legitimacy in under 2 minutes.",
    inLanguage: "en",
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: "Company name (English, romaji, or Japanese)",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Yamada Tools — Japan Company Search",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Search the company name",
        text:
          "Type the Japanese company name in English (e.g., Toyota) or Japanese (e.g., トヨタ自動車). The tool searches METI's gBizINFO database in real time and auto-translates famous brand names.",
        url: `${pageUrl}#step1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Match the corporate number",
        text:
          "Each result shows the official 13-digit corporate number (法人番号). This is Japan's unique business identifier, like a US EIN. Cross-check the number against the supplier's invoice or website.",
        url: `${pageUrl}#step2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Verify the registered address",
        text:
          "Confirm the address shown matches the address on company letterhead, contracts, or website. Discrepancies should be explained — be wary of generic addresses in known virtual-office buildings.",
        url: `${pageUrl}#step3`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Check government activity records",
        text:
          "Companies with 100+ government records have established public footprints (patents, contracts, certifications). Zero records on a claimed major business is a red flag.",
        url: `${pageUrl}#step4`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Request certified documents for high-stakes deals",
        text:
          "For significant transactions, obtain a 履歴事項全部証明書 (Certificate of All Historical Matters) from Japan's Legal Affairs Bureau (法務局). Costs about ¥600 and shows full company history.",
        url: `${pageUrl}#step5`,
      },
    ],
  };

  // ─── SoftwareApplication schema (NEW) ─────────────────────────────────
  // aggregateRating intentionally omitted — adding fake ratings causes
  // structured-data penalties. Add real ratings only when you have a
  // genuine review system in place.
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${pageUrl}#software`,
    name: "Japan Company Search (English)",
    alternateName: [
      "Japanese Company Search",
      "Japan Corporation Lookup",
      "法人検索 (英語版)",
    ],
    url: pageUrl,
    description:
      "Free English search of 5+ million registered Japanese companies using official METI gBizINFO government data. Verify any Japanese corporation in seconds without registration.",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Company Verification / KYB / Due Diligence",
    operatingSystem: "Any (Web Browser)",
    browserRequirements:
      "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
    softwareVersion: "1.0",
    inLanguage: "en",
    isAccessibleForFree: true,
    permissions: "No registration required",
    featureList: [
      "Search 5+ million registered Japanese companies",
      "English-to-Japanese name auto-translation for famous brands",
      "13-digit corporate number (法人番号) lookup",
      "Registered address and postal code",
      "Government activity records count",
      "Corporate type identification (KK, GK, etc.)",
      "Free, no registration, no credit card",
      "Official METI gBizINFO data source",
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
        "Foreign businesses, importers, compliance professionals, recruiters, investors, lawyers, accountants doing business with Japan",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  // ─── WebPage schema with speakable (NEW — voice search) ───────────────
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: "Japan Company Search (English) — Free METI Verification",
    description:
      "Verify any Japanese company in English for free. Instant lookup of 5+ million corporations using official METI gBizINFO government data.",
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
      <CompanySearchClient />
    </>
  );
}
