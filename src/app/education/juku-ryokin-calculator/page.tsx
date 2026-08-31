import { Metadata } from "next";
import JukuClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "【無料】学習塾・習い事 月謝計算機｜年間費用・教育費比率を即計算【2026年版】 | yamada-tools.jp",
  description: "塾・習い事の月謝から年間総費用を計算。複数の習い事を一括登録、季節講習対応、子供の人数別合計、世帯年収比率まで自動算出。文科省令和5年度データとの比較も。完全無料・登録不要。",
  keywords: ["塾 月謝 計算", "習い事 費用 計算", "年間 教育費", "学習塾 費用", "子育て 費用", "教育費 比率", "季節講習 費用", "教育費 シミュレーション"],
  alternates: { canonical: "https://yamada-tools.jp/education/juku-ryokin-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "学習塾・習い事 月謝計算機【2026年版】",
    description: "複数の習い事の年間費用を合計。教育費比率・文科省統計との比較も。完全無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "学習塾・習い事 月謝計算機",
      "url": "https://yamada-tools.jp/education/juku-ryokin-calculator",
      "description": "塾・習い事の月謝から年間総費用を計算。複数の習い事を比較・合計。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "教育", "item": "https://yamada-tools.jp/education" },
        { "@type": "ListItem", "position": 3, "name": "月謝計算機", "item": "https://yamada-tools.jp/education/juku-ryokin-calculator" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "学習塾・習い事の年間費用計算方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "習い事を入力", "text": "習い事名・月謝・入会金・教材費・その他費用を入力。最大8件まで追加可能。" },
        { "@type": "HowToStep", "position": 2, "name": "季節講習を入力", "text": "春期・夏期・冬期講習の費用を入力。なければ0のまま。" },
        { "@type": "HowToStep", "position": 3, "name": "世帯情報を入力", "text": "子供の人数を選択。世帯年収を入力すると教育費比率が表示される（任意）。" },
        { "@type": "HowToStep", "position": 4, "name": "計算ボタンを押す", "text": "「計算する」ボタンで年間総費用・月換算・子供合計・教育費比率を即時算出。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "学習塾の月謝の平均はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "文部科学省「令和5年度子供の学習費調査」によると、公立中学校の学校外活動費は年間約35.6万円（月約3万円）、公立小学校は年間約24.7万円（月約2万円）です。" }
        },
        {
          "@type": "Question",
          "name": "教育費比率は年収の何%が適正ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的に世帯年収の10%以下が家計に余裕がある目安、10〜15%は標準的、15%超は要見直しと言われます。" }
        },
        {
          "@type": "Question",
          "name": "習い事の入会金や教材費はいくらかかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "学習塾の入会金は5,000〜30,000円が相場、教材費は年間10,000〜50,000円が一般的です。" }
        },
        {
          "@type": "Question",
          "name": "季節講習（春・夏・冬期講習）の費用は？",
          "acceptedAnswer": { "@type": "Answer", "text": "学習塾の季節講習は1講座あたり3〜10万円が一般的です。年3回合計で15〜40万円が目安。" }
        },
        {
          "@type": "Question",
          "name": "公立と私立で学校外の教育費は変わりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "令和5年度文科省調査によると、公立小学校の学校外活動費は年間約24.7万円、私立小学校は約66.1万円と約2.7倍の差があります。" }
        },
        {
          "@type": "Question",
          "name": "教育費を無料で計算できるツールはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、yamada-tools.jp（山田ツール）の学習塾・習い事 月謝計算機が完全無料・登録不要で使えます。" }
        }
      ]
    }
  ]
};

const tool = getToolById("juku-ryokin-calculator")!;

export default function JukuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JukuClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
