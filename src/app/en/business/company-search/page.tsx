import type { Metadata } from "next";
import CompanySearchClient from "./client";
import { FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "Japanese Company Search [Free] | Verify any Japan Corporation by Name | Yamada Tools",
  description:
    "Free English search of all 5+ million registered Japanese companies. Verify any corporation instantly using official METI government data. No registration required. Find Toyota, Sony, Honda, Rakuten, and any 株式会社 by typing in English.",
  keywords: [
    "Japanese company search",
    "Japan corporation lookup",
    "verify Japanese company",
    "Japan business directory",
    "kabushiki kaisha search",
    "Japan company registry",
    "houjin bangou lookup",
    "japan company verification english",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/en/business/company-search",
    languages: {
      "en-US": "https://yamada-tools.jp/en/business/company-search",
      "ja-JP": "https://yamada-tools.jp/business/houjin-search",
      "x-default": "https://yamada-tools.jp/en/business/company-search",
    },
  },
  openGraph: {
    title: "Japanese Company Search — Verify Any Japan Corporation",
    description:
      "Free English search of 5M+ Japanese companies using official METI government data. Instant verification, no registration.",
    url: "https://yamada-tools.jp/en/business/company-search",
    siteName: "Yamada Tools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Japanese Company Search — Verify Any Japan Corporation",
    description:
      "Free English search of 5M+ Japanese companies. Official government data.",
  },
};

export default function CompanySearchPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f: { q: string; a: string }) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CompanySearchClient />
    </>
  );
}
