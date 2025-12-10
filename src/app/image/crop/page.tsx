import { Metadata } from "next";
import ImageCropClient from "./client";

const faq = [
  {
    question: "対応している形式は何ですか？",
    answer: "PNG、JPG/JPEG、WebP形式に対応しています。",
  },
  {
    question: "アスペクト比を固定できますか？",
    answer: "はい。1:1、4:3、16:9などのプリセットや、自由な比率で切り抜けます。",
  },
];

export const metadata: Metadata = {
  title: "画像切り抜き | 山田ツール - 無料オンライントリミングツール",
  description: "画像を任意のサイズに切り抜き。アスペクト比固定対応。プレビュー付き。登録不要、完全無料。",
  keywords: ["画像切り抜き", "トリミング", "画像クロップ", "アスペクト比", "無料"],
  openGraph: {
    title: "画像切り抜き | 山田ツール",
    description: "画像を任意のサイズに切り抜き。完全無料。",
    url: "https://yamada-tools.jp/image/crop",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/image/crop",
  },
};

export default function ImageCropPage() {
  return <ImageCropClient faq={faq} />;
}
