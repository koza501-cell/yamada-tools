import { Metadata } from "next";
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

export default function Page() { return <RodoJikanShukei />; }
