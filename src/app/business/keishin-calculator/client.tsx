"use client";
import { useState, useMemo } from "react";

type LP = [number, number];
const X1_TABLE: LP[] = [[1e6,397],[5e6,472],[1e7,502],[3e7,550],[5e7,573],[1e8,608],[3e8,658],[5e8,681],[1e9,716],[3e9,770],[5e9,796],[1e10,833],[5e10,930],[1e11,1000]];
const X21_TABLE: LP[] = [[0,60],[1e7,364],[3e7,430],[5e7,466],[1e8,521],[3e8,621],[5e8,666],[1e9,731],[5e9,901],[1e10,1000]];
const X22_TABLE: LP[] = [[0,60],[5e6,323],[1e7,380],[3e7,481],[5e7,534],[1e8,607],[5e8,793],[1e9,1000]];
const Z1_TABLE: LP[] = [[0,60],[10,390],[20,453],[50,556],[100,651],[200,756],[500,900],[1000,1000]];

function interp(table: LP[], v: number): number {
  if (v <= table[0][0]) return table[0][1];
  if (v >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [x0, y0] = table[i], [x1, y1] = table[i + 1];
    if (v >= x0 && v <= x1) return y0 + (y1 - y0) * (v - x0) / (x1 - x0);
  }
  return table[table.length - 1][1];
}

const W_ITEMS = [
  { label: "建設業の経営経験10年以上", pts: 3 },
  { label: "経営管理責任者の変更なし（3年以上）", pts: 2 },
  { label: "ISO 9001認証取得", pts: 3 },
  { label: "ISO 14001認証取得", pts: 2 },
  { label: "建設業退職金共済制度加入", pts: 1 },
  { label: "退職一時金制度もしくは企業年金制度導入", pts: 2 },
  { label: "法定外労働災害補償制度加入", pts: 1 },
  { label: "営業年数10年以上", pts: 2 },
  { label: "防災協定締結", pts: 1 },
  { label: "建設機械保有", pts: 1 },
];

