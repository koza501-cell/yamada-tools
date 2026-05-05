"use client";
import { useState, useMemo } from "react";

const DECLINING_RATES: Record<number, number> = {
  2: 1.000, 3: 0.667, 4: 0.500, 5: 0.400, 6: 0.333, 7: 0.286,
  8: 0.250, 9: 0.222, 10: 0.200, 11: 0.182, 12: 0.167, 13: 0.154,
  14: 0.143, 15: 0.133, 16: 0.125, 17: 0.118, 18: 0.111, 19: 0.105,
  20: 0.100, 25: 0.080, 30: 0.067, 40: 0.050, 50: 0.040,
};

const GUARANTEED_RATES: Record<number, number> = {
  2: 0.500, 3: 0.334, 4: 0.250, 5: 0.200, 6: 0.167, 7: 0.143,
  8: 0.125, 9: 0.112, 10: 0.100, 11: 0.091, 12: 0.084, 13: 0.077,
  14: 0.071, 15: 0.067, 16: 0.063, 17: 0.059, 18: 0.056, 19: 0.053,
  20: 0.050, 25: 0.040, 30: 0.034, 40: 0.025, 50: 0.020,
};

const REVISED_RATES: Record<number, number> = {
  2: 1.000, 3: 1.000, 4: 0.500, 5: 0.500, 6: 0.334, 7: 0.334,
  8: 0.250, 9: 0.250, 10: 0.200, 11: 0.200, 12: 0.167, 13: 0.167,
  14: 0.143, 15: 0.143, 16: 0.125, 17: 0.125, 18: 0.112, 19: 0.112,
  20: 0.100, 25: 0.080, 30: 0.067, 40: 0.050, 50: 0.040,
};

const USEFUL_LIVES = [
  { label: "パソコン・サーバー", years: 4 },
  { label: "普通乗用車", years: 6 },
  { label: "軽自動車", years: 4 },
  { label: "スマートフォン・タブレット", years: 4 },
  { label: "コピー機・プリンター", years: 5 },
  { label: "エアコン（業務用）", years: 6 },
  { label: "カメラ・映像機器", years: 5 },
  { label: "デスク・椅子（金属製）", years: 15 },
  { label: "デスク・椅子（木製）", years: 8 },
  { label: "建物（鉄骨鉄筋コンクリート）", years: 47 },
  { label: "建物（木造）", years: 22 },
  { label: "建物（軽量鉄骨）", years: 19 },
  { label: "機械装置（一般）", years: 10 },
  { label: "工具・器具備品", years: 5 },
  { label: "カスタム入力", years: 0 },
];

interface YearRow {
  year: number;
  startBook: number;
  depreciation: number;
  endBook: number;
  cumulative: number;
}

function calcStraightLine(cost: number, life: number, startMonth: number): YearRow[] {
  const rate = 1 / life;
  const annual = Math.floor(cost * rate);
  const rows: YearRow[] = [];
  let book = cost;
  let cum = 0;
  for (let y = 1; y <= life; y++) {
    let dep = annual;
    if (y === 1) dep = Math.floor(annual * ((13 - startMonth) / 12));
    if (y === life) dep = book - 1;
    dep = Math.min(dep, book - 1);
    if (book <= 1) break;
    cum += dep;
    rows.push({ year: y, startBook: book, depreciation: dep, endBook: book - dep, cumulative: cum });
    book -= dep;
  }
  return rows;
}

function calcDecliningBalance(cost: number, life: number, startMonth: number): YearRow[] {
  const rate = DECLINING_RATES[life] || (2 / life);
  const guaranteed = GUARANTEED_RATES[life] || 0;
  const revised = REVISED_RATES[life] || 0;
  const guaranteedAmount = Math.floor(cost * guaranteed);
  const rows: YearRow[] = [];
  let book = cost;
  let cum = 0;
  let useRevised = false;
  for (let y = 1; y <= life; y++) {
    if (book <= 1) break;
    let dep: number;
    if (useRevised) {
      dep = Math.floor(book * revised);
    } else {
      let calc = Math.floor(book * rate);
      if (y === 1) calc = Math.floor(cost * rate * ((13 - startMonth) / 12));
      if (calc < guaranteedAmount) { useRevised = true; dep = Math.floor(book * revised); }
      else dep = calc;
    }
    if (y === life) dep = book - 1;
    dep = Math.min(dep, book - 1);
    dep = Math.max(dep, 0);
    cum += dep;
    rows.push({ year: y, startBook: book, depreciation: dep, endBook: book - dep, cumulative: cum });
    book -= dep;
  }
  return rows;
}

function fmt(n: number) { return Math.floor(n).toLocaleString("ja-JP") + "円"; }

