import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("rotate-image")!;

const faq = [
  { question: "自由な角度で回転できますか？", answer: "90度単位での回転に対応しています。" },
  { question: "左右反転もできますか？", answer: "はい、左右反転（ミラー）にも対応しています。" },
  { question: "複数画像を一括で回転できますか？", answer: "はい、複数画像を同時に処理できます。" },
];

const seoContent = {
  intro: "画像を90度単位で回転、または左右反転。スマホで撮った写真の向き修正に便利です。",
  useCases: [
    { title: "📱 写真修正", desc: "向きが違う写真を修正" },
    { title: "🔄 左右反転", desc: "鏡像を作成" },
    { title: "📷 スキャン修正", desc: "傾いたスキャン画像を修正" },
    { title: "🖼️ レイアウト", desc: "縦横を入れ替える" },
  ],
  tips: "90度、180度、270度の回転と、左右反転に対応しています。",
};

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
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
