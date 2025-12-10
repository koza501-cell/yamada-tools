import { Metadata } from "next";
import ImageResizeClient from "./client";
import ToolSchema from '@/components/ToolSchema';
import { toolSchemas } from '@/data/toolSchemas';

const faq = [
  {
    question: "対応している画像形式は？",
    answer: "JPEG、PNG、WebP、GIF形式に対応しています。出力形式も選択可能です。",
  },
  {
    question: "画像の品質は保たれますか？",
    answer: "はい。品質設定を調整できます。高品質設定では元画像に近い品質を維持します。",
  },
  {
    question: "最大何ピクセルまでリサイズできますか？",
    answer: "最大10,000×10,000ピクセルまで対応しています。",
  },
  {
    question: "画像データは保存されますか？",
    answer: "いいえ。すべての処理はブラウザ内で行われ、サーバーに画像データは送信されません。",
  },
];

export const metadata: Metadata = {
  title: "画像リサイズ | 山田ツール - 無料オンライン画像サイズ変更",
  description: "画像のサイズを簡単に変更。縦横比維持、カスタムサイズ、SNS用プリセット対応。ブラウザ内処理で安全。登録不要、完全無料。",
  keywords: ["画像リサイズ", "画像サイズ変更", "画像縮小", "画像拡大", "無料", "オンライン"],
  openGraph: {
    title: "画像リサイズ | 山田ツール",
    description: "画像サイズを簡単に変更。完全無料。",
    url: "https://yamada-tools.jp/image/resize",
  },
};

const schema = toolSchemas['image-resize'];

export default function ImageResizePage() {
  return (
    <>
      <ToolSchema {...schema} />
      <ImageResizeClient faq={faq} />
    </>
  );
}
