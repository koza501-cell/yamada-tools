import Link from "next/link";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import { Metadata } from "next";
import NisaSimulatorClient from "./dynamic-client";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";

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
    {"@type": "ListItem", "position": 3, "name": "新NISAシミュレーター", "item": "https://yamada-tools.jp/finance/nisa-simulator"}
  ]
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "新NISAシミュレーター",
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

const tool = getToolById("nisa-simulator")!;

export default function Page() {
  const relatedTools = [
    { href: "/finance/ideco-nisa-comparison", icon: "📊", label: "iDeCo vs NISA比較", description: "どちらが得か徹底比較" },
    { href: "/finance/retirement-simulator", icon: "👴", label: "老後資金シミュレーター", description: "老後に必要な資金を計算" },
    { href: "/finance/net-salary-calculator", icon: "💴", label: "給与手取り計算機", description: "月給から手取り額を計算" },
    { href: "/finance/depreciation-calculator", icon: "📉", label: "減価償却計算機", description: "定額法・定率法を比較計算" },
  ];
  
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
    
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          新NISA（2024年制度）の年間投資枠と非課税保有限度額
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">項目</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">つみたて投資枠</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">成長投資枠</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">合計</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["年間投資枠", "120万円", "240万円", "360万円"],
                ["非課税保有限度額", "1,800万円（成長と合算）", "1,200万円", "1,800万円（総枠）"],
                ["対象商品", "金融庁認定の投資信託", "上場株式・投資信託・ETF・REIT", "—"],
                ["購入方法", "積立のみ", "一括/積立/スポット", "—"],
                ["非課税保有期間", "無期限", "無期限", "無期限"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[1]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[2]}</td>
                  <td className="py-2 px-4">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">月額積立シミュレーション例（年利5%想定）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">月額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">期間</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">元本</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">運用益込み総額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">うち運用益</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["毎月3万円", "20年", "720万円", "約1,233万円", "約513万円"],
                ["毎月5万円", "20年", "1,200万円", "約2,055万円", "約855万円"],
                ["毎月10万円", "15年", "1,800万円", "約2,673万円", "約873万円"],
                ["毎月10万円", "20年", "1,800万円（MAX）", "約4,110万円", "約2,310万円"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4">{row[1]}</td>
                  <td className="py-2 px-4">{row[2]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[3]}</td>
                  <td className="py-2 px-4">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。<br/>
          出典: 金融庁「新しいNISA」（令和7年/2025年）。シミュレーションは年利5%想定の概算。
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
        <Link
          href="/blog/nisa-simulation-2026"
          className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-kon hover:border-ai hover:shadow-md transition-all p-5 group"
        >
          <div className="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
            <svg className="w-6 h-6 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】新NISAシミュレーション｜年収別の節税効果</p>
            <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
          </div>
        </Link>
      </div>
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
