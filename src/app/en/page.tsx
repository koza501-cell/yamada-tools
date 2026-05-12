import type { Metadata } from "next";
import Link from "next/link";

/**
 * SAVE THIS FILE AS (NEW FILE):
 *   ~/projects/3websitepassive_income/yamada-tools/frontend-staging/src/app/en/page.tsx
 *
 * PURPOSE: English homepage / hub at https://yamada-tools.jp/en
 *
 * Why this matters for international SEO:
 *   - Provides an internal-link target for all English content
 *   - Establishes /en/ as a coherent subtree (Google treats subtrees as
 *     locale signals)
 *   - Gives the English Company Search tool a parent page with PageRank
 *     to inherit
 *   - Makes the site feel "complete" in English (currently /en only has
 *     two tools deep in subfolders with no hub)
 *
 * AFTER DEPLOYING:
 *   - Confirm https://yamada-tools.jp/en/ renders correctly
 *   - The page is in the sitemap (handled in 7_sitemap_patch.txt)
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://yamada-tools.jp"),
  title: "Yamada Tools (English) — Free Japan Business Verification Tools",
  description:
    "Free English tools for foreign businesses dealing with Japan. Verify Japanese companies, check property addresses for hazard/zoning data, look up postal codes, and more. Official government data. No signup.",
  keywords: [
    "japan business tools english",
    "yamada tools english",
    "japan company verification",
    "japan business directory english",
    "japan online tools english",
    "foreign business japan",
    "japan property check english",
    "japan address due diligence",
    "japan postal code lookup english",
    "japan zip code english",
  ],
  authors: [{ name: "Yamada Tools" }],
  alternates: {
    canonical: "https://yamada-tools.jp/en",
    languages: {
      "en-US": "https://yamada-tools.jp/en",
      en: "https://yamada-tools.jp/en",
      "ja-JP": "https://yamada-tools.jp/",
      "x-default": "https://yamada-tools.jp/en",
    },
  },
  openGraph: {
    title: "Yamada Tools (English) — Free Japan Business Tools",
    description:
      "Free English tools for foreign businesses dealing with Japan. Verify Japanese companies, sign PDFs, and more — no signup.",
    url: "https://yamada-tools.jp/en",
    siteName: "Yamada Tools",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    type: "website",
    images: [
      {
        url: "https://yamada-tools.jp/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yamada Tools — Free Japan Business Tools in English",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YamadaToolsJP",
    title: "Yamada Tools (English) — Free Japan Business Tools",
    description:
      "Free English tools for foreign businesses dealing with Japan. Verify companies, sign PDFs, and more.",
    images: ["https://yamada-tools.jp/og-image.png"],
  },
};

export default function EnglishHomePage() {
  const pageUrl = "https://yamada-tools.jp/en";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://yamada-tools.jp/#organization",
    name: "Yamada Trade LLC",
    alternateName: "合同会社山田トレード",
    url: "https://yamada-tools.jp",
    logo: "https://yamada-tools.jp/logo-icon.webp",
    description:
      "Yamada Trade LLC provides free online tools for Japanese businesses, with English versions for foreign companies interacting with Japan.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: "Chiba",
    },
    sameAs: [
      "https://www.facebook.com/yamada.tools/",
      "https://x.com/YamadaToolsJP",
      "https://www.yamadatrade.jp/",
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: "Yamada Tools (English)",
    description:
      "Free English tools for foreign businesses interacting with Japan. Verify Japanese companies, sign PDFs, and more.",
    inLanguage: "en",
    isPartOf: {
      "@id": "https://yamada-tools.jp/#website",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
        {/* ─── Hero ─────────────────────────────────────────── */}
        <header className="max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Free Japan Business Tools <span className="text-kon dark:text-sakura">(English)</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Tools for foreign businesses, importers, recruiters, and
            researchers interacting with Japan. Free, no signup, no credit
            card required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700">
              <span aria-hidden>🇯🇵</span> Japan-domestic servers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700">
              <span aria-hidden>🔒</span> SSL encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700">
              <span aria-hidden>⚡</span> No signup
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700">
              <span aria-hidden>🆓</span> Always free tier
            </span>
          </div>
        </header>

        {/* ─── Featured tool ───────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mt-4">
          <Link
            href="/en/business/company-search"
            className="block bg-gradient-to-br from-kon to-ai dark:from-kon dark:to-ai text-white rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl md:text-5xl flex-shrink-0" aria-hidden>
                🏢
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider opacity-80 mb-1">
                  Featured Tool
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Japan Company Search
                </h2>
                <p className="text-base md:text-lg opacity-95 mb-3">
                  Verify any Japanese company in English using official METI
                  gBizINFO government data. 5+ million registered companies
                  searchable in seconds.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold">
                  Try it now <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* ─── All English tools ───────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            All English Tools
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ToolCard
              href="/en/business/company-search"
              icon="🏢"
              title="Japan Company Search"
              description="Verify any Japanese company in English. Free METI gBizINFO data, 5M+ companies, no signup. Perfect for KYB, due diligence, and supplier verification."
            />
            <ToolCard
              href="/en/realestate/property-report"
              icon="🏠"
              title="Japan Property Due Diligence Report"
              description="Check any Japanese address: hazard map, zoning, land prices, school district, and 50-year population projection in one English report. Free, no signup. Official MLIT government data."
            />
            <ToolCard
              href="/en/pdf-text-input"
              icon="📝"
              title="PDF Text Input & Signature"
              description="Add text, signatures, and stamps to PDF files. All processing is local — files never leave your browser. Free, no signup."
            />
            <ToolCard
              href="/en/utility/postal-code-lookup"
              icon="📮"
              title="Japan Postal Code Lookup"
              description="Two-way lookup of any Japanese postal code in English. Enter a zip code to get the romaji address, or use dropdowns to find the postal code for any address. Covers all 120,000+ Japan postal codes."
            />
          </div>
        </section>

        {/* ─── Why Yamada Tools ────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mt-12">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why use Yamada Tools for Japan business?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Feature
                icon="🇯🇵"
                title="Japan-domestic data"
                text="All tools use official Japanese government data sources (METI, National Tax Agency, Patent Office). Same data Japanese banks and lawyers reference."
              />
              <Feature
                icon="🔒"
                title="Privacy-first"
                text="Files never leave your browser when possible. Server-side processing happens on Japan-domestic servers with auto-delete after 60 minutes."
              />
              <Feature
                icon="🆓"
                title="Free tier forever"
                text="No signup, no credit card, no daily limits for normal use. Optional PRO subscription removes limits and unlocks batch features."
              />
            </div>
          </div>
        </section>

        {/* ─── Looking for Japanese? ───────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mt-8">
          <div className="bg-gray-50 dark:bg-kon/20 border border-gray-200 dark:border-kon rounded-xl p-5 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              日本語のユーザーは、日本語版サイトをご利用ください。<br />
              <span className="text-xs">Japanese-speaking users, please visit our Japanese site.</span>
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2 bg-kon hover:bg-ai text-white text-sm font-semibold rounded-lg transition"
            >
              日本語サイトへ →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function ToolCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-kon dark:hover:border-ai transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0" aria-hidden>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="text-3xl mb-2" aria-hidden>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
    </div>
  );
}
