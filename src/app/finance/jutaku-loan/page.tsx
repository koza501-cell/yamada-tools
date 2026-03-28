import { Metadata } from "next";
import JutakuLoanClient from "./client";

export const metadata: Metadata = {
  title: "住宅ローン計算機【無料】固定・変動・繰上返済・控除・借り換えを一括シミュレーション | yamada-tools.jp",
  description: "住宅ローンの月々返済額・総返済額・住宅ローン控除を無料計算。変動金利の将来シナリオ・5年ルール・借り換え効果・繰り上げ返済の節約額もシミュレーション。登録不要。",
  keywords: ["住宅ローン 計算機", "住宅ローン シミュレーター", "住宅ローン 変動 固定 比較", "繰り上げ返済 計算", "住宅ローン控除 計算", "借り換え シミュレーション 無料"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/jutaku-loan",
  },
  openGraph: {
    title: "住宅ローン計算機【無料】固定・変動・繰上返済・控除・借り換えを一括シミュレーション | yamada-tools.jp",
    description: "住宅ローンの月々返済額・総返済額・住宅ローン控除を無料計算。変動金利の将来シナリオ・5年ルール・借り換え効果・繰り上げ返済の節約額もシミュレーション。登録不要。",
    url: "https://yamada-tools.jp/finance/jutaku-loan",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "住宅ローン計算機【無料】固定・変動・繰上返済・控除・借り換えを一括シミュレーション | yamada-tools.jp",
    description: "住宅ローンの月々返済額・総返済額・住宅ローン控除を無料計算。変動金利の将来シナリオ・5年ルール・借り換え効果・繰り上げ返済の節約額もシミュレーション。登録不要。",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp"},
    {"@type": "ListItem", "position": 2, "name": "金融・資産運用ツール", "item": "https://yamada-tools.jp/finance"},
    {"@type": "ListItem", "position": 3, "name": "住宅ローン計算機 Pro", "item": "https://yamada-tools.jp/finance/jutaku-loan"}
  ]
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "住宅ローン計算機の使い方",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "借入条件を入力", "text": "借入金額・金利タイプ（固定/変動）・借入期間を設定します"},
    {"@type": "HowToStep", "position": 2, "name": "返済方式を選択", "text": "元利均等返済または元金均等返済を選択し、ボーナス返済の有無を設定します"},
    {"@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "毎月返済額・総返済額・利息総額・借り換え効果が自動計算されます"}
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "住宅ローン3000万円を35年で借りた場合の月々の返済額はいくらですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "金利0.5%（変動）の場合、月々約78,000円、総返済額約3,276万円です。金利1.5%（固定）の場合、月々約91,000円、総返済額約3,822万円となります。"}
    },
    {
      "@type": "Question",
      "name": "住宅ローン控除はいくらもらえますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "2024年以降入居の場合、省エネ基準適合住宅なら借入残高の0.7%が13年間控除されます。借入額3000万円の場合、最大で約21万円/年、累計約273万円の控除が受けられます。"}
    },
    {
      "@type": "Question",
      "name": "住宅ローンの5年ルールとは何ですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "変動金利の住宅ローンで金利が上昇しても、5年間は月々の返済額が変わらないルールです。ただし利息が増えるため元本の減りが遅くなり、未払い利息が発生するリスクがあります。"}
    },
    {
      "@type": "Question",
      "name": "住宅ローンの繰り上げ返済でいくら節約できますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "例えば3000万円・35年・金利1%のローンで、10年後に100万円繰り上げ返済（期間短縮型）すると、約50万円の利息節約と約1年2ヶ月の期間短縮が見込めます。"}
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, howToJsonLd, faqJsonLd]) }}
      />
      <JutakuLoanClient />
    </>
  );
}
