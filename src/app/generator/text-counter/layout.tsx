import { Metadata } from "next";

export const metadata: Metadata = {
  title: "文字数カウント【無料】文字数・単語数・行数をリアルタイム計測",
  description: "文字数・単語数・行数をリアルタイムでカウント。Twitter・Instagram・履歴書など文字数制限のある投稿に最適。無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/generator/text-counter" },
  openGraph: {
    title: "文字数カウント【無料】文字数・単語数・行数をリアルタイム計測",
    description: "文字数・単語数・行数をリアルタイムでカウント。Twitter・Instagram・履歴書など文字数制限のある投稿に最適。無料・登録不要。",
    url: "https://yamada-tools.jp/generator/text-counter",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
