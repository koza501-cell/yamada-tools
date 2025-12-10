import { Metadata } from "next";
import FuriganaClient from "./client";

export const metadata: Metadata = {
  title: "ふりがな変換 | 山田ツール - 漢字にふりがな自動付与",
  description: "漢字にふりがな（ひらがな・カタカナ・ローマ字）を自動で付けます。文章の読み方を簡単確認。登録不要、完全無料。",
  keywords: ["ふりがな", "振り仮名", "漢字", "読み方", "ひらがな", "カタカナ", "ローマ字"],
  openGraph: {
    title: "ふりがな変換 | 山田ツール",
    description: "漢字にふりがなを自動付与。完全無料。",
    url: "https://yamada-tools.jp/convert/furigana",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/furigana",
  },
};

export default function FuriganaPage() {
  return <FuriganaClient />;
}
