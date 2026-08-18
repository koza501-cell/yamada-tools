import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import Base64Client from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("base64")!;

const faq = [
  { question: "画像もBase64に変換できますか？", answer: "はい、画像ファイルをBase64文字列に変換できます。" },
  { question: "日本語も変換できますか？", answer: "はい、UTF-8エンコードで日本語も正しく変換されます。" },
  { question: "Base64は暗号化ですか？", answer: "いいえ、Base64はエンコード方式であり、暗号化ではありません。" },
];

const seoContent = {
  intro: "テキストや画像をBase64にエンコード・デコード。メール添付やWebでのデータ埋め込みに使われる形式です。",
  useCases: [
    { title: "💻 開発作業", desc: "APIやデータ転送用に変換" },
    { title: "🖼️ 画像埋め込み", desc: "HTMLに画像を直接埋め込む" },
    { title: "📧 メール", desc: "添付ファイルのエンコード" },
    { title: "🔧 デバッグ", desc: "Base64データの内容確認" },
  ],
  tips: "Base64は暗号化ではありません。データの形式変換のみで、セキュリティ目的には使えません。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】Base64変換｜エンコード・デコード",
  tool,
  longDescription: "テキストや画像をBase64にエンコード・デコード。メール添付やWebでのデータ埋め込みに使われる形式です。",
  keywords: ['Base64 変換', 'Base64 エンコード', 'Base64 デコード', 'Base64 画像'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Base64Client faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
