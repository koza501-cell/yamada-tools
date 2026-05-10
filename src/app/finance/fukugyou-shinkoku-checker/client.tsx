"use client";
import { useState, useMemo, useRef } from "react";

type MainJobType = "one_employer" | "multi_employer" | "self_employed";
type SideJobType = "freelance" | "parttimeJob" | "realestate" | "reselling" | "affiliate" | "youtube" | "investment" | "other";

interface SideJob {
  id: number;
  name: string;
  type: SideJobType;
  income: string;
  expense: string;
  withheld: string;
}

const EXPENSE_EXAMPLES: Record<SideJobType, string[]> = {
  freelance: ["通信費", "書籍・資料代", "交通費", "セミナー費", "PC・機器代"],
  parttimeJob: ["交通費（実費）"],
  realestate: ["管理費", "修繕費", "固定資産税", "減価償却費", "借入金利息"],
  reselling: ["仕入れ代", "梱包材費", "送料", "交通費", "販売手数料"],
  affiliate: ["サーバー・ドメイン代", "ソフト代", "書籍代", "通信費"],
  youtube: ["機材費", "編集ソフト", "通信費", "衣装・小道具費"],
  investment: ["証券会社手数料（取引コスト）"],
  other: ["業務に関連する経費全般"],
};

const JOB_LABELS: Record<SideJobType, string> = {
  freelance: "フリーランス・業務委託",
  parttimeJob: "アルバイト・パート",
  realestate: "不動産収入",
  reselling: "せどり・転売",
  affiliate: "アフィリエイト・ブログ",
  youtube: "YouTube・SNS収益",
  investment: "株式・FX投資",
  other: "その他",
};

