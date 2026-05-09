import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import {
  generatorTools,
  convertTools,
  imageTools,
  healthTools,
  utilityTools,
} from "@/config/tools";

// ============================================================
// /generator — 暮らし・便利 hub (PINK theme)
// ============================================================
// Repositioned as "lifestyle & utility" hub.
// Combines: generatorTools + select convert/image/health/utility tools.
// All sub-routes UNCHANGED.
// ============================================================

export const metadata: Metadata = {
  title: "暮らし・便利ツール【無料】QR・パスワード・和暦・電子印鑑・年齢計算 | 山田ツール",
  description:
    "QRコード作成・パスワード生成・和暦変換・電子印鑑・年齢計算・祝日確認・ランダム抽選など、毎日の暮らしや業務に役立つ便利ツールを無料で提供。登録不要・スマホ対応。",
  keywords:
    "QRコード作成, パスワード生成, 和暦変換, 電子印鑑, 年齢計算, 祝日確認, ランダム抽選, 文字数カウント, 単位変換, 無料",
  alternates: {
    canonical: "https://yamada-tools.jp/generator",
  },
  openGraph: {
    title: "暮らし・便利ツール【無料】 | 山田ツール",
    description:
      "QR・パスワード・和暦・電子印鑑など、暮らしや業務に役立つ無料ツール集。",
    url: "https://yamada-tools.jp/generator",
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
      name: "暮らし・便利ツール",
      item: "https://yamada-tools.jp/generator",
    },
  ],
};

export default function GeneratorHubPage() {
  const gen = generatorTools.filter((t) => t.available);

  // Section 1: Daily life utilities (everyone uses these)
  const dailySection: HubSection = {
    title: "毎日の暮らしツール",
    subtitle: "QRコード・電子印鑑・和暦変換・祝日確認など、生活の便利ツール",
    badge: "暮らし",
    cols: 4,
    tools: [
      ...gen
        .filter((t) =>
          ["hanko", "qr-reader", "holiday-checker", "age-calc"].includes(t.id)
        )
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
      ...convertTools
        .filter((t) => t.available)
        .filter((t) => ["wareki-seireki", "postcode", "tsubo-converter"].includes(t.id))
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
      ...imageTools
        .filter((t) => t.available && t.id === "qr-code")
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
          popular: true,
        })),
    ],
  };

  // Section 2: Security & passwords
  const securitySection: HubSection = {
    title: "セキュリティ・パスワード",
    subtitle: "強力なパスワード・暗号化ZIPで情報を守る",
    badge: "セキュリティ",
    cols: 3,
    tools: gen
      .filter((t) => ["password-generator", "password-zip", "hash-generator"].includes(t.id))
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 3: Text & data utilities
  const textSection: HubSection = {
    title: "テキスト・データ加工",
    subtitle: "文字数カウント・差分比較・全角半角変換などのテキスト処理",
    badge: "テキスト",
    cols: 4,
    tools: [
      ...gen
        .filter((t) =>
          ["char-counter", "text-diff", "text-case", "lorem-ipsum"].includes(t.id)
        )
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
      ...convertTools
        .filter((t) => t.available)
        .filter((t) =>
          ["zenkaku-hankaku", "furigana", "url-encode", "phone-formatter"].includes(t.id)
        )
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
    ],
  };

  // Section 4: Calculators & lottery
  const calcSection: HubSection = {
    title: "計算・抽選ツール",
    subtitle: "消費税計算・ランダム抽選・カラーコード変換など",
    badge: "計算",
    cols: 4,
    tools: [
      ...gen
        .filter((t) =>
          ["tax-calculator", "random-picker", "color-convert", "salary-calc"].includes(t.id)
        )
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
      ...utilityTools
        .filter((t) => t.available)
        .filter((t) => ["date-calculator", "unit-converter-utility"].includes(t.id))
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
    ],
  };

  // Section 5: Health (BMI etc.)
  const healthSection: HubSection = {
    title: "健康・ヘルスケア",
    subtitle: "BMI・カロリー・睡眠時間など健康管理ツール",
    badge: "健康",
    cols: 3,
    tools: healthTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 6: Developer tools (kept smaller, secondary)
  const devSection: HubSection = {
    title: "開発者向けツール",
    subtitle: "JSON整形・正規表現テスター・Base64変換などプログラマー向け",
    badge: "開発",
    cols: 3,
    tools: [
      ...gen
        .filter((t) => ["json-format", "regex-test"].includes(t.id))
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
      ...convertTools
        .filter((t) => t.available && t.id === "base64")
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
    ],
  };

  const sections = [
    dailySection,
    securitySection,
    textSection,
    calcSection,
    healthSection,
    devSection,
  ].filter((s) => s.tools.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HubLayout
        niche={{
          iconName: "home",
          name: "暮らし・便利",
          eyebrow: "LIFESTYLE & UTILITY",
          headline: "暮らしを、もっとスマートに。",
          tagline: "QR・パスワード・和暦・電子印鑑など毎日使える便利ツール",
          description:
            "QRコード作成・パスワード生成・和暦変換・電子印鑑・年齢計算・祝日確認まで、毎日の暮らしや業務に役立つ便利ツールを無料で。登録不要・スマホ対応。",
          theme: "pink",
          primaryCta: { label: "電子印鑑を作成", url: "/generator/hanko" },
          secondaryCta: { label: "QRコード作成", url: "/image/qr-code" },
        }}
        sections={sections}
      />
    </>
  );
}
