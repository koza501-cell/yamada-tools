import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import { taxTools, generatorTools } from "@/config/tools";

// ============================================================
// /tax — 税金・確定申告 hub (AMBER theme)
// ============================================================
// All sub-routes (/tax/income-tax-calculator etc.) UNCHANGED.
// ============================================================

export const metadata: Metadata = {
  title: "税金計算ツール【無料】所得税・消費税・ふるさと納税・相続税・贈与税 | 山田ツール",
  description:
    "所得税・消費税・ふるさと納税控除上限・相続税・贈与税・年末調整を無料で計算。登録不要・日本国内サーバー処理・スマホ対応。確定申告にも対応。",
  keywords: [
    "所得税 計算機",
    "ふるさと納税 計算",
    "消費税 計算",
    "相続税 計算",
    "贈与税 計算",
    "年末調整 計算",
    "税金計算ツール 無料",
  ],
  alternates: { canonical: "https://yamada-tools.jp/tax" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "税金計算ツール【無料】 | 山田ツール",
    description:
      "所得税・消費税・ふるさと納税控除上限・相続税・贈与税を無料で計算。登録不要。",
    url: "https://yamada-tools.jp/tax",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    {
      "@type": "ListItem",
      position: 2,
      name: "税金計算ツール",
      item: "https://yamada-tools.jp/tax",
    },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "税金計算ツール",
  description: "所得税・消費税・ふるさと納税・相続税・贈与税の無料計算ツール集",
  url: "https://yamada-tools.jp/tax",
  hasPart: taxTools
    .filter((t) => t.available)
    .map((t) => ({
      "@type": "SoftwareApplication",
      name: t.nameJa,
      url: `https://yamada-tools.jp${t.path}`,
    })),
};

export default function TaxHubPage() {
  // Section 1: Core tax tools
  const coreSection: HubSection = {
    title: "確定申告・所得税",
    subtitle: "所得税・消費税・ふるさと納税控除など毎年使う税金計算",
    badge: "確定申告",
    cols: 3,
    tools: taxTools
      .filter((t) => t.available)
      .filter((t) =>
        ["income-tax-calculator", "consumption-tax", "furusato-nozei-calculator"].includes(t.id)
      )
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: t.id === "furusato-nozei-calculator",
      })),
  };

  // Section 2: Inheritance & gift
  const inheritanceSection: HubSection = {
    title: "相続・贈与税",
    subtitle: "相続税・贈与税の試算で税負担を事前に把握",
    badge: "相続・贈与",
    cols: 3,
    tools: taxTools
      .filter((t) => t.available)
      .filter((t) =>
        ["inheritance-tax-calculator", "gift-tax-calculator"].includes(t.id)
      )
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 3: Year-end adjustment & related
  const yearEndAdj = generatorTools.find((t) => t.id === "nenmatsu-calc");
  const tNumber = generatorTools.find((t) => t.id === "invoice-validator");
  const yearEndSection: HubSection = {
    title: "年末調整・インボイス",
    subtitle: "年末調整の還付金計算・インボイス番号検証",
    badge: "年末調整",
    cols: 3,
    tools: [
      ...(yearEndAdj
        ? [
            {
              id: yearEndAdj.id,
              name: yearEndAdj.nameJa,
              description: yearEndAdj.description,
              url: yearEndAdj.path,
              icon: yearEndAdj.icon,
              popular: true,
            },
          ]
        : []),
      ...(tNumber
        ? [
            {
              id: tNumber.id,
              name: tNumber.nameJa,
              description: tNumber.description,
              url: tNumber.path,
              icon: tNumber.icon,
            },
          ]
        : []),
    ],
  };

  const sections = [coreSection, inheritanceSection, yearEndSection].filter(
    (s) => s.tools.length > 0
  );

  // Preserve SEO intro content from the original /tax page
  const introContent = (
    <section className="bg-white dark:bg-gray-800 border-b border-stone-100 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-4">
          yamada-tools.jpの税金計算ツールについて
        </h2>
        <p className="text-stone-600 dark:text-gray-300 leading-relaxed mb-6 text-sm">
          日本の税制に完全対応した無料ツールです。確定申告・節税対策・相続対策など、日常的な税務計算をシンプルにサポートします。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-bold text-kon dark:text-gray-200 mb-2 text-sm">
              確定申告を控えた方
            </h3>
            <p className="text-xs text-stone-600 dark:text-gray-300">
              所得税・ふるさと納税の控除計算を事前に把握したい方。
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-bold text-kon dark:text-gray-200 mb-2 text-sm">
              相続・贈与を検討中の方
            </h3>
            <p className="text-xs text-stone-600 dark:text-gray-300">
              相続税・贈与税の目安を事前に把握したい方。
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-bold text-kon dark:text-gray-200 mb-2 text-sm">
              ふるさと納税をお考えの方
            </h3>
            <p className="text-xs text-stone-600 dark:text-gray-300">
              年収から控除上限額を正確に把握したい方。
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-gray-700">
          <p className="text-xs text-stone-500 dark:text-gray-400">
            <time dateTime="2026-04-29">最終更新: 2026年4月</time>
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]),
        }}
      />
      <HubLayout
        niche={{
          iconName: "receipt",
          name: "税金・確定申告",
          eyebrow: "TAX & FILING",
          headline: "税金の悩みを、解決。",
          tagline: "確定申告・節税対策・相続まで日本の税制に完全対応",
          description:
            "所得税・消費税・ふるさと納税・相続税・贈与税・年末調整を無料で計算。確定申告や節税対策に役立つ高精度なシミュレーター。日本国内サーバー処理で安心。",
          theme: "amber",
          primaryCta: { label: "ふるさと納税を計算", url: "/tax/furusato-nozei-calculator" },
          secondaryCta: { label: "所得税を計算", url: "/tax/income-tax-calculator" },
        }}
        sections={sections}
      >
        {introContent}
      </HubLayout>
    </>
  );
}
