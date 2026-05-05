"use client";
import { useState, useCallback } from "react";

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button type="button"
        className="text-blue-500 text-xs border border-blue-300 rounded-full w-4 h-4 inline-flex items-center justify-center leading-none"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onClick={() => setShow(s => !s)} aria-label="説明">?</button>
      {show && (
        <div className="absolute z-50 left-5 top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs text-gray-700 leading-relaxed">
          {text}
        </div>
      )}
    </span>
  );
}

function Row({ label, value, tip, highlight }: { label: string; value: string; tip?: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 ${highlight ? "font-bold" : ""}`}>
      <span className={`text-sm ${highlight ? "text-gray-900" : "text-gray-600"}`}>{label}{tip && <Tip text={tip} />}</span>
      <span className={`text-sm ${highlight ? "text-blue-700 text-base" : "text-gray-800"}`}>{value}</span>
    </div>
  );
}

function fmt(n: number) { return Math.floor(n).toLocaleString("ja-JP") + "円"; }

export default function OvertimeClient() {
  const [baseSalary, setBaseSalary] = useState("250000");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [daysPerMonth, setDaysPerMonth] = useState("20");
  const [overtimeHours, setOvertimeHours] = useState("20");
  const [lateNightHours, setLateNightHours] = useState("0");
  const [holidayHours, setHolidayHours] = useState("0");
  const [fixedOvertime, setFixedOvertime] = useState(false);
  const [fixedOvertimeHours, setFixedOvertimeHours] = useState("20");
  const [fixedOvertimeAmount, setFixedOvertimeAmount] = useState("30000");

  const calc = useCallback(() => {
    const salary = parseFloat(baseSalary) || 0;
    const hpd = parseFloat(hoursPerDay) || 8;
    const dpm = parseFloat(daysPerMonth) || 20;
    const ot = parseFloat(overtimeHours) || 0;
    const ln = parseFloat(lateNightHours) || 0;
    const hol = parseFloat(holidayHours) || 0;
    const fixedHours = parseFloat(fixedOvertimeHours) || 0;
    const fixedAmount = parseFloat(fixedOvertimeAmount) || 0;

    const monthlyHours = hpd * dpm;
    const hourlyBase = salary / monthlyHours;

    const ot60 = Math.min(ot, 60);
    const otOver60 = Math.max(ot - 60, 0);
    const otPay = hourlyBase * ot60 * 1.25 + hourlyBase * otOver60 * 1.50;

    const lnPay = hourlyBase * ln * 0.25;
    const holPay = hourlyBase * hol * 1.35;

    const totalWithoutFixed = otPay + lnPay + holPay;

    let fixedNote = "";
    let extraPay = totalWithoutFixed;
    if (fixedOvertime) {
      if (ot <= fixedHours) {
        extraPay = 0;
        fixedNote = `固定残業時間（${fixedHours}時間）以内のため追加支払いなし`;
      } else {
        const excessOt = ot - fixedHours;
        const excess60 = Math.min(excessOt, 60 - fixedHours);
        const excessOver60 = Math.max(excessOt - (60 - fixedHours), 0);
        extraPay = hourlyBase * Math.max(excess60, 0) * 1.25
          + hourlyBase * excessOver60 * 1.50
          + lnPay + holPay;
        fixedNote = `固定残業代(${fixedAmount.toLocaleString()}円)に加え、超過分の残業代が必要です`;
      }
    }

    return {
      hourlyBase,
      monthlyHours,
      otPay,
      lnPay,
      holPay,
      total: fixedOvertime ? (fixedAmount + extraPay) : totalWithoutFixed,
      extraPay,
      fixedNote,
      ot60,
      otOver60,
    };
  }, [baseSalary, hoursPerDay, daysPerMonth, overtimeHours, lateNightHours, holidayHours,
    fixedOvertime, fixedOvertimeHours, fixedOvertimeAmount]);

  const r = calc();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/finance" className="hover:underline">金融・資産</a>
        <span className="mx-1">&gt;</span>
        <span>残業代計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">⏰ 残業代計算機</h1>
        <p className="text-gray-600">固定残業代・深夜・休日・60時間超え（2023年法改正）に対応した残業代計算機です。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <h2 className="font-semibold text-gray-800 text-sm">📋 基本情報</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              基本月給（額面）<Tip text="固定残業代が含まれている場合はその分を含めた総支給額を入力してください" />
            </label>
            <div className="flex items-center gap-2">
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={baseSalary} onChange={e => setBaseSalary(e.target.value)} placeholder="250000" />
              <span className="text-gray-500 text-sm whitespace-nowrap">円/月</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                1日の所定労働時間<Tip text="会社の規定で定められた1日の労働時間。一般的には8時間です" />
              </label>
              <div className="flex items-center gap-1">
                <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} placeholder="8" step="0.5" />
                <span className="text-gray-500 text-xs">時間</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                月平均所定労働日数<Tip text="1ヶ月の平均出勤日数。（年間所定労働日数 ÷ 12）で計算します。一般的には20〜22日です" />
              </label>
              <div className="flex items-center gap-1">
                <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={daysPerMonth} onChange={e => setDaysPerMonth(e.target.value)} placeholder="20" step="0.5" />
                <span className="text-gray-500 text-xs">日</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-semibold text-gray-800 text-sm pt-2">⏱ 今月の労働時間</h2>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              残業時間<Tip text="法定労働時間（1日8時間または週40時間）を超えた時間。60時間超えは50%割増（2023年法改正）" />
            </label>
            <div className="flex items-center gap-1">
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={overtimeHours} onChange={e => setOvertimeHours(e.target.value)} placeholder="20" min="0" />
              <span className="text-gray-500 text-xs">時間</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              深夜残業<Tip text="22時〜翌5時の労働時間。通常の割増に加えさらに25%が加算されます" />
            </label>
            <div className="flex items-center gap-1">
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={lateNightHours} onChange={e => setLateNightHours(e.target.value)} placeholder="0" min="0" />
              <span className="text-gray-500 text-xs">時間</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              法定休日労働<Tip text="週1日以上の法定休日（通常は日曜）に働いた時間。35%割増が適用されます" />
            </label>
            <div className="flex items-center gap-1">
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={holidayHours} onChange={e => setHolidayHours(e.target.value)} placeholder="0" min="0" />
              <span className="text-gray-500 text-xs">時間</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={fixedOvertime} onChange={e => setFixedOvertime(e.target.checked)}
              className="w-4 h-4 accent-amber-500" />
            <span className="text-sm font-medium text-amber-800">
              固定残業代（みなし残業）あり
              <Tip text="固定残業代とは、あらかじめ一定時間分の残業代を月給に含めた制度です。実際の残業がその時間を超えた場合、超過分は別途支払われる必要があります" />
            </span>
          </label>
          {fixedOvertime && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-amber-700 mb-1">固定残業時間</label>
                <div className="flex items-center gap-1">
                  <input type="number" className="border border-amber-300 rounded-lg px-3 py-2 w-full text-sm outline-none"
                    value={fixedOvertimeHours} onChange={e => setFixedOvertimeHours(e.target.value)} placeholder="20" />
                  <span className="text-amber-600 text-xs">時間</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-amber-700 mb-1">固定残業代（月額）</label>
                <div className="flex items-center gap-1">
                  <input type="number" className="border border-amber-300 rounded-lg px-3 py-2 w-full text-sm outline-none"
                    value={fixedOvertimeAmount} onChange={e => setFixedOvertimeAmount(e.target.value)} placeholder="30000" />
                  <span className="text-amber-600 text-xs">円</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-blue-600 text-white p-4">
          <p className="text-sm opacity-80 mb-1">計算結果</p>
          <p className="text-3xl font-bold">{fmt(r.total)}</p>
          <p className="text-blue-200 text-sm mt-1">今月の残業代合計</p>
        </div>
        <div className="p-4 space-y-0">
          <Row label="基礎時給" value={`${Math.floor(r.hourlyBase).toLocaleString()}円/時間`}
            tip="月給 ÷ 月平均所定労働時間で計算します" />
          <Row label="月平均所定労働時間" value={`${r.monthlyHours}時間`}
            tip="1日の所定労働時間 × 月平均所定労働日数" />
          {r.ot60 > 0 && (
            <Row label={`時間外労働（〜60時間・${r.ot60}h × 1.25）`}
              value={fmt(Math.floor(r.hourlyBase) * r.ot60 * 1.25)} />
          )}
          {r.otOver60 > 0 && (
            <Row label={`時間外労働（60時間超・${r.otOver60}h × 1.50）`}
              value={fmt(Math.floor(r.hourlyBase) * r.otOver60 * 1.50)} />
          )}
          {parseFloat(lateNightHours) > 0 && (
            <Row label={`深夜残業割増（+25%・${lateNightHours}h）`} value={fmt(r.lnPay)}
              tip="22時〜翌5時の深夜労働は通常の割増に加え25%が加算されます" />
          )}
          {parseFloat(holidayHours) > 0 && (
            <Row label={`法定休日労働（35%・${holidayHours}h）`} value={fmt(r.holPay)} />
          )}
          {fixedOvertime && (
            <>
              <Row label="固定残業代（月額）" value={fmt(parseFloat(fixedOvertimeAmount) || 0)} />
              <Row label="超過分残業代" value={fmt(r.extraPay)} />
            </>
          )}
          <Row label="合計残業代" value={fmt(r.total)} highlight />
        </div>
        {r.otOver60 > 0 && (
          <div className="bg-red-50 border-t border-red-200 px-4 py-3 text-xs text-red-700">
            ⚠️ 月60時間を超える残業があります。2023年4月以降、中小企業も50%割増が適用されます。
          </div>
        )}
        {fixedOvertime && r.extraPay > 0 && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-3 text-xs text-amber-700">
            ℹ️ {r.fixedNote}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-8">
        ※ この計算機は参考値を提供するものです。実際の残業代は雇用契約・就業規則・勤怠記録に基づき判断されます。
        未払い残業代の請求は労働基準監督署または弁護士にご相談ください。
      </p>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "残業代の計算式は？", a: "残業代 = 基礎時給 × 残業時間 × 割増率です。基礎時給は「月給 ÷ 月平均所定労働時間」で求めます。月平均所定労働時間は「1日の所定労働時間 × 月平均所定労働日数」で計算します。" },
            { q: "固定残業代（みなし残業）を超えた場合は？", a: "固定残業代は所定の残業時間分を給与に含めた制度です。実際の残業時間が固定残業時間を超えた場合、超えた分の残業代は別途支払われる義務があります。このツールの「固定残業代あり」にチェックを入れて計算できます。" },
            { q: "60時間を超える残業の割増率は？", a: "2023年4月1日より、中小企業も含めて月60時間を超える時間外労働の割増賃金率は50%以上となりました。このツールは60時間超えを自動的に50%割増で計算します。" },
            { q: "深夜残業と通常残業が重なる場合は？", a: "法定時間外労働（残業）と深夜労働（22時〜翌5時）が重なる場合、割増率が加算されます。時間外25%＋深夜25%＝50%の割増となります。" },
          ].map(({ q, a }, i) => (
            <details key={i} className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:bg-gray-50 text-sm">Q. {q}</summary>
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
