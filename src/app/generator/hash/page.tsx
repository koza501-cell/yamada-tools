import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import HashClient from "./client";

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
  longDescription: "MD5、SHA-1、SHA-256などのハッシュ値を生成。ファイルの整合性確認やパスワードの検証に使用します。",
  keywords: ['ハッシュ生成', 'MD5', 'SHA256', 'ハッシュ値', 'チェックサム'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HashClient faq={faq} />
    </>
  );
}
