import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import MergeClient from "./client";
import { toolSchemas } from "@/data/toolSchemas";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("merge")!;

const faq = [
  {
    question: "何ファイルまで結合できますか？",
    answer: "最大50ファイルまで一度に結合できます。それ以上の場合は、まず50ファイルずつ結合してから、さらに結合することで対応可能です。",
  },
  {
    question: "結合する順番は変えられますか？",
    answer: "はい、ドラッグ＆ドロップでお好きな順番に並び替えができます。ファイルをアップロード後、サムネイルを見ながら順序を調整してください。",
  },
  {
    question: "違うサイズのPDFも結合できますか？",
    answer: "はい、A4とB5など異なるサイズのPDFも問題なく結合できます。各ページのサイズはそのまま維持されます。",
  },
  {
    question: "パスワード付きPDFは結合できますか？",
    answer: "パスワードで保護されたPDFはそのままでは結合できません。先に「PDFロック解除」ツールでパスワードを解除してからお試しください。",
  },
  {
    question: "結合後のファイルサイズはどうなりますか？",
    answer: "基本的には元ファイルの合計サイズに近くなります。ただし、重複するフォントや画像がある場合は、最適化により若干小さくなることもあります。",
  },
  {
    question: "スキャンしたPDFも結合できますか？",
    answer: "はい、スキャンで作成したPDF（画像PDF）も問題なく結合できます。他のPDFと混在させても大丈夫です。",
  },
  {
    question: "結合したPDFの品質は落ちますか？",
    answer: "いいえ、品質は一切劣化しません。元のPDFをそのまま連結するだけなので、画質やテキストの鮮明さは維持されます。",
  },
  {
    question: "会社の資料を結合しても安全ですか？",
    answer: "はい、安全です。ファイルは日本国内のサーバーのみで処理され、海外に送信されることはありません。処理後60分で自動削除されます。",
  },
  {
    question: "スマホからでも結合できますか？",
    answer: "はい、iPhone・Androidどちらからもブラウザで直接ご利用いただけます。複数ファイルの選択も可能です。",
  },
  {
    question: "結合後にページ番号を付けられますか？",
    answer: "結合後に「PDFページ番号追加」ツールをお使いください。ヘッダーやフッターに連番を自動挿入できます。",
  },
];

const seoContent = {
  intro: "バラバラのPDFファイルを1つにまとめたい——そんな時に便利なのがPDF結合ツールです。契約書と別紙、見積書と仕様書、複数ページのスキャン画像など、最大50ファイルをドラッグ＆ドロップで簡単に統合。順番の並び替えも自由自在です。",
  useCases: [
    { title: "📑 契約書類", desc: "本契約書と別紙・覚書を1ファイルに" },
    { title: "📊 報告書", desc: "複数部署の資料を1つの報告書に統合" },
    { title: "📄 スキャン文書", desc: "バラバラにスキャンした書類をまとめる" },
    { title: "📁 提出資料", desc: "申請書と添付書類を1ファイルで提出" },
  ],
  tips: "結合前にファイル名を連番（01_表紙.pdf、02_目次.pdf...）にしておくと、アップロード時に自動で正しい順序になります。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "PDF結合【無料】複数のPDFを1つにまとめる｜ドラッグ&ドロップで簡単｜登録不要",
  tool,
  longDescription:
    "複数のPDFファイルを1つに結合する無料ツール。最大50ファイル対応、ドラッグ&ドロップで順番の並び替えも自由。請求書・契約書・履歴書など複数の書類をまとめてメール添付・印刷したい時に。日本国内サーバーで安全処理、登録不要・完全無料・60分自動削除。",
  keywords: [
    "PDF結合",
    "PDF 統合",
    "PDF まとめる",
    "PDF 1つにする",
    "複数PDF 結合",
    "PDF merge",
    "無料 PDF結合",
    "オンライン PDF結合",
    "PDF統合",
    "ファイル結合",
    "PDF編集ツール"
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function MergePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MergeClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
