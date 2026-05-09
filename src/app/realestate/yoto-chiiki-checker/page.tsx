import { Metadata } from "next";
import YotoChiikiClient from "./client";

export const metadata: Metadata = {
  title: "用途地域チェッカー — 住所を入力するだけ | 山田ツール",
  description:
    "住所を入力するだけで用途地域を即座に確認。第一種低層住居専用地域など13種類をわかりやすく解説。建ぺい率・容積率も自動表示。国土交通省データ使用、完全無料。",
  keywords: [
    "用途地域 調べ方",
    "用途地域 わかりやすく",
    "建ぺい率 容積率 確認",
    "クリニック 開業 用途地域",
    "店舗 用途地域 確認",
    "用途地域チェッカー",
    "用途地域 比較",
    "民泊 用途地域",
    "Japan zoning regulations English",
  ],
  openGraph: {
    title: "用途地域チェッカー — 住所を入力するだけ",
    description: "住所だけで用途地域・建ぺい率・容積率を即座に確認。13種類を平易な日本語で解説。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "用途地域チェッカー",
      "url": "https://yamada-tools.jp/realestate/yoto-chiiki-checker",
      "description": "住所を入力するだけで用途地域・建ぺい率・容積率を即座に確認できる無料ツール。国土交通省データ使用。",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "用途地域チェッカー", "item": "https://yamada-tools.jp/realestate/yoto-chiiki-checker" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "用途地域の調べ方",
      "description": "住所を入力するだけで用途地域を無料で確認する方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "住所を入力", "text": "調べたい土地の住所を入力欄に入力します。番地まで入力するとより正確な結果が得られます。" },
        { "@type": "HowToStep", "position": 2, "name": "検索ボタンをクリック", "text": "「用途地域を調べる」ボタンをクリックします。" },
        { "@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "用途地域名・建ぺい率・容積率・建てられる建物の種類が表示されます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "用途地域とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "都市計画法に基づき、土地の使い方を13種類に分類したものです。住宅専用エリアから商業・工業エリアまで、建てられる建物の種類や規模が制限されています。" } },
        { "@type": "Question", "name": "建ぺい率とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "土地面積に対して、建物の1階部分（建築面積）が占める割合の上限です。例えば建ぺい率60%・土地100㎡なら、1階の建物は最大60㎡まで建てられます。" } },
        { "@type": "Question", "name": "容積率とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "土地面積に対する、全ての階の床面積の合計（延床面積）の割合の上限です。容積率200%・土地100㎡なら、全階合計200㎡まで建てられます（約3階建ての目安）。" } },
        { "@type": "Question", "name": "クリニック開業に向く用途地域はどれですか？", "acceptedAnswer": { "@type": "Answer", "text": "第一種中高層住居専用地域・第二種中高層住居専用地域・第一種住居地域などが診療所・病院の建設を許可しています。第一種低層住居専用地域では床面積制限があります。" } },
        { "@type": "Question", "name": "用途地域が見つからない場合はどうすれば？", "acceptedAnswer": { "@type": "Answer", "text": "都市計画区域外（農村・山間部・一部離島など）は用途地域が設定されていない場合があります。市区町村の都市計画部門にお問い合わせください。" } }
      ]
    }
  ]
};

export default function YotoChiikiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <YotoChiikiClient />
    </>
  );
}
