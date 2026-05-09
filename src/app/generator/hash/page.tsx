import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import HashClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("hash-generator")!;

const faq = [
  { question: "どのアルゴリズムを使うべきですか？", answer: "セキュリティ目的ならSHA-256を推奨します。" },
  { question: "ファイルのハッシュも計算できますか？", answer: "はい、ファイルをアップロードしてハッシュ値を計算できます。" },
  { question: "ハッシュから元のデータに戻せますか？", answer: "いいえ、ハッシュは一方向の変換で、元に戻すことはできません。" },
];

const seoContent = {
  intro: "MD5、SHA-1、SHA-256などのハッシュ値を生成。ファイルの整合性確認やパスワードの検証に使用します。",
  useCases: [
    { title: "🔐 整合性確認", desc: "ダウンロードファイルの確認" },
    { title: "💻 開発", desc: "APIやデータのハッシュ化" },
    { title: "🔒 セキュリティ", desc: "パスワードのハッシュ化" },
    { title: "📁 ファイル比較", desc: "同一ファイルかの確認" },
  ],
  tips: "SHA-256が現在最も推奨されるハッシュアルゴリズムです。MD5は非推奨です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】ハッシュ生成｜MD5/SHA256計算",
  tool,
  longDescription: "MD5、SHA-1、SHA-256などのハッシュ値を生成。ファイルの整合性確認やパスワードの検証に使用します。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['ハッシュ生成', 'MD5', 'SHA256', 'ハッシュ値', 'チェックサム'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HashClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
