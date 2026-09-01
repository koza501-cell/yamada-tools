import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import { healthTools, statTools } from "@/config/tools";

// ============================================================
// /health — 健康・データ hub (RED theme)
// ============================================================
// All sub-routes (/health/bmi-calculator etc.) UNCHANGED.
// ============================================================

export const metadata: Metadata = {
  title: "健康計算ツール【無料】BMI・カロリー・理想体重・睡眠・妊娠・平均寿命",
  description:
    "BMI・基礎代謝・理想体重・睡眠時間・妊娠週数・アルコール分解・平均寿命など、健康と生活データに関する無料ツール。登録不要・日本国内サーバー処理・スマホ対応。",
  keywords: [
    "BMI 計算機",
    "カロリー 計算",
    "理想体重",
    "睡眠時間 計算",
    "妊娠週数",
    "アルコール 分解時間",
    "平均寿命",
    "健康計算ツール 無料",
  ],
  alternates: { canonical: "https://yamada-tools.jp/health" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "健康計算ツール【無料】 | 山田ツール",
    description:
      "BMI・カロリー・理想体重・睡眠・妊娠・アルコール・平均寿命を無料で計算。登録不要。",
    url: "https://yamada-tools.jp/health",
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
      name: "健康計算ツール",
      item: "https://yamada-tools.jp/health",
    },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "健康計算ツール",
  description: "BMI・カロリー・理想体重・睡眠・妊娠・平均寿命の無料計算ツール集",
  url: "https://yamada-tools.jp/health",
  datePublished: "2026-01-01",
  dateModified: "2026-05-04",
  hasPart: [
    ...healthTools.filter((t) => t.available),
    ...statTools.filter((t) => t.available && t.path.startsWith("/health/")),
  ]
    .map((t) => ({
      "@type": "SoftwareApplication",
      name: t.nameJa,
      url: `https://yamada-tools.jp${t.path}`,
    })),
};

export default function HealthHubPage() {
  // Single section with all health tools
  const healthSection: HubSection = {
    title: "健康・身体データ計算ツール",
    subtitle: "BMI・カロリー・理想体重・睡眠・妊娠・アルコール・平均寿命の無料計算ツール",
    badge: "健康",
    cols: 3,
    tools: [
      ...healthTools.filter((t) => t.available),
      ...statTools.filter((t) => t.available && t.path.startsWith("/health/")),
    ]
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: ["bmi-calculator", "calorie-calculator"].includes(t.id),
      })),
  };

  const sections = [healthSection].filter((s) => s.tools.length > 0);

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
          iconName: "heart",
          name: "健康・データ",
          eyebrow: "HEALTH & DATA",
          headline: "健康と身体のデータを、シンプルに。",
          tagline: "BMI・カロリー・睡眠・妊娠まで、健康判断を1サイトで",
          description:
            "BMI・基礎代謝・理想体重・睡眠時間・妊娠週数・アルコール分解時間・日本人の平均寿命データなど、健康と生活に関する計算ツール集。すべて無料・登録不要・日本国内サーバーで処理。",
          theme: "red",
          primaryCta: { label: "BMIを計算する", url: "/health/bmi-calculator" },
          secondaryCta: { label: "カロリー計算", url: "/health/calorie-calculator" },
        }}
        sections={sections}
      />
    </>
  );
}
