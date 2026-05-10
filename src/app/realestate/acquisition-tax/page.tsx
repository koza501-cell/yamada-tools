"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

const MAN = 10000;

// ---- 中古住宅の築年数別控除額 ----
interface UsedHouseDeduction {
  label: string;
  amount: number; // 万円
  fromYear: number; // 建築年（西暦）以降
}

const USED_HOUSE_DEDUCTIONS: UsedHouseDeduction[] = [
  { label: "1997年（平成9年）4月以降", fromYear: 1997, amount: 1200 },
  { label: "1989年（平成元年）4月〜1997年3月", fromYear: 1989, amount: 1000 },
  { label: "1985年（昭和60年）7月〜1989年3月", fromYear: 1985, amount: 450 },
  { label: "1981年（昭和56年）7月〜1985年6月", fromYear: 1981, amount: 420 },
  { label: "1976年（昭和51年）1月〜1981年6月", fromYear: 1976, amount: 350 },
  { label: "1973年（昭和48年）1月〜1975年12月", fromYear: 1973, amount: 230 },
  { label: "1964年（昭和39年）1月〜1972年12月", fromYear: 1964, amount: 150 },
  { label: "1954年（昭和29年）7月〜1963年12月", fromYear: 1954, amount: 100 },
];

function getUsedHouseDeduction(buildYear: number): UsedHouseDeduction | null {
  for (const d of USED_HOUSE_DEDUCTIONS) {
    if (buildYear >= d.fromYear) return d;
  }
  return null;
}

// ---- Types ----
interface LandInputs {
  enabled: boolean;
  evaluationMan: number;
  isResidentialLand: boolean;
  isForNewHousing: boolean;
  houseFloorAreaSqm: number;
}

interface BuildingInputs {
  enabled: boolean;
  evaluationMan: number;
  buildingType: "住宅（自己居住用）" | "住宅（自己居住用以外）" | "非住宅（事務所・店舗等）";
  isNew: boolean;
  isLongTermExcellent: boolean;
  floorAreaSqm: number;
  buildYear: number;
  floorAreaUsedSqm: number;
  isSelfOccupied: boolean;
}

interface TaxResult {
  landEnabled: boolean;
  landEvaluation: number;
  landIsResidential: boolean;
  landIsForNewHousing: boolean;
  landTaxableBase: number;
  landTaxBeforeRelief: number;
  landReliefAmount: number;
  landTaxFinal: number;
  landExempt: boolean;

  buildingEnabled: boolean;
  buildingEvaluation: number;
  buildingType: string;
  buildingIsNew: boolean;
  buildingIsLongTermExcellent: boolean;
  buildingDeduction: number;
  buildingDeductionLabel: string;
  buildingTaxableBase: number;
  buildingTaxRate: number;
  buildingTaxFinal: number;
  buildingExempt: boolean;
  buildingFloorOk: boolean;
  buildingIsSelfOccupied: boolean;
  usedDeductionInfo: UsedHouseDeduction | null;

  totalBeforeRelief: number;
  totalAfterRelief: number;
  totalSaving: number;
}

function fmt(yen: number): string {
  const man = Math.round(yen / MAN);
  if (man === 0) return "0円";
  return man.toLocaleString() + "万円";
}

function fmtYen(yen: number): string {
  if (yen < MAN) return yen.toLocaleString() + "円";
  return Math.round(yen / MAN).toLocaleString() + "万円";
}

