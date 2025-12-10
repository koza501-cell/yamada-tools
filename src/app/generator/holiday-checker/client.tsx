"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface Holiday {
  date: string;
  name: string;
}

// Japanese holidays calculation
function getJapaneseHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [];
  
  // Fixed holidays
  holidays.push({ date: `${year}-01-01`, name: "元日" });
  holidays.push({ date: `${year}-02-11`, name: "建国記念の日" });
  holidays.push({ date: `${year}-02-23`, name: "天皇誕生日" });
  holidays.push({ date: `${year}-04-29`, name: "昭和の日" });
  holidays.push({ date: `${year}-05-03`, name: "憲法記念日" });
  holidays.push({ date: `${year}-05-04`, name: "みどりの日" });
  holidays.push({ date: `${year}-05-05`, name: "こどもの日" });
  holidays.push({ date: `${year}-08-11`, name: "山の日" });
  holidays.push({ date: `${year}-11-03`, name: "文化の日" });
  holidays.push({ date: `${year}-11-23`, name: "勤労感謝の日" });
  
  // Happy Monday holidays
  const getMonday = (year: number, month: number, week: number): string => {
    const firstDay = new Date(year, month - 1, 1);
    const firstMonday = (8 - firstDay.getDay()) % 7 + 1;
    const day = firstMonday + (week - 1) * 7;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };
  
  holidays.push({ date: getMonday(year, 1, 2), name: "成人の日" });
  holidays.push({ date: getMonday(year, 7, 3), name: "海の日" });
  holidays.push({ date: getMonday(year, 9, 3), name: "敬老の日" });
  holidays.push({ date: getMonday(year, 10, 2), name: "スポーツの日" });
  
  // Vernal Equinox (around March 20-21)
  const vernalEquinox = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  holidays.push({ date: `${year}-03-${String(vernalEquinox).padStart(2, "0")}`, name: "春分の日" });
  
  // Autumnal Equinox (around September 22-23)
  const autumnalEquinox = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  holidays.push({ date: `${year}-09-${String(autumnalEquinox).padStart(2, "0")}`, name: "秋分の日" });
  
  // Calculate substitute holidays (振替休日)
  const substituteHolidays: Holiday[] = [];
  holidays.forEach(h => {
    const date = new Date(h.date);
    if (date.getDay() === 0) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDateStr = nextDay.toISOString().split("T")[0];
      if (!holidays.some(hh => hh.date === nextDateStr)) {
        substituteHolidays.push({ date: nextDateStr, name: "振替休日" });
      }
    }
  });
  
  return [...holidays, ...substituteHolidays].sort((a, b) => a.date.localeCompare(b.date));
}

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export default function HolidayCheckerClient({ faq }: Props) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [mascotState] = useState<MascotState>("idle");
  const [mascotMessage] = useState("祝日を確認してね！");

  const holidays = useMemo(() => getJapaneseHolidays(selectedYear), [selectedYear]);
  
  const holidaysByMonth = useMemo(() => {
    const grouped: { [key: string]: Holiday[] } = {};
    holidays.forEach(h => {
      const month = h.date.split("-")[1];
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(h);
    });
    return grouped;
  }, [holidays]);

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  const isPast = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr < today;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${day}日 (${dayOfWeek})`;
  };

  const getNextHoliday = () => {
    const today = new Date().toISOString().split("T")[0];
    const allHolidays = getJapaneseHolidays(currentYear).concat(getJapaneseHolidays(currentYear + 1));
    return allHolidays.find(h => h.date >= today);
  };

  const nextHoliday = getNextHoliday();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">祝日確認</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-kon mb-2">祝日確認</h1>
          <p className="text-gray-600 text-lg">日本の祝日カレンダー</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">振替休日対応</span>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {nextHoliday && (
            <div className="mb-6 p-4 bg-gradient-to-r from-sakura/30 to-kon/10 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">次の祝日</p>
              <p className="text-xl font-bold text-kon">{nextHoliday.name}</p>
              <p className="text-gray-600">{nextHoliday.date.replace(/-/g, "/")} {formatDate(nextHoliday.date)}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">年を選択</label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedYear === year
                      ? "bg-kon text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(holidaysByMonth).map(([month, monthHolidays]) => (
              <div key={month} className="border-b border-gray-100 pb-4 last:border-0">
                <h3 className="font-bold text-kon mb-3">{months[parseInt(month) - 1]}</h3>
                <div className="space-y-2">
                  {monthHolidays.map((h, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isToday(h.date)
                          ? "bg-kon text-white"
                          : isPast(h.date)
                          ? "bg-gray-50 text-gray-400"
                          : "bg-sakura/20"
                      }`}
                    >
                      <span className="font-mono text-sm w-24">
                        {h.date.split("-").slice(1).join("/")}
                      </span>
                      <span className="font-medium">{formatDate(h.date)}</span>
                      <span className={`flex-1 ${h.name === "振替休日" ? "text-sm" : ""}`}>
                        {h.name}
                      </span>
                      {isToday(h.date) && (
                        <span className="text-xs bg-white text-kon px-2 py-1 rounded">今日</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              {selectedYear}年の祝日: <span className="font-bold text-kon">{holidays.length}日</span>
            </p>
          </div>
        </section>

        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span>Q. {item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">A. {item.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
