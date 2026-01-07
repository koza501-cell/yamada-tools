import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("url-encode")!;

const faq = [
  { question: "日本語URLを作りたいのですが？", answer: "日本語をエンコードしてURLに使用できる形式に変換できます。" },
  { question: "エンコードとデコードの違いは？", answer: "エンコードは変換、デコードは元に戻すことです。" },
  { question: "スペースはどう変換されますか？", answer: "スペースは%20または+に変換されます。" },
];

const seoContent = {
  intro: "URLに使用できない文字をエンコード・デコード。日本語を含むURLの作成や、パラメータの受け渡しに必要な変換です。",
  useCases: [
    { title: "🌐 URL作成", desc: "日本語を含むURLを作成" },
    { title: "🔗 パラメータ", desc: "URLパラメータのエンコード" },
    { title: "💻 開発", desc: "APIリクエストの準備" },
    { title: "🔧 デバッグ", desc: "エンコード済みURLの確認" },
  ],
  tips: "URLに日本語を含める場合は、必ずエンコードが必要です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】URLエンコード｜日本語URL変換",
  tool,
  longDescription: "URLに使用できない文字をエンコード・デコード。日本語を含むURLの作成や、パラメータの受け渡しに必要な変換です。",
  keywords: ['URLエンコード', 'URL デコード', 'パーセントエンコード', 'URL 日本語'],
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
