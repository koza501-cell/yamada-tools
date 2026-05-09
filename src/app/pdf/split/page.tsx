import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import SplitClient from "./client";
import { toolSchemas } from "@/data/toolSchemas";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("split")!;

const faq = [
  {
    question: "PDFを1ページずつ分割できますか？",
    answer: "はい、1ページずつ個別のファイルに分割できます。10ページのPDFなら、10個の別々のファイルとしてダウンロードできます。",
  },
  {
    question: "特定のページだけ抽出できますか？",
    answer: "はい、「1,3,5-7」のように抽出したいページ番号を指定できます。必要なページだけを取り出して新しいPDFを作成できます。",
  },
  {
    question: "分割後のファイル名はどうなりますか？",
    answer: "元のファイル名に連番が付きます。例えば「資料.pdf」を分割すると「資料_1.pdf」「資料_2.pdf」のようになります。",
  },
  {
    question: "100ページ以上のPDFも分割できますか？",
    answer: "はい、ページ数の制限はありません。ただし、ファイルサイズは50MBまでとなります。大きなファイルは処理に時間がかかる場合があります。",
  },
  {
    question: "分割すると画質は落ちますか？",
    answer: "いいえ、品質は一切劣化しません。元のページをそのまま切り出すだけなので、画質やテキストの鮮明さは維持されます。",
  },
  {
    question: "パスワード付きPDFは分割できますか？",
    answer: "パスワードで保護されたPDFはそのままでは分割できません。先に「PDFロック解除」ツールで解除してからお試しください。",
  },
  {
    question: "スマホからでも分割できますか？",
    answer: "はい、iPhone・Androidどちらからもブラウザで直接ご利用いただけます。アプリのインストールは不要です。",
  },
  {
    question: "会社の機密資料でも使えますか？",
    answer: "はい、安全です。ファイルは日本国内サーバーのみで処理され、60分後に自動削除されます。SSL暗号化で通信も保護されています。",
  },
];

const seoContent = {
  intro: "大きなPDFから必要なページだけ取り出したい、1ページずつ別ファイルにしたい——そんな時に使えるのがPDF分割ツールです。ページ番号を指定して抽出したり、全ページを個別ファイルに分けたり。用途に合わせて柔軟に分割できます。",
  useCases: [
    { title: "📄 必要ページ抽出", desc: "長い資料から該当ページだけ取り出す" },
    { title: "📧 メール添付用", desc: "大きなPDFを分割してサイズを小さく" },
    { title: "📁 整理・分類", desc: "1ファイルを章ごと・セクションごとに分割" },
    { title: "🖨️ 部分印刷", desc: "印刷したいページだけ抽出して印刷" },
  ],
  tips: "「1-5,10,15-20」のように、範囲指定とページ指定を組み合わせることもできます。カンマで区切って自由に指定してください。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF分割｜1ページずつ切り離し｜必要部分だけ抽出",
  tool,
  longDescription:
    "PDFを分割・ページ抽出する無料ツール。必要なページだけ取り出したり、1ページずつ別ファイルに分割可能。100ページの書類から特定の章だけ抜き出す作業も簡単。請求書・契約書の整理に。日本国内サーバーで安全処理、登録不要・完全無料・60分自動削除。",
  keywords: [
    "PDF分割",
    "PDF ページ抽出",
    "PDF 切り出し",
    "PDF 分ける",
    "PDF split",
    "無料 PDF分割",
    "PDFから1ページ抽出",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function SplitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
