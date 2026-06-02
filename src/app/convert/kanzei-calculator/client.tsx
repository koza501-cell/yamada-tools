"use client";
import { useState, useMemo } from "react";

type ImportMode = "personal" | "commercial";

const CATEGORIES = [
  { id: "apparel", label: "衣類・服飾品", rate: 0.10, commercialRate: 0.10 },
  { id: "electronics", label: "電子機器・家電", rate: 0.00, commercialRate: 0.00 },
  { id: "cosmetics", label: "化粧品・美容品", rate: 0.00, commercialRate: 0.00 },
  { id: "food", label: "食品・飲料", rate: 0.10, commercialRate: 0.10 },
  { id: "watches", label: "時計・宝飾品", rate: 0.00, commercialRate: 0.05 },
  { id: "shoes", label: "靴・バッグ", rate: 0.10, commercialRate: 0.10 },
  { id: "toys", label: "おもちゃ・ゲーム", rate: 0.00, commercialRate: 0.00 },
  { id: "books", label: "書籍・メディア", rate: 0.00, commercialRate: 0.00 },
  { id: "other", label: "その他", rate: 0.00, commercialRate: 0.00 },
  { id: "custom", label: "税率を直接入力", rate: -1, commercialRate: -1 },
];

const CURRENCIES = [
  { code: "USD", label: "米ドル (USD)", defaultRate: 150 },
  { code: "EUR", label: "ユーロ (EUR)", defaultRate: 165 },
  { code: "CNY", label: "人民元 (CNY)", defaultRate: 21 },
  { code: "GBP", label: "英ポンド (GBP)", defaultRate: 190 },
  { code: "KRW", label: "韓国ウォン (KRW)", defaultRate: 0.11 },
  { code: "AUD", label: "豪ドル (AUD)", defaultRate: 97 },
  { code: "CAD", label: "カナダドル (CAD)", defaultRate: 108 },
  { code: "JPY", label: "日本円 (JPY)", defaultRate: 1 },
];
export default function KanzeiClient() {
  const [mode, setMode] = useState<ImportMode>("personal");
  const [categoryId, setCategoryId] = useState("electronics");
  const [customRate, setCustomRate] = useState("5");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [fxRate, setFxRate] = useState("150");
  const [priceStr, setPriceStr] = useState("100");
  const [shippingStr, setShippingStr] = useState("20");
  const [insuranceStr, setInsuranceStr] = useState("0");
  const [showComparison, setShowComparison] = useState(false);
  const [showRateTable, setShowRateTable] = useState(false);

  const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const isCustom = cat.rate === -1;
  const tariffRatePct = isCustom
    ? parseFloat(customRate) || 0
    : mode === "personal" ? cat.rate * 100 : cat.commercialRate * 100;

  const r = useMemo(() => {
    const fx = parseFloat(fxRate) || 1;
    const price = (parseFloat(priceStr) || 0) * fx;
    const ship = (parseFloat(shippingStr) || 0) * fx;
    const ins = (parseFloat(insuranceStr) || 0) * fx;
    const kazeikakaku = mode === "personal" ? price * 0.6 : price + ship + ins;
    const isFullExempt = kazeikakaku <= 10000;
    const tariffRaw = Math.round(kazeikakaku * (tariffRatePct / 100));
    const isTariffExempt = tariffRaw <= 10000;
    const kanzeigaku = isFullExempt || isTariffExempt ? 0 : tariffRaw;
    const shouhizei = isFullExempt ? 0 : Math.round((kazeikakaku + kanzeigaku) * 0.1);
    const total = Math.round(price + ship + kanzeigaku + shouhizei);
    const exemptLine = mode === "personal" ? Math.ceil(10000 / 0.6) : 10000;
    return { fx, price, ship, ins, kazeikakaku, isFullExempt, tariffRaw, isTariffExempt, kanzeigaku, shouhizei, total, exemptLine };
  }, [mode, fxRate, priceStr, shippingStr, insuranceStr, tariffRatePct]);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 print:py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-1 print:text-xl">個人輸入・関税計算機</h1>
      <p className="text-sm text-gray-500 mb-6 print:mb-2">海外通販・eBay・Amazon個人輸入の関税・消費税を自動計算</p>

      <div className="flex gap-2 mb-6">
        <button type="button" onClick={() => setMode("personal")}
          className={"flex-1 py-2 rounded-lg text-sm font-medium border-2 " + (mode === "personal" ? "bg-kon text-white border-kon" : "bg-white text-gray-600 border-gray-200")}>
          個人輸入
        </button>
        <button type="button" onClick={() => setMode("commercial")}
          className={"flex-1 py-2 rounded-lg text-sm font-medium border-2 " + (mode === "commercial" ? "bg-kon text-white border-kon" : "bg-white text-gray-600 border-gray-200")}>
          商業輸入
        </button>
      </div>

      <section className="mb-4 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">品目カテゴリ</h2>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        {isCustom && (
          <div className="mt-2">
            <label className="text-xs text-gray-600 block mb-1">関税率（%）</label>
            <input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)} min="0" max="100" step="0.1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        )}
        <p className="text-xs text-kon mt-2">適用関税率: {tariffRatePct.toFixed(1)}%</p>
      </section>
      <section className="mb-4 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">通貨・為替レート</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">通貨</label>
            <select value={currencyCode} onChange={e => {
              setCurrencyCode(e.target.value);
              const c = CURRENCIES.find(x => x.code === e.target.value);
              if (c) setFxRate(String(c.defaultRate));
            }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">為替レート（円）</label>
            <input type="number" value={fxRate} onChange={e => setFxRate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700 mb-3">金額（{currencyCode}）</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">商品代金</label>
            <input type="number" value={priceStr} onChange={e => setPriceStr(e.target.value)} min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">送料</label>
            <input type="number" value={shippingStr} onChange={e => setShippingStr(e.target.value)} min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">保険料</label>
            <input type="number" value={insuranceStr} onChange={e => setInsuranceStr(e.target.value)} min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        {mode === "personal" && (
          <p className="text-xs text-gray-400 mt-2">個人輸入：課税価格 = 商品代金 × 0.6（送料・保険料除く）</p>
        )}
      </section>

      <div className={"rounded-xl border-2 p-5 mb-6 " + (r.isFullExempt ? "bg-emerald-50 border-emerald-300" : "bg-gray-50 border-gray-200")}>
        {r.isFullExempt ? (
          <div className="text-center">
            <p className="text-emerald-700 font-bold text-lg mb-1">免税（全額）</p>
            <p className="text-sm text-emerald-600">課税価格 {fmt(r.kazeikakaku)}円 ≤ 10,000円のため免税</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">課税価格</span>
              <span className="font-medium">{fmt(r.kazeikakaku)}円</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">関税額</span>
              <span className={"font-medium " + (r.isTariffExempt ? "text-emerald-600" : "text-gray-900")}>
                {r.isTariffExempt ? "免税（≤10,000円）" : fmt(r.kanzeigaku) + "円"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">消費税（10%）</span>
              <span className="font-medium">{fmt(r.shouhizei)}円</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
              <span>合計（日本円）</span>
              <span>{fmt(r.total)}円</span>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">免税ライン: 商品代金 {fmt(r.exemptLine / r.fx)}{currencyCode}（≈{fmt(r.exemptLine)}円）まで</p>
      </div>
      <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden print:hidden">
        <button type="button" onClick={() => setShowComparison(!showComparison)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
          個人輸入の免税ルールまとめ
          <span>{showComparison ? "▲" : "▼"}</span>
        </button>
        {showComparison && (
          <div className="px-4 py-3 text-sm text-gray-600 space-y-2">
            <p>・課税価格（=商品代金×0.6）が10,000円以下 → 全額免税</p>
            <p>・課税価格が10,000円超でも関税額が10,000円以下 → 関税のみ免税（消費税はかかる）</p>
            <p>・商業輸入は課税価格 = 商品代金+送料+保険料の合計</p>
            <p>・EMS・国際書留等の送料は課税対象外（個人輸入の場合）</p>
          </div>
        )}
      </div>

      <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden print:hidden">
        <button type="button" onClick={() => setShowRateTable(!showRateTable)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700">
          主要品目の関税率一覧
          <span>{showRateTable ? "▲" : "▼"}</span>
        </button>
        {showRateTable && (
          <table className="w-full text-xs text-gray-600">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left">品目</th>
              <th className="px-4 py-2 text-right">個人</th>
              <th className="px-4 py-2 text-right">商業</th>
            </tr></thead>
            <tbody>
              <tr className="border-t"><td className="px-4 py-2">電子機器</td><td className="px-4 py-2 text-right">0%</td><td className="px-4 py-2 text-right">0%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">衣類・靴</td><td className="px-4 py-2 text-right">10%</td><td className="px-4 py-2 text-right">10%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">時計（個人）</td><td className="px-4 py-2 text-right">0%</td><td className="px-4 py-2 text-right">5%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">化粧品</td><td className="px-4 py-2 text-right">0%</td><td className="px-4 py-2 text-right">0%</td></tr>
              <tr className="border-t"><td className="px-4 py-2">食品</td><td className="px-4 py-2 text-right">10%</td><td className="px-4 py-2 text-right">10%</td></tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="hidden print:block text-center text-xs text-gray-400 mt-8 border-t pt-4">
        yamada-tools.jp — 個人輸入・関税計算機
      </div>
    </div>
  );
}