function gaugeColor(p: number): { bar: string; text: string; label: string } {
  if (p < 600) return { bar: "#ef4444", text: "text-danger", label: "D（入札困難）" };
  if (p < 700) return { bar: "#f59e0b", text: "text-kon", label: "C（中小規模向け）" };
  if (p < 900) return { bar: "#3b82f6", text: "text-kon", label: "B（中規模）" };
  return { bar: "#22c55e", text: "text-green-600", label: "A（大規模）" };
}
export default function KeishinClient() {
  const [x1Amount, setX1Amount] = useState("50000000");
  const [x21Amount, setX21Amount] = useState("30000000");
  const [x22Amount, setX22Amount] = useState("10000000");
  const [yScore, setYScore] = useState("700");
  const [lv1, setLv1] = useState(2);
  const [lv2, setLv2] = useState(3);
  const [lvOther, setLvOther] = useState(0);
  const [z2Amount, setZ2Amount] = useState("50000000");
  const [wChecked, setWChecked] = useState<Record<number, boolean>>({});
  const [showTips, setShowTips] = useState(false);
  const [showRateTable, setShowRateTable] = useState(false);

  const r = useMemo(() => {
    const x1 = interp(X1_TABLE, parseFloat(x1Amount) || 0);
    const x21 = interp(X21_TABLE, parseFloat(x21Amount) || 0);
    const x22 = interp(X22_TABLE, Math.max(0, parseFloat(x22Amount) || 0));
    const x2 = (x21 + x22) / 2;
    const y = Math.min(1000, Math.max(0, parseFloat(yScore) || 0));
    const z1Pts = lv1 * 6 + lv2 * 2 + lvOther;
    const z1 = interp(Z1_TABLE, z1Pts);
    const z2 = interp(X1_TABLE, parseFloat(z2Amount) || 0);
    const z = (z1 + z2) / 2;
    const wRaw = W_ITEMS.reduce((s, item, i) => s + (wChecked[i] ? item.pts : 0), 0);
    const wScore = Math.min(1995, Math.max(-1995, Math.round(wRaw * 10 * (175 / 200))));
    const p = Math.round(0.25 * x1 + 0.15 * x2 + 0.2 * y + 0.25 * z + 0.15 * wScore);
    return { x1, x21, x22, x2, y, z1Pts, z1, z2, z, wRaw, wScore, p };
  }, [x1Amount, x21Amount, x22Amount, yScore, lv1, lv2, lvOther, z2Amount, wChecked]);

  const pLevel = gaugeColor(r.p);
  const gaugeW = Math.min(100, Math.max(2, ((r.p - 200) / 1000) * 100));
  const toggleW = (i: number) => setWChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 print:py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-1 print:text-xl">経審点数（P点）簡易計算機</h1>
      <p className="text-sm text-gray-500 mb-6 print:mb-2">建設業の経営事項審査・総合評定値P点を試算します</p>

      <section className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">X1 — 完成工事高（年間平均）</h2>
        <input type="number" value={x1Amount} onChange={e => setX1Amount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="例: 50000000" />
        <p className="text-xs text-gray-400 mt-1">直近2年または3年の平均完成工事高（円）</p>
        <p className="text-xs text-kon mt-1">→ X1評点: {fmt(r.x1)}</p>
      </section>

      <section className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">X2 — 自己資本・利益額</h2>
        <label className="block text-xs text-gray-600 mb-1">X21 自己資本額（円）</label>
        <input type="number" value={x21Amount} onChange={e => setX21Amount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" />
        <label className="block text-xs text-gray-600 mb-1">X22 平均利益額（営業利益+減価償却費）（円）</label>
        <input type="number" value={x22Amount} onChange={e => setX22Amount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-kon mt-1">→ X2評点: {fmt(r.x2)} （X21={fmt(r.x21)}, X22={fmt(r.x22)}）</p>
      </section>
      <section className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">Y — 経営状況（財務評点）</h2>
        <input type="number" value={yScore} onChange={e => setYScore(e.target.value)} min="0" max="1000"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-gray-400 mt-1">登録経営状況分析機関から通知された点数（0〜1000）、不明な場合は700</p>
      </section>

      <section className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">Z — 技術力</h2>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">1級技術者数</label>
            <input type="number" value={lv1} onChange={e => setLv1(Number(e.target.value))} min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">2級技術者数</label>
            <input type="number" value={lv2} onChange={e => setLv2(Number(e.target.value))} min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">その他技術者数</label>
            <input type="number" value={lvOther} onChange={e => setLvOther(Number(e.target.value))} min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <label className="block text-xs text-gray-600 mb-1">Z2 元請完成工事高（円）</label>
        <input type="number" value={z2Amount} onChange={e => setZ2Amount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-kon mt-1">→ Z評点: {fmt(r.z)} （技術者点Z1={fmt(r.z1)}, 元請Z2={fmt(r.z2)}）</p>
      </section>

      <section className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">W — 社会性等</h2>
        <div className="space-y-2">
          {W_ITEMS.map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!wChecked[i]} onChange={() => toggleW(i)}
                className="rounded" />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="ml-auto text-xs text-gray-400">+{item.pts}点</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-kon mt-2">→ W評点: {fmt(r.wScore)} （加点合計{r.wRaw}点）</p>
      </section>
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-gray-500">総合評定値（P点）</span>
          <span className={"text-4xl font-bold " + pLevel.text}>{r.p.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-5 mb-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: gaugeW.toFixed(1) + "%", backgroundColor: pLevel.bar }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span>200</span><span>500</span><span>700</span><span>900</span><span>1200</span>
        </div>
        <p className={"text-center font-semibold " + pLevel.text}>{pLevel.label}</p>
        <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p>P = 0.25×X1({fmt(r.x1)}) + 0.15×X2({fmt(r.x2)}) + 0.2×Y({fmt(r.y)}) + 0.25×Z({fmt(r.z)}) + 0.15×W({fmt(r.wScore)})</p>
        </div>
      </div>

      <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden print:hidden">
        <button type="button" onClick={() => setShowTips(!showTips)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
          P点を上げるには
          <span>{showTips ? "▲" : "▼"}</span>
        </button>
        {showTips && (
          <div className="px-4 py-3 text-sm text-gray-600 space-y-1">
            <p>・X1（完成工事高）を増やす — 継続的な受注が最重要</p>
            <p>・Z（技術者）を増やす — 1級資格者の採用・育成</p>
            <p>・W加点項目を積み上げる — ISO取得・退職金共済加入など</p>
            <p>・Y（財務）を改善 — 自己資本比率・負債比率の改善</p>
          </div>
        )}
      </div>

      <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden print:hidden">
        <button type="button" onClick={() => setShowRateTable(!showRateTable)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
          P点ランク目安表
          <span>{showRateTable ? "▲" : "▼"}</span>
        </button>
        {showRateTable && (
          <table className="w-full text-xs text-gray-600">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left">ランク</th>
              <th className="px-4 py-2 text-left">P点目安</th>
              <th className="px-4 py-2 text-left">特徴</th>
            </tr></thead>
            <tbody>
              <tr className="border-t"><td className="px-4 py-2">A</td><td className="px-4 py-2">900以上</td><td className="px-4 py-2">大規模公共工事参加可</td></tr>
              <tr className="border-t"><td className="px-4 py-2">B</td><td className="px-4 py-2">700〜899</td><td className="px-4 py-2">中規模工事中心</td></tr>
              <tr className="border-t"><td className="px-4 py-2">C</td><td className="px-4 py-2">600〜699</td><td className="px-4 py-2">小〜中規模</td></tr>
              <tr className="border-t"><td className="px-4 py-2">D</td><td className="px-4 py-2">600未満</td><td className="px-4 py-2">入札参加困難な場合もあり</td></tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="hidden print:block text-center text-xs text-gray-400 mt-8 border-t pt-4">
        yamada-tools.jp — 経審P点計算機
      </div>
    </div>
  );
}
