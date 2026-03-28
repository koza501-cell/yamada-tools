import { Metadata } from "next";
import IdecoNisaComparisonClient from "./client";

export const metadata: Metadata = {
  title: "iDeCo vs NISA 比較ツール【無料】節税額・手取り・最適配分を自動計算 | yamada-tools.jp",
  description: "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。併用シミュレーション・おすすめ診断・職業別iDeCo上限も無料。登録不要。",
  keywords: ["iDeCo NISA 比較", "iDeCo NISA どっちがお得", "iDeCo NISA 節税 計算", "iDeCo NISA 併用 シミュレーション", "iDeCo 上限 職業別", "NISA iDeCo どっちを優先"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/ideco-nisa-comparison",
  },
  openGraph: {
    title: "iDeCo vs NISA 比較ツール【無料】節税額・手取り・最適配分を自動計算 | yamada-tools.jp",
    description: "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。併用シミュレーション・おすすめ診断・職業別iDeCo上限も無料。登録不要。",
    url: "https://yamada-tools.jp/finance/ideco-nisa-comparison",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
    images: [{
      url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-ideco-nisa-comparison.png",
      width: 1200,
      height: 630,
      alt: "iDeCo vs NISA 比較ツール | yamada-tools.jp",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "iDeCo vs NISA 比較ツール【無料】節税額・手取り・最適配分を自動計算 | yamada-tools.jp",
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
  "description": "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。併用シミュレーション・おすすめ診断・職業別iDeCo上限も無料。"
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "iDeCo vs NISA 比較ツールの使い方",
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "プロフィールを入力", "text": "年収・職業・年齢を入力し、iDeCoの掛金上限額を自動計算します"},
    {"@type": "HowToStep", "position": 2, "name": "投資条件を設定", "text": "毎月の投資予算・掛金・運用利回り・投資期間を設定します"},
    {"@type": "HowToStep", "position": 3, "name": "結果を比較", "text": "iDeCo・NISA・併用の3パターンの節税額・最終手取り・おすすめ診断が表示されます"}
  ]
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "iDeCoとNISAはどっちがお得ですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "年収が高い会社員や自営業者はiDeCoの所得控除による節税効果が大きく有利です。一方、専業主婦や低所得者、いつでも引き出したい方はNISAが向いています。最も効果的なのはiDeCo上限まで拠出した後、残りをNISAに回す併用です。"}
    },
    {
      "@type": "Question",
      "name": "iDeCoの掛金の上限は職業によって違いますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "はい、2024年12月改正後の上限は：会社員（企業型DC・DBなし）月2.3万円、会社員（企業型DCあり）月2万円、会社員（DB等あり）月1.2万円、公務員月1.2万円、自営業月6.8万円、専業主婦月2.3万円です。"}
    },
    {
      "@type": "Question",
      "name": "iDeCoの節税効果はいくらですか？年収500万円の場合",
      "acceptedAnswer": {"@type": "Answer", "text": "年収500万円の会社員（税率20%）がiDeCoに月2.3万円拠出した場合、年間の節税額は約66,240円（所得税36,800円＋住民税27,600円）です。30年間継続すると約199万円の節税になります。"}
    },
    {
      "@type": "Question",
      "name": "iDeCoとNISAは同時に使えますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "はい、iDeCoとNISAは別々の制度なので同時利用が可能です。例えば会社員なら毎月iDeCoに2.3万円（上限）＋NISAに残りの予算を積み立てることで、節税と柔軟な資産運用を両立できます。"}
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, softwareApplicationJsonLd, howToJsonLd, faqJsonLd]) }}
      />
      <IdecoNisaComparisonClient />
    </>
  );
}
