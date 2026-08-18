"use client";
import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

interface Activity {
  name: string;
  monthly: string;
  enrollment: string;
  materials: string;
  otherAmount: string;
}

interface Result {
  costs: number[];
  seasonal: number;
  total: number;
  monthly: number;
  withChildren: number;
  ratio: number | null;
}

const newActivity = (): Activity => ({ name: "", monthly: "", enrollment: "", materials: "", otherAmount: "" });

const REFERENCE = [
  { label: "公立小学校（全国平均）", value: 372000 },
  { label: "私立小学校（全国平均）", value: 1663000 },
  { label: "公立中学校（全国平均）", value: 542000 },
  { label: "私立中学校（全国平均）", value: 1557000 },
];

const faqItems = [
  {
    question: "学習塾の月謝の平均はいくらですか？",
    answer: "文部科学省「令和5年度子供の学習費調査」によると、公立中学校の学校外活動費（塾・習い事）の平均は年間約35.6万円（月約3万円）、公立小学校は年間約24.7万円（月約2万円）です。私立中学校はさらに高く年間約42.3万円。yamada-tools.jpの本ツールで自家庭の費用を簡単に集計できます。"
  },
  {
    question: "教育費比率は年収の何%が適正ですか？",
    answer: "一般的に世帯年収の10%以下が家計に余裕がある目安、10〜15%は標準的、15%超は要見直しと言われます。yamada-tools.jpの計算機では年収を入力すると教育費比率を色分け表示。子供の進学計画と合わせて家計バランスをチェックできます。"
  },
  {
    question: "習い事の入会金や教材費はいくらかかりますか？",
    answer: "学習塾の入会金は5,000〜30,000円が相場、教材費は年間10,000〜50,000円が一般的です。スポーツ系（スイミング・サッカー）は入会金5,000〜10,000円、用具費10,000〜30,000円程度。yamada-tools.jpの本ツールでは月謝・入会金・教材費・その他を分けて入力でき、年間総額を自動集計します。"
  },
  {
    question: "季節講習（春・夏・冬期講習）の費用は？",
    answer: "学習塾の季節講習は1講座あたり3〜10万円が一般的です。中学受験塾では夏期講習だけで20万円超になるケースも。年3回（春・夏・冬）合計で15〜40万円が目安。yamada-tools.jpの計算機では春・夏・冬期講習を別々に入力でき、月割りで家計への影響を見える化できます。"
  },
  {
    question: "子供が複数いる場合の教育費はどう計算しますか？",
    answer: "yamada-tools.jpの本ツールでは「子供の人数」を選択すると、入力した費用の合計に人数を掛けた総額がわかります。実際は子供ごとに通う塾や習い事が異なるため、目安として活用してください。年間の家計シミュレーションに役立ちます。"
  },
  {
    question: "公立と私立で学校外の教育費は変わりますか？",
    answer: "令和5年度文科省調査によると、公立小学校の学校外活動費は年間約24.7万円、私立小学校は約66.1万円と約2.7倍の差があります。中学校では公立約35.6万円、私立約42.3万円。私立中学受験を予定している場合、5・6年生で年間100万円超になるケースもあります。"
  },
  {
    question: "教育費を抑える方法はありますか？",
    answer: "①集団指導塾を選ぶ（個別指導の半額程度）、②季節講習を厳選する、③通信教育・オンライン塾を併用する、④兄弟割引のある塾を選ぶ、などが代表的です。yamada-tools.jpの本ツールで複数のシナリオを試算し、最適な組み合わせを比較検討できます。"
  },
  {
    question: "教育費を無料で計算できるツールはありますか？",
    answer: "はい、yamada-tools.jp（山田ツール）の学習塾・習い事 月謝計算機が完全無料・登録不要で使えます。複数の習い事を一括登録、季節講習の追加、子供の人数別合計、年収比率まで自動計算。文科省統計との比較も確認できます。"
  },
];

