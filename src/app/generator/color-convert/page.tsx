import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ColorConvertClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

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
  customTitle: "【無料】カラーコード変換｜HEX/RGB/HSL",
  tool,
  longDescription: "HEX、RGB、HSLなどのカラーコードを相互変換。Webデザインやアプリ開発で必要な色コードを簡単に取得できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['カラーコード変換', 'HEX RGB', '色 変換', 'カラーピッカー'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ColorConvertClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
