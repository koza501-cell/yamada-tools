import { Metadata } from "next";
import HolidayCheckerClient from "./client";

const faq = [
  {
    question: "振替休日は表示されますか？",
    answer: "はい。日曜日と祝日が重なった場合の振替休日も表示されます。",
  },
  {
    question: "何年先まで確認できますか？",
    answer: "2020年から2030年までの祝日を確認できます。",
  },
];

export const metadata: Metadata = {
  title: "祝日確認 | 山田ツール - 日本の祝日カレンダー",
  description: "日本の祝日・振替休日を確認。年間カレンダー表示。登録不要、完全無料。",
  keywords: ["祝日確認", "日本の祝日", "祝日カレンダー", "振替休日", "無料"],
  openGraph: {
    title: "祝日確認 | 山田ツール",
    description: "日本の祝日・振替休日を確認。完全無料。",
    url: "https://yamada-tools.jp/generator/holiday-checker",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/holiday-checker",
  },
};

export default function HolidayCheckerPage() {
  return <HolidayCheckerClient faq={faq} />;
}
