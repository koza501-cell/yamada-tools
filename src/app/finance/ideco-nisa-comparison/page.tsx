import Link from "next/link";
import { Metadata } from "next";
import IdecoNisaComparisonClient from "./dynamic-client";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "iDeCo vs NISA 比較ツール【無料】節税額・手取り・最適配分を自動計算",
  description: "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。併用シミュレーション・おすすめ診断・職業別iDeCo上限も無料。登録不要。",
  keywords: ["iDeCo NISA 比較", "iDeCo NISA どっちがお得", "iDeCo NISA 節税 計算", "iDeCo NISA 併用 シミュレーション", "iDeCo 上限 職業別", "NISA iDeCo どっちを優先"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/ideco-nisa-comparison",
  },
  openGraph: {
    title: "iDeCo vs NISA 比較ツール【無料】節税額・手取り・最適配分を自動計算",
    description: "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。併用シミュレーション・おすすめ診断・職業別iDeCo上限も無料。登録不要。",
    url: "https://yamada-tools.jp/finance/ideco-nisa-comparison",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{
      url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-ideco-nisa-comparison.png",
      width: 1200,
      height: 630,
      alt: "iDeCo vs NISA 比較ツール",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "iDeCo vs NISA 比較ツール【無料】節税額・手取り・最適配分を自動計算",
    description: "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。併用シミュレーション・おすすめ診断・職業別iDeCo上限も無料。登録不要。",
    images: ["https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-ideco-nisa-comparison.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp"},
    {"@type": "ListItem", "position": 2, "name": "金融・資産運用ツール", "item": "https://yamada-tools.jp/finance"},
    {"@type": "ListItem", "position": 3, "name": "iDeCo vs NISA 徹底比較ツール", "item": "https://yamada-tools.jp/finance/ideco-nisa-comparison"}
  ]
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "iDeCo vs NISA 徹底比較ツール",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "JPY"},
  "url": "https://yamada-tools.jp/finance/ideco-nisa-comparison",
  "inLanguage": "ja",
  "provider": {"@type": "Organization", "name": "合同会社山田トレード"},
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "description": "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。"
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "iDeCo vs NISA 比較ツールの使い方",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "プロフィールを入力", "text": "年収・職業・年齢を入力し、iDeCoの掛金上限額を自動計算します"},
    {"@type": "HowToStep", "position": 2, "name": "投資条件を設定", "text": "毎月の投資予算・掛金・運用利回り・投資期間を設定します"},
    {"@type": "HowToStep", "position": 3, "name": "結果を比較", "text": "iDeCo・NISA・併用の3パターンの節税額・最終手取り・おすすめ診断が表示されます"}
  ]
};

const faqItems = [
  {
    question: "iDeCoとNISAはどっちがお得ですか？",
    answer: "年収が高い会社員や自営業者はiDeCoの所得控除による節税効果が大きく有利です。一方、専業主婦や低所得者、いつでも引き出したい方はNISAが向いています。最も効果的なのはiDeCo上限まで拠出した後、残りをNISAに回す併用です。",
  },
  {
    question: "iDeCoの掛金の上限は職業によって違いますか？",
    answer: "はい、2024年12月改正後の上限は：会社員（企業型DC・DBなし）月2.3万円、会社員（企業型DCあり）月2万円、会社員（DB等あり）月1.2万円、公務員月1.2万円、自営業月6.8万円、専業主婦月2.3万円です。",
  },
  {
    question: "iDeCoの節税効果はいくらですか？年収500万円の場合",
    answer: "年収500万円の会社員（税率20%）がiDeCoに月2.3万円拠出した場合、年間の節税額は約66,240円（所得税36,800円＋住民税27,600円）です。30年間継続すると約199万円の節税になります。",
  },
  {
    question: "iDeCoとNISAは同時に使えますか？",
    answer: "はい、iDeCoとNISAは別々の制度なので同時利用が可能です。例えば会社員なら毎月iDeCoに2.3万円（上限）＋NISAに残りの予算を積み立てることで、節税と柔軟な資産運用を両立できます。",
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
    icon: "👔",
    persona: "会社員・サラリーマン",
    title: "iDeCoで所得税・住民税を節税",
    benefit: "年収500万円で月2.3万円拠出すると年間約6.6万円節税。30年で約200万円の差。",
  },
  {
    icon: "💼",
    persona: "NISA積立中の方",
    title: "iDeCoも追加すべきか検討",
    benefit: "現在のNISA積立に加えiDeCoを上限まで活用すると節税+複利で資産形成が加速。",
  },
  {
    icon: "🏠",
    persona: "40代・老後資金が不安な方",
    title: "定年までの最適配分をシミュレーション",
    benefit: "残り20年の運用シナリオを3パターン比較。iDeCo優先か併用かを数字で判断。",
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
        title="iDeCo・NISA比較シミュレーター"
        paragraphs={[
          "老後資金形成の2大非課税制度、iDeCo（個人型確定拠出年金）とNISA（少額投資非課税制度）を、あなたの年収・職業・投資予算で徹底比較します。",
          "節税額・最終手取り・最適配分を自動計算。会社員・自営業・公務員ごとのiDeCo上限額に対応し、「どちらを優先すべきか」「併用するといくら得か」を数字で確認できます。",
          "登録不要・完全無料。スマートフォンでもご利用いただけます。",
        ]}
      />
      <IdecoNisaComparisonClient />
      <UseCasesSection cases={useCases} />
      <FAQSection faq={faqItems} />
    
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
        <Link
          href="/blog/ideco-setuzei-simulation-2026"
          className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】iDeCo節税シミュレーション｜年収別の節税額</p>
            <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
          </div>
        </Link>
      </div>
    </>
  );
}
