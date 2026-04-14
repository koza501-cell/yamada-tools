import Link from "next/link";
import { Metadata } from "next";
import JutakuLoanClient from "./dynamic-client";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "住宅ローン計算機【無料】月返済額・繰上返済・控除・借り換えを計算",
  description: "住宅ローンの月々返済額・総返済額・住宅ローン控除を無料計算。変動金利の将来シナリオ・5年ルール・借り換え効果・繰り上げ返済の節約額もシミュレーション。登録不要。",
  keywords: ["住宅ローン 計算機", "住宅ローン シミュレーター", "住宅ローン 変動 固定 比較", "繰り上げ返済 計算", "住宅ローン控除 計算", "借り換え シミュレーション 無料"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/jutaku-loan",
  },
  openGraph: {
    title: "住宅ローン計算機【無料】月返済額・繰上返済・控除・借り換えを計算",
    description: "住宅ローンの月々返済額・総返済額・住宅ローン控除を無料計算。変動金利の将来シナリオ・5年ルール・借り換え効果・繰り上げ返済の節約額もシミュレーション。登録不要。",
    url: "https://yamada-tools.jp/finance/jutaku-loan",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{
      url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-jutaku-loan.png",
      width: 1200,
      height: 630,
      alt: "住宅ローン計算機",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "住宅ローン計算機【無料】月返済額・繰上返済・控除・借り換えを計算",
    description: "住宅ローンの月々返済額・総返済額・住宅ローン控除を無料計算。",
    images: ["https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-jutaku-loan.png"],
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

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "住宅ローン計算機 Pro",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "JPY"},
  "url": "https://yamada-tools.jp/finance/jutaku-loan",
  "inLanguage": "ja",
  "provider": {"@type": "Organization", "name": "合同会社山田トレード"},
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "description": "住宅ローンの月々返済額・総返済額・住宅ローン控除を無料計算。変動金利の将来シナリオ・5年ルール・借り換え効果・繰り上げ返済の節約額もシミュレーション。"
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

const faqItems = [
  {
    question: "住宅ローン3000万円を35年で借りた場合の月々の返済額はいくらですか？",
    answer: "金利0.5%（変動）の場合、月々約78,000円、総返済額約3,276万円です。金利1.5%（固定）の場合、月々約91,000円、総返済額約3,822万円となります。",
  },
  {
    question: "住宅ローン控除はいくらもらえますか？",
    answer: "2024年以降入居の場合、省エネ基準適合住宅なら借入残高の0.7%が13年間控除されます。借入額3000万円の場合、最大で約21万円/年、累計約273万円の控除が受けられます。",
  },
  {
    question: "住宅ローンの5年ルールとは何ですか？",
    answer: "変動金利の住宅ローンで金利が上昇しても、5年間は月々の返済額が変わらないルールです。ただし利息が増えるため元本の減りが遅くなり、未払い利息が発生するリスクがあります。",
  },
  {
    question: "住宅ローンの繰り上げ返済でいくら節約できますか？",
    answer: "例えば3000万円・35年・金利1%のローンで、10年後に100万円繰り上げ返済（期間短縮型）すると、約50万円の利息節約と約1年2ヶ月の期間短縮が見込めます。",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {"@type": "Answer", "text": item.answer},
  })),
};

const useCases = [
  {
    icon: "🏡",
    persona: "マイホーム購入を検討中",
    title: "月返済額・総返済額を事前確認",
    benefit: "借入3000万円で月々いくら？変動vs固定の差額を数字で把握して安心して購入判断。",
  },
  {
    icon: "🔄",
    persona: "借り換え検討中の方",
    title: "現在のローンとの差額を計算",
    benefit: "金利1%→0.5%に借り換えると総額でいくら節約できるか即座に試算。",
  },
  {
    icon: "💰",
    persona: "繰り上げ返済を考えている方",
    title: "繰り上げ返済の節約額を確認",
    benefit: "100万円繰り上げ返済で何年短縮・何万円節約になるか。タイミング別に比較できる。",
  },
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, softwareApplicationJsonLd, howToJsonLd, faqJsonLd]) }}
      />
      <IntroSection
        title="住宅ローンシミュレーター"
        paragraphs={[
          "借入金額・金利・返済期間を入力すると月々の返済額・総返済額・利息総額を自動計算します。変動金利と固定金利の比較、5年ルール・125%ルールのシミュレーションに対応しています。",
          "住宅ローン控除（最大13年）の控除額計算、繰り上げ返済による節約額と期間短縮効果、借り換えシミュレーションも搭載。住宅購入から返済完了まで一貫して確認できます。",
          "登録不要・完全無料。スマートフォンでもご利用いただけます。",
        ]}
      />
      <JutakuLoanClient />
      <UseCasesSection cases={useCases} />
      <FAQSection faq={faqItems} />
    
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
        <Link
          href="/blog/jutaku-loan-simulation-2026"
          className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】住宅ローンシミュレーション完全ガイド｜変動vs固定・借入可能額</p>
            <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
          </div>
        </Link>
      </div>
    </>
  );
}
