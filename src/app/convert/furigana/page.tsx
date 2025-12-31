import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("furigana")!;

const faq = [
  { question: "人名も正確に変換できますか？", answer: "一般的な読み方は対応していますが、珍しい読み方は異なる場合があります。" },
  { question: "カタカナで出力できますか？", answer: "はい、ひらがな・カタカナどちらでも出力可能です。" },
  { question: "文章全体を一括変換できますか？", answer: "はい、長文でも一括でふりがなを振れます。" },
];

const seoContent = {
  intro: "漢字にふりがな（ルビ）を自動で振ります。人名や地名、難読漢字の読み方を確認したい時に便利です。",
  useCases: [
    { title: "📝 文書作成", desc: "難読漢字にふりがなを追加" },
    { title: "👤 人名確認", desc: "名前の読み方を確認" },
    { title: "🗾 地名確認", desc: "地名の正しい読み方を調べる" },
    { title: "📚 学習支援", desc: "日本語学習者の読み方確認" },
  ],
  tips: "人名や固有名詞は複数の読み方がある場合があります。確認が必要な場合は本人に確認しましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "漢字にふりがな（ルビ）を自動で振ります。人名や地名、難読漢字の読み方を確認したい時に便利です。",
  keywords: ['ふりがな変換', '漢字 読み方', 'ルビ 振る', '漢字 ふりがな', '読み仮名'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
    </>
  );
}
