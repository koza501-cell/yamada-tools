import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("rotate")!;

const faq = [
  { 
    question: "複数ページを一度に回転できますか？", 
    answer: "はい、全ページ一括または選択したページのみ回転できます。ページサムネイルから回転したいページを選んで操作できます。" 
  },
  { 
    question: "回転後の画質は落ちますか？", 
    answer: "いいえ、画質は一切劣化しません。ページの向きデータ（メタデータ）のみが変更されるため、テキストや画像の品質はそのまま維持されます。" 
  },
  { 
    question: "90度以外の角度で回転できますか？", 
    answer: "90度（右回り）、180度（上下反転）、270度（左回り/-90度）の回転に対応しています。任意の角度での回転には対応していません。" 
  },
  { 
    question: "スマホからでも使えますか？", 
    answer: "はい、iPhone・Androidどちらからもブラウザで利用可能です。アプリのインストールは不要で、そのままPDFをアップロードして回転できます。" 
  },
  {
    question: "スキャンしたPDFの向きがバラバラです。一括で修正できますか？",
    answer: "はい、可能です。まず全ページを表示し、回転が必要なページを選択してから一括回転できます。縦横混在のPDFも簡単に統一できます。"
  },
  {
    question: "回転したPDFを元に戻せますか？",
    answer: "はい、同じツールで逆方向に回転すれば元に戻せます。例えば90度回転したものは270度（-90度）回転で元通りになります。"
  },
  {
    question: "会社の機密文書を回転しても安全ですか？",
    answer: "はい、安全です。ファイルは日本国内のサーバーのみで処理され、海外に送信されることはありません。処理後60分で自動削除されます。"
  },
  {
    question: "パスワード付きPDFは回転できますか？",
    answer: "パスワードで保護されたPDFはそのままでは回転できません。先に「PDFロック解除」ツールでパスワードを解除してからお試しください。"
  },
  {
    question: "回転後にファイルサイズは変わりますか？",
    answer: "ほとんど変わりません。回転はページの向き情報を変更するだけなので、ファイルサイズへの影響は最小限です。"
  },
  {
    question: "複数のPDFファイルを一度に回転できますか？",
    answer: "現在は1ファイルずつの処理となります。複数ファイルがある場合は、それぞれアップロードして回転してください。"
  },
];

const seoContent = {
  intro: "PDFのページを90度・180度・270度回転。スキャンで向きが違ってしまったPDFも、ワンクリックで正しい向きに修正できます。複合機でスキャンした書類の向きがバラバラ、スマホで撮った書類が横向きになってしまった——そんなPDFの向き問題を瞬時に解決します。",
  useCases: [
    { title: "📄 スキャン修正", desc: "複合機でスキャンした書類の向きを修正。縦向き・横向きが混在したPDFも一括で統一" },
    { title: "📱 スマホ撮影PDF", desc: "スマホで撮影してPDF化した書類の向きを修正。縦横が逆になった写真も簡単回転" },
    { title: "🖨️ 印刷前の調整", desc: "印刷前にページの向きを揃える。見開き印刷や両面印刷の前に確認・修正" },
    { title: "📑 資料整理", desc: "受け取ったPDF資料のページ向きを統一。プレゼン資料や報告書の体裁を整える" },
    { title: "📋 申請書類", desc: "役所や銀行に提出する書類のPDFの向きを確認・修正。見やすい資料で印象アップ" },
  ],
  tips: "スキャン時に向きがバラバラになりやすい書類は、スキャン前に原稿の向きを揃えておくと効率的です。それでも向きが違う場合は、このツールで簡単に修正できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF回転｜縦横を90度回転｜スキャンミス修正",
  tool,
  longDescription: "PDFのページを90度・180度・270度回転。スキャンで向きが違ってしまったPDFも、ワンクリックで正しい向きに修正。複数ページの一括回転も可能。日本国内サーバーで安全処理。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['PDF回転', 'PDF 向き変更', 'PDF 横向き', 'PDF 縦向き', 'ページ回転', 'PDF 90度', 'スキャン 向き修正', 'PDF 向き 直す'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
