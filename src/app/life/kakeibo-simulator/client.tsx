"use client";
import { useState, useMemo } from "react";

type EduPolicy = "public" | "private_mid" | "private_all" | "univ_private";

const EDU_COSTS: Record<EduPolicy, number> = {
  public: 5500000,
  private_mid: 7500000,
  private_all: 9000000,
  univ_private: 8500000,
};
const EDU_LABELS: Record<EduPolicy, string> = {
  public: "公立中心（約550万）",
  private_mid: "私立中高・大学文系（約750万）",
  private_all: "私立一貫・大学（約900万）",
  univ_private: "大学私立のみ（約850万）",
};

interface Child {
  id: number;
  age: string;
  policy: EduPolicy;
}

const EXPENSE_LABELS = [
  { key: "housing", label: "住居費" },
  { key: "food", label: "食費" },
  { key: "utilities", label: "光熱費・通信費" },
  { key: "transport", label: "交通費" },
  { key: "insurance", label: "保険料" },
  { key: "education", label: "教育費" },
  { key: "leisure", label: "娯楽・交際費" },
  { key: "other", label: "その他" },
] as const;

type ExpenseKey = typeof EXPENSE_LABELS[number]["key"];

const SAVING_TIPS = [
  { cat: "住居費", tip: "住宅ローンは繰り上げ返済より低金利投資の方が有利な場合も。家賃交渉・引越し検討で月1〜3万円削減できることがあります。" },
  { cat: "保険料", tip: "死亡保険は子供が独立したら見直しを。医療保険は貯蓄が十分なら不要なケースも。年間3〜10万円節約できることがあります。" },
  { cat: "光熱費・通信費", tip: "スマホは格安SIMで月2,000〜5,000円削減。電力・ガスの切り替えで年3,000〜10,000円削減できます。" },
  { cat: "食費", tip: "食費は週1まとめ買い・作り置きで月1〜2万円削減可能。外食をコンビニ弁当→自炊に切り替えるだけで大きな節約に。" },
  { cat: "娯楽・交際費", tip: "サブスクを見直すだけで月3,000〜10,000円削減できることがあります。使っていないサービスは解約しましょう。" },
];

function futureValue(monthly: number, annualRate: number, months: number): number {
  if (annualRate === 0 || months <= 0) return monthly * months;
  const r = annualRate / 12;
  return monthly * (Math.pow(1 + r, months) - 1) / r;
}

