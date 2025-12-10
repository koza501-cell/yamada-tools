import { Metadata } from "next";
import PasswordZipClient from "./client";

export const metadata: Metadata = {
  title: "パスワード付きZIP作成 | 山田ツール - 暗号化ZIP",
  description: "ファイルをパスワード付きZIPに圧縮。AES-256暗号化対応。複数ファイルをまとめて圧縮可能。登録不要、完全無料、ブラウザ完結。",
  keywords: ["ZIP", "パスワード", "暗号化", "圧縮", "AES", "セキュリティ"],
  openGraph: {
    title: "パスワード付きZIP作成 | 山田ツール",
    description: "パスワード付きZIPをブラウザで作成。完全無料。",
    url: "https://yamada-tools.jp/generator/password-zip",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/password-zip",
  },
};

export default function PasswordZipPage() {
  return <PasswordZipClient />;
}
