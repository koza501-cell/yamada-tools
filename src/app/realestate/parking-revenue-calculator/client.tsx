
"use client";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import { useState } from "react";

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP") + "円"; }
function fmtR(n: number) { return isFinite(n) && n > 0 ? n.toFixed(1) + "年" : "—"; }

export default function ParkingClient() {
  const tool = getToolById("parking-revenue-calculator");

  const [area, setArea] = useState("250");
  const [spaces, setSpaces] = useState("10");
  const [region, setRegion] = useState("郊外");

  const [mRent, setMRent] = useState("15000");
  const [mOcc, setMOcc] = useState("85");
  const [mMgmt, setMMgmt] = useState("5000");
  const [mTax, setMTax] = useState("120000");

  const [cFirst30, setCFirst30] = useState("300");
  const [cPer30, setCPer30] = useState("200");
  const [cUtil, setCUtil] = useState("40");
  const [cMgmt, setCMgmt] = useState("30000");
  const [cEquip, setCEquip] = useState("1500000");

  const [paving, setPaving] = useState("500000");
  const [otherInit, setOtherInit] = useState("0");

  const [occSlider, setOccSlider] = useState(85);

  const sp = Math.max(1, parseInt(spaces) || 10);
  const sliderOcc = occSlider / 100;

  const mRevenue = sp * (parseInt(mRent) || 0) * (parseInt(mOcc) / 100) * sliderOcc / ((parseInt(mOcc) || 85) / 100);
  const mMonthlyRevenue = sp * (parseInt(mRent) || 0) * sliderOcc;
  const mExpenses = (parseInt(mMgmt) || 0) + (parseInt(mTax) || 0) / 12;
  const mProfit = mMonthlyRevenue - mExpenses;
  const mYearlyProfit = mProfit * 12;
  const mInitial = (parseInt(paving) || 0) + (parseInt(otherInit) || 0);
  const mPayback = mYearlyProfit > 0 ? mInitial / mYearlyProfit : Infinity;
  const mYield = mInitial > 0 ? (mYearlyProfit / mInitial * 100) : 0;

  const cHours = 24;
  const cSlotsPerHour = 2;
  const cRatePerSlot = (parseInt(cPer30) || 0);
  const cDailyPerSpace = cHours * cSlotsPerHour * cRatePerSlot * sliderOcc;
  const cMonthlyRevenue = cDailyPerSpace * 30 * sp;
  const cExpenses = (parseInt(cMgmt) || 0);
  const cProfit = cMonthlyRevenue - cExpenses;
  const cYearlyProfit = cProfit * 12;
  const cInitial = (parseInt(paving) || 0) + (parseInt(otherInit) || 0) + (parseInt(cEquip) || 0);
  const cPayback = cYearlyProfit > 0 ? cInitial / cYearlyProfit : Infinity;
  const cYield = cInitial > 0 ? (cYearlyProfit / cInitial * 100) : 0;

  const mBetter = mProfit >= cProfit;

  const ic = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const lc = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">駐車場収益計算機</h1>
      <p className="text-sm text-gray-500 mb-6">月極・コインパーキングの収益・投資回収期間を比較シミュレーション</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-5">
        <p className="text-sm font-semibold text-gray-700">基本情報</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={lc}>土地面積（㎡）</label>
            <input type="number" className={ic} value={area} onChange={e => { setArea(e.target.value); setSpaces(String(Math.floor((parseInt(e.target.value)||250)/25))); }} />
          </div>
          <div>
            <label className={lc}>駐車台数</label>
            <input type="number" min="1" className={ic} value={spaces} onChange={e => setSpaces(e.target.value)} />
          </div>
          <div>
            <label className={lc}>地域</label>
            <select className={ic} value={region} onChange={e => setRegion(e.target.value)}>
              {["都心部", "郊外", "地方"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={lc}>空き率シミュレーション（稼働率: {occSlider}%）</label>
          <input type="range" min={0} max={100} value={occSlider} onChange={e => setOccSlider(Number(e.target.value))} className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-kon">月極モード</p>
            <div><label className={lc}>月額賃料/台（円）</label><input type="number" className={ic} value={mRent} onChange={e => setMRent(e.target.value)} /></div>
            <div><label className={lc}>管理委託費/月（円）</label><input type="number" className={ic} value={mMgmt} onChange={e => setMMgmt(e.target.value)} /></div>
            <div><label className={lc}>固定資産税/年（円）</label><input type="number" className={ic} value={mTax} onChange={e => setMTax(e.target.value)} /></div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-kon">コインパーキングモード</p>
            <div><label className={lc}>最初の30分料金（円）</label><input type="number" className={ic} value={cFirst30} onChange={e => setCFirst30(e.target.value)} /></div>
            <div><label className={lc}>以降30分料金（円）</label><input type="number" className={ic} value={cPer30} onChange={e => setCPer30(e.target.value)} /></div>
            <div><label className={lc}>管理・機器リース/月（円）</label><input type="number" className={ic} value={cMgmt} onChange={e => setCMgmt(e.target.value)} /></div>
            <div><label className={lc}>精算機設置費（円）</label><input type="number" className={ic} value={cEquip} onChange={e => setCEquip(e.target.value)} /></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={lc}>舗装工事費（共通・円）</label><input type="number" className={ic} value={paving} onChange={e => setPaving(e.target.value)} /></div>
          <div><label className={lc}>その他初期費用（円）</label><input type="number" className={ic} value={otherInit} onChange={e => setOtherInit(e.target.value)} /></div>
        </div>
      </div>

      <div className={`text-center py-3 px-4 rounded-xl mb-4 text-sm font-semibold ${mBetter ? "bg-gray-50 text-kon" : "bg-gray-50 text-kon"}`}>
        {mBetter ? "月極の方が月次利益が高い" : "コインパーキングの方が月次利益が高い"}
        {" — 差額: " + fmt(Math.abs(mProfit - cProfit)) + "/月"}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { title: "月極", color: "blue", revenue: mMonthlyRevenue, expense: mExpenses, profit: mProfit, yearly: mYearlyProfit, initial: mInitial, payback: mPayback, yld: mYield, y10: mYearlyProfit * 10 - mInitial, y20: mYearlyProfit * 20 - mInitial },
          { title: "コインパーキング", color: "orange", revenue: cMonthlyRevenue, expense: cExpenses, profit: cProfit, yearly: cYearlyProfit, initial: cInitial, payback: cPayback, yld: cYield, y10: cYearlyProfit * 10 - cInitial, y20: cYearlyProfit * 20 - cInitial },
        ].map(c => (
          <div key={c.title} className={`bg-white border-2 rounded-xl overflow-hidden ${c.color === "blue" ? "border-kon" : "border-gray-200"}`}>
            <div className={`px-4 py-3 text-white font-bold ${c.color === "blue" ? "bg-kon" : "bg-kon"}`}>{c.title}</div>
            <div className="divide-y divide-gray-100 text-sm">
              {[
                ["月額収入", fmt(c.revenue)],
                ["月額経費", fmt(c.expense)],
                ["月額純利益", fmt(c.profit)],
                ["年間純利益", fmt(c.yearly)],
                ["初期投資", fmt(c.initial)],
                ["表面利回り", c.yld.toFixed(1) + "%"],
                ["投資回収期間", fmtR(c.payback)],
                ["10年累計利益", fmt(c.y10)],
                ["20年累計利益", fmt(c.y20)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-2">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm text-kon">
        <p className="font-medium mb-1">固定資産税について</p>
        <p>駐車場（更地）は住宅用地の特例（6分の1軽減）が適用されません。<a href="/realestate/property-tax-calculator" className="underline">固定資産税計算機</a>で正確な税額を確認してください。</p>
      </div>


      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
        <p className="text-gray-300 text-xs mt-1">透かしなし・高品質PDFはPROプランで → yamada-tools.jp/pricing</p>
      </div>
      {tool && <RelatedTools currentTool={tool} maxItems={4} />}
    </div>
  );
}