export default function FukugyouShinkokuClient() {
  const nextId = useRef(2);
  const [mainJob, setMainJob] = useState<MainJobType>("one_employer");
  const [jobs, setJobs] = useState<SideJob[]>([
    { id: 1, name: "副業1", type: "freelance", income: "", expense: "", withheld: "" },
  ]);
  const [showTips, setShowTips] = useState(false);
  const [openExpense, setOpenExpense] = useState<number | null>(null);

  const addJob = () => {
    if (jobs.length >= 5) return;
    const id = nextId.current++;
    setJobs(prev => [...prev, { id, name: `副業${prev.length + 1}`, type: "freelance", income: "", expense: "", withheld: "" }]);
  };
  const removeJob = (id: number) => setJobs(prev => prev.filter(j => j.id !== id));
  const updateJob = (id: number, field: keyof Omit<SideJob, "id">, value: string) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, [field]: value } : j));

  const result = useMemo(() => {
    const jobResults = jobs.map(j => {
      const inc = parseFloat(j.income) || 0;
      const exp = parseFloat(j.expense) || 0;
      const wh = parseFloat(j.withheld) || 0;
      const profit = Math.max(0, inc - exp);
      return { ...j, incomeNum: inc, expenseNum: exp, withheldNum: wh, profit };
    });
    const totalProfit = jobResults.reduce((s, j) => s + j.profit, 0);
    const totalWithheld = jobResults.reduce((s, j) => s + j.withheldNum, 0);
    const threshold = 200000;
    const remaining = Math.max(0, threshold - totalProfit);
    const over = Math.max(0, totalProfit - threshold);

    let needsFiling = false;
    let reason = "";
    if (mainJob === "self_employed") {
      needsFiling = true;
      reason = "個人事業主・フリーランスは20万円ルールの適用外です。すべての所得を申告する必要があります。";
    } else if (mainJob === "multi_employer") {
      needsFiling = totalProfit > threshold;
      reason = needsFiling
        ? `給与2か所以上の場合、年末調整されていない給与収入等の合計が20万円超（¥${totalProfit.toLocaleString()}）のため確定申告が必要です。`
        : `給与2か所以上ですが、年末調整されていない所得合計が20万円以下（¥${totalProfit.toLocaleString()}）のため申告は不要です。`;
    } else {
      needsFiling = totalProfit > threshold;
      reason = needsFiling
        ? `副業の所得合計が20万円超（¥${totalProfit.toLocaleString()}）のため確定申告が必要です。`
        : `副業の所得合計が20万円以下（¥${totalProfit.toLocaleString()}）のため確定申告は不要です（所得税）。`;
    }

    const canRefund = totalWithheld > 0 && !needsFiling;
    const needsJuumin = !needsFiling && totalProfit > 0 && mainJob !== "self_employed";
    return { jobResults, totalProfit, totalWithheld, threshold, remaining, over, needsFiling, reason, canRefund, needsJuumin };
  }, [jobs, mainJob]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  const verdictColor = result.needsFiling
    ? "bg-gray-50 dark:bg-danger/20 border-danger dark:border-danger"
    : result.canRefund
      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600"
      : "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600";

  const verdictText = result.needsFiling
    ? "🔴 確定申告が必要です"
    : result.canRefund
      ? "🟡 確定申告は任意ですが、還付の可能性があります"
      : "🟢 確定申告は不要です（所得税）";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">副業 確定申告 必要判定ツール</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">会社員・サラリーマン向け。20万円ルールと住民税申告の必要性を判定。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: inputs */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">本業の形態</h2>
              <select value={mainJob} onChange={e => setMainJob(e.target.value as MainJobType)} className={inp}>
                <option value="one_employer">会社員・パート（給与1か所）</option>
                <option value="multi_employer">会社員（給与2か所以上）</option>
                <option value="self_employed">個人事業主・フリーランス</option>
              </select>
              {mainJob === "one_employer" && (
                <p className="text-xs text-gray-400 mt-2">副業の所得合計が20万円超で確定申告が必要です。</p>
              )}
              {mainJob === "multi_employer" && (
                <p className="text-xs text-gray-400 mt-2">年末調整されなかった給与収入 + その他所得が20万円超で申告必要。</p>
              )}
              {mainJob === "self_employed" && (
                <p className="text-xs text-kon mt-2">個人事業主は20万円ルール適用外。すべての所得を申告してください。</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">副業の収入・経費（最大5件）</h2>
              {jobs.map((job, idx) => (
                <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">副業 {idx + 1}</span>
                    {jobs.length > 1 && (
                      <button onClick={() => removeJob(job.id)} className="text-danger hover:text-danger text-xl leading-none font-bold" aria-label="削除">×</button>
                    )}
                  </div>
                  <input type="text" placeholder="副業名（任意）" value={job.name}
                    onChange={e => updateJob(job.id, "name", e.target.value)} className={inp} />
                  <select value={job.type} onChange={e => updateJob(job.id, "type", e.target.value as SideJobType)} className={inp}>
                    {(Object.keys(JOB_LABELS) as SideJobType[]).map(k => (
                      <option key={k} value={k}>{JOB_LABELS[k]}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">収入（売上）円</label>
                      <input type="number" placeholder="0" value={job.income} min="0"
                        onChange={e => updateJob(job.id, "income", e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">経費　円</label>
                      <input type="number" placeholder="0" value={job.expense} min="0"
                        onChange={e => updateJob(job.id, "expense", e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">源泉徴収額円</label>
                      <input type="number" placeholder="0" value={job.withheld} min="0"
                        onChange={e => updateJob(job.id, "withheld", e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                    </div>
                  </div>
                  <button onClick={() => setOpenExpense(openExpense === job.id ? null : job.id)}
                    className="text-xs text-kon hover:text-ai flex items-center gap-1">
                    {openExpense === job.id ? "▲" : "▼"} {JOB_LABELS[job.type]}の経費例
                  </button>
                  {openExpense === job.id && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                      {EXPENSE_EXAMPLES[job.type].join("・")}
                    </p>
                  )}
                  {(parseFloat(job.income) || 0) > 0 && (
                    <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                      所得: ¥{fmt(Math.max(0, (parseFloat(job.income) || 0) - (parseFloat(job.expense) || 0)))}
                    </p>
                  )}
                </div>
              ))}
              {jobs.length < 5 && (
                <button onClick={addJob} className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-ai hover:text-ai transition-colors">
                  ＋ 副業を追加（{5 - jobs.length}件追加可）
                </button>
              )}
            </div>
          </div>

          {/* Right column: results */}
          <div className="space-y-4">
            <div className={`rounded-xl p-5 border-2 ${verdictColor}`}>
              <p className="text-xl font-bold mb-2">{verdictText}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.reason}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">計算内訳</h2>
              <div className="space-y-2 text-sm">
                {result.jobResults.map(j => (
                  <div key={j.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{j.name}</span>
                    <span>¥{fmt(j.profit)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold text-gray-700 dark:text-gray-300">
                  <span>副業所得合計</span>
                  <span>¥{fmt(result.totalProfit)}</span>
                </div>
                {mainJob !== "self_employed" && (
                  <>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-xs">
                      <span>判定基準（20万円）</span>
                      <span>¥200,000</span>
                    </div>
                    {result.needsFiling ? (
                      <div className="flex justify-between text-danger dark:text-danger">
                        <span>超過額</span>
                        <span>+¥{fmt(result.over)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>20万円まであと</span>
                        <span>¥{fmt(result.remaining)}</span>
                      </div>
                    )}
                  </>
                )}
                {result.totalWithheld > 0 && (
                  <div className="flex justify-between text-kon dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2">
                    <span>源泉徴収額合計</span>
                    <span>¥{fmt(result.totalWithheld)}</span>
                  </div>
                )}
              </div>
            </div>

            {result.canRefund && (
              <div className="bg-gray-50 dark:bg-kon/20 rounded-xl p-4 border border-gray-200 dark:border-kon text-sm text-kon dark:text-gray-300">
                <p className="font-semibold mb-1">💰 還付の可能性があります</p>
                <p>源泉徴収額 ¥{fmt(result.totalWithheld)} が納めすぎている可能性があります。確定申告（還付申告）をすることで取り戻せる場合があります。還付申告は1月1日から5年間有効です。</p>
              </div>
            )}

            {result.needsJuumin && (
              <div className="bg-gray-50 dark:bg-kon/20 rounded-xl p-4 border border-gray-200 dark:border-gray-200 text-sm text-kon dark:text-gray-300">
                <p className="font-semibold mb-1">⚠️ 住民税の申告は必要な場合があります</p>
                <p>所得税の確定申告が不要でも、副業収入がある場合は<span className="font-semibold">市区町村への住民税申告が必要</span>です（翌年3月15日まで）。</p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <button onClick={() => setShowTips(!showTips)}
                className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span>副業を会社に知られたくない場合</span>
                <span>{showTips ? "▲" : "▼"}</span>
              </button>
              {showTips && (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>住民税の徴収方法を<span className="font-semibold text-gray-800 dark:text-white">「普通徴収」</span>に設定することで、副業分の住民税が自宅に直接送付され、会社経由の給与天引きを回避できます。</p>
                  <p>確定申告書の「住民税・事業税に関する事項」欄で「<span className="font-semibold">自分で納付（普通徴収）</span>」を選択してください。</p>
                  <p className="text-xs text-gray-400 mt-1">※完全に秘匿できるわけではなく、社会保険料の変動などから察知されることがあります。</p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-sm">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">申告期限</p>
              <p className="text-gray-600 dark:text-gray-400">毎年 <span className="font-bold text-gray-800 dark:text-white">2月16日〜3月15日</span>（前年1〜12月分）</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">還付申告のみの場合は1月1日から申告可能・5年間有効</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p className="font-semibold">⚠️ ご注意</p>
              <p>このツールは概算判定です。実際の申告要否は税理士または最寄りの税務署にご確認ください。</p>
              <p>住民税の扱い・社会保険との関係など、個人の状況により異なります。</p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 副業 確定申告 必要判定ツール
        </div>
      </div>
    </div>
  );
}
