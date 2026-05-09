import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("watermark")!;

const faq = [
  { question: "画像を透かしにできますか？", answer: "はい、テキストだけでなく画像も透かしとして追加できます。" },
  { question: "透明度は調整できますか？", answer: "はい、0-100%で透明度を設定できます。" },
  { question: "特定のページだけに追加できますか？", answer: "はい、全ページまたは指定ページのみに追加できます。" },
];

const seoContent = {
  intro: "PDFに透かし（ウォーターマーク）を追加。「社外秘」「SAMPLE」「DRAFT」など、文書の状態を明示できます。",
  useCases: [
    { title: "🔒 社外秘", desc: "機密文書に社外秘マーク" },
    { title: "📝 DRAFT", desc: "下書き状態を明示" },
    { title: "📋 SAMPLE", desc: "サンプル資料であることを表示" },
    { title: "©️ 著作権", desc: "コピーライト表示" },
  ],
  tips: "透かしの透明度を調整して、本文が読みやすい状態を保ちましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF透かし追加｜社外秘・コピー禁止",
  tool,
  longDescription: "PDFに透かし（ウォーターマーク）を追加。「社外秘」「SAMPLE」「DRAFT」など、文書の状態を明示できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['PDF 透かし', 'PDF ウォーターマーク', 'PDF 社外秘', 'PDF スタンプ'],
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
