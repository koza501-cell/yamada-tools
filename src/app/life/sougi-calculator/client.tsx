"use client";
import { useState, useMemo } from "react";

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtPrice(n: number) { return fmt(n) + "円"; }

type FuneralType = "一般葬" | "家族葬" | "一日葬" | "直葬" | "社葬";
type Region = "都心部" | "地方都市" | "農村部";
type AltarGrade = "基本" | "標準" | "豪華";
type CoffinGrade = "木製" | "布貼り" | "高級";
type Kaimyo = "なし" | "信士信女" | "居士大姉" | "院号";

const FUNERAL_BASE: Record<FuneralType, { min: number; max: number; guests: number }> = {
  "一般葬": { min: 800000, max: 1500000, guests: 100 },
  "家族葬": { min: 400000, max: 800000, guests: 20 },
  "一日葬": { min: 300000, max: 500000, guests: 15 },
  "直葬": { min: 150000, max: 250000, guests: 5 },
  "社葬": { min: 1500000, max: 3000000, guests: 200 },
};

const REGION_FACTOR: Record<Region, number> = {
  "都心部": 1.2,
  "地方都市": 1.0,
  "農村部": 0.8,
};

const ALTAR_PRICE: Record<AltarGrade, number> = {
  "基本": 100000, "標準": 250000, "豪華": 500000,
};

const COFFIN_PRICE: Record<CoffinGrade, number> = {
  "木製": 50000, "布貼り": 80000, "高級": 150000,
};

const KAIMYO_PRICE: Record<Kaimyo, number> = {
  "なし": 0, "信士信女": 300000, "居士大姉": 500000, "院号": 1000000,
};

