import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import KoyoKeiyakushoGenerator from "@/components/tools/KoyoKeiyakushoGenerator";

export const metadata: Metadata = {
  title: "雇用契約書作成ツール｜無料テンプレート・PDF出力対応【2026年労基法対応】",
  description: "雇用契約書を無料で作成。正社員・パート・アルバイト・契約社員に対応。2026年労働基準法準拠。入力するだけでPDF出力できる無料オンラインツール。",
  keywords: ["雇用契約書", "雇用契約書 テンプレート 無料", "雇用契約書 作成", "パート 雇用契約書", "雇用契約書 PDF"],
  alternates: { canonical: "https://yamada-tools.jp/tools/koyo-keiyakusho-sakusei" },
  openGraph: {
    title: "雇用契約書作成ツール｜無料テンプレート・PDF出力対応【2026年労基法対応】",
    description: "正社員・パート・アルバイト・契約社員に対応した雇用契約書を無料で作成。PDF出力対応。",
    url: "https://yamada-tools.jp/tools/koyo-keiyakusho-sakusei",
  },
};

const faq = [
  { question: "雇用契約書は法律で必須ですか？", answer: "書面での交付は法律上義務です。労働条件通知書として必ず書面または電子交付が必要です。" },
  { question: "雇用契約書と労働条件通知書の違いは何ですか？", answer: "労働条件通知書は会社から一方的に交付する書類、雇用契約書は双方が署名・捺印する合意書類です。" },
  { question: "パート・アルバイトにも雇用契約書は必要ですか？", answer: "はい。雇用形態に関わらず、労働条件の書面交付は義務です。" },
  { question: "試用期間中の雇用契約書はどう書けばいいですか？", answer: "試用期間・期間中の賃金・本採用の条件を明記することが重要です。本ツールで試用期間欄を設定できます。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "雇用契約書作成ツール", description: "必要事項を入力するだけで雇用契約書を自動作成・PDF出力。", path: "/tools/koyo-keiyakusho-sakusei" }} faq={faq} />
      <KoyoKeiyakushoGenerator />
    </>
  );
}
