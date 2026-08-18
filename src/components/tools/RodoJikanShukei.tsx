"use client";

import { useState, useMemo } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import { calcMonth, getDaysInMonth, minsToHHMM, type DayRow, type DayMemo } from "@/lib/rodo-jikan-calculator";

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
const MEMO_OPTS: { v: DayMemo; l: string }[] = [
  { v: "normal", l: "通常" }, { v: "paid", l: "有給" },
  { v: "absent", l: "欠勤" }, { v: "holiday", l: "休日出勤" }, { v: "statutory", l: "法定休日" },
];

function rowBg(dow: number, memo: DayMemo): string {
  if (memo === "paid")   return "bg-green-50";
  if (memo === "absent") return "bg-gray-100";
  if (memo === "statutory" || memo === "holiday") return "bg-orange-50";
  if (dow === 0) return "bg-red-50";
  if (dow === 6) return "bg-blue-50";
  return "bg-white";
}

function StatusBadge({ otMin }: { otMin: number }) {
  const h = otMin / 60;
  if (h >= 80) return <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-bold">🚨 違反リスク</span>;
  if (h >= 60) return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-bold">⚠️ 要対応</span>;
  if (h >= 45) return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700 font-bold">⚠️ 注意</span>;
  return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-bold">✅ 問題なし</span>;
}

