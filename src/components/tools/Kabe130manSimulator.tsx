"use client";

import { useState } from "react";
import { AdUnit } from "@/components/common/AdUnit";

const ANNUAL_THRESHOLD = 1_300_000;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

// 協会けんぽ 従業員負担率（概算）
const KENKO_HOKEN_RATE = 0.0499;  // 健康保険 約5%（東京・2026年度）
const KOSEI_NENKIN_RATE = 0.0915;  // 厚生年金 9.15%
const KOYO_HOKEN_RATE = 0.005;   // 雇用保険 0.5%
const KAIGO_HOKEN_RATE = 0.008;  // 介護保険 0.8%（40〜64歳）

function calcInsurancePremium(monthlyIncome: number, isKaigo: boolean): number {
  const base = (KENKO_HOKEN_RATE + KOSEI_NENKIN_RATE + KOYO_HOKEN_RATE) * monthlyIncome;
  const kaigo = isKaigo ? KAIGO_HOKEN_RATE * monthlyIncome : 0;
  return Math.round(base + kaigo);
}

const FAQ_ITEMS = [
  {
    q: "2026年4月の改正で何が変わったのですか？",
    a: "社会保険の被扶養者判定が「実収入ベース（残業代込みの実際の収入）」から「契約ベース（労働契約上の所定賃金から算出した年収見込み）」へ変わりました。繁忙期の残業で一時的に年収130万円を超えても、契約上の年収が130万円未満であれば扶養から外れなくなります。",
  },
  {
    q: "通勤手当は130万円の計算に含まれますか？",
    a: "含まれます。社会保険の収入判定では通勤手当も年収に算入します。所得税では通勤手当（月15万円まで）は非課税ですが、社会保険の判定ルールは異なります。見落としやすいポイントです。",
  },
  {
    q: "106万円の壁はどうなりましたか？",
    a: "2026年3月末に全都道府県の最低賃金が時給1,016円を超えたため、週20時間働くだけで月収8.8万円（106万円/年換算）を超える計算になり、事実上形骸化しました。2026年10月には賃金要件（月8.8万円）自体が撤廃予定で、「週20時間以上か否か」がシンプルな基準になります。",
  },
  {
    q: "事業主証明による扶養継続の特例とは何ですか？",
    a: "一時的な収入超過の際に事業主が証明書を出すことで扶養継続できる制度（2022年〜）です。一人につき原則連続2年間が上限で、2026年4月の新ルール（契約ベース判定）とは別制度として併存しています。",
  },
  {
    q: "Wワーク（副業）の場合はどう計算しますか？",
    a: "2か所以上の勤め先がある場合、すべての収入を合算して130万円の壁を判定します。契約ベース判定も合算が基本です。各雇用先での週労働時間が少なくても、合算で週20時間以上になると106万円の壁（特定適用事業所のみ）の対象になります。",
  },
];

