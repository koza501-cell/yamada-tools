import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Japan Real Estate Tools (English) — Free Property Due Diligence",
  description: "Free English tools to research Japanese real estate. Check hazard maps, zoning, land prices, and more using official government data. No signup required.",
  alternates: {
    canonical: "https://yamada-tools.jp/en/realestate",
    languages: {
      en: "https://yamada-tools.jp/en/realestate",
      "en-US": "https://yamada-tools.jp/en/realestate",
      "ja-JP": "https://yamada-tools.jp/realestate",
      "x-default": "https://yamada-tools.jp/en/realestate",
    },
  },
  openGraph: {
    title: "Japan Real Estate Tools (English)",
    description: "Free English tools for Japan property due diligence. Official government data. No signup.",
    url: "https://yamada-tools.jp/en/realestate",
    siteName: "Yamada Tools",
    locale: "en_US",
    type: "website",
  },
};

export default function EnRealEstatePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <header className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Japan Real Estate Tools <span className="text-kon dark:text-sakura">(English)</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Research any Japanese property using official government data. Free, no signup required.
        </p>
      </header>

      <section className="max-w-4xl mx-auto px-4 mt-4">
        <Link
          href="/en/realestate/property-report"
          className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-kon dark:hover:border-ai transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0" aria-hidden>🏠</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Japan Property Due Diligence Report
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Check any Japanese address: hazard map, zoning, land prices, school district, and 50-year population projection — all in one English report. Official MLIT government data.
              </p>
              <span className="text-sm font-semibold text-kon dark:text-ai">Try it free →</span>
            </div>
          </div>
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-8 text-center">
        <Link href="/en" className="text-sm text-gray-500 hover:text-kon dark:hover:text-ai">
          ← Back to all English tools
        </Link>
      </section>
    </div>
  );
}
