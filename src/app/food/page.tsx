import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import { foodTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "飲食・食品ツール【無料】原価率・栄養成分表示・フードロス | 山田ツール",
  description:
    "飲食店の原価率計算・適正売価・FLコスト、食品の栄養成分表示値計算、フードロスコスト管理など飲食・食品業向けの無料ツール。登録不要・日本国内サーバー処理。",
  alternates: { canonical: "https://yamada-tools.jp/food" },
  openGraph: {
    title: "飲食・食品ツール【無料】 | 山田ツール",
    description: "原価率・栄養成分表示・フードロスコストを無料で計算。登録不要。",
    url: "https://yamada-tools.jp/food",
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
    { "@type": "ListItem", position: 2, name: "飲食・食品ツール", item: "https://yamada-tools.jp/food" },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "飲食・食品ツール",
  description: "原価率・栄養成分表示・フードロスコストの無料計算ツール集",
  url: "https://yamada-tools.jp/food",
  datePublished: "2026-05-01",
  dateModified: "2026-05-07",
  hasPart: foodTools.filter((t) => t.available).map((t) => ({
    "@type": "SoftwareApplication",
    name: t.nameJa,
    url: `https://yamada-tools.jp${t.path}`,
  })),
};

export default function FoodHubPage() {
  const foodSection: HubSection = {
    title: "飲食・食品計算ツール",
    subtitle: "原価率・栄養成分表示・フードロスコストの無料計算ツール",
    badge: "飲食",
    cols: 3,
    tools: foodTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: t.id === "genka-calculator",
      })),
  };

  const sections = [foodSection].filter((s) => s.tools.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]) }}
      />
      <HubLayout
        niche={{
          iconName: "receipt",
          name: "飲食・食品",
          eyebrow: "FOOD & RESTAURANT",
          headline: "飲食店経営と食品管理を、数字で最適化。",
          tagline: "原価率・栄養成分・フードロスまで、飲食業の計算を1サイトで",
          description:
            "飲食店のメニュー原価率・適正売価・FLコスト計算、食品の栄養成分表示値計算（食品表示法対応）、フードロスコスト管理など飲食・食品業向けの無料ツール集。すべて無料・登録不要・日本国内サーバーで処理。",
          theme: "amber",
          primaryCta: { label: "原価率を計算する", url: "/food/genka-calculator" },
          secondaryCta: { label: "栄養成分表示を計算", url: "/food/nutrition-label-calculator" },
        }}
        sections={sections}
      />
    </>
  );
}
