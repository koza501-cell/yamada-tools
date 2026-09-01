import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import { lifeTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "生活・家計ツール【無料】家計簿・引越し費用・葬儀費用・保育料",
  description:
    "家計簿貯蓄シミュレーター・引越し費用見積もり・葬儀費用計算・保育料無償化判定など、暮らしのお金に関する無料ツール。登録不要・日本国内サーバー処理。",
  alternates: { canonical: "https://yamada-tools.jp/life" },
  openGraph: {
    title: "生活・家計ツール【無料】 | 山田ツール",
    description: "家計簿・引越し費用・葬儀費用・保育料を無料で計算。登録不要。",
    url: "https://yamada-tools.jp/life",
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
    { "@type": "ListItem", position: 2, name: "生活・家計ツール", item: "https://yamada-tools.jp/life" },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "生活・家計ツール",
  description: "家計簿・引越し費用・葬儀費用・保育料の無料計算ツール集",
  url: "https://yamada-tools.jp/life",
  datePublished: "2026-05-01",
  dateModified: "2026-05-07",
  hasPart: lifeTools.filter((t) => t.available).map((t) => ({
    "@type": "SoftwareApplication",
    name: t.nameJa,
    url: `https://yamada-tools.jp${t.path}`,
  })),
};

export default function LifeHubPage() {
  const lifeSection: HubSection = {
    title: "生活・家計計算ツール",
    subtitle: "家計簿・引越し費用・葬儀費用・保育料の無料計算ツール",
    badge: "生活",
    cols: 3,
    tools: lifeTools
      .filter((t) => t.available)
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: t.id === "kakeibo-simulator",
      })),
  };

  const sections = [lifeSection].filter((s) => s.tools.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]) }}
      />
      <HubLayout
        niche={{
          iconName: "home",
          name: "生活・家計",
          eyebrow: "LIFE & HOUSEHOLD",
          headline: "暮らしのお金を、見える化する。",
          tagline: "家計・引越し・葬儀・保育まで、生活費の計算を1サイトで",
          description:
            "家計簿貯蓄シミュレーター・引越し費用見積もり・葬儀費用計算・保育料無償化判定など、暮らしのお金にまつわる無料計算ツール集。すべて無料・登録不要・日本国内サーバーで処理。",
          theme: "green",
          primaryCta: { label: "家計簿シミュレーター", url: "/life/kakeibo-simulator" },
          secondaryCta: { label: "引越し費用を計算", url: "/life/hikkoshi-hiyou-calculator" },
        }}
        sections={sections}
      />
    </>
  );
}
