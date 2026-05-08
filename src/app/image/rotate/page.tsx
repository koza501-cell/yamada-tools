import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ImageRotateClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("rotate-image")!;

const faq = [
  { question: "自由な角度で回転できますか？", answer: "90度単位での回転に対応しています。" },
  { question: "左右反転もできますか？", answer: "はい、左右反転（ミラー）にも対応しています。" },
  { question: "複数画像を一括で回転できますか？", answer: "はい、複数画像を同時に処理できます。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像回転｜90度回転・反転",
  tool,
  longDescription: "画像を90度単位で回転、または左右反転。スマホで撮った写真の向き修正に便利です。",
  keywords: ['画像 回転', '写真 回転', '画像 反転', '画像 向き'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageRotateClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
