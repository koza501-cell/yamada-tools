import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("ocr")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "スキャンしたPDFや画像PDFから文字を認識。検索可能なPDFに変換したり、テキストを抽出できます。",
  useCases: [
    { title: "🔍 検索可能化", desc: "スキャンPDFを検索可能に" },
    { title: "📝 テキスト抽出", desc: "画像から文字を取り出す" },
    { title: "📄 文書デジタル化", desc: "紙文書のデジタル化" },
    { title: "📊 データ入力", desc: "手入力の手間を省く" },
  ],
  tips: "高解像度でスキャンしたPDFほど、OCR精度が向上します。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF OCR｜スキャンPDFをテキスト化",
  tool,
  longDescription: "スキャンしたPDFや画像PDFから文字を認識。検索可能なPDFに変換したり、テキストを抽出できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['PDF OCR', '文字認識', 'スキャン PDF テキスト', '画像 文字抽出'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} customH1="PDFをOCRでテキスト化する無料ツール — スキャンPDFを編集可能に" faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
