"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

const MAN = 10000;

type LandUse = "小規模住宅用地（200㎡以下）" | "一般住宅用地（200㎡超）" | "非住宅用地";
type BuildingType =
  | "住宅（新築・一般）"
  | "住宅（新築・長期優良住宅）"
  | "住宅（中古）"
  | "非住宅（事務所・店舗等）";
type YearsElapsed = "1" | "2" | "3" | "4" | "5" | "6以降";

interface LandInputs {
  enabled: boolean;
  evaluationMan: number;
  landUse: LandUse;
  areaSqm: number;
  inCityPlan: boolean;
}

interface BuildingInputs {
  enabled: boolean;
  evaluationMan: number;
  buildingType: BuildingType;
  yearsElapsed: YearsElapsed;
  isFireResistant: boolean;
  inCityPlan: boolean;
}

interface SimRow {
  year: number;
  propertyTaxBuilding: number;
  propertyTaxLand: number;
  cityPlanTaxBuilding: number;
  cityPlanTaxLand: number;
  total: number;
}

interface TaxResult {
  landEnabled: boolean;
  landEvaluation: number;
  landUse: LandUse;
  landTaxableBase: number;
  landPropertyTax: number;
  landExempt: boolean;
  landInCityPlan: boolean;
  landCityPlanTaxableBase: number;
  landCityPlanTax: number;
  buildingEnabled: boolean;
  buildingEvaluation: number;
  buildingType: BuildingType;
  buildingTaxableBase: number;
  buildingPropertyTax: number;
  buildingPropertyTaxFull: number;
  buildingReductionYears: number;
  buildingYearsElapsed: number;
  buildingInReduction: boolean;
  buildingExempt: boolean;
  buildingInCityPlan: boolean;
  buildingCityPlanTax: number;
  totalPropertyTax: number;
  totalCityPlanTax: number;
  grandTotal: number;
  monthlyTotal: number;
  simRows: SimRow[];
  isNewConstruction: boolean;
}

function getReductionYears(type: BuildingType, isFireResistant: boolean): number {
  if (type === "住宅（新築・長期優良住宅）") return isFireResistant ? 7 : 5;
  if (type === "住宅（新築・一般）") return isFireResistant ? 5 : 3;
  return 0;
}