export default function SougiClient() {
  const [funeralType, setFuneralType] = useState<FuneralType>("家族葬");
  const [guestCount, setGuestCount] = useState(20);
  const [region, setRegion] = useState<Region>("地方都市");
  const [altarGrade, setAltarGrade] = useState<AltarGrade>("標準");
  const [coffinGrade, setCoffinGrade] = useState<CoffinGrade>("布貼り");
  const [dryIce, setDryIce] = useState(true);
  const [hearse, setHearse] = useState(true);
  const [cremation, setCremation] = useState(true);
  const [venue, setVenue] = useState(true);
  const [dinnerEvening, setDinnerEvening] = useState(true);
  const [dinnerFuneral, setDinnerFuneral] = useState(true);
  const [returnGift, setReturnGift] = useState(true);
  const [flowers, setFlowers] = useState(true);
  const [portrait, setPortrait] = useState(true);
  const [ihai, setIhai] = useState(true);
  const [kaimyo, setKaimyo] = useState<Kaimyo>("なし");
  const [graveyard, setGraveyard] = useState("0");
  const [govSubsidy, setGovSubsidy] = useState(false);
  const [showDirectComparison, setShowDirectComparison] = useState(false);

  const r = useMemo(() => {
    const rf = REGION_FACTOR[region];
    const base = FUNERAL_BASE[funeralType];

    const items: { label: string; amount: number; category: string }[] = [];

    // 基本サービス
    items.push({ label: "祭壇（" + altarGrade + "）", amount: ALTAR_PRICE[altarGrade] * rf, category: "基本" });
    items.push({ label: "棺（" + coffinGrade + "）", amount: COFFIN_PRICE[coffinGrade] * rf, category: "基本" });
    if (dryIce) items.push({ label: "遺体安置・ドライアイス", amount: 30000 * rf, category: "基本" });
    if (hearse) items.push({ label: "霊柩車", amount: 50000 * rf, category: "基本" });
    if (cremation) items.push({ label: "火葬料", amount: (region === "都心部" ? 50000 : 20000), category: "基本" });
    if (venue) items.push({ label: "式場使用料", amount: 200000 * rf, category: "基本" });

    // オプション
    if (dinnerEvening) items.push({ label: "通夜料理（" + guestCount + "名 × 4,000円）", amount: guestCount * 4000, category: "飲食" });
    if (dinnerFuneral) items.push({ label: "告別式料理（" + guestCount + "名 × 2,500円）", amount: guestCount * 2500, category: "飲食" });
    if (returnGift) items.push({ label: "返礼品（" + guestCount + "名 × 3,000円）", amount: guestCount * 3000, category: "飲食" });
    if (flowers) items.push({ label: "生花・供花", amount: 100000 * rf, category: "オプション" });
    if (portrait) items.push({ label: "遺影写真", amount: 20000, category: "オプション" });
    if (ihai) items.push({ label: "位牌", amount: 30000, category: "オプション" });

    // お布施
    if (kaimyo !== "なし") items.push({ label: "お布施・戒名（" + kaimyo + "）", amount: KAIMYO_PRICE[kaimyo], category: "お布施" });

    // 納骨・墓地
    const graveyardAmt = parseFloat(graveyard) || 0;
    if (graveyardAmt > 0) items.push({ label: "納骨堂・墓地", amount: graveyardAmt, category: "その他" });

    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const subsidyAmt = govSubsidy ? 50000 : 0;
    const netTotal = total - subsidyAmt;

    // Compare with 直葬
    const choksoBase = 200000 * rf + COFFIN_PRICE["木製"] * rf + (cremation ? 20000 : 0);
    const savingsVsChokso = total - choksoBase;

    // Category totals
    const categories = ["基本", "飲食", "オプション", "お布施", "その他"];
    const catTotals = categories.map(cat => ({
      label: cat,
      total: items.filter(i => i.category === cat).reduce((s, i) => s + i.amount, 0),
    })).filter(c => c.total > 0);

    // Comparison with average
    const avg = (base.min + base.max) / 2 * rf;
    const comparisonMsg = total < avg * 0.85
      ? "👍 相場より安い水準です"
      : total > avg * 1.15
      ? "⚠️ 相場より高い水準です"
      : "📊 相場の標準的な水準です";

    return { items, total, subsidyAmt, netTotal, catTotals, comparisonMsg, savingsVsChokso, choksoBase };
  }, [funeralType, guestCount, region, altarGrade, coffinGrade, dryIce, hearse, cremation,
    venue, dinnerEvening, dinnerFuneral, returnGift, flowers, portrait, ihai,
    kaimyo, graveyard, govSubsidy]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <span>葬儀費用計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🕊️ 葬儀費用 見積もり計算機</h1>
        <p className="text-gray-600 text-sm">葬儀の形式・規模・オプションから費用の目安を計算。相場と比較して適正価格を確認。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <h2 className="font-semibold text-gray-800 text-sm">⚙️ 基本設定</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-2">葬儀形式</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {(["一般葬", "家族葬", "一日葬", "直葬", "社葬"] as FuneralType[]).map(t => (
              <button key={t} onClick={() => setFuneralType(t)}
                className={"py-2 rounded-lg border text-xs font-medium transition-colors " + (funeralType === t ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600 hover:border-gray-400")}>
                {t}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">相場: {fmtPrice(FUNERAL_BASE[funeralType].min)}〜{fmtPrice(FUNERAL_BASE[funeralType].max)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">参列者数: <strong>{guestCount}名</strong></label>
            <input type="range" min={5} max={300} step={5} value={guestCount}
              onChange={e => setGuestCount(parseInt(e.target.value))}
              className="w-full accent-gray-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5名</span><span>300名</span></div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">地域</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-400 outline-none"
              value={region} onChange={e => setRegion(e.target.value as Region)}>
              <option value="都心部">都心部（×1.2）</option>
              <option value="地方都市">地方都市（×1.0）</option>
              <option value="農村部">農村部（×0.8）</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">祭壇</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-400 outline-none"
              value={altarGrade} onChange={e => setAltarGrade(e.target.value as AltarGrade)}>
              <option value="基本">基本（10万円）</option>
              <option value="標準">標準（25万円）</option>
              <option value="豪華">豪華（50万円）</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">棺</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-400 outline-none"
              value={coffinGrade} onChange={e => setCoffinGrade(e.target.value as CoffinGrade)}>
              <option value="木製">木製（5万円）</option>
              <option value="布貼り">布貼り（8万円）</option>
              <option value="高級">高級（15万円）</option>
            </select>
          </div>
        </div>

        <h2 className="font-semibold text-gray-800 text-sm pt-2">📋 基本サービス</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["遺体安置・ドライアイス（3万円〜）", dryIce, setDryIce],
            ["霊柩車（5万円〜）", hearse, setHearse],
            ["火葬料", cremation, setCremation],
            ["式場使用料（20万円〜）", venue, setVenue],
          ].map(([label, val, setter], i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as Function)(e.target.checked)} className="w-4 h-4 accent-gray-600" />
              <span className="text-sm text-gray-700">{label as string}</span>
            </label>
          ))}
        </div>

        <h2 className="font-semibold text-gray-800 text-sm pt-2">🍱 飲食・返礼品（参列者数連動）</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["通夜料理（4,000円/名）", dinnerEvening, setDinnerEvening],
            ["告別式料理（2,500円/名）", dinnerFuneral, setDinnerFuneral],
            ["返礼品（3,000円/名）", returnGift, setReturnGift],
          ].map(([label, val, setter], i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as Function)(e.target.checked)} className="w-4 h-4 accent-gray-600" />
              <span className="text-sm text-gray-700">{label as string}</span>
            </label>
          ))}
        </div>

        <h2 className="font-semibold text-gray-800 text-sm pt-2">✨ オプション・その他</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["生花・供花（10万円〜）", flowers, setFlowers],
            ["遺影写真（2万円）", portrait, setPortrait],
            ["位牌（3万円）", ihai, setIhai],
          ].map(([label, val, setter], i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as Function)(e.target.checked)} className="w-4 h-4 accent-gray-600" />
              <span className="text-sm text-gray-700">{label as string}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">お布施・戒名</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-400 outline-none"
            value={kaimyo} onChange={e => setKaimyo(e.target.value as Kaimyo)}>
            <option value="なし">なし（0円）</option>
            <option value="信士信女">信士・信女（30万円）</option>
            <option value="居士大姉">居士・大姉（50万円）</option>
            <option value="院号">院号（100万円）</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">納骨堂・墓地費用（円）</label>
          <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-400 outline-none"
            value={graveyard} onChange={e => setGraveyard(e.target.value)} placeholder="0" />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={govSubsidy} onChange={e => setGovSubsidy(e.target.checked)} className="w-4 h-4 accent-green-600" />
          <span className="text-sm text-gray-700">葬祭費補助金を申請予定（国保/社保: 約5万円）</span>
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-700 text-white p-4">
          <p className="text-sm opacity-80 mb-1">総費用目安</p>
          <p className="text-3xl font-bold">{fmtPrice(r.total)}</p>
          {govSubsidy && (
            <p className="text-gray-300 text-sm mt-1">補助金控除後: {fmtPrice(r.netTotal)}</p>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">費用内訳</h3>
          <div className="space-y-0">
            {r.items.map((item, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-600">{item.label}</span>
                <span className="text-xs font-medium">{fmtPrice(Math.round(item.amount))}</span>
              </div>
            ))}
          </div>
          {r.catTotals.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {r.catTotals.map(cat => (
                <div key={cat.label} className="flex justify-between py-1">
                  <span className="text-sm text-gray-500">{cat.label}合計</span>
                  <span className="text-sm font-medium">{fmtPrice(Math.round(cat.total))}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 mt-1">
                <span className="text-sm font-bold text-gray-700">総合計</span>
                <span className="text-sm font-bold text-gray-900">{fmtPrice(r.total)}</span>
              </div>
              {govSubsidy && (
                <div className="flex justify-between py-1">
                  <span className="text-sm text-green-600">葬祭費補助金</span>
                  <span className="text-sm font-medium text-green-600">−{fmtPrice(r.subsidyAmt)}</span>
                </div>
              )}
              {govSubsidy && (
                <div className="flex justify-between py-2 border-t border-gray-200 mt-1">
                  <span className="text-sm font-bold text-gray-700">実質負担額</span>
                  <span className="text-sm font-bold text-blue-700">{fmtPrice(r.netTotal)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
          {r.comparisonMsg}
        </div>
      </div>

      {govSubsidy && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-800 mb-1">💡 葬祭費補助金の申請を忘れずに</p>
          <p className="text-xs text-green-700">国民健康保険・健康保険から葬祭費（約5万円）が支給されます。死亡から2年以内に市区町村役場または健保組合へ申請してください。</p>
        </div>
      )}

      <div className="mb-6">
        <button onClick={() => setShowDirectComparison(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
          <span>⚖️ 直葬にした場合の節約額を見る</span>
          <span>{showDirectComparison ? "▲" : "▼"}</span>
        </button>
        {showDirectComparison && (
          <div className="border border-gray-200 border-t-0 rounded-b-xl p-4 text-sm text-gray-700">
            <p>直葬（火葬式）の目安費用: <strong>{fmtPrice(Math.round(r.choksoBase))}</strong></p>
            <p className="mt-1">現在の設定との差額（節約できる金額）: <strong className="text-green-600">約{fmtPrice(Math.round(Math.max(0, r.savingsVsChokso)))}</strong></p>
            <p className="text-xs text-gray-500 mt-2">直葬は通夜・告別式を行わず、火葬のみを行う形式です。費用は最も安く抑えられますが、お別れの場が少ない点に注意が必要です。</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ 複数の葬儀社に見積もりを取ることをお勧めします</p>
        <p className="text-xs text-amber-700">葬儀費用は葬儀社によって大きく異なります。急いでいる状況でも、事前相談や2〜3社への見積もり比較が適正価格を知る近道です。</p>
      </div>

      <p className="text-xs text-gray-400 mb-8">
        ※ 本ツールは目安計算です。実際の費用は葬儀社・地域・サービス内容によって異なります。
      </p>

      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        山田ツール | yamada-tools.jp — 無料計算ツール集 | 葬儀費用見積もり
      </div>
    </div>
  );
}
