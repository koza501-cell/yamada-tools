import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import FXCalculatorClient from "./client";

const tool = getToolById("fx-calculator")!;

export const metadata: Metadata = {
  title: "FX損益計算機【無料】損益・証拠金・ロスカット・スワップ・確定申告を一括計算 | yamada-tools.jp",
  description: "FX取引の損益・必要証拠金・ロスカットレート・スワップ収益・確定申告税額を無料で計算。複数取引の一括計算や損失繰越控除シミュレーターも対応。登録不要。",
  keywords: ["FX 損益計算", "FX シミュレーター 無料", "FX ロスカット 計算機", "FX 確定申告 計算", "FX スワップ 計算", "FX 証拠金 計算"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/fx-calculator",
  },
  openGraph: {
    title: "FX損益計算機【無料】損益・証拠金・ロスカット・スワップ・確定申告を一括計算 | yamada-tools.jp",
    description: "FX取引の損益・必要証拠金・ロスカットレート・スワップ収益・確定申告税額を無料で計算。複数取引の一括計算や損失繰越控除シミュレーターも対応。登録不要。",
    url: "https://yamada-tools.jp/finance/fx-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
    images: [{
      url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-fx-calculator.png",
      width: 1200,
      height: 630,
      alt: "FX損益計算機 | yamada-tools.jp",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FX損益計算機【無料】損益・証拠金・ロスカット・スワップ・確定申告を一括計算 | yamada-tools.jp",
    description: "FX取引の損益・必要証拠金・ロスカットレート・スワップ収益・確定申告税額を無料で計算。複数取引の一括計算や損失繰越控除シミュレーターも対応。登録不要。",
    images: ["https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-fx-calculator.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp"},
    {"@type": "ListItem", "position": 2, "name": "金融・資産運用ツール", "item": "https://yamada-tools.jp/finance"},
    {"@type": "ListItem", "position": 3, "name": "FX損益計算機 Pro", "item": "https://yamada-tools.jp/finance/fx-calculator"}
  ]
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FX損益計算機 Pro",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "JPY"},
  "url": "https://yamada-tools.jp/finance/fx-calculator",
  "inLanguage": "ja",
  "provider": {"@type": "Organization", "name": "合同会社山田トレード"},
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "description": "FX取引の損益・必要証拠金・ロスカットレート・スワップ収益・確定申告税額を無料で計算。複数取引の一括計算や損失繰越控除シミュレーターも対応。"
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "FX損益計算機の使い方",
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "通貨ペアとレートを入力", "text": "取引する通貨ペア・エントリーレート・決済レートを入力します"},
    {"@type": "HowToStep", "position": 2, "name": "取引数量を設定", "text": "ロット数または通貨単位を入力し、レバレッジ倍率を設定します"},
    {"@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "損益額・必要証拠金・ロスカット水準・スワップポイントが自動計算されます"}
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
      "name": "FXの損益はいくらから確定申告が必要ですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "会社員の場合はFX利益が年間20万円を超えると確定申告が必要です。専業主婦や無職の方は年間48万円を超える場合に必要です。損失の場合も、翌年以降3年間の繰越控除を受けるために確定申告をすることをお勧めします。"}
    },
    {
      "@type": "Question",
      "name": "FXの税率は何パーセントですか？",
      "acceptedAnswer": {"@type": "Answer", "text": "FXの利益には申告分離課税が適用され、税率は一律20.315%（所得税15%＋復興特別所得税0.315%＋住民税5%）です。所得金額に関わらず一定です。"}
    },
    {
      "@type": "Question",
      "name": "FXのロスカットレートはどうやって計算しますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "ロスカットレート（買いの場合）＝エントリーレート −（口座残高 − 維持証拠金）÷ 取引数量で計算できます。維持証拠金率は証券会社によって異なりますが、一般的に50%程度です。"}
    },
    {
      "@type": "Question",
      "name": "FXのスワップポイントにも税金はかかりますか？",
      "acceptedAnswer": {"@type": "Answer", "text": "はい、スワップポイントも課税対象です。FXの課税所得は「為替差益＋スワップポイント収益−必要経費」で計算されます。スワップポイントを含めた年間の利益に対して20.315%の税率が適用されます。"}
    }
  ]
};

export default function Page() {
  const faq = [
    { question: "FXの確定申告は必要ですか？", answer: "会社員の場合、FXの利益が20万円を超えると確定申告が必要です。自営業の場合は48万円を超えると申告が必要です。" },
    { question: "スワップポイントは課税されますか？", answer: "はい、スワップポイントも為替差益と同様に「雑所得」として課税されます。" },
    { question: "レバレッジ25倍は安全ですか？", answer: "レバレッジが高いほどリスクも高まります。実効レバレッジ10倍以上はハイレバレッジとされ、注意が必要です。" },
    { question: "ロスカットはいつ発生しますか？", answer: "口座残高が維持証拠金（通常は必要証拠金の50%）を下回ると、強制決済（ロスカット）が発生します。" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, softwareApplicationJsonLd, howToJsonLd, faqJsonLd]) }}
      />
      <FXCalculatorClient faq={faq} />
    </>
  );
}
