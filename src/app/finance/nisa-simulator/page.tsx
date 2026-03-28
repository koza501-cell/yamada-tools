import { Metadata } from "next";
import NisaSimulatorClient from "./client";

export const metadata: Metadata = {
  title: "新NISAシミュレーター【無料】積立・節税額・1800万枠を計算｜複数シナリオ比較 | yamada-tools.jp",
  description: "新NISAの積立シミュレーションを無料で。毎月の積立額・利回り・期間を入力するだけで将来資産・節税額・非課税枠の使用率を自動計算。つみたて投資枠・成長投資枠の同時シミュレーションにも対応。",
  keywords: ["新NISA シミュレーター", "NISA 積立 計算機", "新NISA 節税額", "1800万 シミュレーション", "つみたて投資枠 計算", "NISA 無料 計算"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/nisa-simulator",
  },
  openGraph: {
    title: "新NISAシミュレーター【無料】積立・節税額・1800万枠を計算｜複数シナリオ比較 | yamada-tools.jp",
    description: "新NISAの積立シミュレーションを無料で。毎月の積立額・利回り・期間を入力するだけで将来資産・節税額・非課税枠の使用率を自動計算。つみたて投資枠・成長投資枠の同時シミュレーションにも対応。",
    url: "https://yamada-tools.jp/finance/nisa-simulator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "新NISAシミュレーター【無料】積立・節税額・1800万枠を計算｜複数シナリオ比較 | yamada-tools.jp",
    description: "新NISAの積立シミュレーションを無料で。毎月の積立額・利回り・期間を入力するだけで将来資産・節税額・非課税枠の使用率を自動計算。つみたて投資枠・成長投資枠の同時シミュレーションにも対応。",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp"},
    {"@type": "ListItem", "position": 2, "name": "金融・資産運用ツール", "item": "https://yamada-tools.jp/finance"},
    {"@type": "ListItem", "position": 3, "name": "新NISAシミュレーター Pro", "item": "https://yamada-tools.jp/finance/nisa-simulator"}
  ]
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "新NISAシミュレーターの使い方",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "年齢を入力", "text": "現在の年齢と積立終了年齢をスライダーで設定します"},
    {"@type": "HowToStep", "position": 2, "name": "積立条件を設定", "text": "毎月の積立額・投資枠の種類・想定利回りを入力します"},
    {"@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "3つのシナリオ（3%・5%・7%）の将来資産・節税額・非課税枠使用率が自動計算されます"}
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "新NISAで毎月3万円を30年積み立てるといくらになりますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "年利5%で運用した場合、毎月3万円を30年間積み立てると約2,496万円になります。元本1,080万円に対して運用益が約1,416万円となり、新NISAなら全額非課税で受け取れます。"}
    },
    {
      "@type": "Question",
      "name": "新NISAの節税効果はいくらですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "通常の課税口座では運用益に20.315%の税金がかかりますが、新NISAなら非課税です。例えば運用益500万円の場合、約101万円の節税効果があります。"}
    },
    {
      "@type": "Question",
      "name": "新NISAの1800万円の非課税枠はいつ埋まりますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "年間投資上限は360万円（つみたて投資枠120万円＋成長投資枠240万円）です。上限まで投資すると最短5年で1800万円の枠が埋まります。毎月10万円積立の場合は15年で埋まります。"}
    },
    {
      "@type": "Question",
      "name": "つみたて投資枠と成長投資枠は同時に使えますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "はい、2024年からの新NISAでは両方の枠を同時に使えます。年間合計360万円まで投資でき、生涯で1800万円まで非課税運用が可能です。"}
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
      <NisaSimulatorClient />
    </>
  );
}
