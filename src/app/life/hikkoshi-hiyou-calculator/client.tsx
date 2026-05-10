"use client";
import { useState, useMemo } from "react";

const BASE_RATES: Record<string, Record<string, [number, number]>> = {
  "単身": {
    "同一市区町村": [3, 6], "同一都道府県": [4, 8],
    "近距離（〜100km）": [5, 10], "中距離（100〜500km）": [7, 15], "遠距離（500km〜）": [10, 20],
  },
  "2人家族": {
    "同一市区町村": [5, 10], "同一都道府県": [7, 15],
    "近距離（〜100km）": [9, 18], "中距離（100〜500km）": [13, 25], "遠距離（500km〜）": [18, 35],
  },
  "3〜4人家族": {
    "同一市区町村": [8, 15], "同一都道府県": [12, 22],
    "近距離（〜100km）": [15, 30], "中距離（100〜500km）": [20, 40], "遠距離（500km〜）": [30, 60],
  },
  "5人以上": {
    "同一市区町村": [11, 20], "同一都道府県": [16, 29],
    "近距離（〜100km）": [20, 39], "中距離（100〜500km）": [26, 52], "遠距離（500km〜）": [39, 78],
  },
};

const FAMILY_OPTS = Object.keys(BASE_RATES);
const DIST_OPTS = Object.keys(BASE_RATES["単身"]);

function timeCoeff(month: string): [number, number] {
  if (month === "3" || month === "4") return [1.5, 2.0];
  if (month === "9" || month === "10") return [1.2, 1.5];
  return [1.0, 1.0];
}

