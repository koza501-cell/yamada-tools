import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import EnvelopePrintClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import { StepGuide } from "./step-guide";
import { JsonLdDedup } from "./json-ld-dedup";
import RelatedTools from "@/components/common/RelatedTools";
import { AdUnit } from "@/components/common/AdUnit";

const tool = getToolById("envelope-print")!;

const faq = [
  {
    question: "どの封筒サイズに対応していますか？",
    answer: "長形3号、長形4号、角形2号、角形A4、洋形1号など、日本で使われる主要な封筒サイズすべてに対応しています。",
  },
  {
    question: "縦書きと横書きは選べますか？",
    answer: "はい、縦書き・横書きどちらにも対応しています。ビジネス文書は縦書き、DMや案内状は横書きが一般的です。",
  },
  {
    question: "郵便番号枠に合わせて印刷できますか？",
    answer: "はい、封筒の郵便番号枠に合わせた位置に自動配置されます。位置の微調整も可能です。",
  },
  {
    question: "会社のロゴや印影を入れられますか？",
    answer: "はい、差出人側にロゴや社印の画像を配置できます。PNG形式の透過画像がおすすめです。",
  },
  {
    question: "プリンターの設定は？",
    answer: "印刷時にプリンターの用紙設定を封筒サイズに合わせてください。多くのプリンターは封筒印刷に対応しています。",
  },
  {
    question: "複数の宛先を一括印刷できますか？",
    answer: "現在は1件ずつの印刷となります。大量印刷が必要な場合は、CSVインポート機能を今後追加予定です。",
  },
  {
    question: "差出人情報は保存されますか？",
    answer: "はい、ブラウザに保存されます。次回アクセス時に自動入力されるので、毎回入力する手間が省けます。",
  },
  {
    question: "敬称（様・御中など）は自動で付きますか？",
    answer: "はい、個人宛は「様」、会社宛は「御中」など、適切な敬称を選択できます。",
  },
  {
    question: "スマホからでも使えますか？",
    answer: "はい、スマホからレイアウトを確認できます。ただし印刷はパソコンに接続したプリンターが必要です。",
  },
  {
    question: "印刷がずれる場合は？",
    answer: "詳細設定で位置を微調整できます。プリンターによってズレ具合が異なるため、まず1枚テスト印刷することをおすすめします。",
  },
  {
    question: "コンビニで印刷できますか？",
    answer: "PDF保存後、コンビニのマルチコピー機でA4用紙に印刷し、封筒に貼り付けてご利用いただけます。セブン-イレブン・ファミリーマート・ローソンすべてのマルチコピー機に対応しています。",
  },
];

const seoContent = {
  intro: "ビジネスレター、請求書、DMの発送——封筒の宛名書き、手書きで大変ではありませんか？封筒印刷ツールなら、宛先を入力するだけで、郵便番号枠にピッタリ合った美しい宛名を印刷。長形・角形・洋形など日本の全サイズに対応しています。",
  useCases: [
    { title: "💼 ビジネス文書", desc: "請求書・契約書の送付に" },
    { title: "📮 DM発送", desc: "キャンペーン案内・お知らせに" },
    { title: "🎉 招待状", desc: "結婚式・パーティーの案内に" },
    { title: "📝 履歴書", desc: "就活・転職の応募書類送付に" },
  ],
  tips: "封筒は印刷前にプリンターにセットする向きを確認しましょう。多くのプリンターは蓋（フラップ）側を手前にセットします。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "封筒印刷・宛名印刷【無料】長形・角形・洋形 全サイズ対応",
  tool,
  longDescription: "封筒の宛名印刷を無料で。長形3号・角形2号・洋形など全サイズ対応。郵便番号入力で住所自動補完。縦書き・横書き対応。300DPI高画質印刷でプロ品質の仕上がり。登録不要・スマホOK。ビジネス・個人どちらにも対応。",
  keywords: ["封筒印刷", "宛名印刷", "封筒 宛名", "長形3号 印刷", "角形2号 印刷", "封筒 テンプレート", "宛名書き",
    "封筒宛名",
    "郵便封筒"
  ],
});

const envelopeHowToSteps = [
  { name: "封筒サイズを選択", text: "長形3号・角形2号など用途に合った封筒サイズを選択します。" },
  { name: "宛先を入力", text: "郵便番号を入力すると住所が自動補完されます。氏名・会社名・敬称を入力してください。" },
  { name: "プレビューで確認", text: "リアルタイムプレビューで印刷レイアウトを確認します。位置がずれている場合は詳細設定で微調整できます。" },
  { name: "印刷またはPDF保存", text: "「印刷」ボタンで直接プリンターへ出力、または「PDF保存」でファイルに保存してコンビニ印刷も可能です。" },
];
const jsonLd = generateToolJsonLd(tool, faq, envelopeHowToSteps);

export default function EnvelopePrintPage() {
  return (
    <>
      <script
        id="envelope-print-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdFreeZone><EnvelopePrintClient faq={faq} seoContent={seoContent} /></AdFreeZone>
      <AdUnit slot="7823491056" format="horizontal" />
      <StepGuide />
      <JsonLdDedup scriptId="envelope-print-jsonld" />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
