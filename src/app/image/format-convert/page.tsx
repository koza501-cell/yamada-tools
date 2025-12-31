import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("convert-image")!;

const faq = [
  { question: "透過は保持されますか？", answer: "PNGやWebPへの変換では透過が保持されます。JPGは透過非対応です。" },
  { question: "WebPとは何ですか？", answer: "Googleが開発した軽量な画像形式で、Webサイトでの使用に最適です。" },
  { question: "画質は選べますか？", answer: "はい、JPGやWebPへの変換時に画質を指定できます。" },
];

const seoContent = {
  intro: "JPG、PNG、WebP、GIFなど画像形式を相互変換。Web用にWebPへ、印刷用にJPGへなど、用途に合わせて変換できます。",
  useCases: [
    { title: "🌐 Web最適化", desc: "WebPに変換して軽量化" },
    { title: "🖨️ 印刷用", desc: "PNGからJPGに変換" },
    { title: "🎨 透過保持", desc: "JPGからPNGに変換" },
    { title: "📧 互換性", desc: "相手が開ける形式に変換" },
  ],
  tips: "WebPはファイルサイズが小さく、Webサイトの表示速度向上に効果的です。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "JPG、PNG、WebP、GIFなど画像形式を相互変換。Web用にWebPへ、印刷用にJPGへなど、用途に合わせて変換できます。",
  keywords: ['画像 形式変換', 'JPG PNG 変換', 'WebP 変換', '画像 コンバーター'],
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
