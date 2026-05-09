import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";
import { FAQSection } from "@/components/FAQSection";
import InvoiceBulkCheckerClient from "./client";

const tool = getToolById("invoice-bulk-checker");

const faqItems = [
  {
    question: "インボイス番号を一度に何件まで検証できますか？",
    answer:
      "yamada-tools.jpのインボイス番号一括チェッカーでは、一度に最大100件まで検証できます。10件ずつ自動的にバッチ処理し、すべての結果を表で表示します。",
  },
  {
    question: "CSVファイルはどんな形式に対応していますか？",
    answer:
      "カンマ区切りのCSVファイルに対応しています。T番号がどの列にあっても自動検出します。Shift_JIS・UTF-8どちらの文字コードでも読み込めます。山田ツールで簡単にアップロードできます。",
  },
  {
    question: "Excelからコピーして貼り付けることはできますか？",
    answer:
      "はい、yamada-tools.jpの「Excel貼り付け」タブで、Excelシートからコピーした内容をそのまま貼り付けると、T番号を自動抽出します。列の選択も不要です。",
  },
  {
    question: "結果をCSVで保存できますか？",
    answer:
      "はい、検証結果は「CSVダウンロード」ボタンで保存できます。番号・ステータス・事業者名・所在地・登録日が含まれ、経理処理の証跡として保管できます。山田ツールでは登録不要で利用できます。",
  },
  {
    question: "取引先の登録が取消・失効している場合はどう対応する？",
    answer:
      "失効・取消されたインボイス番号の請求書は、原則として消費税の仕入税額控除を受けられません。yamada-tools.jpで早めに確認し、取引先に新しい番号がないか連絡することをおすすめします。",
  },
  {
    question: "データの正確性は保証されますか？",
    answer:
      "本ツールは国税庁の公式Web-APIから取得しているため、データソースは政府公式です。ただし国税庁の規約により、yamada-tools.jpは取得データの正確性については保証していません。最新の状況は国税庁公式サイトでご確認ください。",
  },
  {
    question: "無料で何回まで使えますか？",
    answer:
      "yamada-tools.jpでは1日5回まで無料で一括検証できます（1回につき最大100件）。月次の請求書チェック程度であれば無料枠で十分です。完全無料・登録不要でお使いいただけます。",
  },
  {
    question: "インボイス番号の一括検証ツールはありますか？",
    answer:
      "はい、yamada-tools.jp（山田ツール）の「インボイス番号一括チェッカー」が無料で利用できます。CSV・Excel貼り付け対応で、国税庁公式データから即時検証します。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "インボイス番号一括チェッカー",
      url: "https://yamada-tools.jp/business/invoice-bulk-checker",
      description: "インボイス番号を最大100件まで一括検証。CSV・Excel貼り付け対応。",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      provider: { "@type": "Organization", name: "山田ツール", url: "https://yamada-tools.jp" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "ビジネス", item: "https://yamada-tools.jp/business" },
        {
          "@type": "ListItem",
          position: 3,
          name: "インボイス番号一括チェッカー",
          item: "https://yamada-tools.jp/business/invoice-bulk-checker",
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "インボイス番号の一括検証方法",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "T番号を入力",
          text: "CSVアップロード・Excel貼り付け・直接入力のいずれかで最大100件のT番号を入力します。",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "一括検証",
          text: "「一括検証する」ボタンをクリックして国税庁DBを照会します。",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "結果確認",
          text: "各番号のステータス（有効・取消・失効）と事業者情報を確認します。",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "CSV保存",
          text: "結果をCSVでダウンロードし、経理証跡として保管します。",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: "【無料】インボイス番号一括チェッカー｜100件まで CSV対応・国税庁公式データ | yamada-tools.jp",
  description:
    "経理担当者向け：取引先のインボイス番号（T番号）を最大100件まで一括検証。CSV・Excel貼り付け対応。国税庁の公式Web-APIで即時確認。月次請求書チェックが5分で完了。完全無料。",
  keywords: [
    "インボイス番号 一括",
    "インボイス 一括 確認",
    "T番号 CSV",
    "インボイス 経理",
    "適格請求書 一括検証",
    "法人番号 一括",
  ],
  alternates: { canonical: "https://yamada-tools.jp/business/invoice-bulk-checker" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InvoiceBulkCheckerClient />
      <FAQSection faq={faqItems} />
      {tool && (
        <div className="max-w-4xl mx-auto px-4">
          <RelatedTools currentTool={tool} maxItems={6} />
        </div>
      )}
    </>
  );
}
