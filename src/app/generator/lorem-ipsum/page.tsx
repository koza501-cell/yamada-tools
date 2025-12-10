import { Metadata } from "next";
import LoremIpsumClient from "./client";

export const metadata: Metadata = {
  title: "ダミーテキスト生成 | 山田ツール - Lorem Ipsum日本語",
  description: "デザイン用のダミーテキストを生成。Lorem Ipsum・日本語ダミー文に対応。登録不要、完全無料。",
  keywords: ["Lorem Ipsum", "ダミーテキスト", "仮テキスト", "日本語", "無料"],
  openGraph: {
    title: "ダミーテキスト生成 | 山田ツール",
    description: "Lorem Ipsum・日本語ダミーテキスト生成。完全無料。",
    url: "https://yamada-tools.jp/generator/lorem-ipsum",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/lorem-ipsum",
  },
};

export default function LoremIpsumPage() {
  return <LoremIpsumClient />;
}
