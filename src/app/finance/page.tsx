import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import {
  financeTools,
  careerTools,
  insuranceTools,
  realestateTools,
  businessTools,
  debtTools,
} from "@/config/tools";

// ============================================================
// /finance — 金融・資産運用 hub (GREEN theme)
// ============================================================
// Combines: financeTools (NISA/loan/FX) + career + insurance + realestate
// + business + debt = comprehensive financial planning hub.
// All sub-routes (/finance/nisa-simulator etc.) UNCHANGED.
// ============================================================

export const metadata: Metadata = {
  title: "金融・資産運用ツール【無料】NISA・iDeCo・住宅ローン・FX・年金 | 山田ツール",
  description:
    "新NISA・iDeCo・住宅ローン・FX損益・老後資金・退職金・転職・年収・社会保険料・相続税など30種以上の無料金融計算ツール。専門家相談前の事前確認に最適。登録不要・日本国内サーバー処理・スマホ対応。完全無料でご利用いただけます。",
  keywords: [
    "NISA シミュレーター",
    "住宅ローン 計算機",
    "FX 損益計算",
    "老後資金 計算",
    "iDeCo NISA 比較",
    "退職金計算",
    "転職シミュレーター",
    "金融計算ツール 無料",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/finance",
  },
  openGraph: {
    title: "金融・資産運用ツール【無料】 | 山田ツール",
    description:
      "新NISA・iDeCo・住宅ローン・FX・老後資金など30種以上の金融計算ツール。",
    url: "https://yamada-tools.jp/finance",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-hub.png",
        width: 1200,
        height: 630,
        alt: "金融計算ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "金融・資産運用ツール【無料】 | 山田ツール",
    description: "新NISA・iDeCo・住宅ローン・FX・老後資金など30種以上の金融計算ツール。",
    images: ["https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-hub.png"],
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
      name: "金融・資産運用ツール",
      item: "https://yamada-tools.jp/finance",
    },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "金融計算ツール",
  description: "新NISA・iDeCo・住宅ローン・FX・老後資金の無料シミュレーター集",
  url: "https://yamada-tools.jp/finance",
  datePublished: "2026-01-01",
  dateModified: "2026-04-29",
  hasPart: financeTools
    .filter((t) => t.available)
    .map((t) => ({
      "@type": "SoftwareApplication",
      name: t.nameJa,
      url: `https://yamada-tools.jp${t.path}`,
    })),
};

export default function FinanceHubPage() {
  // Section 1: Core finance (NISA, loan, FX, retirement, comparison)
  const coreSection: HubSection = {
    title: "資産運用シミュレーター",
    subtitle: "新NISA・iDeCo・住宅ローン・FX・老後資金の高精度シミュレーター",
    badge: "コア",
    cols: 3,
    tools: financeTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: ["nisa-simulator", "jutaku-loan"].includes(t.id),
      })),
  };

  // Section 2: Career & income
  const careerSection: HubSection = {
    title: "転職・年収・給与",
    subtitle: "転職判断・残業代・失業保険・退職金など働く人の計算ツール",
    badge: "キャリア",
    cols: 3,
    tools: careerTools
      .filter((t) => t.available)
      .slice(0, 9)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 3: Insurance
  const insuranceSection: HubSection = {
    title: "保険",
    subtitle: "生命保険・医療保険の必要額シミュレーション",
    badge: "保険",
    cols: 3,
    tools: insuranceTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 4: Real estate
  const realestateSection: HubSection = {
    title: "不動産・住まい",
    subtitle: "賃貸vs購入・固定資産税・引越し費用など住まいに関する計算",
    badge: "不動産",
    cols: 3,
    tools: realestateTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 5: Business / 法人
  const businessSection: HubSection = {
    title: "ビジネス・法人",
    subtitle: "法人化・役員報酬・法人税・フリーランス税金など事業者向け計算",
    badge: "事業者",
    cols: 3,
    tools: businessTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 6: Debt
  const debtSection: HubSection = {
    title: "借金・返済",
    subtitle: "借金返済・リボ払い・債務整理など返済計画ツール",
    badge: "返済",
    cols: 3,
    tools: debtTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  const sections = [
    coreSection,
    careerSection,
    insuranceSection,
    realestateSection,
    businessSection,
    debtSection,
  ].filter((s) => s.tools.length > 0);

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
          iconName: "chart",
          name: "金融・資産運用",
          eyebrow: "FINANCE & WEALTH",
          headline: "お金の不安に、答えを。",
          tagline: "NISA・住宅ローン・年金まで、人生のお金を1サイトで計算",
          description:
            "新NISA・iDeCo・住宅ローン・FX損益・老後資金・転職・退職金まで、人生のあらゆるお金の判断を支える30種以上の高精度シミュレーター。すべて無料・登録不要・日本国内サーバーで処理。",
          theme: "green",
          primaryCta: { label: "NISAをシミュレーション", url: "/finance/nisa-simulator" },
          secondaryCta: { label: "住宅ローン計算", url: "/finance/jutaku-loan" },
        }}
        sections={sections}
      />
    </>
  );
}
