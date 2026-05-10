import Link from "next/link";
import { Metadata } from "next";
import RetirementSimulatorClient from "./dynamic-client";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "老後資金シミュレーター【無料】年金・iDeCo・NISA・退職金・取り崩しを総合計算",
  description: "老後に必要な資金を総合シミュレーション。公的年金・iDeCo・NISA・退職金を一括計算。インフレ対応・資産寿命・iDeCo出口戦略（2026年10年ルール対応）を無料試算。登録不要。",
  keywords: ["老後資金 シミュレーター", "老後 いくら必要 計算", "老後 年金 不足額", "老後2000万 計算", "資産寿命 計算機", "iDeCo 出口戦略 シミュレーション"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/retirement-simulator",
  },
  openGraph: {
    title: "老後資金シミュレーター【無料】年金・iDeCo・NISA・退職金・取り崩しを総合計算",
    description: "老後に必要な資金を総合シミュレーション。公的年金・iDeCo・NISA・退職金を一括計算。インフレ対応・資産寿命・iDeCo出口戦略（2026年10年ルール対応）を無料試算。登録不要。",
    url: "https://yamada-tools.jp/finance/retirement-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{
      url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-retirement-simulator.png",
      width: 1200,
      height: 630,
      alt: "老後資金シミュレーター",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "老後資金シミュレーター【無料】年金・iDeCo・NISA・退職金・取り崩しを総合計算",
    description: "老後に必要な資金を総合シミュレーション。公的年金・iDeCo・NISA・退職金を一括計算。",
    images: ["https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-retirement-simulator.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp"},
    {"@type": "ListItem", "position": 2, "name": "金融・資産運用ツール", "item": "https://yamada-tools.jp/finance"},
    {"@type": "ListItem", "position": 3, "name": "老後資金シミュレーター", "item": "https://yamada-tools.jp/finance/retirement-simulator"}
  ]
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "老後資金シミュレーター",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "JPY"},
  "url": "https://yamada-tools.jp/finance/retirement-simulator",
  "inLanguage": "ja",
  "provider": {"@type": "Organization", "name": "合同会社山田トレード"},
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "description": "老後に必要な資金を総合シミュレーション。公的年金・iDeCo・NISA・退職金を一括計算。インフレ対応・資産寿命・iDeCo出口戦略（2026年10年ルール対応）を無料試算。"
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

const faqItems = [
  {
    question: "老後に必要な資金は本当に2000万円ですか？",
    answer: "金融庁の試算では夫婦で約2,000万円不足するとされましたが、実際は生活スタイルや年金受給額、インフレ率によって大きく異なります。このシミュレーターで自分の状況に合った必要額を計算できます。",
  },
  {
    question: "老後の生活費は毎月いくらかかりますか？",
    answer: "総務省の家計調査によると、65歳以上夫婦無職世帯の平均支出は月約25万円、単身世帯は月約15万円です。ただし旅行や趣味を楽しむゆとりある生活では月35万円以上必要な場合もあります。",
  },
  {
    question: "iDeCoの出口戦略で2026年からの10年ルールとは何ですか？",
    answer: "2026年1月から、iDeCoの一時金を受け取ってから10年以内に退職金を受け取ると、退職所得控除が制限されます。従来の5年ルールから厳格化されたため、iDeCoと退職金の受取タイミングの戦略が重要になりました。",
  },
  {
    question: "老後資金の取り崩しで4%ルールとは何ですか？",
    answer: "4%ルールとは、保有資産の年間4%以内を取り崩せば30年以上資産が持続するという経験則です。例えば2000万円の資産なら年間80万円（月約6.7万円）取り崩せます。ただし日本のインフレ率や運用環境によって異なります。",
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
    icon: "😰",
    persona: "老後資金が不安な50代",
    title: "定年までの残り年数で試算",
    benefit: "年金・退職金・現在の貯蓄を合算して「いつまで資産がもつか」を可視化。不足額を把握。",
  },
  {
    icon: "🌅",
    persona: "早期退職（FIRE）を検討中",
    title: "55歳退職なら資産寿命は何年？",
    benefit: "取り崩し額・運用利回り・インフレ率を調整して安全な引退時期を数字で確認。",
  },
  {
    icon: "💼",
    persona: "退職金の運用先を検討中",
    title: "iDeCo・NISA・一時金の最適な受け取り方",
    benefit: "2026年10年ルールを考慮したiDeCo出口戦略を試算。税負担を最小化する順序を確認。",
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
        title="老後資金シミュレーター"
        paragraphs={[
          "現在の年齢・貯蓄・毎月積立額を入力すると、定年後の資産残高の推移をシミュレーションします。公的年金・退職金・iDeCo・NISAを組み合わせた総合試算に対応しています。",
          "インフレ率・運用利回りを考慮した資産寿命の計算、iDeCo出口戦略（2026年10年ルール対応）、資産の取り崩しシミュレーションも搭載。老後の収支を一元管理できます。",
          "登録不要・完全無料。スマートフォンでもご利用いただけます。",
        ]}
      />
      <RetirementSimulatorClient />
      <UseCasesSection cases={useCases} />
      <FAQSection faq={faqItems} />
    
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          夫婦2人の老後生活費の目安（厚生労働省・総務省データ）
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">生活水準</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">月額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">年額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">30年間の総額</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["最低限の生活", "約23万円", "約276万円", "約8,280万円"],
                ["平均的な生活", "約27万円", "約324万円", "約9,720万円"],
                ["ゆとりある生活", "約38万円", "約456万円", "約1億3,680万円"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[1]}</td>
                  <td className="py-2 px-4">{row[2]}</td>
                  <td className="py-2 px-4">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">年金受給額の目安（夫婦2人・厚生年金）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">条件</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">平均月額（夫婦2人）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["平均的な月額（夫婦2人）", "約23万円"],
                ["国民年金のみ（夫婦2人）", "約13万円"],
                ["厚生年金あり（共働き想定）", "約28万円"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。<br/>
          出典: 総務省「家計調査（令和6年）」・厚生労働省「年金制度基礎資料」
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
        <Link
          href="/blog/rougo-shikin-simulation-2026"
          className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】老後資金はいくら必要？2000万円問題の真実とシミュレーション</p>
            <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
          </div>
        </Link>
      </div>
    </>
  );
}
