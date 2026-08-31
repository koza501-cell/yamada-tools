import type { Metadata } from "next";
import BankCodeClient from "./client";
import { FAQS } from "./faqs";

export const metadata: Metadata = {
  metadataBase: new URL("https://yamada-tools.jp"),
  title:
    "Japan Bank, Branch & SWIFT Code Lookup (English) — Free Zengin + BIC Search | Yamada Tools",
  description:
    "Free English lookup of all Japanese bank codes, branch codes, and SWIFT/BIC codes for international wire transfers. Find MUFG, Mizuho, SMBC, Japan Post Bank codes instantly. No signup.",
  keywords: [
    "japan bank code english",
    "zengin code lookup",
    "japan wire transfer bank code",
    "MUFG bank code",
    "SMBC bank code",
    "mizuho bank code english",
    "japan SWIFT code english",
    "japan BIC code lookup",
    "mizuho SWIFT code",
    "MUFG SWIFT code",
    "SMBC BIC code",
    "wire transfer to japan SWIFT",
    "japan branch code lookup",
    "japan financial institution code",
    "金融機関コード english",
    "japan bank code format",
    "find japan bank code by name english",
    "japan post bank code 9900",
    "japan account number format",
    "how to wire transfer to japan bank account",
    "is zengin code free",
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
    canonical: "https://yamada-tools.jp/en/business/bank-code-lookup",
    languages: {
      "en-US": "https://yamada-tools.jp/en/business/bank-code-lookup",
      "en-GB": "https://yamada-tools.jp/en/business/bank-code-lookup",
      en: "https://yamada-tools.jp/en/business/bank-code-lookup",
      "ja-JP": "https://yamada-tools.jp/reference/bank-codes",
      ja: "https://yamada-tools.jp/reference/bank-codes",
      "x-default": "https://yamada-tools.jp/en/business/bank-code-lookup",
    },
  },
  openGraph: {
    title: "Japan Bank, Branch & SWIFT Code Lookup (English) — Free Zengin + BIC Search",
    description:
      "Free English lookup for all Japanese bank codes, branch codes, and SWIFT/BIC codes. Zengin + international wire transfer codes. No signup.",
    url: "https://yamada-tools.jp/en/business/bank-code-lookup",
    siteName: "Yamada Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://yamada-tools.jp/og-image.png",
        width: 1200,
        height: 630,
        alt: "Japan Bank & Branch Code Lookup (English) — Free Zengin Code Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YamadaToolsJP",
    creator: "@YamadaToolsJP",
    title: "Japan Bank, Branch & SWIFT Code Lookup (English) — Free",
    description:
      "Free English lookup for all Japanese bank codes, branch codes, and SWIFT/BIC codes. No signup.",
    images: ["https://yamada-tools.jp/og-image.png"],
  },
};

export default function BankCodePage() {
  const pageUrl = "https://yamada-tools.jp/en/business/bank-code-lookup";

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
      { "@type": "ListItem", position: 3, name: "Business Tools", item: "https://yamada-tools.jp/en/business/company-search" },
      { "@type": "ListItem", position: 4, name: "Bank Code Lookup", item: pageUrl },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: "How to Look Up a Japanese Bank Code in English",
    description:
      "Step-by-step guide to find the Zengin bank code and branch code for any Japanese bank.",
    inLanguage: "en",
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Search for the bank",
        text: "Use the 'Bank search' tab and type the bank name in English (e.g., 'mizuho'), romaji, or Japanese (e.g., 'みずほ'). Click the bank from the results list.",
        url: `${pageUrl}#step1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select the branch",
        text: "After selecting a bank, all branches appear. Click a branch or use the dropdown in the 'Bank → Branch' tab to select by name.",
        url: `${pageUrl}#step2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy the codes",
        text: "The result card shows the 4-digit bank code and 3-digit branch code with copy buttons. Use these codes for domestic wire transfers (振込) or to fill out payroll forms.",
        url: `${pageUrl}#step3`,
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${pageUrl}#software`,
    name: "Japan Bank & Branch Code Lookup (English)",
    alternateName: ["Zengin Code Lookup", "Japan Bank Code Search", "金融機関コード 英語"],
    url: pageUrl,
    description:
      "Free English lookup tool for all Japanese bank and branch codes (Zengin format). Search by bank name in English, romaji, or Japanese to find the 4-digit bank code and 3-digit branch code needed for wire transfers.",
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Bank Code Lookup",
    operatingSystem: "Any (Web Browser)",
    browserRequirements: "Requires JavaScript.",
    inLanguage: "en",
    isAccessibleForFree: true,
    permissions: "No registration required",
    featureList: [
      "Search all Japanese banks by English or Japanese name",
      "4-digit Zengin bank code lookup",
      "3-digit branch code lookup",
      "Cascading bank → branch dropdown",
      "One-click copy for bank and branch codes",
      "Explains Zengin vs SWIFT/BIC difference",
      "Top 20 Japanese bank reference table",
      "Free, no registration",
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
    name: "Japan Bank & Branch Code Lookup (English) — Free Zengin Code Search",
    description:
      "Free English tool to look up any Japanese bank code or branch code. Search by bank name in English or Japanese. Zengin codes for wire transfers.",
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
      <BankCodeClient />
    </>
  );
}
