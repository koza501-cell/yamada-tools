import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("receipt")!;

const faq = [
  { question: "インボイス制度に対応していますか？", answer: "はい、登録番号を入力すれば適格領収書を発行できます。" },
  { question: "印紙税の金額は表示されますか？", answer: "はい、金額に応じた印紙税の目安が表示されます。" },
  { question: "連番管理はできますか？", answer: "領収書番号は自動採番と手動入力に対応しています。" },
];

const seoContent = {
  intro: "領収書を無料で作成。インボイス制度対応の適格領収書も発行可能。印紙税の目安も表示されます。",
  useCases: [
    { title: "💰 現金取引", desc: "現金払いの領収書発行" },
    { title: "🏪 店舗運営", desc: "お客様への領収書" },
    { title: "📝 経費精算", desc: "従業員の経費精算用" },
    { title: "🧾 インボイス", desc: "適格領収書の発行" },
  ],
  tips: "5万円以上の領収書には収入印紙が必要です。印紙税額の目安も確認できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】領収書作成｜PDF出力｜印刷対応",
  tool,
  longDescription: "領収書を無料で作成。インボイス制度対応の適格領収書も発行可能。印紙税の目安も表示されます。",
  keywords: ['領収書 作成', '領収書 無料', '領収書 テンプレート', '適格領収書', 'インボイス 領収書'],
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
