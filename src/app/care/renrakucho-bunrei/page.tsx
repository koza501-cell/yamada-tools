import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import RenrakuchoClient from "./client";

export const metadata: Metadata = {
  title: "連絡帳 文例ジェネレーター｜0歳〜5歳・シーン別の保育園連絡帳例文【無料】",
  description: "保育園・こども園の連絡帳に使える文例を年齢・シーン別に即生成。0歳児〜5歳児、遊び・食事・睡眠・成長・行事など10シーン対応。NG表現チェッカー付き、コピー1タップで時短。",
  keywords: ["連絡帳", "文例", "保育園", "こども園", "保育士", "0歳児", "5歳児", "シーン別"],
  openGraph: {
    title: "連絡帳 文例ジェネレーター【0歳〜5歳・シーン別】",
    description: "保育園・こども園の連絡帳文例を年齢・シーン別に即生成。NG表現チェッカー付き。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/renrakucho-bunrei" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "連絡帳 文例ジェネレーター",
      url: "https://yamada-tools.jp/care/renrakucho-bunrei",
      description: "年齢・シーンを選ぶだけで保育園連絡帳の文例を自動生成。NG表現チェッカー付き。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "連絡帳 文例ジェネレーター", item: "https://yamada-tools.jp/care/renrakucho-bunrei" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "連絡帳はどんな構成で書けばいい?",
          acceptedAnswer: { "@type": "Answer", text: "「事実(what happened) → 子どもの内面(how they felt) → 保育士からの一言」の3要素が基本です。具体的な観察事実と子どもの感情、保育士の温かい受けとめがバランスよく入っていると、保護者に伝わりやすくなります。" },
        },
        {
          "@type": "Question",
          name: "ネガティブな出来事をどう書けばいい?",
          acceptedAnswer: { "@type": "Answer", text: "「できなかった」ではなく「これから挑戦していきます」と前向きに、具体的な状況と保育士のサポート姿勢を伝えるのがコツです。本ツールにはNG表現チェック機能があります。" },
        },
        {
          "@type": "Question",
          name: "個人情報を入力してもいい?",
          acceptedAnswer: { "@type": "Answer", text: "入力しないでください。本ツールはブラウザ上でのみ動作し、入力内容はサーバーに送信されませんが、お子さまの個人情報は伏せてご利用ください。" },
        },
        {
          "@type": "Question",
          name: "文例をそのまま使っても大丈夫?",
          acceptedAnswer: { "@type": "Answer", text: "あくまで参考用の文例です。実際のお子さまの様子に合わせて加筆・修正の上、園の連絡帳基準に従ってご使用ください。" },
        },
        {
          "@type": "Question",
          name: "0歳児と5歳児で書き方を変えるべき?",
          acceptedAnswer: { "@type": "Answer", text: "年齢に応じた発達段階を意識した観察事実が大切です。0歳児は身体的発達や情緒の安定、5歳児は社会性や役割意識など、発達課題に沿った視点で書くと保護者にも伝わりやすくなります。" },
        },
      ],
    },
  ],
};

const tool = getToolById("renrakucho-bunrei");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RenrakuchoClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
