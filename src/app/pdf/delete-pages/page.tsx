import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("delete-pages")!;

const faq = [
  { question: "削除したページは復元できますか？", answer: "元のファイルは変更されません。新しいファイルとしてダウンロードされるので、元ファイルは残ります。" },
  { question: "複数ページを一度に削除できますか？", answer: "はい、「1,3,5-10」のように複数指定できます。" },
  { question: "削除後のページ番号は振り直されますか？", answer: "はい、自動的に連番になります。" },
];

const seoContent = {
  intro: "PDFから不要なページを削除。表紙や空白ページ、間違って入ったページなど、いらないページだけを簡単に取り除けます。",
  useCases: [
    { title: "📄 表紙削除", desc: "不要な表紙や裏表紙を削除" },
    { title: "📝 空白ページ", desc: "スキャン時の空白ページを除去" },
    { title: "🔒 機密ページ", desc: "共有前に機密ページを削除" },
    { title: "📑 軽量化", desc: "不要ページを削除してサイズダウン" },
  ],
  tips: "削除したいページ番号を「1,3,5-7」のように指定できます。プレビューで確認してから削除しましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "PDFから不要なページを削除。表紙や空白ページ、間違って入ったページなど、いらないページだけを簡単に取り除けます。",
  keywords: ['PDFページ削除', 'PDF ページ 消す', 'PDF 不要ページ', 'PDF 編集'],
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