export default function JukuClient() {
  const [activities, setActivities] = useState<Activity[]>([
    { name: "学習塾", monthly: "15000", enrollment: "10000", materials: "5000", otherAmount: "30000" },
  ]);
  const [spring, setSpring] = useState("0");
  const [summer, setSummer] = useState("0");
  const [winter, setWinter] = useState("0");
  const [childCount, setChildCount] = useState(1);
  const [householdIncome, setHouseholdIncome] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const addActivity = () => {
    if (activities.length < 8) setActivities(p => [...p, newActivity()]);
  };
  const removeActivity = (i: number) => setActivities(p => p.filter((_, idx) => idx !== i));
  const update = (i: number, k: keyof Activity, v: string) =>
    setActivities(p => p.map((a, idx) => idx === i ? { ...a, [k]: v } : a));

  const handleCalculate = () => {
    const costs = activities.map(a => {
      const m = Number(a.monthly) || 0;
      const e = Number(a.enrollment) || 0;
      const mat = Number(a.materials) || 0;
      const o = Number(a.otherAmount) || 0;
      return m * 12 + e + mat + o;
    });
    const seasonal = (Number(spring) || 0) + (Number(summer) || 0) + (Number(winter) || 0);
    const total = costs.reduce((s, c) => s + c, 0) + seasonal;
    const monthly = total / 12;
    const withChildren = total * childCount;
    const hi = Number(householdIncome) || 0;
    const ratio = hi > 0 ? (withChildren / hi) * 100 : null;
    setResult({ costs, seasonal, total, monthly, withChildren, ratio });
  };

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">学習塾・習い事 月謝計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">複数の習い事を合計して年間費用を一覧管理。家計の教育費を見える化します。【2026年版・文科省令和5年度データ反映】</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300">習い事リスト</h2>
                <button
                  type="button"
                  onClick={addActivity}
                  disabled={activities.length >= 8}
                  className="text-sm bg-kon hover:bg-ai disabled:opacity-40 text-white px-3 py-1 rounded-lg"
                >
                  ＋ 追加
                </button>
              </div>
              <div className="space-y-3">
                {activities.map((a, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">習い事 {i + 1}</span>
                      {activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActivity(i)}
                          className="text-xs text-danger hover:text-danger"
                        >
                          削除
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <input type="text" value={a.name} onChange={e => update(i, "name", e.target.value)}
                          placeholder="習い事名（例：英語・サッカー）" className={inp} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">月謝 (円)</label>
                        <input type="number" value={a.monthly} onChange={e => update(i, "monthly", e.target.value)} className={inp} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">入会金 (円)</label>
                        <input type="number" value={a.enrollment} onChange={e => update(i, "enrollment", e.target.value)} className={inp} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">教材費 (円/年)</label>
                        <input type="number" value={a.materials} onChange={e => update(i, "materials", e.target.value)} className={inp} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">その他費用 (円/年)</label>
                        <input type="number" value={a.otherAmount} onChange={e => update(i, "otherAmount", e.target.value)}
                          placeholder="発表会費など" className={inp} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">季節講習 (円/年)</h2>
              <div className="grid grid-cols-3 gap-3">
                {([["春期講習", spring, setSpring], ["夏期講習", summer, setSummer], ["冬期講習", winter, setWinter]] as [string, string, (v: string) => void][]).map(([lbl, val, set]) => (
                  <div key={lbl}>
                    <label className="text-xs text-gray-500 dark:text-gray-400">{lbl}</label>
                    <input type="number" value={val} onChange={e => set(e.target.value)} className={inp} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">世帯情報</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">子供の人数</label>
                <select value={childCount} onChange={e => setChildCount(Number(e.target.value))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white">
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}人</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">世帯年収 (円) — 任意</label>
                <input type="number" value={householdIncome} onChange={e => setHouseholdIncome(e.target.value)}
                  placeholder="例: 6000000"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-kon hover:bg-ai text-white font-semibold py-3 rounded-xl shadow-sm transition"
            >
              計算する
            </button>
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <div className="bg-gray-50 dark:bg-kon/30 rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-kon dark:text-gray-300 mb-3">📊 費用サマリー</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">習い事合計（年間）</span>
                      <span className="font-bold text-gray-800 dark:text-white">¥{fmt(result.total)}</span>
                    </div>
                    {result.seasonal > 0 && (
                      <div className="flex justify-between pl-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">うち季節講習</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">¥{fmt(result.seasonal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">月換算費用</span>
                      <span className="font-semibold text-gray-800 dark:text-white">¥{fmt(result.monthly)}/月</span>
                    </div>
                    {childCount > 1 && (
                      <div className="border-t border-gray-200 dark:border-kon pt-2 flex justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">子供{childCount}人合計（年間）</span>
                        <span className="font-bold text-xl text-kon dark:text-gray-300">¥{fmt(result.withChildren)}</span>
                      </div>
                    )}
                    {result.ratio !== null && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mt-2 text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">年収に対する教育費比率</div>
                        <div className={`font-bold text-2xl ${result.ratio > 15 ? "text-danger dark:text-danger" : result.ratio > 10 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>
                          {result.ratio.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400 mt-1">目安: 10%以下が家計に余裕あり</div>
                      </div>
                    )}
                  </div>
                </div>

                {activities.length > 1 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">習い事別 年間費用内訳</h2>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left pb-2">習い事</th>
                          <th className="text-right pb-2">年間費用</th>
                          <th className="text-right pb-2">割合</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((a, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 text-gray-600 dark:text-gray-300">{a.name || `習い事 ${i + 1}`}</td>
                            <td className="py-2 text-right font-medium dark:text-white">¥{fmt(result.costs[i] ?? 0)}</td>
                            <td className="py-2 text-right text-gray-500 dark:text-gray-400">
                              {result.total > 0 ? (((result.costs[i] ?? 0) / result.total) * 100).toFixed(0) : 0}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
                左の項目を入力して「計算する」ボタンを押してください
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">参考: 文科省調査 学校種別の学習費平均（年額）</h2>
              <table className="w-full text-sm">
                <tbody>
                  {REFERENCE.map(r => (
                    <tr key={r.label} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 text-gray-600 dark:text-gray-400">{r.label}</td>
                      <td className="py-2 text-right font-medium dark:text-white">¥{fmt(r.value)}/年</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2">出典: 文部科学省「令和5年度子供の学習費調査」（2024年12月公表）</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <FAQSection faq={faqItems} />
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 学習塾・習い事 月謝計算機
        </div>
      </div>
    </div>
  );
}