export default function DepreciationClient() {
  const [cost, setCost] = useState("1000000");
  const [lifePreset, setLifePreset] = useState("4");
  const [customLife, setCustomLife] = useState("4");
  const [isCustom, setIsCustom] = useState(false);
  const [startMonth, setStartMonth] = useState("1");
  const [showComparison, setShowComparison] = useState(true);

  const life = isCustom ? (parseInt(customLife) || 4) : parseInt(lifePreset);
  const costNum = parseFloat(cost.replace(/,/g, "")) || 0;
  const startMonthNum = parseInt(startMonth) || 1;

  const slRows = useMemo(() => calcStraightLine(costNum, life, startMonthNum), [costNum, life, startMonthNum]);
  const dbRows = useMemo(() => calcDecliningBalance(costNum, life, startMonthNum), [costNum, life, startMonthNum]);

  const maxDep = Math.max(...slRows.map(r => r.depreciation), ...dbRows.map(r => r.depreciation));
  const isSmallAsset = costNum > 0 && costNum < 300000;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/finance" className="hover:underline">金融・資産</a>
        <span className="mx-1">&gt;</span>
        <span>減価償却計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📉 減価償却計算機</h1>
        <p className="text-gray-600">定額法・定率法を比較。耐用年数プルダウン・グラフ・少額特例判定付き。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">取得価額（購入価格）</label>
          <div className="flex items-center gap-2">
            <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={cost} onChange={e => setCost(e.target.value)} placeholder="1,000,000" />
            <span className="text-gray-500 text-sm whitespace-nowrap">円</span>
          </div>
        </div>

        {isSmallAsset && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-800">
            🎉 <strong>少額減価償却資産の特例が使える可能性があります！</strong><br />
            中小企業者等は30万円未満の資産を取得年度に全額経費計上できます（年間300万円限度・2026年3月まで）。
            税理士にご確認ください。
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-600 mb-1">耐用年数</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={isCustom ? "0" : lifePreset}
            onChange={e => {
              if (e.target.value === "0") { setIsCustom(true); }
              else { setIsCustom(false); setLifePreset(e.target.value); }
            }}
          >
            {USEFUL_LIVES.map(u => (
              <option key={u.label} value={u.years === 0 ? "0" : u.years}>
                {u.label}{u.years > 0 ? ` (${u.years}年)` : ""}
              </option>
            ))}
          </select>
          {isCustom && (
            <div className="flex items-center gap-2 mt-2">
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-32 text-sm outline-none"
                value={customLife} onChange={e => setCustomLife(e.target.value)} min="2" max="100" placeholder="10" />
              <span className="text-gray-500 text-sm">年</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">取得月（初年度の月割り計算用）</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            value={startMonth} onChange={e => setStartMonth(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}月取得</option>
            ))}
          </select>
        </div>
      </div>

      {costNum > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-semibold mb-1">📊 定額法（初年度）</p>
              <p className="text-2xl font-bold text-blue-800">{fmt(slRows[0]?.depreciation || 0)}</p>
              <p className="text-xs text-blue-600 mt-1">毎年均等に償却</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-xs text-purple-600 font-semibold mb-1">📈 定率法（初年度）</p>
              <p className="text-2xl font-bold text-purple-800">{fmt(dbRows[0]?.depreciation || 0)}</p>
              <p className="text-xs text-purple-600 mt-1">初期に多く償却</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => setShowComparison(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${showComparison ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              比較表示
            </button>
            <button type="button" onClick={() => setShowComparison(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${!showComparison ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              グラフ表示
            </button>
          </div>

          {showComparison ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600">年</th>
                      <th className="px-3 py-2 text-right text-blue-700">定額法 償却費</th>
                      <th className="px-3 py-2 text-right text-blue-500">期末簿価</th>
                      <th className="px-3 py-2 text-right text-purple-700">定率法 償却費</th>
                      <th className="px-3 py-2 text-right text-purple-500">期末簿価</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.max(slRows.length, dbRows.length) }, (_, i) => {
                      const sl = slRows[i];
                      const db = dbRows[i];
                      return (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-3 py-2 text-gray-500">{i + 1}年目</td>
                          <td className="px-3 py-2 text-right text-blue-700">{sl ? fmt(sl.depreciation) : "—"}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{sl ? fmt(sl.endBook) : "—"}</td>
                          <td className="px-3 py-2 text-right text-purple-700">{db ? fmt(db.depreciation) : "—"}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{db ? fmt(db.endBook) : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">年別償却費の比較</p>
              <div className="space-y-2">
                {Array.from({ length: Math.max(slRows.length, dbRows.length) }, (_, i) => {
                  const sl = slRows[i];
                  const db = dbRows[i];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-10">{i + 1}年</span>
                      <div className="flex-1 space-y-1">
                        {sl && <div className="flex items-center gap-2">
                          <div className="bg-blue-400 h-3 rounded" style={{ width: `${(sl.depreciation / maxDep) * 100}%`, minWidth: 2 }} />
                          <span className="text-xs text-blue-700">{fmt(sl.depreciation)}</span>
                        </div>}
                        {db && <div className="flex items-center gap-2">
                          <div className="bg-purple-400 h-3 rounded" style={{ width: `${(db.depreciation / maxDep) * 100}%`, minWidth: 2 }} />
                          <span className="text-xs text-purple-700">{fmt(db.depreciation)}</span>
                        </div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded" /><span className="text-xs text-gray-500">定額法</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-400 rounded" /><span className="text-xs text-gray-500">定率法</span></div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mb-8">
            ※ この計算機は参考値です。実際の税務処理は税理士にご確認ください。
            定率法は200%定率法で計算しています。
          </p>
        </>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "定額法と定率法どちらが得ですか？", a: "節税を早期に実現したい場合は定率法が有利です。初期に多く経費計上できるため初年度の節税効果が高くなります。一方、定額法は毎年均等に計上でき利益の見通しが立てやすいです。建物・建物付属設備は定額法のみ適用されます。" },
            { q: "少額減価償却資産の特例とは？", a: "中小企業者等が取得価額30万円未満の減価償却資産を取得した場合、年間300万円を限度に全額を取得年度の経費として計上できる特例です（2026年3月31日まで）。高額なPCや備品でも30万円未満であれば全額経費化できます。" },
            { q: "耐用年数はどこで確認できますか？", a: "法定耐用年数は国税庁が定めており、資産の種類・材質・用途によって異なります。このツールの耐用年数プルダウンに主要な資産の耐用年数を記載しています。" },
            { q: "初年度が月割りになるのはなぜ？", a: "減価償却は取得した月から開始されます。例えば10月に取得した場合、初年度は10〜12月の3ヶ月分（年間の3/12）のみ計上できます。このツールは取得月を入力することで自動的に月割り計算を行います。" },
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
