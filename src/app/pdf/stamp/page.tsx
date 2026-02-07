import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PdfStampClient from "./client";

const tool = getToolById("pdf-stamp")!;

const faq = [
  { question: "PDF押印とは何ですか？", answer: "PDFファイルに電子印鑑（ハンコ画像）を貼り付けるツールです。印刷→押印→スキャンの手間を省き、デジタルで完結できます。" },
  { question: "印鑑画像がなくても使えますか？", answer: "はい、名前を入力するだけで丸印・角印・日付印を自動生成できる「かんたん印影メーカー」機能を搭載しています。" },
  { question: "押印位置は自由に指定できますか？", answer: "はい、PDFのプレビュー上でクリック（タップ）して押印位置を指定し、ドラッグで移動、スライダーでサイズ調整もできます。" },
  { question: "複数ページのPDFに対応していますか？", answer: "はい、ページ送りで各ページに個別に押印できます。" },
  { question: "法的効力はありますか？", answer: "本ツールで作成した電子印鑑は画像の貼り付けです。法的な電子署名とは異なりますが、社内文書や見積書など日常的な書類には広く使われています。" },
  { question: "PDFはサーバーに送信されますか？", answer: "いいえ、すべてブラウザ内で処理されます。PDFや印鑑画像がサーバーに送信されることはありません。" },
];

const seoContent = {
  intro: "PDFに電子印鑑（ハンコ）を押すツールです。印鑑画像のアップロードはもちろん、名前を入力するだけで印影を自動生成する機能も搭載。見積書・請求書・契約書などの押印がデジタルで完結します。",
  useCases: [
    { title: "📄 見積書・請求書", desc: "取引先に送るPDF書類に社印・担当印を押印" },
    { title: "📝 契約書・稟議書", desc: "社内承認用の書類に承認印を押印" },
    { title: "🏢 社内文書", desc: "報告書や申請書に担当者印を押印" },
    { title: "🏠 在宅ワーク", desc: "自宅でも印刷不要でPDFに押印できる" },
  ],
  tips: "印鑑の色は朱色が一般的です。かんたん印影メーカーでは自動的に朱色で生成されます。背景透明PNGの印鑑画像を使うと最もきれいに仕上がります。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF押印ツール｜電子印鑑をPDFに貼り付け",
  tool,
  longDescription: "PDFに電子印鑑を押すツール。印鑑画像アップロードまたは自動生成。ブラウザ処理で安全。",
  keywords: ["PDF 押印 無料", "電子印鑑 PDF", "PDF ハンコ", "PDF 印鑑 貼り付け", "電子印鑑 作成"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PdfStampClient faq={faq} seoContent={seoContent} />
    </>
  );
}
