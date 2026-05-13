import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import AllergyCheckerClient from "./client";

export const metadata: Metadata = {
  title: "食物アレルギー チェッカー｜28品目自動検出【令和6年3月改正対応・無料】",
  description: "原材料を貼り付けるだけで28品目のアレルゲンを自動チェック。義務8品目(えび・かに・くるみ・小麦・そば・卵・乳・落花生)+推奨20品目に対応。代替表記・隠れた成分も検出。給食室・保育園・介護施設向け。",
  keywords: ["食物アレルギー", "アレルゲン", "28品目", "チェッカー", "給食", "保育園", "令和6年"],
  openGraph: {
    title: "食物アレルギー チェッカー【28品目対応】",
    description: "原材料を貼り付けるだけで28品目のアレルゲンを自動チェック。義務8品目+推奨20品目対応。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/allergy-checker" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "食物アレルギー チェッカー",
      url: "https://yamada-tools.jp/care/allergy-checker",
      description: "原材料を貼り付けるだけで28品目のアレルゲンを自動検出。義務8品目+推奨20品目、令和6年3月改正対応。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "食物アレルギー チェッカー", item: "https://yamada-tools.jp/care/allergy-checker" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "義務表示の8品目は何ですか?",
          acceptedAnswer: { "@type": "Answer", text: "えび・かに・くるみ・小麦・そば・卵・乳・落花生の8品目です。これらは食品表示法で必ず表示が義務付けられています(令和5年3月にくるみが追加されました)。" },
        },
        {
          "@type": "Question",
          name: "推奨表示の20品目は?",
          acceptedAnswer: { "@type": "Answer", text: "アーモンド、あわび、いか、いくら、オレンジ、カシューナッツ、キウイ、牛肉、ごま、さけ、さば、大豆、鶏肉、バナナ、豚肉、マカダミアナッツ、もも、やまいも、りんご、ゼラチンです(令和6年3月にマカダミアナッツが追加、まつたけが削除されました)。" },
        },
        {
          "@type": "Question",
          name: "このツールで命の安全は保証できますか?",
          acceptedAnswer: { "@type": "Answer", text: "いいえ。本ツールは原材料表示の概要チェック用です。実際の食品提供は必ず医師の生活管理指導表と現物の食品ラベルを確認してください。" },
        },
        {
          "@type": "Question",
          name: "コンタミネーション(交差汚染)は検出できますか?",
          acceptedAnswer: { "@type": "Answer", text: "できません。原材料に直接記載のないコンタミネーションリスクは、製造元への問い合わせや「同じ製造ラインで○○を使用」の表記を確認してください。" },
        },
        {
          "@type": "Question",
          name: "入力した情報はサーバーに送信されますか?",
          acceptedAnswer: { "@type": "Answer", text: "いいえ。本ツールはブラウザ上でのみ動作し、入力内容はサーバーへ送信されません。" },
        },
      ],
    },
  ],
};

const tool = getToolById("allergy-checker");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AllergyCheckerClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
