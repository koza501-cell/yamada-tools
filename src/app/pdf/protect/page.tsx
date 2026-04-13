import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("protect")!;

const faq = [
  { question: "どんな暗号化方式ですか？", answer: "AES 256bitの強力な暗号化を使用しています。" },
  { question: "パスワードを忘れたら？", answer: "セキュリティ上、パスワードの復元はできません。元ファイルを保管しておくことをおすすめします。" },
  { question: "開封と編集で別のパスワードを設定できますか？", answer: "はい、閲覧用と編集用で異なるパスワードを設定できます。" },
];

const seoContent = {
  intro: "PDFにパスワードを設定して保護。機密文書や個人情報を含むファイルを安全に共有できます。開封パスワードと編集パスワードを別々に設定可能。",
  useCases: [
    { title: "🔒 機密文書", desc: "社外秘資料にパスワード設定" },
    { title: "📧 メール送信", desc: "添付ファイルを暗号化" },
    { title: "📄 契約書", desc: "重要書類を保護" },
    { title: "👤 個人情報", desc: "個人情報を含むPDFを保護" },
  ],
  tips: "パスワードは推測されにくい文字列を使用しましょう。忘れると解除できないので、安全な場所にメモを保管してください。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDFパスワード設定｜閲覧・編集を制限",
  tool,
  longDescription: "PDFにパスワードを設定して保護。機密文書や個人情報を含むファイルを安全に共有できます。開封パスワードと編集パスワードを別々に設定可能。",
  keywords: ['PDF パスワード', 'PDF 暗号化', 'PDF 保護', 'PDF ロック', 'PDF セキュリティ'],
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
