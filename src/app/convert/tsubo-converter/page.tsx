import { Metadata } from "next";
import TsuboConverterClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

const faq = [
  {
    question: "1坪は何平米（㎡）ですか？",
    answer: "1坪は約3.30579平方メートル（㎡）です。計算式は「坪数 × 3.30579 = 平米」です。逆に平米から坪に変換するには「平米 × 0.3025 = 坪数」で計算できます。"
  },
  {
    question: "1坪は何平方フィート（square feet）ですか？",
    answer: "1坪は約35.58平方フィート（sq ft）です。アメリカやイギリスの不動産で使われるsquare feetとの変換に便利です。"
  },
  {
    question: "How many square feet is 1 tsubo?",
    answer: "1 tsubo equals approximately 35.58 square feet (sq ft). Tsubo is a traditional Japanese unit of area still commonly used in real estate. To convert tsubo to square feet, multiply by 35.58."
  },
  {
    question: "How do I convert tsubo to acres?",
    answer: "1 tsubo equals approximately 0.000817 acres. To convert, multiply the tsubo value by 0.000817. For example, 100 tsubo = 0.0817 acres. This tool automatically calculates the conversion for you."
  },
  {
    question: "坪と畳の違いは何ですか？",
    answer: "1坪は畳2枚分の広さです。ただし畳のサイズは地域により異なります（江戸間：1.548㎡、京間：1.824㎡、中京間：1.656㎡）。不動産広告で1畳=1.62㎡が標準です。"
  },
  {
    question: "What is tsubo? How is it used in Japan?",
    answer: "Tsubo is a traditional Japanese unit of area equal to approximately 3.306 square meters or 35.58 square feet. It is still widely used in Japanese real estate for land pricing and property descriptions, even though the metric system is the official standard."
  },
  {
    question: "坪単価の計算方法は？",
    answer: "坪単価は「物件価格 ÷ 坪数」で計算します。例えば3,000万円の土地が50坪なら、坪単価は60万円/坪です。本ツールで面積変換した後、坪単価の計算にもお役立てください。"
  },
  {
    question: "韓国のピョン（평/坪）や台湾のピン（坪）との違いは？",
    answer: "日本・韓国・台湾の「坪」はほぼ同じ面積（約3.3058㎡）です。韓国では평（ピョン）、台湾では坪（ピン）と呼ばれ、いずれも不動産取引で現在も使われています。"
  },
  {
    question: "Can I use this tool for Korean pyeong or Taiwanese ping?",
    answer: "Yes! Japanese tsubo, Korean pyeong, and Taiwanese ping are essentially the same unit - approximately 3.306 square meters. This converter works for all three."
  },
  {
    question: "不動産で使われる面積単位にはどんなものがありますか？",
    answer: "日本では坪・平米・畳が主流ですが、海外ではsquare feet（米国・英国）、acres（大規模土地）、hectares（国際標準）などが使われます。本ツールは全ての単位に対応しています。"
  }
];

export const metadata: Metadata = {
  title: "【無料】坪・平米・㎡変換｜Tsubo to Square Feet / Acres Converter｜面積計算ツール",
  description: "坪（tsubo）を平米・畳・平方フィート・エーカー・ヘクタールに一括変換。Japanese tsubo to square feet, acres, square meters converter. 不動産・土地面積の計算に。無料・登録不要。",
  keywords: [
    "坪 変換", "坪 平米", "坪 計算", "坪 平方フィート", "坪 エーカー",
    "tsubo converter", "tsubo to square feet", "tsubo to sqft",
    "tsubo to acres", "tsubo to square meters", "tsubo to hectares",
    "Japanese land area", "Japanese real estate unit", "坪 面積",
    "tsubo calculator", "pyeong converter", "ping converter",
    "坪数 計算", "坪単価", "不動産 面積変換", "畳 変換",
    "1 tsubo in square feet", "how big is a tsubo",
    "Japanese area unit converter", "坪 ㎡ 変換"
  ],
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "坪・面積変換ツール | Tsubo Area Converter",
    description: "坪（tsubo）⇄ 平米・畳・sq ft・acres・hectares を一括変換。Free Japanese tsubo converter for real estate.",
    url: "https://yamada-tools.jp/convert/tsubo-converter",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "坪・面積変換 | Tsubo Converter",
    description: "坪をsq ft・acres・㎡に一括変換。Tsubo to square feet & acres converter. 無料・登録不要。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/tsubo-converter",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "坪・面積変換ツール (Tsubo Area Converter)",
    "description": "坪（tsubo）を平米・畳・平方フィート・エーカー・ヘクタールに一括変換するオンラインツール。Convert Japanese tsubo to square feet, acres, square meters and more.",
    "url": "https://yamada-tools.jp/convert/tsubo-converter",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "inLanguage": ["ja", "en"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "author": {
      "@type": "Organization",
      "name": "Yamada Trade LLC",
      "url": "https://yamada-tools.jp"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }
];

const tool = getToolById("tsubo-converter")!;

export default function TsuboConverterPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <TsuboConverterClient faq={faq} />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
