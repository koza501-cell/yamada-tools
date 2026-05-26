import { allTools } from "@/config/tools";

const allAvailableTools = allTools.filter((t) => t.available);
// Deduplicate by path AND name (same logic as original page.tsx BUG-003 fix)
const seenPaths = new Set<string>();
const seenNames = new Set<string>();
const availableTools = allAvailableTools.filter((tool) => {
  if (seenPaths.has(tool.path) || seenNames.has(tool.nameJa)) return false;
  seenPaths.add(tool.path);
  seenNames.add(tool.nameJa);
  return true;
});

export const homepageItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "山田ツール - 無料オンラインツール一覧",
  description: `日本国内サーバーで安全に使える${availableTools.length}種類の無料オンラインツール`,
  numberOfItems: availableTools.length,
  itemListElement: availableTools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.nameJa,
    url: `https://yamada-tools.jp${tool.path}`,
    item: {
      "@type": "WebApplication",
      name: tool.nameJa,
      description: tool.description,
      url: `https://yamada-tools.jp${tool.path}`,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
    },
  })),
};

const siteUrl = "https://yamada-tools.jp";

export const homepageSoftwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/#software`,
  name: "山田ツール",
  description: `日本国内サーバーで安全に使える無料オンラインツール${availableTools.length}種。インボイス制度・全銀フォーマット・電子印鑑・PDF編集・書類作成・画像変換・財務計算など、日本の中小企業・フリーランスのビジネスに特化。登録不要・完全無料。`,
  url: siteUrl,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "ja-JP",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};

export const homepageBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "ホーム",
      item: siteUrl,
    },
  ],
};

export const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "山田ツールは本当に無料ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、すべてのツールを完全無料でご利用いただけます。会員登録も不要です。一部の高度な機能はPROプランで提供していますが、基本機能はすべて無料です。",
      },
    },
    {
      "@type": "Question",
      name: "アップロードしたファイルの安全性は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ファイルは日本国内のサーバーでのみ処理され、SSL暗号化通信で保護されています。多くのツールはブラウザ内で処理されるためサーバーにファイルが送信されません。サーバー処理が必要なツールでも、処理完了後60分以内に自動削除されます。",
      },
    },
    {
      "@type": "Question",
      name: "スマホからも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、iPhone・Androidどちらからもすべてのツールをご利用いただけます。レスポンシブデザインでスマホに最適化されており、アプリのインストールも不要です。",
      },
    },
    {
      "@type": "Question",
      name: "会員登録は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "いいえ、会員登録なしですべてのツールをご利用いただけます。メールアドレスの入力も不要です。アクセスしてすぐにお使いいただけます。",
      },
    },
  ],
};
