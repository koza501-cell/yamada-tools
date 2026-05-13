import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import KaigoKirokuClient from "./client";

export const metadata: Metadata = {
  title: "介護記録 テンプレート ジェネレーター｜SOAP・5W1H対応【無料・登録不要】",
  description: "介護記録の文例を場面別に自動生成。SOAP形式・5W1H・シンプル形式対応。食事・入浴・排泄・服薬・転倒など7場面、利用者状況別の例文を即コピー。禁止用語チェッカー付き。",
  keywords: ["介護記録", "テンプレート", "文例", "SOAP", "5W1H", "介護職", "書き方", "禁止用語"],
  openGraph: {
    title: "介護記録 テンプレート ジェネレーター【SOAP・5W1H対応】",
    description: "場面別に介護記録の文例を即生成。禁止用語チェッカー付き。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/kaigo-kiroku-template" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "介護記録 テンプレート ジェネレーター",
      url: "https://yamada-tools.jp/care/kaigo-kiroku-template",
      description: "場面を選ぶだけで介護記録の文例を自動生成。SOAP・5W1H・シンプル形式対応。禁止用語チェッカー付き。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "介護記録 テンプレート", item: "https://yamada-tools.jp/care/kaigo-kiroku-template" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "SOAPとは何ですか?",
          acceptedAnswer: { "@type": "Answer", text: "Subjective（主観的情報）、Objective（客観的情報）、Assessment（評価）、Plan（計画）の頭文字で、介護・医療現場で広く使われる記録形式です。利用者の発言と観察事実を分けて整理できます。" },
        },
        {
          "@type": "Question",
          name: "介護記録に書いてはいけない言葉は?",
          acceptedAnswer: { "@type": "Answer", text: "侮蔑的表現（「ボケ」「徘徊」など）、命令的表現（「させる」「してやる」）、医学的診断、主観的評価（「かわいい」「可哀想」）は避けるべきとされています。本ツールには禁止用語チェック機能があります。" },
        },
        {
          "@type": "Question",
          name: "利用者の個人情報を入力してもいい?",
          acceptedAnswer: { "@type": "Answer", text: "入力しないでください。本ツールはブラウザ上のみで動作し、入力内容はサーバーへ送信されませんが、念のため個人情報は伏せてご利用ください。" },
        },
        {
          "@type": "Question",
          name: "法律で介護記録は何年保管が必要?",
          acceptedAnswer: { "@type": "Answer", text: "介護保険法に基づき、サービス完結日から原則2年間（自治体により5年）の保管義務があります。詳細は事業所所在の市町村にご確認ください。" },
        },
        {
          "@type": "Question",
          name: "文例をそのまま使用していい?",
          acceptedAnswer: { "@type": "Answer", text: "文例は参考用です。実際の利用者の状況に応じて加筆・修正の上、事業所の記録基準に従ってご使用ください。" },
        },
      ],
    },
  ],
};

const tool = getToolById("kaigo-kiroku-template");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KaigoKirokuClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