function calcTax(land: LandInputs, building: BuildingInputs): TaxResult {
  // ===== LAND =====
  let landTaxableBase = 0;
  let landTaxBeforeRelief = 0;
  let landReliefAmount = 0;
  let landTaxFinal = 0;
  let landExempt = false;

  if (land.enabled) {
    const landEvalYen = land.evaluationMan * MAN;
    landTaxableBase = land.isResidentialLand ? landEvalYen / 2 : landEvalYen;

    if (landTaxableBase < 100_000) {
      landExempt = true;
      landTaxFinal = 0;
      landTaxBeforeRelief = 0;
    } else {
      landTaxBeforeRelief = Math.round(landTaxableBase * 0.03);
      landTaxFinal = landTaxBeforeRelief;

      if (land.isForNewHousing && land.houseFloorAreaSqm > 0) {
        const reliefA = 45_000;
        const cappedFloor = Math.min(land.houseFloorAreaSqm * 2, 200);
        const reliefB = 0;
        landReliefAmount = Math.max(reliefA, reliefB);
        landTaxFinal = Math.max(0, landTaxBeforeRelief - landReliefAmount);
        void cappedFloor;
      }
    }
  }

  // ===== BUILDING =====
  let buildingTaxableBase = 0;
  let buildingDeduction = 0;
  let buildingDeductionLabel = "なし";
  let buildingTaxRate = 0.03;
  let buildingTaxFinal = 0;
  let buildingExempt = false;
  let buildingFloorOk = true;
  let usedDeductionInfo: UsedHouseDeduction | null = null;

  if (building.enabled) {
    const bldEvalYen = building.evaluationMan * MAN;

    if (building.buildingType === "非住宅（事務所・店舗等）") {
      buildingTaxRate = 0.04;
      buildingDeduction = 0;
      buildingDeductionLabel = "なし（非住宅）";
      buildingTaxableBase = bldEvalYen;
    } else if (building.buildingType === "住宅（自己居住用以外）") {
      buildingTaxRate = 0.03;
      buildingDeduction = 0;
      buildingDeductionLabel = "なし（自己居住用以外）";
      buildingTaxableBase = bldEvalYen;
    } else {
      buildingTaxRate = 0.03;

      if (building.isNew) {
        buildingFloorOk =
          building.floorAreaSqm >= 50 && building.floorAreaSqm <= 240;
        if (buildingFloorOk) {
          buildingDeduction = building.isLongTermExcellent ? 1300 : 1200;
          buildingDeductionLabel = building.isLongTermExcellent
            ? "1,300万円（長期優良住宅）"
            : "1,200万円（一般新築住宅）";
        } else {
          buildingDeductionLabel = "床面積要件外（50㎡以上240㎡以下が必要）";
        }
      } else {
        buildingFloorOk =
          building.floorAreaUsedSqm >= 50 && building.floorAreaUsedSqm <= 240;
        if (buildingFloorOk && building.isSelfOccupied) {
          usedDeductionInfo = getUsedHouseDeduction(building.buildYear);
          if (usedDeductionInfo) {
            buildingDeduction = usedDeductionInfo.amount;
            buildingDeductionLabel = `${usedDeductionInfo.amount.toLocaleString()}万円（${usedDeductionInfo.label}）`;
          } else {
            buildingDeductionLabel = "控除対象外（1954年以前の建物）";
          }
        } else if (!buildingFloorOk) {
          buildingDeductionLabel = "床面積要件外（50㎡以上240㎡以下が必要）";
        } else {
          buildingDeductionLabel = "なし（自己居住用のみ適用）";
        }
      }

      buildingTaxableBase = Math.max(0, bldEvalYen - buildingDeduction * MAN);
    }

    const exemptThreshold = building.isNew ? 230_000 : 120_000;
    if (bldEvalYen < exemptThreshold) {
      buildingExempt = true;
      buildingTaxFinal = 0;
    } else {
      buildingTaxFinal = Math.round(buildingTaxableBase * buildingTaxRate);
    }
  }

  const landEval = land.enabled ? land.evaluationMan * MAN : 0;
  const bldEval = building.enabled ? building.evaluationMan * MAN : 0;
  const landTaxableForCalc = land.enabled ? landTaxableBase : 0;
  const buildingBeforeRelief = building.enabled
    ? Math.round(
        building.buildingType === "非住宅（事務所・店舗等）"
          ? bldEval * 0.04
          : bldEval * 0.03
      )
    : 0;

  const totalBeforeRelief =
    (land.enabled ? Math.round(landTaxableForCalc * 0.03) : 0) + buildingBeforeRelief;
  const totalAfterRelief =
    (land.enabled ? landTaxFinal : 0) + (building.enabled ? buildingTaxFinal : 0);
  const totalSaving = totalBeforeRelief - totalAfterRelief;

  return {
    landEnabled: land.enabled,
    landEvaluation: landEval,
    landIsResidential: land.isResidentialLand,
    landIsForNewHousing: land.isForNewHousing,
    landTaxableBase,
    landTaxBeforeRelief,
    landReliefAmount,
    landTaxFinal,
    landExempt,

    buildingEnabled: building.enabled,
    buildingEvaluation: bldEval,
    buildingType: building.buildingType,
    buildingIsNew: building.isNew,
    buildingIsLongTermExcellent: building.isLongTermExcellent,
    buildingDeduction,
    buildingDeductionLabel,
    buildingTaxableBase,
    buildingTaxRate,
    buildingTaxFinal,
    buildingExempt,
    buildingFloorOk,
    buildingIsSelfOccupied: building.isSelfOccupied,
    usedDeductionInfo,

    totalBeforeRelief,
    totalAfterRelief,
    totalSaving,
  };
}

