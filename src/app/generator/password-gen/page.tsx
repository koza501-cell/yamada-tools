import { Metadata } from "next";
import PasswordGenClient from "./client";

export const metadata: Metadata = {
  title: "パスワード生成 | 山田ツール - 安全なパスワード作成",
  description: "安全で強力なランダムパスワードを生成。長さ・文字種を自由にカスタマイズ。登録不要、完全無料。",
  keywords: ["パスワード生成", "パスワード作成", "ランダム", "セキュリティ", "無料"],
  openGraph: {
    title: "パスワード生成 | 山田ツール",
    description: "安全なランダムパスワードを生成。完全無料。",
    url: "https://yamada-tools.jp/generator/password-gen",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/password-gen",
  },
};

export default function PasswordGenPage() {
  return <PasswordGenClient />;
}
