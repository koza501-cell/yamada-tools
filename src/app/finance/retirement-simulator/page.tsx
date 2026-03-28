import { Metadata } from "next";
import RetirementSimulatorClient from "./client";

export const metadata: Metadata = {
  title: "老後資金シミュレーター【無料】年金・iDeCo・NISA・退職金・取り崩しを総合計算 | yamada-tools.jp",
  description: "老後に必要な資金を総合シミュレーション。公的年金・iDeCo・NISA・退職金を一括計算。インフレ対応・資産寿命・iDeCo出口戦略（2026年10年ルール対応）を無料試算。登録不要。",
  keywords: ["老後資金 シミュレーター", "老後 いくら必要 計算", "老後 年金 不足額", "老後2000万 計算", "資産寿命 計算機", "iDeCo 出口戦略 シミュレーション"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/retirement-simulator",
  },
  openGraph: {
    title: "老後資金シミュレーター【無料】年金・iDeCo・NISA・退職金・取り崩しを総合計算 | yamada-tools.jp",
    description: "老後に必要な資金を総合シミュレーション。公的年金・iDeCo・NISA・退職金を一括計算。インフレ対応・資産寿命・iDeCo出口戦略（2026年10年ルール対応）を無料試算。登録不要。",
    url: "https://yamada-tools.jp/finance/retirement-simulator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "老後資金シミュレーター【無料】年金・iDeCo・NISA・退職金・取り崩しを総合計算 | yamada-tools.jp",
    description: "老後に必要な資金を総合シミュレーション。公的年金・iDeCo・NISA・退職金を一括計算。インフレ対応・資産寿命・iDeCo出口戦略（2026年10年ルール対応）を無料試算。登録不要。",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp"},
    {"@type": "ListItem", "position": 2, "name": "金融・資産運用ツール", "item": "https://yamada-tools.jp/finance"},
    {"@type": "ListItem", "position": 3, "name": "老後資金シミュレーター Pro", "item": "https://yamada-tools.jp/finance/retirement-simulator"}
  ]
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "老後資金シミュレーターの使い方",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "基本情報を入力", "text": "現在の年齢・退職年齢・寿命の予測を設定します"},
    {"@type": "HowToStep", "position": 2, "name": "収入・資産を設定", "text": "公的年金額・退職金・iDeCo・NISAなどの資産情報を入力します"},
    {"@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "資産寿命・毎月の収支・iDeCo出口戦略が自動計算されます"}
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "老後に必要な資金は本当に2000万円ですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "金融庁の試算では夫婦で約2,000万円不足するとされましたが、実際は生活スタイルや年金受給額、インフレ率によって大きく異なります。このシミュレーターで自分の状況に合った必要額を計算できます。"}
    },
    {
      "@type": "Question",
      "name": "老後の生活費は毎月いくらかかりますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "総務省の家計調査によると、65歳以上夫婦無職世帯の平均支出は月約25万円、単身世帯は月約15万円です。ただし旅行や趣味を楽しむゆとりある生活では月35万円以上必要な場合もあります。"}
    },
    {
      "@type": "Question",
      "name": "iDeCoの出口戦略で2026年からの10年ルールとは何ですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "2026年1月から、iDeCoの一時金を受け取ってから10年以内に退職金を受け取ると、退職所得控除が制限されます。従来の5年ルールから厳格化されたため、iDeCoと退職金の受取タイミングの戦略が重要になりました。"}
    },
    {
      "@type": "Question",
      "name": "老後資金の取り崩しで4%ルールとは何ですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "4%ルールとは、保有資産の年間4%以内を取り崩せば30年以上資産が持続するという経験則です。例えば2000万円の資産なら年間80万円（月約6.7万円）取り崩せます。ただし日本のインフレ率や運用環境によって異なります。"}
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
      <RetirementSimulatorClient />
    </>
  );
}