export default function Kabe130manSimulator() {
  const [hourlyWage, setHourlyWage] = useState(1100);
  const [hourlyWageText, setHourlyWageText] = useState("1100");
  const [weeklyHours, setWeeklyHours] = useState(24);
  const [weeklyHoursText, setWeeklyHoursText] = useState("24");
  const [monthlyCommute, setMonthlyCommute] = useState(10000);
  const [monthlyCommuteText, setMonthlyCommuteText] = useState("10000");
  const [hasOvertime, setHasOvertime] = useState(false);
  const [monthlyOvertime, setMonthlyOvertime] = useState(10000);
  const [monthlyOvertimeText, setMonthlyOvertimeText] = useState("10000");
  const [age, setAge] = useState(35);
  const [ageText, setAgeText] = useState("35");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const isKaigo = age >= 40 && age <= 64;

  // 契約ベース年収（社会保険の判定基準）
  const contractAnnual =
    hourlyWage * weeklyHours * WEEKS_PER_YEAR + monthlyCommute * MONTHS_PER_YEAR;

  // 実収入見込み（残業含む）
  const actualAnnual = contractAnnual + (hasOvertime ? monthlyOvertime * MONTHS_PER_YEAR : 0);

  const contractMonthly = contractAnnual / MONTHS_PER_YEAR;
  const margin = ANNUAL_THRESHOLD - contractAnnual;
  const isOver130 = contractAnnual >= ANNUAL_THRESHOLD;
  const isOver106 = weeklyHours >= 20;

  // 月収（残業なし基準）で保険料計算
  const monthlyInsurance = calcInsurancePremium(contractMonthly, isKaigo);
  const annualInsurance = monthlyInsurance * MONTHS_PER_YEAR;

  // 安全に収めるための週労働時間上限
  const maxWeeklyHours =
    Math.floor(
      (ANNUAL_THRESHOLD - monthlyCommute * MONTHS_PER_YEAR) /
        (hourlyWage * WEEKS_PER_YEAR)
    );

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">📋</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">2026年4月改正のポイント</p>
            <p>
              被扶養者の判定基準が<strong>「実収入ベース」→「契約ベース」</strong>へ変更。
              契約上の年収が130万円未満なら、残業等で一時的に超えても扶養から外れません。
              ただし<strong>通勤手当は社会保険の収入に含まれる</strong>点に注意が必要です。
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        130万円の壁 シミュレーター（2026年4月改正対応）
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        契約ベースの年収が130万円の壁を超えるか判定。通勤手当込みの正確な試算と、超過時の社会保険料負担を計算。
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Input panel */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm">勤務条件</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">時給（円）</label>
                <input
                  type="number"
                  value={hourlyWageText}
                  onChange={(e) => {
                    setHourlyWageText(e.target.value);
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v > 0) setHourlyWage(v);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  週の所定労働時間（時間）
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  step={0.5}
                  value={weeklyHoursText}
                  onChange={(e) => {
                    setWeeklyHoursText(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > 0) setWeeklyHours(v);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={0.5}
                  value={Math.min(Math.max(weeklyHours, 10), 40)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setWeeklyHours(v);
                    setWeeklyHoursText(String(v));
                  }}
                  className="w-full accent-blue-600 mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>10時間</span>
                  <span>40時間</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  通勤手当（月額・円）
                  <span className="text-orange-500 ml-1 font-normal">※社会保険収入に含む</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={monthlyCommuteText}
                  onChange={(e) => {
                    setMonthlyCommuteText(e.target.value);
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 0) setMonthlyCommute(v);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm">残業・その他</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasOvertime}
                  onChange={(e) => setHasOvertime(e.target.checked)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">残業・変動収入がある</span>
              </label>
              {hasOvertime && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">残業代 月額目安（円）</label>
                  <input
                    type="number"
                    min={0}
                    value={monthlyOvertimeText}
                    onChange={(e) => {
                      setMonthlyOvertimeText(e.target.value);
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= 0) setMonthlyOvertime(v);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">2026年4月改正後は契約ベースで判定するため、残業分は扶養判定に影響しません（妥当な範囲内）。</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">年齢（介護保険料の判定）</label>
                <input
                  type="number"
                  min={18}
                  max={70}
                  value={ageText}
                  onChange={(e) => {
                    setAgeText(e.target.value);
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) setAge(v);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <AdUnit slot="5612038947" format="rectangle" className="my-2" />
        </div>

        {/* Result panel */}
        <div className="sm:w-72 space-y-4">
          {/* 判定バッジ */}
          <div className={`rounded-xl p-5 text-white ${isOver130 ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-green-500 to-emerald-600"}`}>
            <p className="text-sm opacity-80 mb-1">契約ベース年収（社会保険判定）</p>
            <p className="text-3xl font-bold">¥{fmt(contractAnnual)}</p>
            <div className={`mt-3 pt-3 border-t border-white/30 text-sm font-semibold ${isOver130 ? "text-red-100" : "text-green-100"}`}>
              {isOver130 ? "⚠ 130万円の壁 超過" : "✅ 130万円の壁 クリア"}
            </div>
            {!isOver130 && (
              <p className="text-xs opacity-70 mt-1">余裕：あと¥{fmt(margin)} / 年</p>
            )}
          </div>

          {/* 内訳 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">年収内訳</p>
            <div className="flex justify-between">
              <span className="text-gray-600">時給 × 所定時間 × 52週</span>
              <span className="font-medium">¥{fmt(hourlyWage * weeklyHours * WEEKS_PER_YEAR)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">通勤手当 × 12ヶ月</span>
              <span className={`font-medium ${monthlyCommute > 0 ? "text-orange-600" : "text-gray-400"}`}>
                +¥{fmt(monthlyCommute * MONTHS_PER_YEAR)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold">
              <span className="text-gray-700">契約ベース年収</span>
              <span className={isOver130 ? "text-red-700" : "text-green-700"}>¥{fmt(contractAnnual)}</span>
            </div>
            {hasOvertime && (
              <>
                <div className="flex justify-between text-gray-500">
                  <span>残業込み実収入見込み</span>
                  <span>¥{fmt(actualAnnual)}</span>
                </div>
                <p className="text-xs text-blue-600">
                  ↑ 改正後の判定対象外（契約ベースで判定）
                </p>
              </>
            )}
          </div>

          {/* 106万円の壁 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">106万円の壁（週20時間以上か）</p>
            <div className={`flex items-center gap-2 text-sm font-semibold ${isOver106 ? "text-orange-600" : "text-green-600"}`}>
              <span>{isOver106 ? "⚠" : "✅"}</span>
              <span>週{weeklyHours}時間 → {isOver106 ? "20時間以上（対象）" : "20時間未満（対象外）"}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              2026年10月〜 賃金要件撤廃予定。週20時間以上が唯一の基準になります（特定適用事業所のみ）。
            </p>
          </div>

          {/* 130万超の場合の保険料 */}
          {isOver130 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-orange-700 mb-2">自身で社会保険加入した場合の保険料</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">月額保険料（概算）</span>
                  <span className="font-semibold text-orange-700">¥{fmt(monthlyInsurance)}</span>
                </div>
                <div className="flex justify-between border-t border-orange-100 pt-1 font-semibold">
                  <span className="text-gray-700">年間保険料</span>
                  <span className="text-orange-700">¥{fmt(annualInsurance)}</span>
                </div>
              </div>
              {isKaigo && <p className="text-xs text-gray-500 mt-2">40〜64歳：介護保険料を含む</p>}
              <p className="text-xs text-gray-500 mt-1">
                ※ 将来の年金額増加・傷病手当金・出産手当金の受給資格も得られます。
              </p>
            </div>
          )}

          {/* 調整アドバイス */}
          {isOver130 && maxWeeklyHours > 0 && maxWeeklyHours < weeklyHours && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">130万円以内に収めるには</p>
              <p className="text-blue-700">
                週の所定労働時間を <strong>{maxWeeklyHours}時間以下</strong>にすると
                契約ベース年収が130万円未満になります。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 解説 */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">130万円の壁 2026年 改正のポイント</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-gray-700 mb-1">改正前（〜2026年3月）</p>
            <p className="text-gray-600">残業代を含む<strong>実際の収入見込み</strong>で判定。繁忙期に残業が増えると扶養から外れるリスクがあった。</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="font-semibold text-blue-800 mb-1">改正後（2026年4月〜）</p>
            <p className="text-blue-700"><strong>労働契約上の年収見込み</strong>で判定。妥当な範囲の一時的な超過は扶養を維持できる。</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
          <p className="font-semibold text-amber-800 mb-1">⚠ 通勤手当の注意点</p>
          <p className="text-amber-700">
            通勤手当は<strong>所得税では非課税</strong>（月15万円まで）ですが、
            <strong>社会保険の被扶養者判定では年収に含まれます</strong>。
            労働条件通知書に記載される通勤手当を必ず確認してください。
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-3">「106万円の壁」が2026年に事実上なくなった理由</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          106万円の壁（賃金月8.8万円）は、2026年3月末までに全47都道府県の最低賃金が時給1,016円を超えたことで事実上形骸化。週20時間働くだけで月収8.8万円相当（年約106万円）を超える計算になるためです。さらに2026年10月には賃金要件（月8.8万円）自体が撤廃される見込みで、「特定適用事業所に週20時間以上勤務するか否か」がシンプルな加入基準になります。
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 pr-4 text-sm">{item.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AdUnit slot="5612038947" format="horizontal" className="mt-8 print:hidden" />
    </div>
  );
}