export default function HikkoshiHiyouClient() {
  const [family, setFamily] = useState("単身");
  const [dist, setDist] = useState("同一都道府県");
  const [month, setMonth] = useState("6");
  const [weekend, setWeekend] = useState(false);
  const [piano, setPiano] = useState(false);
  const [noElev, setNoElev] = useState(false);
  const [packSvc, setPackSvc] = useState(false);
  const [disposal, setDisposal] = useState(false);
  const [bizPacking, setBizPacking] = useState(false);
  const [aircon, setAircon] = useState("0");

  const result = useMemo(() => {
    const base = BASE_RATES[family]?.[dist] ?? [5, 10];
    const [tcMin, tcMax] = timeCoeff(month);
    let mn = base[0] * tcMin;
    let mx = base[1] * tcMax;
    if (!weekend) { mn *= 0.85; mx *= 0.90; }
    const specials: { label: string; min: number; max: number }[] = [];
    if (piano) specials.push({ label: "ピアノ・大型家具", min: 1, max: 3 });
    if (noElev) specials.push({ label: "階段作業（EV無し）", min: 0.5, max: 1 });
    if (packSvc) specials.push({ label: "梱包・養生サービス", min: 1, max: 2 });
    if (disposal) specials.push({ label: "不用品処分", min: 1, max: 5 });
    if (bizPacking) specials.push({ label: "業者梱包（全荷物）", min: 2, max: 5 });
    const ac = parseInt(aircon) || 0;
    if (ac > 0) specials.push({ label: "エアコン取外・取付 ×" + ac + "台", min: 1.5 * ac, max: 3 * ac });
    const sMin = specials.reduce((s, r) => s + r.min, 0);
    const sMax = specials.reduce((s, r) => s + r.max, 0);
    const round1 = (n: number) => Math.round(n * 10) / 10;
    return {
      baseMin: round1(mn), baseMax: round1(mx),
      specials, sMin: round1(sMin), sMax: round1(sMax),
      totalMin: round1(mn + sMin), totalMax: round1(mx + sMax),
      isBusy: month === "3" || month === "4",
      isSemiBusy: month === "9" || month === "10",
    };
  }, [family, dist, month, weekend, piano, noElev, packSvc, disposal, bizPacking, aircon]);

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  const checkItems = [
    { state: piano, setter: setPiano, label: "ピアノ・大型家具あり（+1〜3万）" },
    { state: noElev, setter: setNoElev, label: "エレベーターなし・階段作業（+0.5〜1万）" },
    { state: packSvc, setter: setPackSvc, label: "梱包・養生サービス（+1〜2万）" },
    { state: disposal, setter: setDisposal, label: "不用品処分（業者依頼、+1〜5万）" },
    { state: bizPacking, setter: setBizPacking, label: "業者梱包（全荷物、+2〜5万）" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">引越し費用 見積もり計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">時期・距離・荷物量から相場をチェック（2025年相場）</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">基本条件</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">世帯人数</label>
                <select value={family} onChange={e => setFamily(e.target.value)} className={inp}>
                  {FAMILY_OPTS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">引越し距離</label>
                <select value={dist} onChange={e => setDist(e.target.value)} className={inp}>
                  {DIST_OPTS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">引越し月</label>
                  <select value={month} onChange={e => setMonth(e.target.value)} className={inp}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={String(m)}>
                        {m}月{m === 3 || m === 4 ? "（繁忙期）" : m === 9 || m === 10 ? "（準繁忙）" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">曜日</label>
                  <div className="flex gap-2">
                    {[{ label: "平日", val: false }, { label: "土日祝", val: true }].map(b => (
                      <button key={b.label} onClick={() => setWeekend(b.val)}
                        className={"flex-1 py-2 rounded-lg text-xs border transition-colors " + (weekend === b.val ? "bg-kon text-white border-kon" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600")}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">特殊事情・オプション</h2>
              {checkItems.map(item => (
                <label key={item.label} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" checked={item.state} onChange={e => item.setter(e.target.checked)} className="w-4 h-4 rounded" />
                  {item.label}
                </label>
              ))}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">エアコン取外・取付</span>
                <input type="number" value={aircon} min={0} max={5} onChange={e => setAircon(e.target.value)}
                  className="w-16 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                <span className="text-sm text-gray-500 dark:text-gray-400">台（+1.5〜3万/台）</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">費用目安</h2>
              {result.isBusy && (
                <div className="bg-gray-50 dark:bg-danger/20 text-danger dark:text-gin text-xs rounded-lg p-2 mb-3">
                  ⚠️ 3〜4月は繁忙期です。費用が通常の1.5〜2倍になることがあります。
                </div>
              )}
              {result.isSemiBusy && (
                <div className="bg-gray-50 dark:bg-kon/20 text-kon dark:text-gray-300 text-xs rounded-lg p-2 mb-3">
                  9〜10月は準繁忙期です。費用が1.2〜1.5倍になることがあります。
                </div>
              )}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">基本引越し費用</span>
                  <span className="dark:text-white">{result.baseMin}〜{result.baseMax}万円</span>
                </div>
                {result.specials.map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{s.label}</span>
                    <span className="text-gray-600 dark:text-gray-300 text-xs">+{s.min}〜{s.max}万円</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">総費用目安</span>
                    <span className="font-bold text-2xl text-gray-800 dark:text-white">{result.totalMin}〜{result.totalMax}万円</span>
                  </div>
                  {!weekend && <p className="text-xs text-green-600 dark:text-green-400 text-right mt-1">平日割引（10〜15%引き）適用済み</p>}
                </div>
              </div>
            </div>
            <details className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <summary className="p-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer text-sm">💡 引越し費用を節約するコツ</summary>
              <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>・複数業者に見積もり依頼（最大50%の差が出ることがあります）</p>
                <p>・3・4月を避け、閑散期（1・2・6・7月）を選ぶ</p>
                <p>・平日（月〜木）は10〜20%安くなるケースが多い</p>
                <p>・自分で梱包することで業者梱包費2〜5万円を節約</p>
                <p>・引越し前に不用品を売却・処分しておく</p>
                <p>・一括見積もりサービスで相見積もりを取る</p>
              </div>
            </details>
            <details className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <summary className="p-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer text-sm">📋 引越し1ヶ月前チェックリスト</summary>
              <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>□ 引越し業者の選定・契約</p>
                <p>□ 役所への転出届（前住所）</p>
                <p>□ 電気・ガス・水道の解約・開設手続き</p>
                <p>□ 郵便局への転送届</p>
                <p>□ 銀行・クレジットカードの住所変更</p>
                <p>□ 不用品の処分・売却</p>
                <p>□ 梱包資材の準備</p>
              </div>
            </details>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
              <p className="font-semibold mb-1">⚠️ ご注意</p>
              <p>費用は2025年相場の目安です。実際の費用は複数業者への見積もりでご確認ください。</p>
            </div>
          </div>
        </div>
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 引越し費用 見積もり計算機
        </div>
      </div>
    </div>
  );
}