// Build year options
const buildYearOptions: number[] = [];
for (let y = 2025; y >= 1954; y--) buildYearOptions.push(y);

// ---- Checklist item type ----
interface CheckItem {
  label: string;
  applied: boolean;
  status: string;   // text shown in badge
  reason?: string;  // extra note when not applied
}

export default function AcquisitionTaxPage() {
  // Land
  const [landEnabled, setLandEnabled] = useState(true);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [landEval, setLandEval] = useState(1500);
  const [isResidentialLand, setIsResidentialLand] = useState(true);
  const [isForNewHousing, setIsForNewHousing] = useState(false);
  const [houseFloorArea, setHouseFloorArea] = useState(100);

  // Building
  const [buildingEnabled, setBuildingEnabled] = useState(true);
  const [buildingEval, setBuildingEval] = useState(1200);
  const [buildingType, setBuildingType] = useState<BuildingInputs["buildingType"]>(
    "住宅（自己居住用）"
  );
  const [isNew, setIsNew] = useState(true);
  const [isLongTermExcellent, setIsLongTermExcellent] = useState(false);
  const [floorArea, setFloorArea] = useState(100);
  const [buildYear, setBuildYear] = useState(2000);
  const [floorAreaUsed, setFloorAreaUsed] = useState(100);
  const [isSelfOccupied, setIsSelfOccupied] = useState(true);

  const [result, setResult] = useState<TaxResult | null>(null);

  const handleCalc = () => {
    const land: LandInputs = {
      enabled: landEnabled,
      evaluationMan: landEval,
      isResidentialLand,
      isForNewHousing,
      houseFloorAreaSqm: houseFloorArea,
    };
    const building: BuildingInputs = {
      enabled: buildingEnabled,
      evaluationMan: buildingEval,
      buildingType,
      isNew,
      isLongTermExcellent,
      floorAreaSqm: floorArea,
      buildYear,
      floorAreaUsedSqm: floorAreaUsed,
      isSelfOccupied,
    };
    setResult(calcTax(land, building));
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Build checklist from result
  const buildChecklist = (r: TaxResult): CheckItem[] => {
    const items: CheckItem[] = [];

    if (r.landEnabled) {
      // 宅地特例
      items.push({
        label: "宅地特例（課税標準1/2）",
        applied: r.landIsResidential,
        status: r.landIsResidential ? "適用済み" : "非対象",
        reason: r.landIsResidential ? undefined : "宅地以外のため非適用",
      });

      // 住宅用地追加減額
      if (r.landIsResidential) {
        const applies = r.landIsResidential && r.landIsForNewHousing && !r.landExempt;
        items.push({
          label: "住宅用地追加減額（最低45,000円）",
          applied: applies,
          status: applies ? "適用済み（最低45,000円）" : "非対象",
          reason: applies ? undefined : "新築・新築予定の住宅用土地でない場合は非適用",
        });
      }

      // 土地免税点
      items.push({
        label: "免税点（課税標準10万円未満）",
        applied: r.landExempt,
        status: r.landExempt ? "非課税" : "課税対象",
        reason: r.landExempt
          ? undefined
          : `課税標準額 ${fmt(r.landTaxableBase)}（10万円以上）`,
      });
    }

    if (r.buildingEnabled) {
      const isSelfResidential = r.buildingType === "住宅（自己居住用）";
      const isNonResidential = r.buildingType === "非住宅（事務所・店舗等）";

      // 住宅軽減税率（3%）
      items.push({
        label: "住宅軽減税率（3%）",
        applied: !isNonResidential,
        status: isNonResidential ? "非対象（4%）" : "適用済み（3%）",
        reason: isNonResidential ? "非住宅のため4%が適用されます" : undefined,
      });

      if (isSelfResidential && r.buildingIsNew) {
        // 新築住宅控除
        const newBaseApplied = r.buildingFloorOk && r.buildingDeduction >= 1200;
        items.push({
          label: "新築住宅控除（1,200万円）",
          applied: newBaseApplied,
          status: newBaseApplied ? "適用済み" : "要件不足",
          reason: newBaseApplied
            ? undefined
            : "床面積50㎡以上240㎡以下の要件を満たしていません",
        });

        // 長期優良住宅控除
        const longTermApplied = r.buildingIsLongTermExcellent && r.buildingFloorOk;
        items.push({
          label: "長期優良住宅控除（1,300万円）",
          applied: longTermApplied,
          status: longTermApplied ? "適用済み" : "非対象",
          reason: longTermApplied
            ? undefined
            : r.buildingIsLongTermExcellent
            ? "床面積要件不足"
            : "長期優良住宅でないため非対象",
        });
      }

      if (isSelfResidential && !r.buildingIsNew) {
        // 中古住宅築年数別控除
        const usedApplied = r.buildingFloorOk && r.buildingIsSelfOccupied && r.usedDeductionInfo !== null;
        items.push({
          label: `中古住宅築年数別控除（${r.usedDeductionInfo ? r.usedDeductionInfo.amount.toLocaleString() + "万円" : "―"}）`,
          applied: usedApplied,
          status: usedApplied
            ? `適用済み（${r.usedDeductionInfo!.amount.toLocaleString()}万円控除）`
            : "要件不足",
          reason: usedApplied
            ? undefined
            : !r.buildingFloorOk
            ? "床面積50㎡以上240㎡以下の要件不足"
            : !r.buildingIsSelfOccupied
            ? "自己居住用のみ適用可能"
            : "1954年以前の建物は控除対象外",
        });
      }

      // 建物免税点
      items.push({
        label: `免税点（評価額が${r.buildingIsNew ? "23" : "12"}万円未満）`,
        applied: r.buildingExempt,
        status: r.buildingExempt ? "非課税" : "課税対象",
        reason: r.buildingExempt
          ? undefined
          : `評価額 ${fmt(r.buildingEvaluation)}（免税点以上）`,
      });
    }

    return items;
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const selectClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const ToggleBtn = ({
    value,
    onChange,
    trueLabel = "はい",
    falseLabel = "いいえ",
    color = "blue",
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
    trueLabel?: string;
    falseLabel?: string;
    color?: string;
  }) => {
    const activeClass =
      color === "green"
        ? "bg-green-600 text-white border-green-600"
        : "bg-blue-600 text-white border-blue-600";
    const inactiveClass = "bg-white text-gray-600 border-gray-300 hover:border-blue-400";
    return (
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          className={`flex-1 min-w-0 py-2 rounded-lg text-sm font-medium border transition-colors ${value ? activeClass : inactiveClass}`}
          onClick={() => onChange(true)}
        >
          {trueLabel}
        </button>
        <button
          type="button"
          className={`flex-1 min-w-0 py-2 rounded-lg text-sm font-medium border transition-colors ${!value ? activeClass : inactiveClass}`}
          onClick={() => onChange(false)}
        >
          {falseLabel}
        </button>
      </div>
    );
  };

  const Row = ({
    label,
    value,
    highlight,
    sub,
  }: {
    label: string;
    value: string;
    highlight?: "green" | "blue" | "red";
    sub?: string;
  }) => (
    <div className="flex flex-wrap justify-between items-start gap-x-2 py-2 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <span className="text-sm text-gray-600">{label}</span>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <span
        className={`text-sm font-semibold flex-shrink-0 text-right ${
          highlight === "green"
            ? "text-green-600"
            : highlight === "blue"
            ? "text-blue-600"
            : highlight === "red"
            ? "text-red-500"
            : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/realestate" className="hover:text-blue-600">不動産・住まい</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-600">不動産取得税 計算機</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            不動産取得税 計算機
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            軽減措置を自動適用して不動産取得税を計算。土地・建物の両方に対応。
            <span className="inline-block ml-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded">
              令和9年3月31日まで延長特例対応
            </span>
          </p>
        </div>

        <AdUnit slot="5612038947" format="horizontal" className="mb-6" />

        {/* Section 1: 土地 */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-amber-700 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </span>
              土地の情報
            </h2>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${landEnabled ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setLandEnabled(true)}
              >
                取得する
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${!landEnabled ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setLandEnabled(false)}
              >
                取得しない
              </button>
            </div>
          </div>

          {landEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  土地の固定資産税評価額（万円）
                </label>
                <input
                  type="number"
                  className={inputClass}
                  value={landEval}
                  min={1}
                  onChange={(e) => setLandEval(Number(e.target.value))}
                />
                <p className="text-xs text-gray-400 mt-1">
                  購入価格の約70%が目安。納税通知書または役所で確認できます
                </p>
              </div>
              <div>
                <label className={labelClass}>宅地ですか？</label>
                <p className="text-xs text-gray-400 mb-1">
                  宅地なら課税標準額が評価額の1/2になります
                </p>
                <ToggleBtn value={isResidentialLand} onChange={setIsResidentialLand} />
              </div>
              <div>
                <label className={labelClass}>新築または新築予定の住宅用土地ですか？</label>
                <p className="text-xs text-gray-400 mb-1">
                  追加の軽減措置が適用される可能性があります
                </p>
                <ToggleBtn value={isForNewHousing} onChange={setIsForNewHousing} />
              </div>
              {isForNewHousing && (
                <div className="sm:col-span-2">
                  <label className={labelClass}>住宅の床面積（㎡）</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={houseFloorArea}
                    min={1}
                    onChange={(e) => setHouseFloorArea(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    軽減計算の参考値として使用します
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: 建物 */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </span>
              建物の情報
            </h2>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${buildingEnabled ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setBuildingEnabled(true)}
              >
                取得する
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${!buildingEnabled ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-500 border-gray-300"}`}
                onClick={() => setBuildingEnabled(false)}
              >
                取得しない
              </button>
            </div>
          </div>

          {buildingEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>建物の固定資産税評価額（万円）</label>
                <input
                  type="number"
                  className={inputClass}
                  value={buildingEval}
                  min={1}
                  onChange={(e) => setBuildingEval(Number(e.target.value))}
                />
                <p className="text-xs text-gray-400 mt-1">
                  新築の場合は建築費の約50〜60%が目安
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>建物の種別</label>
                <select
                  className={selectClass}
                  value={buildingType}
                  onChange={(e) =>
                    setBuildingType(e.target.value as BuildingInputs["buildingType"])
                  }
                >
                  <option>住宅（自己居住用）</option>
                  <option>住宅（自己居住用以外）</option>
                  <option>非住宅（事務所・店舗等）</option>
                </select>
              </div>

              {buildingType === "住宅（自己居住用）" && (
                <>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>新築・中古の別</label>
                    <div className="flex gap-2 mt-1">
                      {["新築", "中古"].map((v) => (
                        <button
                          key={v}
                          type="button"
                          className={`flex-1 min-w-0 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            (v === "新築") === isNew
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                          }`}
                          onClick={() => setIsNew(v === "新築")}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isNew ? (
                    <>
                      <div>
                        <label className={labelClass}>床面積（㎡）</label>
                        <input
                          type="number"
                          className={inputClass}
                          value={floorArea}
                          min={1}
                          onChange={(e) => setFloorArea(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          軽減要件: 50㎡以上240㎡以下
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>長期優良住宅ですか？</label>
                        <ToggleBtn
                          value={isLongTermExcellent}
                          onChange={setIsLongTermExcellent}
                          color="green"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className={labelClass}>建築年</label>
                        <select
                          className={selectClass}
                          value={buildYear}
                          onChange={(e) => setBuildYear(Number(e.target.value))}
                        >
                          {buildYearOptions.map((y) => (
                            <option key={y} value={y}>
                              {y}年
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>床面積（㎡）</label>
                        <input
                          type="number"
                          className={inputClass}
                          value={floorAreaUsed}
                          min={1}
                          onChange={(e) => setFloorAreaUsed(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          軽減要件: 50㎡以上240㎡以下
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>自己居住用ですか？</label>
                        <ToggleBtn value={isSelfOccupied} onChange={setIsSelfOccupied} />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Calculate button */}
        <button
          type="button"
          onClick={handleCalc}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl text-lg shadow-md transition-all mb-8"
        >
          不動産取得税を計算する
        </button>

        {/* ---- RESULTS ---- */}
        {result && (
          <div id="result-section" className="space-y-5">

            {/* Total Big Card — Bug 1 fix: grid-cols-1 sm:grid-cols-3 */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-amber-200 p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700 mb-4">不動産取得税 合計</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">軽減前合計</p>
                  <p className="text-lg font-bold text-gray-700">
                    {fmt(result.totalBeforeRelief)}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-orange-300">
                  <p className="text-xs text-orange-600 font-medium mb-1">実際の納税額</p>
                  <p className="text-xl font-bold text-orange-600">
                    {fmt(result.totalAfterRelief)}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <p className="text-xs text-green-600 mb-1">節税効果</p>
                  <p className="text-lg font-bold text-green-600">
                    {result.totalSaving > 0 ? `-${fmt(result.totalSaving)}` : "なし"}
                  </p>
                </div>
              </div>
              {result.totalAfterRelief === 0 && (
                <div className="bg-green-100 text-green-700 rounded-lg px-4 py-2 text-sm font-medium">
                  軽減措置により不動産取得税は0円（非課税）になります
                </div>
              )}
            </div>

            {/* ---- Checklist ---- */}
            <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <span>✅</span> 軽減措置適用状況チェックリスト
              </h3>
              <div className="space-y-2">
                {buildChecklist(result).map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-start gap-2 bg-white rounded-xl px-4 py-3 border border-green-100"
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {item.applied ? "✅" : "❌"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 break-words">
                        {item.label}
                      </span>
                      {item.reason && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.reason}</p>
                      )}
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                        item.applied
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Land detail */}
            {result.landEnabled && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
                <h3 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">🌏</span> 土地の不動産取得税
                </h3>
                {result.landExempt ? (
                  <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700">
                    課税標準額が10万円未満のため非課税（免税点以下）
                  </div>
                ) : (
                  <div className="space-y-0">
                    <Row
                      label="固定資産税評価額"
                      value={fmt(result.landEvaluation)}
                    />
                    <Row
                      label="宅地特例（1/2）"
                      value={result.landIsResidential ? "適用" : "非適用"}
                      highlight={result.landIsResidential ? "green" : undefined}
                    />
                    <Row
                      label="課税標準額"
                      value={fmt(result.landTaxableBase)}
                    />
                    <Row
                      label="軽減前税額（3%）"
                      value={fmt(result.landTaxBeforeRelief)}
                    />
                    {result.landReliefAmount > 0 && (
                      <Row
                        label="住宅用地減額"
                        value={`-${fmtYen(result.landReliefAmount)}`}
                        highlight="green"
                        sub="最低45,000円（住宅の床面積要件により変動）"
                      />
                    )}
                    <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-200">
                      <span className="text-sm font-bold text-amber-700">土地の税額</span>
                      <span className="text-lg font-bold text-orange-600">
                        {fmt(result.landTaxFinal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Building detail */}
            {result.buildingEnabled && (
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">🏠</span> 建物の不動産取得税
                </h3>
                {result.buildingExempt ? (
                  <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700">
                    評価額が免税点未満のため非課税
                  </div>
                ) : (
                  <div className="space-y-0">
                    <Row
                      label="固定資産税評価額"
                      value={fmt(result.buildingEvaluation)}
                    />
                    <Row
                      label="税率"
                      value={
                        result.buildingTaxRate === 0.04
                          ? "4%（非住宅）"
                          : "3%（住宅）"
                      }
                    />
                    {!result.buildingFloorOk && (
                      <div className="bg-orange-50 rounded-lg p-2 text-xs text-orange-600 my-1">
                        床面積が50㎡以上240㎡以下の要件を満たさないため軽減措置の控除が適用されません
                      </div>
                    )}
                    <Row
                      label="控除額"
                      value={
                        result.buildingDeduction > 0
                          ? `-${result.buildingDeductionLabel}`
                          : result.buildingDeductionLabel
                      }
                      highlight={result.buildingDeduction > 0 ? "green" : undefined}
                    />
                    {result.usedDeductionInfo && (
                      <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-600 my-1">
                        適用控除: {result.usedDeductionInfo.label}
                      </div>
                    )}
                    <Row
                      label="課税標準額"
                      value={fmt(result.buildingTaxableBase)}
                    />
                    <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-200">
                      <span className="text-sm font-bold text-blue-700">建物の税額</span>
                      <span className="text-lg font-bold text-orange-600">
                        {fmt(result.buildingTaxFinal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-xs text-blue-700 space-y-1">
              <p className="font-semibold">計算の前提・注意事項</p>
              <p>• 土地の住宅用地追加減額（減額B）は土地の㎡あたり評価額が必要なため、確実に適用される最低額（45,000円）のみ表示しています。実際は更に大きくなる場合があります。</p>
              <p>• 長期優良住宅の控除1,300万円の適用には認定証が必要です。</p>
              <p>• 中古住宅の軽減は耐震基準への適合要件があります（1982年1月以降の建物は原則適合とみなされます）。</p>
              <p>• 税率・控除額は令和9年（2027年）3月31日まで適用される特例です。</p>
            </div>

            <AdUnit slot="2847591036" format="rectangle" className="my-4" />
          </div>
        )}

        {/* SEO Content */}
        <section className="mt-12 space-y-8 text-sm text-gray-700">

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              不動産取得税の計算例
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-3 py-2 text-left">ケース</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">評価額</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">軽減前</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">軽減後</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["新築マンション（床面積80㎡）", "建物1,200万円", "36万円", "0円"],
                    ["中古住宅（1998年築・床面積90㎡）", "建物800万円", "24万円", "0円"],
                    ["宅地（評価額2,000万円）", "土地2,000万円", "30万円", "30万円"],
                    ["事務所（非住宅）", "建物3,000万円", "120万円", "120万円"],
                  ].map(([label, eval_, before, after], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-200 px-3 py-2">{label}</td>
                      <td className="border border-gray-200 px-3 py-2">{eval_}</td>
                      <td className="border border-gray-200 px-3 py-2 text-orange-600">
                        {before}
                      </td>
                      <td
                        className={`border border-gray-200 px-3 py-2 font-medium ${
                          after === "0円" ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {after}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-800">不動産取得税の基礎知識</h2>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">不動産取得税とは？</h3>
              <p>
                不動産取得税は、土地や建物を取得した際に一度だけ都道府県に納める税金です。
                売買・贈与・交換・新築など、有償・無償を問わず課税されます（相続は非課税）。
                通常、取得から6ヶ月〜1年後に都道府県から納税通知書が届きます。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">税率と課税標準額</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-3 py-2 text-left">種別</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">本則税率</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">軽減税率（〜令和9年3月31日）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2">住宅・土地</td>
                      <td className="border border-gray-200 px-3 py-2">4%</td>
                      <td className="border border-gray-200 px-3 py-2 font-medium text-green-600">3%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-3 py-2">非住宅（事務所・店舗等）</td>
                      <td className="border border-gray-200 px-3 py-2">4%</td>
                      <td className="border border-gray-200 px-3 py-2">4%（軽減なし）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">主な軽減措置</h3>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-700 mb-1">新築住宅の控除（1,200万円 / 長期優良は1,300万円）</h4>
                  <p className="text-sm">
                    床面積50㎡以上240㎡以下の新築住宅は、固定資産税評価額から控除額を差し引いた額に3%を乗じます。
                    多くの場合、税額はゼロになります。
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-blue-700 mb-1">中古住宅の築年数別控除（100万〜1,200万円）</h4>
                  <p className="text-sm">
                    自己居住用で床面積50㎡以上240㎡以下の中古住宅は、建築年に応じた控除額が適用されます。
                    1997年4月以降の建物は1,200万円控除で、ほとんどの場合で税額がゼロになります。
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <h4 className="font-bold text-amber-700 mb-1">宅地の課税標準1/2特例</h4>
                  <p className="text-sm">
                    宅地（宅地評価土地）を取得した場合、課税標準額が固定資産税評価額の1/2となります。
                    令和9年3月31日まで延長された特例です。
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">免税点（非課税になる場合）</h3>
              <ul className="space-y-1 text-sm list-disc list-inside text-gray-600">
                <li>土地: 課税標準額が10万円未満</li>
                <li>建物（新築・増築）: 固定資産税評価額が23万円未満</li>
                <li>建物（売買等）: 固定資産税評価額が12万円未満</li>
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">よくある質問</h2>
            {[
              {
                q: "不動産取得税はいつ払うのですか？",
                a: "不動産を取得してから数ヶ月〜半年後に、都道府県から納税通知書が届きます。通常、取得から6ヶ月〜1年以内に送付されます。納付期限は通知書記載の日付となります。",
              },
              {
                q: "新築マンションで不動産取得税がかかりますか？",
                a: "床面積50㎡以上240㎡以下の新築住宅は1,200万円（長期優良住宅は1,300万円）が控除されるため、固定資産税評価額が1,200万円以下であれば税額はゼロになります。多くの新築マンションでは実質非課税となります。",
              },
              {
                q: "中古住宅を購入したとき、不動産取得税の軽減を受けるには何が必要ですか？",
                a: "自己居住用で床面積50㎡以上240㎡以下であることが主な条件です。また、1982年（昭和57年）1月1日以降に建築された住宅、またはそれ以前でも耐震基準適合証明書や既存住宅売買瑕疵保険の付保証明書があれば軽減が受けられます。取得後60日以内に都道府県税事務所に申告が必要な場合があります。",
              },
              {
                q: "土地だけ買った場合、不動産取得税はかかりますか？",
                a: "宅地の場合は固定資産税評価額の1/2を課税標準とし3%の税率が適用されます。ただし、取得後3年以内に住宅を新築した場合や、住宅建築後1年以内に土地を取得した場合は追加の軽減措置が適用され、大幅に税額が減ります。",
              },
              {
                q: "不動産取得税は経費になりますか？",
                a: "個人の自己居住用不動産については経費にはなりません。ただし、賃貸用不動産として取得した場合は不動産所得の経費（必要経費）として計上できます。また、事業用不動産の場合も経費計上が可能です。",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-2">Q: {item.q}</h3>
                <p className="text-gray-600">A: {item.a}</p>
              </div>
            ))}
          </div>

          {/* Related tools */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">あわせて使えるツール</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "家賃 vs 購入 比較計算機",
                  url: "/realestate/rent-vs-buy",
                  icon: "⚖️",
                },
                {
                  name: "固定資産税 計算機",
                  url: "/realestate/property-tax-calculator",
                  icon: "🏛️",
                },
                {
                  name: "住宅ローン計算機",
                  url: "/finance/jutaku-loan",
                  icon: "💰",
                },
                {
                  name: "賃貸 敷金礼金 トータルコスト計算機",
                  url: "/realestate/rental-cost-calculator",
                  icon: "🏠",
                },
              ].map((tool) => (
                <Link
                  key={tool.url}
                  href={tool.url}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-amber-600 transition-colors text-sm">
                    {tool.name}
                  </span>
                  <span className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-xs text-yellow-800">
            <p>
              <strong>免責事項：</strong>
              本ツールの計算結果は参考情報です。実際の税額は都道府県税事務所の判定によります。
              軽減措置の適用には所定の申告・要件確認が必要な場合があります。最終的な税額については都道府県税事務所または税理士にご確認ください。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
