import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("page-numbers")!;

const faq = [
  { question: "ページ番号の位置は選べますか？", answer: "はい、上下左右中央など、9箇所から選択できます。" },
  { question: "開始番号は変更できますか？", answer: "はい、1以外の番号から始めることも可能です。" },
  { question: "フォントやサイズは変更できますか？", answer: "はい、フォント、サイズ、色をカスタマイズできます。" },
];

const seoContent = {
  intro: "PDFにページ番号を追加。報告書や資料のページ管理に便利です。位置、フォント、開始番号などカスタマイズ可能。",
  useCases: [
    { title: "📊 報告書", desc: "ビジネス資料にページ番号" },
    { title: "📚 マニュアル", desc: "操作説明書にページ番号" },
    { title: "📄 契約書", desc: "複数ページの契約書に" },
    { title: "📑 資料集", desc: "結合したPDFにページ番号" },
  ],
  tips: "ページ番号の開始を2からにすると、表紙を除いた番号付けができます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDFページ番号追加｜自動ナンバリング",
  tool,
  longDescription: "PDFにページ番号を追加。報告書や資料のページ管理に便利です。位置、フォント、開始番号などカスタマイズ可能。",
  keywords: ['PDF ページ番号', 'PDF ページ番号追加', 'PDF フッター', 'PDF ヘッダー'],
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
