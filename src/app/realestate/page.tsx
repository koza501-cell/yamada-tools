import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import { realestateTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "不動産情報ツール【無料】用途地域・ハザードマップ・地価・学区 | 山田ツール",
  description:
    "住所を入力するだけで用途地域・ハザードマップ・地価・不動産取引価格・学区・人口推計を確認。国土交通省データ使用。賃貸vs購入・固定資産税の計算も無料。",
  keywords: [
    "用途地域 調べ方",
    "ハザードマップ 住所",
    "地価 確認",
    "不動産 取引価格",
    "学区 チェック",
    "人口推計",
    "固定資産税 計算",
    "賃貸 購入 比較",
  ],
  alternates: { canonical: "https://yamada-tools.jp/realestate" },
  openGraph: {
    title: "不動産情報ツール【無料】用途地域・ハザード・地価・学区",
    description: "住所だけで用途地域・ハザードマップ・地価・学区を確認。国土交通省データ使用、完全無料。",
    url: "https://yamada-tools.jp/realestate",
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
    { "@type": "ListItem", position: 2, name: "不動産情報ツール", item: "https://yamada-tools.jp/realestate" },
  ],
};

const API_TOOL_IDS = [
  "yoto-chiiki-checker",
  "hazard-checker",
  "land-price",
  "transaction-price",
  "school-district",
  "population",
];

const CALC_TOOL_IDS = [
  "rent-vs-buy",
  "moving-cost-calculator",
  "property-tax-calculator",
  "rental-cost-calculator",
  "acquisition-tax",
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "不動産向けツール",
  description: "住宅ローン・取得税・賃貸 vs 購入・人口推計など、不動産関連の判断ツール集",
  url: "https://yamada-tools.jp/realestate",
  isPartOf: { "@type": "WebSite", url: "https://yamada-tools.jp/", name: "山田ツール" },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: realestateTools.filter((t: any) => t.available).length,
    itemListElement: realestateTools.filter((t: any) => t.available).map((t: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "SoftwareApplication", name: t.nameJa, url: `https://yamada-tools.jp${t.path}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } },
    })),
  },
};

export default function RealEstatePage() {
  const all = realestateTools.filter((t) => t.available);

  const apiTools = all.filter((t) => API_TOOL_IDS.includes(t.id));
  const calcTools = all.filter((t) => CALC_TOOL_IDS.includes(t.id));

  const apiSection: HubSection = {
    title: "不動産情報チェッカー",
    subtitle: "住所を入力するだけで国土交通省データを即座に確認",
    badge: "国交省データ",
    cols: 3,
    tools: apiTools.map((t) => ({
      id: t.id,
      name: t.nameJa,
      description: t.description,
      url: t.path,
      icon: t.icon,
      popular: ["yoto-chiiki-checker", "hazard-checker"].includes(t.id),
    })),
  };

  const calcSection: HubSection = {
    title: "不動産計算ツール",
    subtitle: "賃貸vs購入・固定資産税・引越し費用を無料でシミュレーション",
    badge: "計算ツール",
    cols: 3,
    tools: calcTools.map((t) => ({
      id: t.id,
      name: t.nameJa,
      description: t.description,
      url: t.path,
      icon: t.icon,
    })),
  };

  const sections = [apiSection, calcSection].filter((s) => s.tools.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]) }}
      />
      <HubLayout
        niche={{
          iconName: "building",
          name: "不動産情報",
          eyebrow: "REAL ESTATE",
          headline: "不動産情報を、住所だけで。",
          tagline: "用途地域・ハザード・地価・学区・人口を1サイトで確認",
          description:
            "用途地域チェッカー・ハザードマップ・地価公示・不動産取引価格・学区・人口推計など、住まい選びに必要な情報を国土交通省データから即座に取得。賃貸vs購入・固定資産税の計算も無料。登録不要・完全無料。",
          theme: "olive",
          primaryCta: { label: "用途地域を調べる", url: "/realestate/yoto-chiiki-checker" },
          secondaryCta: { label: "ハザードマップを確認", url: "/realestate/hazard-checker" },
        }}
        sections={sections}
      />
    </>
  );
}