export default function RodoJikanShukei() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [scheduledH, setScheduledH] = useState(8);
  const [schedDays, setSchedDays] = useState([false, true, true, true, true, true, false]); // Sun-Sat
  const [rows, setRows] = useState<DayRow[]>(() => getDaysInMonth(now.getFullYear(), now.getMonth() + 1));

  const result = useMemo(() => calcMonth(rows, scheduledH, schedDays), [rows, scheduledH, schedDays]);

  function changeMonth(y: number, m: number) {
    setYear(y); setMonth(m);
    setRows(getDaysInMonth(y, m));
  }

  function updateRow(i: number, patch: Partial<DayRow>) {
    setRows(prev => { const r = [...prev]; r[i] = { ...r[i], ...patch }; return r; });
  }

  function bulkFill() {
    setRows(prev => prev.map(r => {
      const isScheduled = schedDays[r.dayOfWeek === 0 ? 6 : r.dayOfWeek - 1];
      if (!isScheduled) return r;
      return { ...r, inTime: "09:00", outTime: "18:00", breakMin: 60, memo: "normal" as DayMemo };
    }));
  }

  function exportTSV() {
    const header = "日付\t曜日\t出勤\t退勤\t休憩\t実労働\t時間外\t深夜\t備考";
    const lines = rows.map((r, i) => {
      const d = result.days[i];
      return [r.date, DOW_LABELS[r.dayOfWeek], r.inTime, r.outTime, r.breakMin, minsToHHMM(d.workedMin), minsToHHMM(d.overtimeMin), minsToHHMM(d.nightMin), r.memo].join("\t");
    });
    navigator.clipboard.writeText([header, ...lines].join("\n"));
  }

  const otH = result.totalOvertimeMin / 60;
  const barPct = Math.min((otH / 80) * 100, 100);
  const barColor = otH >= 80 ? "bg-red-600" : otH >= 60 ? "bg-orange-500" : otH >= 45 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">労働時間集計ツール 2026</h1>
      <p className="text-sm text-gray-500 mb-6">月間の勤怠を入力して残業時間・36協定の遵守状況を確認</p>

      {/* 設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">対象月</label>
          <div className="flex gap-1">
            <select value={year} onChange={e => changeMonth(parseInt(e.target.value), month)}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
            <select value={month} onChange={e => changeMonth(year, parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              {Array.from({ length: 12 }, (_, i) => <option key={i+1} value={i+1}>{i+1}月</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">所定労働時間/日</label>
          <input type="number" min={1} max={12} value={scheduledH} onChange={e => setScheduledH(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <span className="text-sm text-gray-500 ml-1">時間</span>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">所定労働日</label>
          <div className="flex gap-1">
            {DOW_LABELS.map((d, i) => (
              <button key={d} onClick={() => { const s = [...schedDays]; s[i] = !s[i]; setSchedDays(s); }}
                className={`w-8 h-8 rounded-full text-xs font-medium border transition-colors ${schedDays[i] ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-400"}`}>{d}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={bulkFill} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">平日一括入力</button>
          <button onClick={exportTSV} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">TSVコピー</button>
          <button onClick={() => window.print()} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">印刷</button>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: "総実労働時間", val: minsToHHMM(result.totalWorkedMin), color: "text-blue-700" },
          { label: "時間外労働合計", val: minsToHHMM(result.totalOvertimeMin), color: otH >= 45 ? "text-red-700" : "text-gray-800" },
          { label: "深夜労働時間", val: minsToHHMM(result.totalNightMin), color: "text-purple-700" },
          { label: "法定休日労働", val: minsToHHMM(result.totalStatutoryHolidayMin), color: "text-orange-700" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className={`text-2xl font-bold font-mono ${c.color}`}>{c.val}</p>
          </div>
        ))}
      </div>

      {/* 36協定バー */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">36協定 時間外労働状況</span>
            <StatusBadge otMin={result.totalOvertimeMin} />
          </div>
          <span className="text-sm font-mono font-bold">{minsToHHMM(result.totalOvertimeMin)} / 80h</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${barPct}%` }} />
          {[45, 60, 80].map(h => (
            <div key={h} className="absolute top-0 bottom-0 w-0.5 bg-gray-400 opacity-50" style={{ left: `${(h / 80) * 100}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0h</span><span>45h ⚠</span><span>60h ⚠</span><span>80h 🚨</span>
        </div>
      </div>

      {/* タイムシート */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs text-gray-500 font-medium w-20">日付</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium w-8">曜</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium">出勤</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium">退勤</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium w-16">休憩</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium">実労働</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium">時間外</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium">深夜</th>
              <th className="px-2 py-2 text-center text-xs text-gray-500 font-medium w-24">備考</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const d = result.days[i];
              const bg = rowBg(r.dayOfWeek, r.memo);
              const dayLabel = r.date.slice(8); // "DD"
              return (
                <tr key={r.date} className={`border-b border-gray-100 ${bg}`}>
                  <td className="px-3 py-1.5 text-xs text-gray-600">{month}/{parseInt(dayLabel)}</td>
                  <td className={`px-2 py-1.5 text-center text-xs font-medium ${r.dayOfWeek === 0 ? "text-red-600" : r.dayOfWeek === 6 ? "text-blue-600" : "text-gray-700"}`}>{DOW_LABELS[r.dayOfWeek]}</td>
                  <td className="px-1 py-1">
                    <input type="time" value={r.inTime} onChange={e => updateRow(i, { inTime: e.target.value })} disabled={r.memo === "paid" || r.memo === "absent"}
                      className="w-full border-0 bg-transparent text-center text-xs font-mono focus:outline-none focus:bg-blue-50 rounded disabled:opacity-30" />
                  </td>
                  <td className="px-1 py-1">
                    <input type="time" value={r.outTime} onChange={e => updateRow(i, { outTime: e.target.value })} disabled={r.memo === "paid" || r.memo === "absent"}
                      className="w-full border-0 bg-transparent text-center text-xs font-mono focus:outline-none focus:bg-blue-50 rounded disabled:opacity-30" />
                  </td>
                  <td className="px-1 py-1">
                    <input type="number" value={r.breakMin} min={0} onChange={e => updateRow(i, { breakMin: Number(e.target.value) })} disabled={r.memo === "paid" || r.memo === "absent"}
                      className="w-full border-0 bg-transparent text-center text-xs font-mono focus:outline-none focus:bg-blue-50 rounded disabled:opacity-30" />
                  </td>
                  <td className="px-2 py-1.5 text-center text-xs font-mono font-medium text-gray-800">{d.workedMin > 0 ? minsToHHMM(d.workedMin) : "—"}</td>
                  <td className={`px-2 py-1.5 text-center text-xs font-mono font-medium ${d.overtimeMin > 0 ? "text-orange-700" : "text-gray-400"}`}>{d.overtimeMin > 0 ? minsToHHMM(d.overtimeMin) : "—"}</td>
                  <td className={`px-2 py-1.5 text-center text-xs font-mono font-medium ${d.nightMin > 0 ? "text-purple-700" : "text-gray-400"}`}>{d.nightMin > 0 ? minsToHHMM(d.nightMin) : "—"}</td>
                  <td className="px-1 py-1">
                    <select value={r.memo} onChange={e => updateRow(i, { memo: e.target.value as DayMemo })}
                      className="w-full border-0 bg-transparent text-xs focus:outline-none focus:bg-blue-50 rounded cursor-pointer">
                      {MEMO_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2 border-gray-300 sticky bottom-0">
            <tr>
              <td colSpan={5} className="px-3 py-2 text-xs font-bold text-gray-700">月合計</td>
              <td className="px-2 py-2 text-center text-xs font-bold font-mono text-blue-700">{minsToHHMM(result.totalWorkedMin)}</td>
              <td className={`px-2 py-2 text-center text-xs font-bold font-mono ${otH >= 45 ? "text-red-700" : "text-orange-700"}`}>{minsToHHMM(result.totalOvertimeMin)}</td>
              <td className="px-2 py-2 text-center text-xs font-bold font-mono text-purple-700">{minsToHHMM(result.totalNightMin)}</td>
              <td className="px-2 py-2 text-center text-xs text-gray-500">有給{result.paidDays}日</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <AdUnit slot="5612038947" format="horizontal" className="mt-8" />
    </div>
  );
}
