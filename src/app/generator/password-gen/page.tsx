import { Metadata } from "next";
import PasswordGenClient from "./client";

export const metadata: Metadata = {
  title: "【無料】パスワード生成｜安全な強力パスワード作成",
  description: "安全なパスワードを自動生成。大文字、小文字、数字、記号を組み合わせた強力なパスワードを作成します。",
  keywords: ["パスワード生成", "パスワード 作成", "強力なパスワード", "パスワード ジェネレーター"],
  alternates: {
    canonical: 'https://yamada-tools.jp/generator/password',
  },
};

const faq = [
  { question: "生成されたパスワードは安全ですか？", answer: "暗号学的に安全な乱数を使用しています。" },
  { question: "パスワードの長さは？", answer: "8〜128文字まで指定可能です。12文字以上を推奨します。" },
];

const seoContent = {
  intro: "安全なパスワードを自動生成。大文字、小文字、数字、記号を組み合わせた強力なパスワードを作成します。",
  useCases: [
    { title: "🔐 新規登録", desc: "サービス登録時のパスワード" },
    { title: "🔄 パスワード変更", desc: "定期的なパスワード更新" },
  ],
  tips: "12文字以上で、大文字・小文字・数字・記号を含めると安全性が高まります。",
};

export default function PasswordGenPage() {
  return <PasswordGenClient faq={faq} seoContent={seoContent} />;
}
