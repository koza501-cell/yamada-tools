import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Japan Utility Tools (English) — Free Online Tools",
  description: "Free English utility tools for Japan. Look up Japanese postal codes, addresses, and more. No signup required.",
  alternates: {
    canonical: "https://yamada-tools.jp/en/utility",
    languages: {
      en: "https://yamada-tools.jp/en/utility",
      "en-US": "https://yamada-tools.jp/en/utility",
      "ja-JP": "https://yamada-tools.jp/utility",
      "x-default": "https://yamada-tools.jp/en/utility",
    },
  },
  openGraph: {
    title: "Japan Utility Tools (English)",
    description: "Free English utility tools for Japan. Postal code lookup and more. No signup.",
    url: "https://yamada-tools.jp/en/utility",
    siteName: "Yamada Tools",
    locale: "en_US",
    type: "website",
  },
};

export default function EnUtilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <header className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Japan Utility Tools <span className="text-kon dark:text-sakura">(English)</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Handy free tools for everyday Japan tasks. No signup required.
        </p>
      </header>

      <section className="max-w-4xl mx-auto px-4 mt-4">
        <Link
          href="/en/utility/postal-code-lookup"
          className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-kon dark:hover:border-ai transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0" aria-hidden>📮</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Japan Postal Code Lookup
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Two-way lookup of any Japanese postal code in English. Enter a zip code to get the romaji address, or find the postal code for any address. Covers all 120,000+ Japan postal codes.
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
