"use client";

import { useState, useMemo } from "react";

interface FeedItem {
  label: string;
  price: number;
  kgPerDay: number;
}

interface ResultLine {
  animalLabel: string;
  subLabel: string;
  feedLabel: string;
  count: number;
  unit: string;
  monthlyTons: number;
  monthlyCost: number;
}

const FEED_DATA: Record<string, Record<string, Record<string, FeedItem>>> = {
  dairy: {
    milking: {
      kongo:       { label: "配合飼料",        price: 95000, kgPerDay: 8    },
      roughImport: { label: "粗飼料(輸入乾草)", price: 65000, kgPerDay: 10   },
      roughWcs:    { label: "粗飼料(国産WCS)",  price: 35000, kgPerDay: 8    },
      tmr:         { label: "TMRミックス",       price: 45000, kgPerDay: 30   },
    },
    dry: {
      kongo:       { label: "配合飼料",        price: 95000, kgPerDay: 3    },
    },
    ikusei: {
      kongo:       { label: "配合飼料",        price: 95000, kgPerDay: 3    },
    },
  },
  beef: {
    fattening: {
      kongo:       { label: "配合飼料(肥育)",   price: 90000, kgPerDay: 8    },
      straw:       { label: "粗飼料(稲わら)",   price: 30000, kgPerDay: 5    },
      hay:         { label: "粗飼料(乾草)",     price: 60000, kgPerDay: 3    },
    },
    breeding: {
      kongo:       { label: "配合飼料",        price: 90000, kgPerDay: 5    },
      straw:       { label: "粗飼料(稲わら)",   price: 30000, kgPerDay: 5    },
    },
  },
  pig: {
    piglet:    { kongo: { label: "配合飼料(子豚)",    price: 80000, kgPerDay: 0.8  } },
    fattening: { kongo: { label: "配合飼料(肥育豚)",  price: 75000, kgPerDay: 2.5  } },
    breeding:  { kongo: { label: "配合飼料(繁殖母豚)", price: 75000, kgPerDay: 2.5  } },
  },
  layer:   { birds: { kongo: { label: "配合飼料", price: 70000, kgPerDay: 0.115 } } },
  broiler: { birds: { kongo: { label: "配合飼料", price: 75000, kgPerDay: 0.12  } } },
};

const ANIMAL_LABELS: Record<string, string> = {
  dairy: "乳牛", beef: "肉牛", pig: "豚", layer: "採卵鶏", broiler: "ブロイラー",
};

const SUB_LABELS: Record<string, string> = {
  milking: "泌乳牛", dry: "乾乳牛", ikusei: "育成牛", fattening: "肥育", breeding: "繁殖母",
  piglet: "子豚", birds: "羽数",
};

const UNIT: Record<string, string> = {
  dairy: "頭", beef: "頭", pig: "頭", layer: "羽", broiler: "羽",
};

interface Row {
  id: string;
  animalType: string;
  subType: string;
  feedKey: string;
  count: string;
}

const makeRow = (): Row => ({
  id: Math.random().toString(36).slice(2),
  animalType: "dairy",
  subType: "milking",
  feedKey: "kongo",
  count: "10",
});

const fmt = (n: number) => n.toLocaleString("ja-JP");

