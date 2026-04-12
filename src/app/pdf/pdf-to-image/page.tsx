import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("pdf-to-image")!;

const faq = [
  { question: "出力形式は選べますか？", answer: "はい、JPGとPNGから選択できます。" },
  { question: "複数ページのPDFはどうなりますか？", answer: "各ページが個別の画像ファイルになります。" },
  { question: "解像度は指定できますか？", answer: "はい、用途に応じて解像度を選択できます。" },
];

const seoContent = {
  intro: "PDFをJPGやPNG画像に変換。プレゼン資料への挿入、SNSでの共有、サムネイル作成など、画像として使いたい時に便利です。",
  useCases: [
    { title: "📊 プレゼン挿入", desc: "PDFをパワポに画像として挿入" },
    { title: "📱 SNS共有", desc: "PDFを画像にしてSNSに投稿" },
    { title: "🖼️ サムネイル", desc: "PDFの表紙画像を作成" },
    { title: "📝 編集用", desc: "画像編集ソフトで加工" },
  ],
  tips: "高解像度（300dpi）で出力すれば印刷にも対応。Web用なら72dpiで軽量化できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF→画像変換｜JPG/PNGに一括変換",
  tool,
  longDescription: "PDFをJPGやPNG画像に変換。プレゼン資料への挿入、SNSでの共有、サムネイル作成など、画像として使いたい時に便利です。",
  keywords: ['PDF 画像変換', 'PDF JPG', 'PDF PNG', 'PDF 画像化', 'PDFを画像に'],
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
