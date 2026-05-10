"use client";
import { useState, useCallback } from "react";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

type Platform = { label: string; rate: number };
const PLATFORMS: Platform[] = [
  { label: "メルカリ (10%)", rate: 0.10 },
  { label: "eBay (13%)", rate: 0.13 },
  { label: "ヤフオク (10%)", rate: 0.10 },
  { label: "Amazon (15%)", rate: 0.15 },
  { label: "ラクマ (6%)", rate: 0.06 },
  { label: "その他 (カスタム)", rate: -1 },
];

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP") + "円";
}

function InputRow({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-kon outline-none"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          min="0"
        />
        {unit && <span className="text-gray-500 text-sm whitespace-nowrap">{unit}</span>}
      </div>
    </div>
  );
}

export default function FurimaClient() {
  const tool = getToolById("furima-profit-calculator");
  const [purchase, setPurchase] = useState("3000");
  const [selling, setSelling] = useState("5000");
  const [platformIdx, setPlatformIdx] = useState(0);
  const [customRate, setCustomRate] = useState("10");
  const [shipping, setShipping] = useState("600");
  const [packing, setPacking] = useState("100");
  const [other, setOther] = useState("0");
  const [reverseMode, setReverseMode] = useState(false);
  const [targetRate, setTargetRate] = useState("20");

  const feeRate = PLATFORMS[platformIdx].rate === -1
    ? (parseFloat(customRate) || 0) / 100
    : PLATFORMS[platformIdx].rate;

  const calc = useCallback(() => {
    const p = parseFloat(purchase) || 0;
    const s = parseFloat(selling) || 0;
    const ship = parseFloat(shipping) || 0;
    const pack = parseFloat(packing) || 0;
    const oth = parseFloat(other) || 0;
    const feeAmt = s * feeRate;
    const totalCost = p + feeAmt + ship + pack + oth;
    const profit = s - totalCost;
    const profitRate = s > 0 ? (profit / s) * 100 : 0;
    const fixedCosts = p + ship + pack + oth;
    const breakEven = feeRate < 1 ? fixedCosts / (1 - feeRate) : 0;
    const tr = (parseFloat(targetRate) || 0) / 100;
    const denom = 1 - tr - feeRate;
    const neededPrice = denom > 0 ? fixedCosts / denom : 0;
    return { feeAmt, totalCost, profit, profitRate, breakEven, neededPrice };
  }, [purchase, selling, shipping, packing, other, feeRate, targetRate]);

  const r = calc();
  const profitPositive = r.profit >= 0;
  const gaugeWidth = Math.min(Math.max(r.profitRate, 0), 50) * 2;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/business" className="hover:underline">ビジネス</a>
        <span className="mx-1">&gt;</span>
        <span>フリマ利益計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🛒 古物商・フリマ仕入れ利益計算機</h1>
        <p className="text-gray-600 text-sm">仕入れ値・手数料・送料から利益と利益率をリアルタイム計算。損益分岐点・目標利益率逆算対応。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <h2 className="font-semibold text-gray-800 text-sm">📦 仕入れ・販売情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <InputRow label="仕入れ値" value={purchase} onChange={setPurchase} unit="円" placeholder="3000" />
          <InputRow label="販売価格" value={selling} onChange={setSelling} unit="円" placeholder="5000" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">プラットフォーム</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-kon outline-none"
            value={platformIdx}
            onChange={e => setPlatformIdx(Number(e.target.value))}
          >
            {PLATFORMS.map((pl, i) => (
              <option key={i} value={i}>{pl.label}</option>
            ))}
          </select>
          {PLATFORMS[platformIdx].rate === -1 && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                className="border border-gray-300 rounded-lg px-3 py-2 w-28 text-sm focus:ring-2 focus:ring-kon outline-none"
                value={customRate}
                onChange={e => setCustomRate(e.target.value)}
                placeholder="10"
                min="0"
                max="100"
                step="0.1"
              />
              <span className="text-gray-500 text-sm">% (カスタム手数料率)</span>
            </div>
          )}
        </div>
        <h2 className="font-semibold text-gray-800 text-sm pt-2">💸 その他費用</h2>
        <div className="grid grid-cols-3 gap-3">
          <InputRow label="送料" value={shipping} onChange={setShipping} unit="円" placeholder="600" />
          <InputRow label="梱包資材費" value={packing} onChange={setPacking} unit="円" placeholder="100" />
          <InputRow label="その他費用" value={other} onChange={setOther} unit="円" placeholder="0" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className={profitPositive ? "p-4 text-white bg-green-600" : "p-4 text-white bg-danger"}>
          <p className="text-sm opacity-80 mb-1">利益</p>
          <p className="text-3xl font-bold">{fmt(r.profit)}</p>
          <p className="text-sm opacity-80 mt-1">利益率 {r.profitRate.toFixed(1)}%</p>
        </div>
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>利益率ゲージ (0〜50%)</span>
            <span className={r.profitRate >= 20 ? "text-green-600 font-bold" : "text-gray-500"}>
              {r.profitRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
            <div
              className={r.profitRate >= 30 ? "h-3 rounded-full bg-green-500 transition-all" : r.profitRate >= 15 ? "h-3 rounded-full bg-yellow-400 transition-all" : "h-3 rounded-full bg-danger transition-all"}
              style={{ width: gaugeWidth + "%" }}
            />
          </div>
        </div>
        <div className="px-4 pb-4 divide-y divide-gray-100">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">手数料額（{(feeRate * 100).toFixed(1)}%）</span>
            <span className="text-sm text-gray-800 font-medium">{fmt(r.feeAmt)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">総費用合計</span>
            <span className="text-sm text-gray-800 font-medium">{fmt(r.totalCost)}</span>
          </div>
          <div className="flex items-start justify-between py-2">
            <div>
              <span className="text-sm text-gray-600">損益分岐点販売価格</span>
              <p className="text-xs text-gray-400">この価格以上で利益が出ます</p>
            </div>
            <span className="text-sm font-medium text-gray-800">{fmt(r.breakEven)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <label className="flex items-center gap-2 cursor-pointer mb-3">
          <input type="checkbox" checked={reverseMode} onChange={e => setReverseMode(e.target.checked)} className="w-4 h-4 accent-amber-500" />
          <span className="font-semibold text-kon text-sm">🎯 目標利益率から逆算する</span>
        </label>
        {reverseMode && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input type="number" className="border border-gray-200 rounded-lg px-3 py-2 w-24 text-sm outline-none"
                value={targetRate} onChange={e => setTargetRate(e.target.value)} placeholder="20" min="1" max="90" />
              <span className="text-kon text-sm">% の利益率を達成するには</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-kon mb-1">必要販売価格</p>
              <p className="text-2xl font-bold text-kon">{fmt(r.neededPrice)}</p>
              <p className="text-xs text-gray-500 mt-1">以上で販売すれば目標利益率を達成できます</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-8">※ 計算結果は参考値です。実際の手数料・送料はプラットフォームの規約・条件により異なります。</p>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "メルカリの手数料は何%ですか？", a: "メルカリの販売手数料は販売価格の10%です。" },
            { q: "損益分岐点とは何ですか？", a: "損益分岐点販売価格とは、利益がゼロになる最低限の販売価格です。仕入れ値・送料・梱包費・手数料を全て回収できる価格で、これ以上で売れば利益が出ます。" },
            { q: "目標利益率逆算とは？", a: "希望する利益率（例：20%）を入力すると、その利益率を達成するために必要な最低販売価格を自動計算します。" },
            { q: "eBayの手数料は何%ですか？", a: "eBayの手数料は約13%が目安です。カテゴリにより異なります。" },
          ].map(({ q, a }, i) => (
            <details key={i} className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:bg-gray-50 text-sm">Q. {q}</summary>
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>


      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
        <p className="text-gray-300 text-xs mt-1">透かしなし・高品質PDFはPROプランで → yamada-tools.jp/pricing</p>
      </div>
      {tool && <RelatedTools currentTool={tool} maxItems={4} />}
    </div>
  );
}
