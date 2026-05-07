"use client";

import { useState, useMemo } from "react";

interface CostRange { min: number; max: number }
const mid = (r: CostRange) => Math.round((r.min + r.max) / 2);
const fmt = (n: number) => n.toLocaleString("ja-JP");

const KAIGAI_FIXED: CostRange  = { min: 150000, max: 600000  };
const TRAVEL_PER: CostRange    = { min: 50000,  max: 150000  };
const HOUSING_PER: CostRange   = { min: 100000, max: 300000  };
const GYO_INITIAL_PER: CostRange = { min: 80000, max: 200000 };
const GYO_CHANGE_PER: CostRange  = { min: 50000, max: 150000 };
const GYO_RENEWAL_PER: CostRange = { min: 30000, max: 80000  };
const GOV_VISA: CostRange      = { min: 3000,   max: 6000    };
const GOV_CHANGE               = 4000;
const GOV_RENEWAL              = 4000;
const TRAINING_PER: CostRange  = { min: 50000,  max: 200000  };

const MERITS = [
  "在留期間更新制限なし（1年・3年・5年ごとに更新、上限なし）",
  "家族帯同可能（配偶者・子に「家族滞在」ビザが発行される）",
  "転職可能（同種業務であれば雇用先を変更できる）",
  "高度専門職ビザへのステップアップが可能",
];

const DOCS_KAIGAI = [
  "会社の登記簿謄本（3ヶ月以内）",
  "直近2期分の決算書",
  "本人との雇用契約書",
  "本人の最終学歴証明書（卒業証書・成績証明書）",
  "会社概要（パンフレットまたはウェブ印刷）",
  "在留資格認定証明書交付申請書",
];

const DOCS_KOKUNAI = [
  "在留資格変更許可申請書",
  "パスポート・在留カード",
  "現在の在留資格の証明書類",
  "雇用契約書",
  "会社の登記簿謄本・決算書",
  "本人の学歴・職歴証明書",
];

