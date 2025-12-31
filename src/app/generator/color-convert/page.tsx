import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("color-convert")!;

const faq = [
  { question: "HEXからRGBに変換できますか？", answer: "はい、HEX、RGB、HSL、CMYKの相互変換に対応しています。" },
  { question: "色を見ながら選べますか？", answer: "はい、カラーピッカーで視覚的に色を選択できます。" },
  { question: "日本の伝統色は対応していますか？", answer: "一部の日本の伝統色名にも対応しています。" },
];

const seoContent = {
  intro: "HEX、RGB、HSLなどのカラーコードを相互変換。Webデザインやアプリ開発で必要な色コードを簡単に取得できます。",
  useCases: [
    { title: "🎨 Webデザイン", desc: "CSS用のカラーコード取得" },
    { title: "📱 アプリ開発", desc: "RGB値の確認" },
    { title: "🖌️ デザイン", desc: "印刷用のCMYK確認" },
    { title: "🔍 色の確認", desc: "色名からコードを調べる" },
  ],
  tips: "カラーピッカーで色を選ぶと、各形式のコードが自動表示されます。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "HEX、RGB、HSLなどのカラーコードを相互変換。Webデザインやアプリ開発で必要な色コードを簡単に取得できます。",
  keywords: ['カラーコード変換', 'HEX RGB', '色 変換', 'カラーピッカー'],
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