function calcTax(land: LandInputs, building: BuildingInputs): TaxResult {
  let landTaxableBase = 0;
  let landPropertyTax = 0;
  let landExempt = false;
  let landCityPlanTaxableBase = 0;
  let landCityPlanTax = 0;
  const landEvalYen = land.enabled ? land.evaluationMan * MAN : 0;

  if (land.enabled) {
    if (land.landUse === "小規模住宅用地（200㎡以下）") {
      landTaxableBase = landEvalYen / 6;
    } else if (land.landUse === "一般住宅用地（200㎡超）") {
      landTaxableBase = landEvalYen / 3;
    } else {
      landTaxableBase = landEvalYen;
    }
    if (landTaxableBase < 300_000) {
      landExempt = true;
      landPropertyTax = 0;
    } else {
      landPropertyTax = Math.round(landTaxableBase * 0.014);
    }
    if (land.inCityPlan) {
      if (land.landUse === "小規模住宅用地（200㎡以下）") {
        landCityPlanTaxableBase = landEvalYen / 3;
      } else if (land.landUse === "一般住宅用地（200㎡超）") {
        landCityPlanTaxableBase = (landEvalYen * 2) / 3;
      } else {
        landCityPlanTaxableBase = landEvalYen;
      }
      landCityPlanTax = Math.round(landCityPlanTaxableBase * 0.003);
    }
  }

  let buildingTaxableBase = 0;
  let buildingPropertyTaxFull = 0;
  let buildingPropertyTax = 0;
  let buildingReductionYears = 0;
  let buildingYearsElapsed = 0;
  let buildingInReduction = false;
  let buildingExempt = false;
  let buildingCityPlanTax = 0;
  const buildingEvalYen = building.enabled ? building.evaluationMan * MAN : 0;
  const isNewConstruction =
    building.enabled &&
    (building.buildingType === "住宅（新築・一般）" ||
      building.buildingType === "住宅（新築・長期優良住宅）");

  if (building.enabled) {
    buildingTaxableBase = buildingEvalYen;
    if (buildingEvalYen < 200_000) {
      buildingExempt = true;
      buildingPropertyTax = 0;
      buildingPropertyTaxFull = 0;
    } else {
      buildingPropertyTaxFull = Math.round(buildingTaxableBase * 0.014);
      if (isNewConstruction) {
        buildingReductionYears = getReductionYears(building.buildingType, building.isFireResistant);
        buildingYearsElapsed = building.yearsElapsed === "6以降" ? 6 : Number(building.yearsElapsed);
        buildingInReduction = buildingYearsElapsed <= buildingReductionYears;
        buildingPropertyTax = buildingInReduction
          ? Math.round(buildingPropertyTaxFull / 2)
          : buildingPropertyTaxFull;
      } else {
        buildingPropertyTax = buildingPropertyTaxFull;
      }
    }
    if (building.inCityPlan) {
      buildingCityPlanTax = Math.round(buildingEvalYen * 0.003);
    }
  }

  const totalPropertyTax = landPropertyTax + buildingPropertyTax;
  const totalCityPlanTax = landCityPlanTax + buildingCityPlanTax;
  const grandTotal = totalPropertyTax + totalCityPlanTax;
  const monthlyTotal = Math.round(grandTotal / 12);

  const simRows: SimRow[] = [];
  if (isNewConstruction && buildingReductionYears > 0) {
    const showYears = buildingReductionYears + 2;
    for (let y = 1; y <= showYears; y++) {
      const inRed = y <= buildingReductionYears;
      const bldTax = buildingExempt ? 0 : inRed ? Math.round(buildingPropertyTaxFull / 2) : buildingPropertyTaxFull;
      simRows.push({
        year: y,
        propertyTaxBuilding: bldTax,
        propertyTaxLand: landPropertyTax,
        cityPlanTaxBuilding: buildingCityPlanTax,
        cityPlanTaxLand: landCityPlanTax,
        total: landPropertyTax + bldTax + landCityPlanTax + buildingCityPlanTax,
      });
    }
  }

  return {
    landEnabled: land.enabled, landEvaluation: landEvalYen, landUse: land.landUse,
    landTaxableBase, landPropertyTax, landExempt, landInCityPlan: land.inCityPlan,
    landCityPlanTaxableBase, landCityPlanTax,
    buildingEnabled: building.enabled, buildingEvaluation: buildingEvalYen,
    buildingType: building.buildingType, buildingTaxableBase, buildingPropertyTax,
    buildingPropertyTaxFull, buildingReductionYears, buildingYearsElapsed,
    buildingInReduction, buildingExempt, buildingInCityPlan: building.inCityPlan,
    buildingCityPlanTax, totalPropertyTax, totalCityPlanTax, grandTotal,
    monthlyTotal, simRows, isNewConstruction,
  };
}

function fmtYen(yen: number): string {
  return yen.toLocaleString() + "円";
}

function fmtMan(yen: number): string {
  const man = Math.round(yen / MAN);
  if (man === 0) return "0万円";
  return man.toLocaleString() + "万円";
}

const yearsOptions: YearsElapsed[] = ["1", "2", "3", "4", "5", "6以降"];

