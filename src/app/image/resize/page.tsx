import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("resize-image")!;

const faq = [
  { question: "縦横比は維持されますか？", answer: "はい、デフォルトで縦横比を維持します。解除も可能です。" },
  { question: "一括でリサイズできますか？", answer: "はい、複数画像を同じサイズに一括変換できます。" },
  { question: "拡大すると画質は落ちますか？", answer: "拡大すると画質が低下する場合があります。縮小は問題ありません。" },
];

const seoContent = {
  intro: "画像のサイズを変更。ピクセル指定やパーセント指定で、SNS投稿やWeb用に最適なサイズに調整できます。",
  useCases: [
    { title: "📱 SNS投稿", desc: "Instagram、Twitter用サイズに" },
    { title: "🌐 Web用", desc: "ブログやサイト用に最適化" },
    { title: "📧 メール添付", desc: "送信しやすいサイズに縮小" },
    { title: "🖨️ 印刷用", desc: "印刷に適したサイズに調整" },
  ],
  tips: "縦横比を維持したままリサイズすると、画像が歪みません。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像リサイズ｜サイズ変更・縮小拡大",
  tool,
  longDescription: "画像のサイズを変更。ピクセル指定やパーセント指定で、SNS投稿やWeb用に最適なサイズに調整できます。",
  keywords: ['画像リサイズ', '画像 サイズ変更', '写真 リサイズ', '画像 縮小', '画像 拡大'],
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