export default function ShiryoCostClient() {
  const [rows, setRows] = useState<Row[]>([makeRow()]);
  const [globalKongoPrice, setGlobalKongoPrice] = useState("");
  const [globalRoughePrice, setGlobalRoughePrice] = useState("");
  const [openTips, setOpenTips] = useState(false);

  const updateRow = (id: string, patch: Partial<Row>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...patch };
        if (patch.animalType) {
          const subs = Object.keys(FEED_DATA[patch.animalType] || {});
          updated.subType = subs[0] || "";
          const feeds = Object.keys(FEED_DATA[patch.animalType]?.[updated.subType] || {});
          updated.feedKey = feeds[0] || "";
        }
        if (patch.subType && !patch.animalType) {
          const feeds = Object.keys(FEED_DATA[updated.animalType]?.[patch.subType] || {});
          updated.feedKey = feeds[0] || "";
        }
        return updated;
      })
    );
  };

  const addRow = () => setRows((prev) => [...prev, makeRow()]);
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const summary = useMemo(() => {
    let totalMonthly = 0;
    let totalHeads = 0;

    const lines = rows.map((row) => {
      const feedItem = FEED_DATA[row.animalType]?.[row.subType]?.[row.feedKey];
      if (!feedItem) return null;
      const count = parseInt(row.count) || 0;

      let price = feedItem.price;
      if (globalKongoPrice && feedItem.label.includes("配合飼料")) {
        price = parseInt(globalKongoPrice) || price;
      }
      if (globalRoughePrice && (feedItem.label.includes("粗飼料") || feedItem.label.includes("TMR"))) {
        price = parseInt(globalRoughePrice) || price;
      }

      const monthlyTons = (count * feedItem.kgPerDay * 30) / 1000;
      const monthlyCost = Math.round(monthlyTons * price);
      totalMonthly += monthlyCost;
      totalHeads += count;

      return {
        animalLabel: ANIMAL_LABELS[row.animalType],
        subLabel: SUB_LABELS[row.subType] || row.subType,
        feedLabel: feedItem.label,
        count,
        unit: UNIT[row.animalType],
        monthlyTons,
        monthlyCost,
      };
    }).filter((x): x is ResultLine => x !== null);

    return { lines, totalMonthly, totalAnnual: totalMonthly * 12, totalHeads };
  }, [rows, globalKongoPrice, globalRoughePrice]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>ホーム</span> &gt; <span>農業・暮らし</span> &gt;{" "}
            <span className="text-gray-700 dark:text-gray-200">酪農・畜産飼料コスト計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            酪農・畜産 飼料コスト計算機
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            乳牛・肉牛・豚・鶏の頭数と飼料種別から月間飼料費を計算。飼料高騰対策の経営改善に。
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
            飼養区分・飼料の入力
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="text-left px-2 py-2 text-gray-600 dark:text-gray-300">畜種</th>
                  <th className="text-left px-2 py-2 text-gray-600 dark:text-gray-300">飼養区分</th>
                  <th className="text-left px-2 py-2 text-gray-600 dark:text-gray-300">飼料</th>
                  <th className="text-left px-2 py-2 text-gray-600 dark:text-gray-300">頭/羽数</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.map((row) => {
                  const subTypes = Object.keys(FEED_DATA[row.animalType] || {});
                  const feedKeys = Object.keys(FEED_DATA[row.animalType]?.[row.subType] || {});
                  return (
                    <tr key={row.id}>
                      <td className="px-2 py-2">
                        <select
                          value={row.animalType}
                          onChange={(e) => updateRow(row.id, { animalType: e.target.value })}
                          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white w-full"
                        >
                          {Object.keys(ANIMAL_LABELS).map((k) => (
                            <option key={k} value={k}>{ANIMAL_LABELS[k]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={row.subType}
                          onChange={(e) => updateRow(row.id, { subType: e.target.value })}
                          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white w-full"
                        >
                          {subTypes.map((s) => (
                            <option key={s} value={s}>{SUB_LABELS[s] || s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={row.feedKey}
                          onChange={(e) => updateRow(row.id, { feedKey: e.target.value })}
                          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white w-full"
                        >
                          {feedKeys.map((k) => (
                            <option key={k} value={k}>
                              {FEED_DATA[row.animalType]?.[row.subType]?.[k]?.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.count}
                          onChange={(e) => updateRow(row.id, { count: e.target.value })}
                          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white w-24"
                        />
                      </td>
                      <td className="px-2 py-2">
                        {rows.length > 1 && (
                          <button type="button"
                            onClick={() => removeRow(row.id)}
                            className="text-danger hover:text-danger text-xs"
                          >
                            削除
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button type="button"
            onClick={addRow}
            className="mt-3 text-sm text-kon hover:underline dark:text-gray-300"
          >
            ＋ 行を追加
          </button>

          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                現在の配合飼料価格（円/トン）— 空欄で標準値を使用
              </label>
              <input
                type="number"
                value={globalKongoPrice}
                onChange={(e) => setGlobalKongoPrice(e.target.value)}
                placeholder="例: 98000"
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                現在の粗飼料・TMR価格（円/トン）— 空欄で標準値を使用
              </label>
              <input
                type="number"
                value={globalRoughePrice}
                onChange={(e) => setGlobalRoughePrice(e.target.value)}
                placeholder="例: 68000"
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white w-full"
              />
            </div>
          </div>
        </div>

        {summary.lines.length > 0 && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                飼料コスト 内訳
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">畜種・区分</th>
                      <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">飼料</th>
                      <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300">頭数</th>
                      <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300">月間消費(t)</th>
                      <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300">月間費用</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {summary.lines.map((line, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                          {line.animalLabel} / {line.subLabel}
                        </td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{line.feedLabel}</td>
                        <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-white">
                          {fmt(line.count)}{line.unit}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-white">
                          {line.monthlyTons.toFixed(3)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-white">
                          {fmt(line.monthlyCost)}円
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-600 rounded-xl shadow p-5 text-white text-center">
                <p className="text-xs opacity-80 mb-1">月間飼料費合計</p>
                <p className="text-3xl font-bold">{fmt(summary.totalMonthly)}</p>
                <p className="text-xs opacity-70">円/月</p>
              </div>
              <div className="bg-green-700 rounded-xl shadow p-5 text-white text-center">
                <p className="text-xs opacity-80 mb-1">年間飼料費合計</p>
                <p className="text-3xl font-bold">{fmt(summary.totalAnnual)}</p>
                <p className="text-xs opacity-70">円/年</p>
              </div>
              <div className="bg-gray-700 rounded-xl shadow p-5 text-white text-center">
                <p className="text-xs opacity-80 mb-1">頭(羽)あたり月間飼料費</p>
                <p className="text-3xl font-bold">
                  {summary.totalHeads > 0 ? fmt(Math.round(summary.totalMonthly / summary.totalHeads)) : "—"}
                </p>
                <p className="text-xs opacity-70">円/頭(羽)/月</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <button type="button"
                onClick={() => window.print()}
                className="text-xs text-kon hover:underline print:hidden"
              >
                🖨️ 印刷 / PDFとして保存
              </button>
            </div>
          </>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <button type="button"
            onClick={() => setOpenTips(!openTips)}
            className="w-full text-left flex justify-between items-center"
          >
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">
              💡 飼料費削減のヒント
            </h2>
            <span className="text-gray-400">{openTips ? "▲" : "▼"}</span>
          </button>
          {openTips && (
            <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex gap-2">
                <span>🌾</span>
                <div>
                  <strong>自給飼料の拡大（WCS・稲わら）</strong>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    飼料用稲・WCSの作付けを増やし輸入依存を減らすことで、変動コストを抑制できます。
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span>🍚</span>
                <div>
                  <strong>飼料米の活用</strong>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    飼料米は補助金対象品目。国内産で安定供給が可能です。
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span>🏭</span>
                <div>
                  <strong>TMRセンターの利用</strong>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    TMRセンターを利用することで調製コストを削減し、品質を安定させられます。
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span>💴</span>
                <div>
                  <strong>飼料高騰対策補助金の活用</strong>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    農林水産省・都道府県の飼料価格高騰対策交付金を確認しましょう。
                  </p>
                </div>
              </li>
            </ul>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-kon/30 border border-gray-200 dark:border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-xs text-kon dark:text-amber-200">
            📊 参考: 飼料価格の推移 — 2020年比で配合飼料は約40%上昇（2024年度時点）
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            ※ 実際の飼料費はJAや飼料会社との契約条件・飼養管理によります。本計算はあくまで目安です。
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