export default function KakeiboSimulatorClient() {
  // 収入
  const [monthlyTake, setMonthlyTake] = useState("300000");
  const [bonusTake, setBonusTake] = useState("600000");
  const [otherIncome, setOtherIncome] = useState("0");

  // 支出
  const [expenses, setExpenses] = useState<Record<ExpenseKey, string>>({
    housing: "80000",
    food: "50000",
    utilities: "20000",
    transport: "15000",
    insurance: "20000",
    education: "0",
    leisure: "30000",
    other: "20000",
  });

  // 目標
  const [goalRetirement, setGoalRetirement] = useState(true);
  const [retirementTarget, setRetirementTarget] = useState("20000000");
  const [currentAge, setCurrentAge] = useState("35");
  const [retireAge, setRetireAge] = useState("65");

  const [goalEdu, setGoalEdu] = useState(false);
  const [children, setChildren] = useState<Child[]>([{ id: 1, age: "5", policy: "public" }]);
  const nextChildId = useState(2)[0];
  const childIdRef = useState({ v: 2 })[0];

  const [goalHousing, setGoalHousing] = useState(false);
  const [housingTarget, setHousingTarget] = useState("4000000");
  const [housingYears, setHousingYears] = useState("5");

  const [goalEmergency, setGoalEmergency] = useState(true);

  const [showTips, setShowTips] = useState(false);

  const addChild = () => {
    const id = childIdRef.v++;
    setChildren(prev => [...prev, { id, age: "0", policy: "public" }]);
  };
  const removeChild = (id: number) => setChildren(prev => prev.filter(c => c.id !== id));
  const updateChild = (id: number, field: keyof Omit<Child, "id">, value: string) =>
    setChildren(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const setExpense = (key: ExpenseKey, value: string) =>
    setExpenses(prev => ({ ...prev, [key]: value }));

  const result = useMemo(() => {
    const monthly = parseFloat(monthlyTake) || 0;
    const bonus = parseFloat(bonusTake) || 0;
    const other = parseFloat(otherIncome) || 0;
    const totalMonthlyIncome = monthly + bonus / 12 + other;

    const totalExpenses = EXPENSE_LABELS.reduce((s, { key }) => s + (parseFloat(expenses[key]) || 0), 0);
    const monthlySavable = totalMonthlyIncome - totalExpenses;
    const savingRate = totalMonthlyIncome > 0 ? (monthlySavable / totalMonthlyIncome) * 100 : 0;

    // Goals
    const goals: { label: string; target: number; months: number; monthly: number }[] = [];

    if (goalRetirement) {
      const age = parseInt(currentAge) || 35;
      const retire = parseInt(retireAge) || 65;
      const months = Math.max(1, (retire - age) * 12);
      const target = parseFloat(retirementTarget) || 20000000;
      goals.push({ label: "老後資金", target, months, monthly: Math.ceil(target / months) });
    }

    if (goalEdu) {
      children.forEach(c => {
        const childAge = parseInt(c.age) || 0;
        const yearsToUnivEnd = Math.max(1, 22 - childAge);
        const months = yearsToUnivEnd * 12;
        const target = EDU_COSTS[c.policy];
        goals.push({ label: `教育費（${childAge}歳・${EDU_LABELS[c.policy].split("（")[0]}）`, target, months, monthly: Math.ceil(target / months) });
      });
    }

    if (goalHousing) {
      const target = parseFloat(housingTarget) || 4000000;
      const months = Math.max(1, (parseInt(housingYears) || 5) * 12);
      goals.push({ label: "住宅購入頭金", target, months, monthly: Math.ceil(target / months) });
    }

    if (goalEmergency) {
      const target = monthly * 6;
      goals.push({ label: "緊急資金（月収×6か月）", target, months: 24, monthly: Math.ceil(target / 24) });
    }

    const totalGoalMonthly = goals.reduce((s, g) => s + g.monthly, 0);
    const surplus = monthlySavable - totalGoalMonthly;

    // 3% compound interest benefit (30 years example)
    const investMonths = 30 * 12;
    const withInvest = futureValue(monthlySavable, 0.03, investMonths);
    const withoutInvest = monthlySavable * investMonths;
    const investGain = Math.max(0, withInvest - withoutInvest);

    return {
      totalMonthlyIncome,
      totalExpenses,
      monthlySavable,
      savingRate,
      goals,
      totalGoalMonthly,
      surplus,
      investGain,
      investMonths,
    };
  }, [monthlyTake, bonusTake, otherIncome, expenses, goalRetirement, retirementTarget, currentAge, retireAge, goalEdu, children, goalHousing, housingTarget, housingYears, goalEmergency]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const fmtM = (n: number) => (n / 10000).toFixed(0) + "万";
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const lbl = "block text-sm text-gray-600 dark:text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">家計簿 貯蓄シミュレーター</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">毎月いくら貯めれば目標達成できるか、目標別に逆算します。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: inputs */}
          <div className="space-y-4">
            {/* 収入 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">収入</h2>
              <div>
                <label className={lbl}>手取り月収（円）</label>
                <input type="number" value={monthlyTake} onChange={e => setMonthlyTake(e.target.value)} className={inp} />
              </div>
              <div>
                <label className={lbl}>手取りボーナス（円/年）</label>
                <input type="number" value={bonusTake} onChange={e => setBonusTake(e.target.value)} className={inp} />
                <p className="text-xs text-gray-400 mt-1">月換算: ¥{fmt(Math.round((parseFloat(bonusTake) || 0) / 12))}</p>
              </div>
              <div>
                <label className={lbl}>その他収入（円/月）</label>
                <input type="number" value={otherIncome} onChange={e => setOtherIncome(e.target.value)} className={inp} />
              </div>
            </div>

            {/* 支出 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">月間支出</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {EXPENSE_LABELS.map(({ key, label }) => (
                  <div key={key}>
                    <label className={lbl}>{label}（円）</label>
                    <input type="number" value={expenses[key]} min="0"
                      onChange={e => setExpense(key, e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">支出合計</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">¥{fmt(result.totalExpenses)}</span>
              </div>
            </div>

            {/* 貯蓄目標 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">貯蓄目標</h2>

              {/* 老後資金 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={goalRetirement} onChange={e => setGoalRetirement(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">老後資金</span>
                </label>
                {goalRetirement && (
                  <div className="pl-6 space-y-2">
                    <div>
                      <label className={lbl}>目標金額（円）</label>
                      <input type="number" value={retirementTarget} onChange={e => setRetirementTarget(e.target.value)} className={inp} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>現在の年齢</label>
                        <input type="number" value={currentAge} min="20" max="64" onChange={e => setCurrentAge(e.target.value)} className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>退職予定年齢</label>
                        <input type="number" value={retireAge} min="50" max="75" onChange={e => setRetireAge(e.target.value)} className={inp} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">残り {Math.max(0, (parseInt(retireAge) || 65) - (parseInt(currentAge) || 35))} 年 = {Math.max(0, ((parseInt(retireAge) || 65) - (parseInt(currentAge) || 35)) * 12)} か月</p>
                  </div>
                )}
              </div>

              {/* 教育費 */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={goalEdu} onChange={e => setGoalEdu(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">教育費</span>
                </label>
                {goalEdu && (
                  <div className="pl-6 space-y-3">
                    {children.map((c, idx) => (
                      <div key={c.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">子供 {idx + 1}</span>
                          {children.length > 1 && (
                            <button onClick={() => removeChild(c.id)} className="text-red-400 hover:text-red-600 text-lg leading-none font-bold">×</button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">現在の年齢</label>
                            <input type="number" value={c.age} min="0" max="21"
                              onChange={e => updateChild(c.id, "age", e.target.value)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">教育方針</label>
                            <select value={c.policy} onChange={e => updateChild(c.id, "policy", e.target.value as EduPolicy)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white">
                              {(Object.keys(EDU_LABELS) as EduPolicy[]).map(k => (
                                <option key={k} value={k}>{EDU_LABELS[k]}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">目標: ¥{fmt(EDU_COSTS[c.policy])} ／ 大学卒業まで {Math.max(1, 22 - (parseInt(c.age) || 0))}年</p>
                      </div>
                    ))}
                    {children.length < 4 && (
                      <button onClick={addChild} className="text-sm text-blue-500 hover:text-blue-700">＋ 子供を追加</button>
                    )}
                  </div>
                )}
              </div>

              {/* 住宅購入頭金 */}
              <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={goalHousing} onChange={e => setGoalHousing(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">住宅購入頭金</span>
                </label>
                {goalHousing && (
                  <div className="pl-6 grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>目標頭金（円）</label>
                      <input type="number" value={housingTarget} onChange={e => setHousingTarget(e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>達成時期（年後）</label>
                      <input type="number" value={housingYears} min="1" max="30" onChange={e => setHousingYears(e.target.value)} className={inp} />
                    </div>
                  </div>
                )}
              </div>

              {/* 緊急資金 */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={goalEmergency} onChange={e => setGoalEmergency(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">緊急資金（月収×6か月 = ¥{fmt((parseFloat(monthlyTake) || 0) * 6)}）</span>
                </label>
                {goalEmergency && (
                  <p className="pl-6 text-xs text-gray-400 mt-1">2年（24か月）で積み立てる想定</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: results */}
          <div className="space-y-4">
            {/* Income & savable summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">収支サマリー</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>月収入合計（ボーナス月換算込）</span>
                  <span>¥{fmt(Math.round(result.totalMonthlyIncome))}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>月支出合計</span>
                  <span>¥{fmt(result.totalExpenses)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">月間貯蓄可能額</span>
                  <span className={`text-3xl font-bold ${result.monthlySavable >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
                    ¥{fmt(Math.round(result.monthlySavable))}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>貯蓄率</span>
                  <span className={`font-medium ${result.savingRate >= 20 ? "text-green-600 dark:text-green-400" : result.savingRate >= 10 ? "text-yellow-600 dark:text-yellow-400" : "text-red-500"}`}>
                    {result.savingRate.toFixed(1)}%
                    {result.savingRate >= 20 ? " ✓ 優良" : result.savingRate >= 10 ? " △ 標準" : " ⚠ 低い"}
                  </span>
                </div>
              </div>
            </div>

            {/* Goal table */}
            {result.goals.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">目標別 必要月額積立</h2>
                <div className="space-y-2">
                  {result.goals.map((g, i) => (
                    <div key={i} className="flex justify-between items-start text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{g.label}</p>
                        <p className="text-xs text-gray-400">目標 ¥{fmtM(g.target)} ／ {Math.round(g.months / 12)}年（{g.months}か月）</p>
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 ml-4 whitespace-nowrap">¥{fmt(g.monthly)}/月</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300 pt-1">
                    <span>目標合計月額積立</span>
                    <span>¥{fmt(result.totalGoalMonthly)}/月</span>
                  </div>
                </div>
              </div>
            )}

            {/* Surplus/deficit verdict */}
            {result.goals.length > 0 && (
              <div className={`rounded-xl p-5 border-2 ${result.surplus >= 0 ? "bg-green-50 dark:bg-green-900/20 border-green-400" : "bg-red-50 dark:bg-red-900/20 border-red-400"}`}>
                <p className="text-lg font-bold mb-1">
                  {result.surplus >= 0
                    ? `✅ 余裕 ¥${fmt(Math.round(result.surplus))}/月`
                    : `⚠️ 不足 ¥${fmt(Math.abs(Math.round(result.surplus)))}/月`}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {result.surplus >= 0
                    ? `現在の収支で全目標を達成できます。余剰分は追加投資に回しましょう。`
                    : `月々 ¥${fmt(Math.abs(Math.round(result.surplus)))} の不足です。支出削減または収入増が必要です。`}
                </p>
              </div>
            )}

            {/* Investment benefit */}
            {result.monthlySavable > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">📈 運用すると…（3%複利・30年）</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  貯蓄可能額 ¥{fmt(Math.round(result.monthlySavable))}/月を30年運用すると
                  <span className="font-bold mx-1">¥{fmtM(Math.round(result.investGain))}多く</span>
                  貯まります（運用なしとの差額）。
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">NISAやiDeCoの活用でこの効果を非課税で得られます。</p>
              </div>
            )}

            {/* Tips accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <button onClick={() => setShowTips(!showTips)}
                className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span>固定費削減のヒント</span>
                <span>{showTips ? "▲" : "▼"}</span>
              </button>
              {showTips && (
                <div className="mt-3 space-y-3">
                  {SAVING_TIPS.map(t => (
                    <div key={t.cat}>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t.cat}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{t.tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p className="font-semibold">⚠️ ご注意</p>
              <p>このシミュレーターは概算です。実際の貯蓄計画は家族構成・ライフイベントにより異なります。ファイナンシャルプランナーへの相談もご検討ください。</p>
              <p>運用利回りは将来を保証するものではありません。</p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 家計簿 貯蓄シミュレーター
        </div>
      </div>
    </div>
  );
}
