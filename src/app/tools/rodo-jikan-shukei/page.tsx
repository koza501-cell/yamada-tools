import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import RodoJikanShukei from "@/components/tools/RodoJikanShukei";

export const metadata: Metadata = {
  title: "労働時間集計ツール｜36協定・時間外労働を自動計算【2026年版】",
  description: "日々の出退勤時間を入力するだけで月間労働時間・残業時間・深夜労働を自動集計。36協定の上限チェック付き。無料で使えるシフト管理・勤怠集計ツール。",
  keywords: ["労働時間 集計", "残業時間 計算", "36協定 チェック", "勤怠管理 無料", "時間外労働 計算"],
  alternates: { canonical: "https://yamada-tools.jp/tools/rodo-jikan-shukei" },
  openGraph: {
    title: "労働時間集計ツール｜36協定・時間外労働を自動計算【2026年版】",
    description: "月間の勤怠を入力して残業・深夜・法定休日労働を自動集計。36協定の遵守状況をリアルタイム確認。",
    url: "https://yamada-tools.jp/tools/rodo-jikan-shukei",
  },
};

const faq = [
  { question: "法定労働時間は1日何時間ですか？", answer: "1日8時間・週40時間が法定労働時間です。これを超える分は時間外労働として割増賃金が必要です。" },
  { question: "フレックスタイム制の労働時間はどう計算しますか？", answer: "清算期間（最長3ヶ月）の総労働時間で判断します。本ツールで日別入力後に合計を確認できます。" },
  { question: "深夜労働とは何時から何時までですか？", answer: "22時から翌5時までが深夜労働時間帯です。この時間帯の労働には25%以上の割増賃金が必要です。" },
  { question: "36協定なしで残業させることはできますか？", answer: "できません。時間外労働には労使間で36協定の締結・届出が必要です。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "労働時間集計ツール", description: "出退勤時間を入力して労働時間・残業時間・深夜割増を自動集計。", path: "/tools/rodo-jikan-shukei" }} faq={faq} />
      <RodoJikanShukei />
    </>
  );
}