export default function GaikokujinVisaClient() {
  const [ninzu, setNinzu] = useState("1");
  const [hoho, setHoho] = useState<"kaigai" | "kokunai">("kaigai");
  const [useGyo, setUseGyo] = useState(true);
  const [includeTraining, setIncludeTraining] = useState(false);
  const [years, setYears] = useState("3");
  const [openDocs, setOpenDocs] = useState(false);

  const calc = useMemo(() => {
    const n = Math.max(parseInt(ninzu) || 1, 1);
    const yr = Math.max(parseInt(years) || 1, 1);

    const kaigaiFixed = hoho === "kaigai" ? KAIGAI_FIXED : { min: 0, max: 0 };
    const travelPer   = hoho === "kaigai" ? TRAVEL_PER   : { min: 0, max: 0 };
    const housingPer  = hoho === "kaigai" ? HOUSING_PER  : { min: 0, max: 0 };
    const gyoInitialPer = useGyo
      ? (hoho === "kaigai" ? GYO_INITIAL_PER : GYO_CHANGE_PER)
      : { min: 0, max: 0 };
    const govPerMin = hoho === "kaigai" ? GOV_VISA.min : GOV_CHANGE;
    const govPerMax = hoho === "kaigai" ? GOV_VISA.max : GOV_CHANGE;
    const trainingPer = includeTraining ? TRAINING_PER : { min: 0, max: 0 };

    const perPersonInitial: CostRange = {
      min: travelPer.min + housingPer.min + gyoInitialPer.min + govPerMin + trainingPer.min,
      max: travelPer.max + housingPer.max + gyoInitialPer.max + govPerMax + trainingPer.max,
    };
    const initialTotal: CostRange = {
      min: kaigaiFixed.min + perPersonInitial.min * n,
      max: kaigaiFixed.max + perPersonInitial.max * n,
    };

    const gyoRenewalPer = useGyo ? GYO_RENEWAL_PER : { min: 0, max: 0 };
    const perPersonRenewal: CostRange = {
      min: gyoRenewalPer.min + GOV_RENEWAL,
      max: gyoRenewalPer.max + GOV_RENEWAL,
    };
    const renewalTotal: CostRange = {
      min: perPersonRenewal.min * n,
      max: perPersonRenewal.max * n,
    };

    const renewalYears = Math.max(yr - 1, 0);
    const grandTotal: CostRange = {
      min: initialTotal.min + renewalTotal.min * renewalYears,
      max: initialTotal.max + renewalTotal.max * renewalYears,
    };

    const tableRows: { label: string; r: CostRange; perPerson?: boolean }[] = [
      ...(hoho === "kaigai"
        ? [{ label: "海外求人広告費・現地面接費（一括）", r: KAIGAI_FIXED }]
        : []),
      ...(hoho === "kaigai"
        ? [{ label: "渡航費（/人）", r: TRAVEL_PER, perPerson: true }]
        : []),
      ...(hoho === "kaigai"
        ? [{ label: "住居初期費用（/人）", r: HOUSING_PER, perPerson: true }]
        : []),
      {
        label: hoho === "kaigai"
          ? "行政書士費用・在留資格認定証明書申請（/人）"
          : "行政書士費用・在留資格変更申請（/人）",
        r: useGyo ? gyoInitialPer : { min: 0, max: 0 },
        perPerson: true,
      },
      {
        label: hoho === "kaigai" ? "ビザ発給手数料（/人）" : "在留資格変更手数料（/人）",
        r: { min: govPerMin, max: govPerMax },
        perPerson: true,
      },
      ...(includeTraining
        ? [{ label: "日本語研修費 3ヶ月コース（/人）", r: TRAINING_PER, perPerson: true }]
        : []),
    ];

    return { tableRows, perPersonInitial, initialTotal, perPersonRenewal, renewalTotal, grandTotal, n, yr };
  }, [ninzu, hoho, useGyo, includeTraining, years]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>ホーム</span> &gt; <span>ビジネス・法人</span> &gt;{" "}
            <span className="text-gray-700 dark:text-gray-200">外国人採用ビザ費用計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            外国人採用 ビザ費用計算機
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            技術・人文知識・国際業務ビザの申請費用を採用人数・採用方法から計算。行政書士費用・継続更新費用も含めて試算。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-5 h-fit">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              入力条件
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                採用人数
              </label>
              <input
                type="number"
                min="1"
                value={ninzu}
                onChange={(e) => setNinzu(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                採用方法
              </label>
              <select
                value={hoho}
                onChange={(e) => setHoho(e.target.value as "kaigai" | "kokunai")}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="kaigai">海外から招へい（在留資格認定）</option>
                <option value="kokunai">国内在留者の変更（在留資格変更）</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useGyo"
                checked={useGyo}
                onChange={(e) => setUseGyo(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <label htmlFor="useGyo" className="text-sm text-gray-700 dark:text-gray-300">
                行政書士に依頼する
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="training"
                checked={includeTraining}
                onChange={(e) => setIncludeTraining(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <label htmlFor="training" className="text-sm text-gray-700 dark:text-gray-300">
                日本語研修を含める
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                継続雇用予定年数
              </label>
              <input
                type="number"
                min="1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                費用内訳（{calc.n}人採用の場合）
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">費用項目</th>
                      <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300">最小</th>
                      <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300">最大</th>
                      <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300">目安</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {calc.tableRows.map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.label}</td>
                        <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-white">
                          {fmt(row.r.min)}円
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-white">
                          {fmt(row.r.max)}円
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-blue-700 dark:text-blue-300">
                          {fmt(mid(row.r))}円
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 dark:bg-gray-700 font-semibold">
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-200">初期費用合計（{calc.n}人）</td>
                      <td className="px-3 py-2 text-right font-mono">{fmt(calc.initialTotal.min)}円</td>
                      <td className="px-3 py-2 text-right font-mono">{fmt(calc.initialTotal.max)}円</td>
                      <td className="px-3 py-2 text-right font-mono text-blue-700 dark:text-blue-300">
                        {fmt(mid(calc.initialTotal))}円
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-600 rounded-xl shadow p-5 text-white text-center">
                <p className="text-xs opacity-80 mb-1">初期費用合計（目安）</p>
                <p className="text-2xl font-bold">{fmt(mid(calc.initialTotal))}</p>
                <p className="text-xs opacity-70">円</p>
              </div>
              <div className="bg-blue-700 rounded-xl shadow p-5 text-white text-center">
                <p className="text-xs opacity-80 mb-1">年間更新費用（目安）</p>
                <p className="text-2xl font-bold">{fmt(mid(calc.renewalTotal))}</p>
                <p className="text-xs opacity-70">円/年</p>
              </div>
              <div className="bg-blue-800 rounded-xl shadow p-5 text-white text-center">
                <p className="text-xs opacity-80 mb-1">{calc.yr}年間 総費用（目安）</p>
                <p className="text-2xl font-bold">{fmt(mid(calc.grandTotal))}</p>
                <p className="text-xs opacity-70">円</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.print()}
                className="text-xs text-blue-600 hover:underline print:hidden"
              >
                🖨️ 印刷 / PDFとして保存
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
          <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            ✅ 技術・人文知識・国際業務ビザのメリット
          </h2>
          <ul className="space-y-2">
            {MERITS.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm text-blue-800 dark:text-blue-200">
                <span className="shrink-0">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <button
            onClick={() => setOpenDocs(!openDocs)}
            className="w-full text-left flex justify-between items-center"
          >
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">
              📋 申請に必要な主な書類
            </h2>
            <span className="text-gray-400">{openDocs ? "▲" : "▼"}</span>
          </button>
          {openDocs && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {hoho === "kaigai" ? "海外招へい（在留資格認定証明書申請）" : "国内変更（在留資格変更許可申請）"}
              </h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {(hoho === "kaigai" ? DOCS_KAIGAI : DOCS_KOKUNAI).map((doc, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gray-400 shrink-0">•</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                ※ 大卒以上、または関連分野の実務経験10年以上が許可要件です。
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            ※ 実際の費用は行政書士・申請状況・国籍により異なります。本計算はあくまで目安です。詳細は出入国在留管理局または行政書士にご相談ください。
          </p>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
          <p className="text-gray-300 text-xs mt-1">透かしなし・高品質 PDFはPROプランで → yamada-tools.jp/pricing</p>
        </div>
      </div>
    </div>
  );
}
