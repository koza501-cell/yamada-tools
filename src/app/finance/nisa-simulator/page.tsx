import Link from "next/link";
import { Metadata } from "next";
import NisaSimulatorClient from "./dynamic-client";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import { AdUnit } from "@/components/common/AdUnit";

export const metadata: Metadata = {
  title: "新NISAシミュレーター【無料】積立・節税額・1800万枠を計算｜複数シナリオ比較",
  description: "新NISAの積立シミュレーションを無料で。毎月の積立額・利回り・期間を入力するだけで将来資産・節税額・非課税枠の使用率を自動計算。つみたて投資枠・成長投資枠の同時シミュレーションにも対応。",
  keywords: ["新NISA シミュレーター", "NISA 積立 計算機", "新NISA 節税額", "1800万 シミュレーション", "つみたて投資枠 計算", "NISA 無料 計算"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/nisa-simulator",
  },
  openGraph: {
    title: "新NISAシミュレーター【無料】積立・節税額・1800万枠を計算｜複数シナリオ比較",
    description: "新NISAの積立シミュレーションを無料で。毎月の積立額・利回り・期間を入力するだけで将来資産・節税額・非課税枠の使用率を自動計算。つみたて投資枠・成長投資枠の同時シミュレーションにも対応。",
    url: "https://yamada-tools.jp/finance/nisa-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{
      url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-nisa-simulator.png",
      width: 1200,
      height: 630,
      alt: "新NISAシミュレーター",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "新NISAシミュレーター【無料】積立・節税額・1800万枠を計算｜複数シナリオ比較",
    description: "新NISAの積立シミュレーションを無料で。毎月の積立額・利回り・期間を入力するだけで将来資産・節税額・非課税枠の使用率を自動計算。",
    images: ["https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-nisa-simulator.png"],
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

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "新NISAシミュレーター Pro",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "JPY"},
  "url": "https://yamada-tools.jp/finance/nisa-simulator",
  "inLanguage": "ja",
  "provider": {"@type": "Organization", "name": "合同会社山田トレード"},
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "description": "新NISAの積立シミュレーションを無料で。毎月の積立額・利回り・期間を入力するだけで将来資産・節税額・非課税枠の使用率を自動計算。"
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

const faqItems = [
  {
    question: "新NISAで毎月3万円を30年積み立てるといくらになりますか？",
    answer: "年利5%で運用した場合、毎月3万円を30年間積み立てると約2,496万円になります。元本1,080万円に対して運用益が約1,416万円となり、新NISAなら全額非課税で受け取れます。",
  },
  {
    question: "新NISAの節税効果はいくらですか？",
    answer: "通常の課税口座では運用益に20.315%の税金がかかりますが、新NISAなら非課税です。例えば運用益500万円の場合、約101万円の節税効果があります。",
  },
  {
    question: "新NISAの1800万円の非課税枠はいつ埋まりますか？",
    answer: "年間投資上限は360万円（つみたて投資枠120万円＋成長投資枠240万円）です。上限まで投資すると最短5年で1800万円の枠が埋まります。毎月10万円積立の場合は15年で埋まります。",
  },
  {
    question: "つみたて投資枠と成長投資枠は同時に使えますか？",
    answer: "はい、2024年からの新NISAでは両方の枠を同時に使えます。年間合計360万円まで投資でき、生涯で1800万円まで非課税運用が可能です。",
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
    icon: "🌱",
    persona: "投資初心者の方",
    title: "積立NISAの将来効果を実感",
    benefit: "月3万円×30年で約2,500万円。複利の力を数字でリアルに体感できる。",
  },
  {
    icon: "🎓",
    persona: "子どもの教育資金を準備中",
    title: "18年後の目標額を逆算",
    benefit: "目標額から逆算して必要な月額積立を確認。つみたて枠・成長枠の使い方を最適化。",
  },
  {
    icon: "🏖️",
    persona: "老後2,000万円を目指す方",
    title: "1800万円非課税枠の活用計画",
    benefit: "何歳までに枠を使い切れるか試算。課税口座との節税差額も一目でわかる。",
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
        title="新NISAシミュレーター"
        paragraphs={[
          "毎月の積立額・想定利回り・期間を入力すると、新NISAで将来いくらの資産が積み上がるかをシミュレーションします。3%・5%・7%の3シナリオを同時比較できます。",
          "課税口座との節税差額、1800万円非課税枠の消化ペース、つみたて投資枠と成長投資枠の使い分けも可視化。数字で資産形成の全体像を把握できます。",
          "登録不要・完全無料。スマートフォンでもご利用いただけます。",
        ]}
      />
      <NisaSimulatorClient />
      <UseCasesSection cases={useCases} />
      <FAQSection faq={faqItems} />
    
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
        <Link
          href="/blog/nisa-simulation-2026"
          className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】新NISAシミュレーション｜年収別の節税効果</p>
            <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
          </div>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </>
  );
}
