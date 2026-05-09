import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import TNumberClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";
import { FAQSection } from "@/components/FAQSection";

const tool = getToolById("invoice-validator")!;

const faqItems = [
  {
    question: "インボイス番号（T番号）とは何ですか？",
    answer:
      "適格請求書発行事業者として国税庁に登録された事業者に付与される13桁の番号で、頭にTが付きます（例: T6010001197612）。インボイス制度（2023年10月開始）では、仕入税額控除を受けるためにこの番号の確認が必要です。yamada-tools.jpで国税庁公式データから即座に検証できます。",
  },
  {
    question: "インボイス番号の確認はなぜ必要ですか？",
    answer:
      "取引先のインボイス番号が無効・取消・失効している場合、消費税の仕入税額控除が受けられず、自社の納税額が増えてしまうためです。山田ツールで月次の請求書チェック時に簡単に確認できます。",
  },
  {
    question: "T番号が「該当なし」と表示される原因は？",
    answer:
      "①番号の入力ミス（特に数字の桁ずれ）、②取引先がまだ登録していない、③番号が偽造されている、のいずれかです。yamada-tools.jpの本ツールはNTA公式データを使用しているため、結果は信頼できます。",
  },
  {
    question: "一度に何件まで検索できますか？",
    answer:
      "yamada-tools.jpの本ツールでは最大10件まで一度に検索できます。それ以上の一括チェックが必要な場合は、インボイス番号一括チェッカーをご利用ください。",
  },
  {
    question: "取引先の登録番号が変わった場合は？",
    answer:
      "法人番号は基本的に変更されませんが、個人事業主の場合は法人成りに伴って番号が変わることがあります。山田ツールの「履歴も含む」オプションで過去の登録履歴も確認できます。",
  },
  {
    question: "データはどこから取得していますか？",
    answer:
      "国税庁「適格請求書発行事業者公表システム」のWeb-APIから取得しています。これは政府公式のデータソースで、yamada-tools.jpは正規のApplication IDを取得して利用しています。",
  },
  {
    question: "検索結果を保存・印刷できますか？",
    answer:
      "はい、yamada-tools.jpではCSVダウンロード・印刷・PDF保存に対応しています。経理処理の証跡として保存できます。",
  },
  {
    question: "インボイス番号を無料で確認できるツールはありますか？",
    answer:
      "はい、yamada-tools.jp（山田ツール）で完全無料・登録不要で確認できます。1日5回まで無料で、最大10件を同時にチェックできます。",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "インボイス番号（T番号）の検索・確認方法",
  "description": "yamada-tools.jpでT番号を国税庁DBで検証する手順",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "T番号を入力", "text": "T番号（T+13桁の数字）を1行に1件ずつ入力します" },
    { "@type": "HowToStep", "position": 2, "name": "履歴オプション設定", "text": "必要に応じて「履歴も含む」にチェックを入れます" },
    { "@type": "HowToStep", "position": 3, "name": "検索実行", "text": "「検索」ボタンをクリックして国税庁DBを照会します" },
    { "@type": "HowToStep", "position": 4, "name": "結果確認", "text": "事業者名・所在地・登録日・ステータスを確認します" },
    { "@type": "HowToStep", "position": 5, "name": "データ保存", "text": "必要に応じてCSV保存・印刷でエビデンスを保管します" },
  ],
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "インボイス番号検索ツール - yamada-tools.jp",
  "description": "国税庁公式APIで適格請求書発行事業者のT番号を即時検証。事業者名・所在地・登録日も表示。",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
  "url": "https://yamada-tools.jp/generator/t-number",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
    { "@type": "ListItem", "position": 2, "name": "計算・生成ツール", "item": "https://yamada-tools.jp/generator" },
    { "@type": "ListItem", "position": 3, "name": "インボイス番号検索", "item": "https://yamada-tools.jp/generator/t-number" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map((f) => ({
    "@type": "Question",
    "name": f.question,
    "acceptedAnswer": { "@type": "Answer", "text": f.answer },
  })),
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】インボイス番号 検索・確認｜国税庁データで即座に検証",
  tool,
  longDescription:
    "適格請求書発行事業者の登録番号（T番号）を国税庁公式データベースで即時検証。事業者名・所在地・登録日も表示。最大10件まで一括チェック可能。経理担当者・フリーランス・中小企業向け。完全無料・登録不要。",
  keywords: [
    "インボイス番号 確認",
    "インボイス番号 検索",
    "T番号 検証",
    "適格請求書",
    "インボイス制度",
    "登録番号 確認",
    "国税庁 インボイス",
  ],
});

const baseJsonLd = generateToolJsonLd(tool, faqItems);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <TNumberClient />
      <FAQSection faq={faqItems} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
