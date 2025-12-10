import { Metadata } from "next";
import VerticalTextClient from "./client";

export const metadata: Metadata = {
  title: "縦書き文書作成 | 山田ツール - 縦書きテキスト",
  description: "縦書きの文書を作成。小説・手紙・詩に最適。印刷対応。登録不要、完全無料。",
  keywords: ["縦書き", "縦書き文書", "小説", "手紙", "無料"],
  openGraph: {
    title: "縦書き文書作成 | 山田ツール",
    description: "縦書き文書を作成。完全無料。",
    url: "https://yamada-tools.jp/document/vertical-text",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/document/vertical-text",
  },
};

export default function VerticalTextPage() {
  return <VerticalTextClient />;
}