export default function PropertyTaxCalculatorPage() {
  const [landEnabled, setLandEnabled] = useState(true);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [landEval, setLandEval] = useState(800);
  const [landUse, setLandUse] = useState<LandUse>("小規模住宅用地（200㎡以下）");
  const [areaSqm, setAreaSqm] = useState(120);
  const [landInCityPlan, setLandInCityPlan] = useState(true);
  const [buildingEnabled, setBuildingEnabled] = useState(true);
  const [buildingEval, setBuildingEval] = useState(1200);
  const [buildingType, setBuildingType] = useState<BuildingType>("住宅（新築・一般）");
  const [yearsElapsed, setYearsElapsed] = useState<YearsElapsed>("1");
  const [isFireResistant, setIsFireResistant] = useState(false);
  const [buildingInCityPlan, setBuildingInCityPlan] = useState(true);
  const [result, setResult] = useState<TaxResult | null>(null);

  const isNewBuilding =
    buildingType === "住宅（新築・一般）" || buildingType === "住宅（新築・長期優良住宅）";

  const handleCalc = () => {
    const land: LandInputs = {
      enabled: landEnabled, evaluationMan: landEval, landUse, areaSqm, inCityPlan: landInCityPlan,
    };
    const building: BuildingInputs = {
      enabled: buildingEnabled, evaluationMan: buildingEval, buildingType,
      yearsElapsed, isFireResistant, inCityPlan: buildingInCityPlan,
    };
    setResult(calcTax(land, building));
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const ToggleBtn = ({
    value, onChange, trueLabel = "はい", falseLabel = "いいえ", color = "blue",
  }: {
    value: boolean; onChange: (v: boolean) => void;
    trueLabel?: string; falseLabel?: string; color?: string;
  }) => {
    const activeClass = color === "green"
      ? "bg-green-600 text-white border-green-600"
      : "bg-blue-600 text-white border-blue-600";
    const inactiveClass = "bg-white text-gray-600 border-gray-300 hover:border-blue-400";
    return (
      <div className="flex gap-2 mt-1">
        <button type="button"
          className={`flex-1 min-w-0 py-2 rounded-lg text-sm font-medium border transition-colors ${value ? activeClass : inactiveClass}`}
          onClick={() => onChange(true)}>{trueLabel}</button>
        <button type="button"
          className={`flex-1 min-w-0 py-2 rounded-lg text-sm font-medium border transition-colors ${!value ? activeClass : inactiveClass}`}
          onClick={() => onChange(false)}>{falseLabel}</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="mb-6">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/realestate" className="hover:text-blue-600">不動産・住まい</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-600">固定資産税 計算機</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">固定資産税 計算機</h1>
          <p className="text-gray-600 text-sm md:text-base">
            固定資産税・都市計画税を軽減措置込みで自動計算。住宅用地特例・新築1/2軽減に対応。
            <span className="inline-block ml-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded">2026年最新対応</span>
          </p>
        </div>

        <AdUnit position="mid" format="horizontal" className="mb-6" />

        {/* Section 1: 土地 */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-amber-700 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              土地の情報
            </h2>
            <div className="flex gap-2 flex-shrink-0">
              <button type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${landEnabled ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setLandEnabled(true)}>所有する</button>
              <button type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${!landEnabled ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setLandEnabled(false)}>所有しない</button>
            </div>
          </div>
          {landEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>土地の固定資産税評価額（万円）</label>
                <input type="number" className={inputClass} value={landEval} min={1}
                  onChange={(e) => setLandEval(Number(e.target.value))} />
                <p className="text-xs text-gray-400 mt-1">毎年届く課税明細書または役所で確認できます（公示地価の約70%が目安）</p>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>土地の用途</label>
                <select className={selectClass} value={landUse} onChange={(e) => setLandUse(e.target.value as LandUse)}>
                  <option>小規模住宅用地（200㎡以下）</option>
                  <option>一般住宅用地（200㎡超）</option>
                  <option>非住宅用地</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">住宅用地は大幅軽減あり（小規模：1/6、一般：1/3）</p>
              </div>
              {landUse !== "非住宅用地" && (
                <div>
                  <label className={labelClass}>土地面積（㎡）</label>
                  <input type="number" className={inputClass} value={areaSqm} min={1}
                    onChange={(e) => setAreaSqm(Number(e.target.value))} />
                  <p className="text-xs text-gray-400 mt-1">200㎡が小規模/一般の境界</p>
                </div>
              )}
              <div>
                <label className={labelClass}>都市計画区域内ですか？</label>
                <p className="text-xs text-gray-400 mb-1">区域内なら都市計画税（最大0.3%）が加算されます</p>
                <ToggleBtn value={landInCityPlan} onChange={setLandInCityPlan} />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: 建物 */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              建物の情報
            </h2>
            <div className="flex gap-2 flex-shrink-0">
              <button type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${buildingEnabled ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setBuildingEnabled(true)}>所有する</button>
              <button type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${!buildingEnabled ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setBuildingEnabled(false)}>所有しない</button>
            </div>
          </div>
          {buildingEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>建物の固定資産税評価額（万円）</label>
                <input type="number" className={inputClass} value={buildingEval} min={1}
                  onChange={(e) => setBuildingEval(Number(e.target.value))} />
                <p className="text-xs text-gray-400 mt-1">新築の場合は建築費の約50〜60%が目安。課税明細書で確認できます</p>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>建物の種別</label>
                <select className={selectClass} value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value as BuildingType)}>
                  <option>住宅（新築・一般）</option>
                  <option>住宅（新築・長期優良住宅）</option>
                  <option>住宅（中古）</option>
                  <option>非住宅（事務所・店舗等）</option>
                </select>
              </div>
              {isNewBuilding && (
                <>
                  <div>
                    <label className={labelClass}>新築からの経過年数</label>
                    <select className={selectClass} value={yearsElapsed}
                      onChange={(e) => setYearsElapsed(e.target.value as YearsElapsed)}>
                      {yearsOptions.map((y) => (
                        <option key={y} value={y}>{y === "6以降" ? "6年目以降" : `${y}年目`}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>3階建て以上の耐火・準耐火構造ですか？</label>
                    <p className="text-xs text-gray-400 mb-1">該当すると軽減期間が延長されます（3年→5年 / 5年→7年）</p>
                    <ToggleBtn value={isFireResistant} onChange={setIsFireResistant} color="green" />
                  </div>
                </>
              )}
              <div className={isNewBuilding ? "sm:col-span-2" : ""}>
                <label className={labelClass}>都市計画区域内ですか？</label>
                <p className="text-xs text-gray-400 mb-1">区域内なら都市計画税（評価額×0.3%）が加算されます</p>
                <ToggleBtn value={buildingInCityPlan} onChange={setBuildingInCityPlan} />
              </div>
            </div>
          )}
        </div>

        <button type="button" onClick={handleCalc}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl text-lg shadow-md transition-all mb-8">
          固定資産税・都市計画税を計算する
        </button>

        {result && (
          <div id="result-section" className="space-y-5">

            {/* 年間・月額合計 BIG */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-amber-200 p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700 mb-1">年間 固定資産税＋都市計画税</h2>
              <p className="text-4xl font-bold text-orange-600 mb-1">{fmtYen(result.grandTotal)}</p>
              <p className="text-sm text-gray-500">月額換算：約{fmtYen(result.monthlyTotal)}/月</p>
              {result.grandTotal === 0 && (
                <div className="mt-3 bg-green-100 text-green-700 rounded-lg px-4 py-2 text-sm font-medium">免税点以下のため非課税です</div>
              )}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-xl p-3 border border-amber-100">
                  <p className="text-xs text-gray-500 mb-1">固定資産税合計</p>
                  <p className="text-lg font-bold text-gray-700">{fmtYen(result.totalPropertyTax)}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">都市計画税合計</p>
                  <p className="text-lg font-bold text-gray-700">
                    {result.landInCityPlan || result.buildingInCityPlan ? fmtYen(result.totalCityPlanTax) : "対象外"}
                  </p>
                </div>
              </div>
            </div>

            {/* 固定資産税内訳 */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
              <h3 className="font-bold text-amber-700 mb-3">固定資産税の内訳（税率 1.4%）</h3>
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-400 mb-2">
                <div className="col-span-2">項目</div>
                <div className="text-right">課税標準額</div>
                <div className="text-right">税額</div>
              </div>
              {result.landEnabled && (
                <div className="grid grid-cols-4 gap-2 py-2 border-b border-gray-100 text-sm">
                  <div className="col-span-2">
                    <span className="text-gray-700">土地（{result.landUse}）</span>
                    {result.landUse === "小規模住宅用地（200㎡以下）" && <p className="text-xs text-gray-400">評価額×1/6の特例適用</p>}
                    {result.landUse === "一般住宅用地（200㎡超）" && <p className="text-xs text-gray-400">評価額×1/3の特例適用</p>}
                  </div>
                  <div className="text-right text-gray-500 text-xs flex items-center justify-end">
                    {result.landExempt ? "免税点以下" : fmtMan(result.landTaxableBase)}
                  </div>
                  <div className="text-right font-semibold text-gray-800 flex items-center justify-end">
                    {result.landExempt ? "非課税" : fmtYen(result.landPropertyTax)}
                  </div>
                </div>
              )}
              {result.buildingEnabled && (
                <div className="grid grid-cols-4 gap-2 py-2 border-b border-gray-100 text-sm">
                  <div className="col-span-2">
                    <span className="text-gray-700">建物（{result.buildingType}）</span>
                    {result.buildingInReduction && (
                      <p className="text-xs text-green-600">新築軽減（1/2）適用中〜{result.buildingReductionYears}年目まで</p>
                    )}
                  </div>
                  <div className="text-right text-gray-500 text-xs flex items-center justify-end">
                    {result.buildingExempt ? "免税点以下" : fmtMan(result.buildingTaxableBase)}
                  </div>
                  <div className={`text-right font-semibold flex items-center justify-end ${result.buildingInReduction ? "text-green-600" : "text-gray-800"}`}>
                    {result.buildingExempt ? "非課税" : fmtYen(result.buildingPropertyTax)}
                    {result.buildingInReduction && !result.buildingExempt && (
                      <span className="text-xs text-gray-400 ml-1">(1.4%×1/2)</span>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 pt-2 mt-1 border-t border-gray-200 text-sm font-bold">
                <div className="col-span-3 text-gray-700">固定資産税合計</div>
                <div className="text-right text-orange-600">{fmtYen(result.totalPropertyTax)}</div>
              </div>
            </div>

            {/* 都市計画税内訳 */}
            {(result.landInCityPlan || result.buildingInCityPlan) && (
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                <h3 className="font-bold text-blue-700 mb-3">都市計画税の内訳（税率 0.3%）</h3>
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-400 mb-2">
                  <div className="col-span-2">項目</div>
                  <div className="text-right">課税標準額</div>
                  <div className="text-right">税額</div>
                </div>
                {result.landEnabled && result.landInCityPlan && (
                  <div className="grid grid-cols-4 gap-2 py-2 border-b border-gray-100 text-sm">
                    <div className="col-span-2">
                      <span className="text-gray-700">土地（{result.landUse}）</span>
                      {result.landUse === "小規模住宅用地（200㎡以下）" && <p className="text-xs text-gray-400">評価額×1/3の特例適用</p>}
                      {result.landUse === "一般住宅用地（200㎡超）" && <p className="text-xs text-gray-400">評価額×2/3の特例適用</p>}
                    </div>
                    <div className="text-right text-gray-500 text-xs flex items-center justify-end">{fmtMan(result.landCityPlanTaxableBase)}</div>
                    <div className="text-right font-semibold text-gray-800 flex items-center justify-end">{fmtYen(result.landCityPlanTax)}</div>
                  </div>
                )}
                {result.buildingEnabled && result.buildingInCityPlan && (
                  <div className="grid grid-cols-4 gap-2 py-2 border-b border-gray-100 text-sm">
                    <div className="col-span-2">
                      <span className="text-gray-700">建物（{result.buildingType}）</span>
                      <p className="text-xs text-gray-400">建物は都市計画税の軽減なし</p>
                    </div>
                    <div className="text-right text-gray-500 text-xs flex items-center justify-end">{fmtMan(result.buildingEvaluation)}</div>
                    <div className="text-right font-semibold text-gray-800 flex items-center justify-end">{fmtYen(result.buildingCityPlanTax)}</div>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-2 pt-2 mt-1 border-t border-gray-200 text-sm font-bold">
                  <div className="col-span-3 text-gray-700">都市計画税合計</div>
                  <div className="text-right text-blue-600">{fmtYen(result.totalCityPlanTax)}</div>
                </div>
              </div>
            )}

            {/* 特例適用チェックリスト */}
            <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <span>✅</span> 住宅用地特例・軽減措置の適用状況
              </h3>
              <div className="space-y-2">
                {result.landEnabled && (() => {
                  const isSmall = result.landUse === "小規模住宅用地（200㎡以下）";
                  const isGeneral = result.landUse === "一般住宅用地（200㎡超）";
                  const applied = isSmall || isGeneral;
                  const label = isSmall ? "小規模住宅用地特例（1/6）" : isGeneral ? "一般住宅用地特例（1/3）" : "住宅用地特例";
                  const sub = isSmall ? "固定資産税の課税標準額が評価額の1/6に軽減" : isGeneral ? "固定資産税の課税標準額が評価額の1/3に軽減" : "非住宅用地のため特例なし";
                  return (
                    <div className="flex items-start gap-2 bg-white rounded-xl px-4 py-3 border border-green-100">
                      <span className="text-base flex-shrink-0 mt-0.5">{applied ? "✅" : "❌"}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                      </div>
                      <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${applied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {applied ? "適用済み" : "非対象"}
                      </span>
                    </div>
                  );
                })()}
                {result.landEnabled && result.landExempt && (
                  <div className="flex items-start gap-2 bg-white rounded-xl px-4 py-3 border border-green-100">
                    <span className="text-base flex-shrink-0 mt-0.5">✅</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700">土地免税点（課税標準額30万円未満）</span>
                      <p className="text-xs text-gray-400 mt-0.5">免税点以下のため土地の固定資産税は非課税</p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">非課税</span>
                  </div>
                )}
                {result.buildingEnabled && result.isNewConstruction && (
                  <div className="flex items-start gap-2 bg-white rounded-xl px-4 py-3 border border-green-100">
                    <span className="text-base flex-shrink-0 mt-0.5">{result.buildingInReduction ? "✅" : "❌"}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700">
                        新築住宅軽減（税額1/2）〜{result.buildingReductionYears}年目まで
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {result.buildingInReduction
                          ? `現在${result.buildingYearsElapsed}年目 — 軽減期間中`
                          : `現在${result.buildingYearsElapsed}年目 — 軽減期間終了`}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${result.buildingInReduction ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {result.buildingInReduction ? "適用中" : "終了"}
                    </span>
                  </div>
                )}
                {result.buildingEnabled && result.buildingExempt && (
                  <div className="flex items-start gap-2 bg-white rounded-xl px-4 py-3 border border-green-100">
                    <span className="text-base flex-shrink-0 mt-0.5">✅</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700">建物免税点（評価額20万円未満）</span>
                      <p className="text-xs text-gray-400 mt-0.5">免税点以下のため建物の固定資産税は非課税</p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">非課税</span>
                  </div>
                )}
              </div>
            </div>

            {/* 軽減期間シミュレーション */}
            {result.simRows.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
                <h3 className="font-bold text-amber-700 mb-1">軽減期間シミュレーション</h3>
                <p className="text-xs text-gray-400 mb-3">新築住宅軽減（1/2）が終了すると建物の固定資産税が倍増します</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs text-gray-500">
                        <th className="pb-2 text-left">年目</th>
                        <th className="pb-2 text-right">固定資産税</th>
                        <th className="pb-2 text-right">都市計画税</th>
                        <th className="pb-2 text-right font-bold text-gray-700">年間合計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.simRows.map((row) => {
                        const inRed = row.year <= result.buildingReductionYears;
                        return (
                          <tr key={row.year} className={`border-b border-gray-50 ${inRed ? "bg-green-50" : ""}`}>
                            <td className="py-2">
                              <span className={`font-medium ${inRed ? "text-green-700" : "text-gray-700"}`}>{row.year}年目</span>
                              {inRed && <span className="ml-1 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">軽減中</span>}
                              {!inRed && row.year === result.buildingReductionYears + 1 && (
                                <span className="ml-1 text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded">軽減終了</span>
                              )}
                            </td>
                            <td className="py-2 text-right text-gray-600">
                              {fmtYen(row.propertyTaxLand + row.propertyTaxBuilding)}
                            </td>
                            <td className="py-2 text-right text-gray-600">
                              {row.cityPlanTaxLand + row.cityPlanTaxBuilding > 0
                                ? fmtYen(row.cityPlanTaxLand + row.cityPlanTaxBuilding) : "—"}
                            </td>
                            <td className={`py-2 text-right font-bold ${inRed ? "text-green-600" : "text-orange-600"}`}>
                              {fmtYen(row.total)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-xs text-blue-700 space-y-1">
              <p>※ 固定資産税の標準税率1.4%、都市計画税の上限0.3%を使用しています。実際の税率は市区町村によって異なる場合があります。</p>
              <p>※ 固定資産税評価額は3年ごとに見直されます（次回評価替えは2027年予定）。</p>
              <p>※ 本ツールはあくまでも目安です。実際の税額は市区町村の課税明細書をご確認ください。</p>
            </div>
          </div>
        )}

        {/* SEO CONTENT */}
        <section className="mt-12 space-y-8 text-sm text-gray-700">

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">固定資産税の目安早見表</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-50 border border-amber-100">
                    <th className="p-3 text-left font-medium text-gray-700 border border-amber-100">物件種別</th>
                    <th className="p-3 text-left font-medium text-gray-700 border border-amber-100">固定資産税評価額（目安）</th>
                    <th className="p-3 text-left font-medium text-gray-700 border border-amber-100">年間固定資産税目安</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["新築マンション（70㎡）", "土地500万＋建物1,000万", "約7〜12万円/年"],
                    ["中古マンション（70㎡）", "土地500万＋建物500万", "約10〜15万円/年"],
                    ["新築一戸建て（100㎡）", "土地800万＋建物1,200万", "約10〜18万円/年"],
                    ["中古一戸建て（100㎡）", "土地800万＋建物600万", "約15〜22万円/年"],
                  ].map(([type, ev, tax], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 border border-gray-100">{type}</td>
                      <td className="p-3 border border-gray-100 text-gray-600">{ev}</td>
                      <td className="p-3 border border-gray-100 font-medium text-orange-600">{tax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">固定資産税の基礎知識</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <p className="leading-relaxed">
                固定資産税は毎年1月1日時点で土地・建物を所有している人に課税される地方税です（市区町村が徴収）。
              </p>
              <div className="bg-amber-50 rounded-lg p-3 text-sm">
                <p className="font-medium text-amber-800 mb-1">固定資産税の計算式</p>
                <p className="text-amber-700">固定資産税 ＝ 固定資産税評価額 × 1.4%</p>
                <p className="text-amber-600 text-xs mt-1">※ 住宅用地や新築住宅には特例で大幅軽減あり</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">住宅用地の特例（最重要）</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>・<span className="font-medium text-gray-800">小規模住宅用地（200㎡以下の部分）</span>：評価額の1/6で計算</li>
                  <li>・<span className="font-medium text-gray-800">一般住宅用地（200㎡超の部分）</span>：評価額の1/3で計算</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">新築住宅の軽減</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>・一般住宅：最初の3年間（耐火・準耐火は5年間）、建物の税額が1/2</li>
                  <li>・長期優良住宅：最初の5年間（耐火・準耐火は7年間）、建物の税額が1/2</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">固定資産税評価額の見直し</h3>
                <p className="text-gray-600 leading-relaxed">
                  固定資産税評価額は3年ごとに見直されます（評価替え）。次回は2027年（令和9年）の予定です。地価上昇エリアでは増額される可能性があります。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">都市計画税とは</h3>
                <p className="text-gray-600 leading-relaxed">
                  都市計画区域内の土地・建物にかかる税金で、道路・公園・上下水道など都市インフラ整備の財源です。税率は最大0.3%（自治体により異なる）。
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">よくある質問</h2>
            <div className="space-y-3">
              {[
                {
                  q: "固定資産税はいつ払うのですか？",
                  a: "毎年4〜6月頃に市区町村から納税通知書が届きます。年4回（4月・7月・12月・翌2月）に分けて納付するか、一括払いを選べます。マンションなどで管理組合が支払うケースを除き、所有者が直接納付します。",
                },
                {
                  q: "固定資産税評価額と購入価格はどう違いますか？",
                  a: "固定資産税評価額は購入価格とは別に市区町村が決定する価格です。一般的に土地は公示地価の約70%、建物は建築費の50〜60%が目安です。実際の評価額は毎年4〜6月に届く「課税明細書」で確認できます。",
                },
                {
                  q: "マンションの固定資産税は一戸建てより安いですか？",
                  a: "一般的に同じ規模であればマンションの方が固定資産税は安くなる傾向があります。マンションは土地を区分所有するため、一人当たりの土地面積が小さく、小規模住宅用地特例（1/6軽減）がフルに適用されやすいためです。",
                },
                {
                  q: "固定資産税はずっと同じ金額ですか？",
                  a: "いいえ、3年ごとの評価替えで変わります。特に地価が上昇しているエリアでは増額される場合があります。新築住宅の軽減期間終了後は税額が倍増することも覚えておきましょう。次回の評価替えは2027年の予定です。",
                },
                {
                  q: "空き家にも固定資産税はかかりますか？",
                  a: "はい、空き家であっても所有している限り固定資産税はかかります。ただし2015年の「空き家対策特別措置法」により、「特定空き家」に指定されると住宅用地特例が外れ、固定資産税が最大6倍になる場合があります。空き家の管理・活用・売却を検討することが重要です。",
                },
              ].map((item, i) => (
                <details key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <summary className="p-4 cursor-pointer font-medium text-gray-800 flex justify-between items-center hover:bg-gray-50">
                    <span>Q. {item.q}</span>
                    <span className="text-gray-400 text-xs ml-2 flex-shrink-0">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">あわせて使えるツール</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/realestate/rent-vs-buy", label: "家賃 vs 購入 比較計算機", desc: "賃貸と購入どちらがお得かを計算" },
                { href: "/realestate/acquisition-tax", label: "不動産取得税 計算機", desc: "購入時にかかる取得税を軽減措置込みで計算" },
                { href: "/finance/jutaku-loan", label: "住宅ローン計算機 Pro", desc: "月返済額・総返済額・繰り上げ返済を計算" },
                { href: "/tax/inheritance-tax-calculator", label: "相続税 簡易計算機", desc: "不動産相続時の相続税目安を計算" },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href}
                  className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all group">
                  <span className="text-blue-500 text-lg flex-shrink-0">🔗</span>
                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-blue-600 text-sm">{tool.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-xs text-gray-400 leading-relaxed">
            <p className="font-medium text-gray-500 mb-1">免責事項</p>
            本ツールは一般的な計算式に基づく概算値を提供するものです。実際の固定資産税・都市計画税は市区町村が発行する課税明細書をご確認ください。税率・特例制度は変更される場合があります。正確な税額については税理士または各市区町村の税務窓口にご相談ください。
          </div>

        </section>
      </div>
    </div>
  );
}
