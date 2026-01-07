import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("cover-letter")!;

const faq = [
  { question: "定型文は用意されていますか？", answer: "はい、ビジネスシーンで使える定型文を複数用意しています。" },
  { question: "送付物の一覧は入れられますか？", answer: "はい、送付する書類の一覧を記載できます。" },
  { question: "縦書きにできますか？", answer: "横書きのみの対応となります。" },
];

const seoContent = {
  intro: "ビジネス文書に添える送付状を簡単作成。定型文を選ぶだけで、失礼のない送付状が完成します。",
  useCases: [
    { title: "📄 書類送付", desc: "契約書や請求書に添える" },
    { title: "📦 商品発送", desc: "納品物に同封する送付状" },
    { title: "📧 FAX送信", desc: "FAX送付時の表紙" },
    { title: "💼 就活", desc: "履歴書送付時の送付状" },
  ],
  tips: "送付状には送付物の一覧を必ず記載しましょう。相手が内容を確認しやすくなります。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】送付状作成｜ビジネス文書テンプレート",
  tool,
  longDescription: "ビジネス文書に添える送付状を簡単作成。定型文を選ぶだけで、失礼のない送付状が完成します。",
  keywords: ['送付状 作成', '送付状 テンプレート', '送付状 書き方', '添え状', 'カバーレター'],
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
