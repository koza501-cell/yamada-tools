import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "日本の祝日一覧【2025年・2026年・2027年】振替休日・連休も完全網羅",
  description: "2025年・2026年・2027年の日本の祝日カレンダー。振替休日・連休情報も完全網羅。登録不要・無料。",
  keywords: ["祝日", "国民の祝日", "祝日一覧", "祝日カレンダー", "振替休日"],
  alternates: {
    canonical: 'https://yamada-tools.jp/reference/holidays',
  },
  openGraph: {
    title: "日本の祝日一覧【2025年・2026年・2027年】振替休日・連休も完全網羅",
    description: "2024年・2025年・2026年の日本の国民の祝日一覧。振替休日・連休情報も網羅。登録不要・完全無料。",
    url: "https://yamada-tools.jp/reference/holidays",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "日本の祝日一覧【2025年・2026年・2027年】振替休日・連休も完全網羅",
    description: "2024年・2025年・2026年の国民の祝日カレンダー。振替休日も含めた完全版。",
  },
};

const holidays2024 = [
  { date: "1月1日", name: "元日", weekday: "月" },
  { date: "1月8日", name: "成人の日", weekday: "月" },
  { date: "2月11日", name: "建国記念の日", weekday: "日" },
  { date: "2月12日", name: "振替休日", weekday: "月" },
  { date: "2月23日", name: "天皇誕生日", weekday: "金" },
  { date: "3月20日", name: "春分の日", weekday: "水" },
  { date: "4月29日", name: "昭和の日", weekday: "月" },
  { date: "5月3日", name: "憲法記念日", weekday: "金" },
  { date: "5月4日", name: "みどりの日", weekday: "土" },
  { date: "5月5日", name: "こどもの日", weekday: "日" },
  { date: "5月6日", name: "振替休日", weekday: "月" },
  { date: "7月15日", name: "海の日", weekday: "月" },
  { date: "8月11日", name: "山の日", weekday: "日" },
  { date: "8月12日", name: "振替休日", weekday: "月" },
  { date: "9月16日", name: "敬老の日", weekday: "月" },
  { date: "9月22日", name: "秋分の日", weekday: "日" },
  { date: "9月23日", name: "振替休日", weekday: "月" },
  { date: "10月14日", name: "スポーツの日", weekday: "月" },
  { date: "11月3日", name: "文化の日", weekday: "日" },
  { date: "11月4日", name: "振替休日", weekday: "月" },
  { date: "11月23日", name: "勤労感謝の日", weekday: "土" },
];

const holidays2025 = [
  { date: "1月1日", name: "元日", weekday: "水" },
  { date: "1月13日", name: "成人の日", weekday: "月" },
  { date: "2月11日", name: "建国記念の日", weekday: "火" },
  { date: "2月23日", name: "天皇誕生日", weekday: "日" },
  { date: "2月24日", name: "振替休日", weekday: "月" },
  { date: "3月20日", name: "春分の日", weekday: "木" },
  { date: "4月29日", name: "昭和の日", weekday: "火" },
  { date: "5月3日", name: "憲法記念日", weekday: "土" },
  { date: "5月4日", name: "みどりの日", weekday: "日" },
  { date: "5月5日", name: "こどもの日", weekday: "月" },
  { date: "5月6日", name: "振替休日", weekday: "火" },
  { date: "7月21日", name: "海の日", weekday: "月" },
  { date: "8月11日", name: "山の日", weekday: "月" },
  { date: "9月15日", name: "敬老の日", weekday: "月" },
  { date: "9月23日", name: "秋分の日", weekday: "火" },
  { date: "10月13日", name: "スポーツの日", weekday: "月" },
  { date: "11月3日", name: "文化の日", weekday: "月" },
  { date: "11月23日", name: "勤労感謝の日", weekday: "日" },
  { date: "11月24日", name: "振替休日", weekday: "月" },
];

const holidays2026 = [
  { date: "1月1日", name: "元日", weekday: "木" },
  { date: "1月12日", name: "成人の日", weekday: "月" },
  { date: "2月11日", name: "建国記念の日", weekday: "水" },
  { date: "2月23日", name: "天皇誕生日", weekday: "月" },
  { date: "3月20日", name: "春分の日", weekday: "金" },
  { date: "4月29日", name: "昭和の日", weekday: "水" },
  { date: "5月3日", name: "憲法記念日", weekday: "日" },
  { date: "5月4日", name: "みどりの日", weekday: "月" },
  { date: "5月5日", name: "こどもの日", weekday: "火" },
  { date: "5月6日", name: "振替休日", weekday: "水" },
  { date: "7月20日", name: "海の日", weekday: "月" },
  { date: "8月11日", name: "山の日", weekday: "火" },
  { date: "9月21日", name: "敬老の日", weekday: "月" },
  { date: "9月22日", name: "国民の休日", weekday: "火" },
  { date: "9月23日", name: "秋分の日", weekday: "水" },
  { date: "10月12日", name: "スポーツの日", weekday: "月" },
  { date: "11月3日", name: "文化の日", weekday: "火" },
  { date: "11月23日", name: "勤労感謝の日", weekday: "月" },
];

function HolidayTable({ year, data }: { year: string; data: { date: string; name: string; weekday: string }[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-kon mb-4">📅 {year}年の祝日</h2>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">日付</th>
              <th className="px-4 py-3 text-left">祝日名</th>
              <th className="px-4 py-3 text-left">曜日</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((h, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{h.date}</td>
                <td className="px-4 py-3 font-bold">{h.name}</td>
                <td className="px-4 py-3">{h.weekday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function HolidaysPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-kon mb-4">日本の祝日一覧</h1>
          <p className="text-gray-600">2024年〜2026年の国民の祝日・振替休日</p>
        </header>
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <p className="text-kon text-sm">
            💡 祝日が日曜日の場合、翌日が振替休日になります。
            <Link href="/generator/holiday-checker" className="underline ml-1">祝日判定ツール</Link>もご活用ください。
          </p>
        </div>
        <HolidayTable year="2026" data={holidays2026} />
        <HolidayTable year="2025" data={holidays2025} />
        <HolidayTable year="2024" data={holidays2024} />
        <section className="bg-white rounded-2xl p-6 border mt-8">
          <h2 className="font-bold text-kon mb-4">関連ツール</h2>
          <Link href="/generator/holiday-checker" className="p-4 border rounded-xl hover:shadow block">
            <span className="text-2xl">📆</span>
            <h3 className="font-bold">祝日判定ツール</h3>
            <p className="text-sm text-gray-500">指定した日付が祝日かどうか判定</p>
          </Link>
        </section>
        <p className="text-xs text-gray-400 mt-8 text-center">
          ※ 春分の日・秋分の日は天文計算により変動する場合があります。
        </p>
      </div>
    </div>
  );
}
