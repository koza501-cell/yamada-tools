import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("rotate")!;

const faq = [
  { question: "複数ページを一度に回転できますか？", answer: "はい、全ページ一括または選択したページのみ回転できます。" },
  { question: "回転後の画質は落ちますか？", answer: "いいえ、画質は一切劣化しません。ページの向きデータのみが変更されます。" },
  { question: "90度以外の角度で回転できますか？", answer: "90度、180度、270度（-90度）の回転に対応しています。" },
  { question: "スマホからでも使えますか？", answer: "はい、iPhone・Androidどちらからもブラウザで利用可能です。" },
];

const seoContent = {
  intro: "PDFのページを90度・180度・270度回転。スキャンで向きが違ってしまったPDFも、ワンクリックで正しい向きに修正できます。",
  useCases: [
    { title: "📄 スキャン修正", desc: "向きが違うスキャンPDFを修正" },
    { title: "📱 スマホ撮影", desc: "縦横が逆の写真PDFを回転" },
    { title: "🖨️ 印刷前調整", desc: "印刷前にページの向きを揃える" },
    { title: "📑 混在ページ", desc: "縦横混在のPDFを統一" },
  ],
  tips: "複数ページを一括回転することもできます。回転したいページだけを選択することも可能です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF回転｜縦横を90度回転｜スキャンミス修正",
  tool,
  longDescription: "PDFのページを90度・180度・270度回転。スキャンで向きが違ってしまったPDFも、ワンクリックで正しい向きに修正できます。",
  keywords: ['PDF回転', 'PDF 向き変更', 'PDF 横向き', 'PDF 縦向き', 'ページ回転'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
    </>
  );
}
