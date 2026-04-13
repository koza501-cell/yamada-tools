import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import DpiCheckerClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("dpi-checker")!;

const faq = [
  { question: "DPIとは何ですか？", answer: "DPI（Dots Per Inch）は1インチあたりのドット数で、印刷解像度を表します。一般的に300DPI以上が高品質印刷に適しています。" },
  { question: "印刷に最適なDPIは？", answer: "一般的なカラー印刷は300DPI、ポスターなど大判印刷は150〜200DPI、Web表示は72〜96DPIが目安です。" },
  { question: "画像のDPIを確認するだけですか？", answer: "DPIの確認に加え、ピクセルサイズ、ファイルサイズ、推奨印刷サイズも表示します。" },
  { question: "スマホで撮った写真のDPIは？", answer: "スマホ写真は通常72DPIですが、ピクセル数が多いため実質的に高解像度です。印刷サイズを確認することが重要です。" },
  { question: "対応画像形式は？", answer: "JPG、PNG、WebP、BMP、GIF形式に対応しています。" },
];

const seoContent = {
  intro: "画像のDPI（解像度）を確認する無料ツールです。印刷前にDPIをチェックして、高品質な印刷ができるか事前に確認できます。推奨印刷サイズの計算も自動で行います。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像DPI確認｜解像度チェック｜印刷サイズ計算｜ブラウザ処理",
  tool,
  longDescription: "画像のDPI（解像度）を確認する無料ツール。印刷前のDPIチェック、推奨印刷サイズの自動計算。ブラウザ処理で安全。",
  keywords: ["DPI 確認", "画像 解像度 チェック", "DPI チェッカー", "印刷 解像度", "画像 DPI 調べる", "写真 解像度 確認"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DpiCheckerClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
