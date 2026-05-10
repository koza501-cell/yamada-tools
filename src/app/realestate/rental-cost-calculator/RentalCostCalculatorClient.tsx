"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ---- Types ----
interface PropertyInputs {
  name: string;
  rent: string;
  kanrihi: string;
  shikikin: string;
  reikin: string;
  chukai: string;
  maeYachin: string;
  kagiKokan: string;
  kagiKokanOther: string;
  kasaiHoken: string;
  kasaiHokenOther: string;
  hosho: string;
  hoshoOther: string;
  otherShoki: string;
}

interface ResidenceInputs {
  years: string;
  koushinRyo: string;
  kasaiRenewal: string;
  yachinUp: string;
}

interface DepartureInputs {
  cleaning: string;
  madori: string;
  shikikinReturn: string;
  genjoCost: string;
  customCleaning: string;
}

interface PropertyResult {
  shokiHiyo: number;
  shikikinAmount: number;
  reikinAmount: number;
  chukaiAmount: number;
  maeYachinAmount: number;
  kagiKokanAmount: number;
  kasaiHokenAmount: number;
  hoshoAmount: number;
  otherAmount: number;
  monthlyTotal: number;
  yearlyTotal: number;
  totalYachin: number;
  koushinTotal: number;
  kasaiRenewalTotal: number;
  departureNet: number;
  cleaningCost: number;
  shikikinReturnAmount: number;
  genjoAmount: number;
  grandTotal: number;
  monthlyReal: number;
}

// ---- Helpers ----
function fmtYen(n: number): string {
  return Math.round(n).toLocaleString() + "円";
}

function fmtMan(n: number): string {
  const man = n / 10000;
  if (man >= 100) return Math.round(man).toLocaleString() + "万円";
  if (man >= 1) return man.toFixed(1).replace(/\.0$/, "") + "万円";
  return Math.round(n).toLocaleString() + "円";
}

function getKagiKokan(v: string, other: string): number {
  if (v === "0") return 0;
  if (v === "other") return parseInt(other || "0", 10) || 0;
  return parseInt(v, 10);
}

function getKasaiHoken(v: string, other: string): number {
  if (v === "other") return parseInt(other || "0", 10) || 0;
  return parseInt(v, 10);
}

function getHosho(v: string, other: string, rentYen: number): number {
  if (v === "none") return 0;
  if (v === "other") return parseInt(other || "0", 10) || 0;
  return Math.round(rentYen * (parseInt(v, 10) / 100));
}

const CLEANING_COSTS: Record<string, number> = {
  "1K": 35000,
  "1DK": 40000,
  "1LDK": 50000,
  "2K2DK": 55000,
  "2LDK": 65000,
  "3LDK": 80000,
};

function calcProperty(
  p: PropertyInputs,
  res: ResidenceInputs,
  dep: DepartureInputs
): PropertyResult {
  const rentYen = parseFloat(p.rent) * 10000;
  const kanrihiYen = parseInt(p.kanrihi || "0", 10) || 0;
  const shikikinMonths = parseFloat(p.shikikin);
  const reikinMonths = parseFloat(p.reikin);
  const chukaiMonths = parseFloat(p.chukai);
  const maeYachinMonths = parseFloat(p.maeYachin);

  const shikikinAmount = Math.round(rentYen * shikikinMonths);
  const reikinAmount = Math.round(rentYen * reikinMonths);
  const chukaiAmount = Math.round(rentYen * chukaiMonths * 1.1);
  const maeYachinAmount = Math.round(rentYen * maeYachinMonths);
  const kagiKokanAmount = getKagiKokan(p.kagiKokan, p.kagiKokanOther);
  const kasaiHokenAmount = getKasaiHoken(p.kasaiHoken, p.kasaiHokenOther);
  const hoshoAmount = getHosho(p.hosho, p.hoshoOther, rentYen);
  const otherAmount = parseInt(p.otherShoki || "0", 10) || 0;

  const shokiHiyo =
    shikikinAmount +
    reikinAmount +
    chukaiAmount +
    maeYachinAmount +
    kagiKokanAmount +
    kasaiHokenAmount +
    hoshoAmount +
    otherAmount;

  const monthlyTotal = rentYen + kanrihiYen;
  const yearlyTotal = monthlyTotal * 12;

  const years = parseInt(res.years, 10);
  const yachinUp = parseFloat(res.yachinUp);

  // 居住期間家賃総額（年ごとに値上がり計算）
  let totalYachin = 0;
  for (let y = 0; y < years; y++) {
    totalYachin += Math.round(rentYen * Math.pow(1 + yachinUp, y) * 12);
  }
  totalYachin += kanrihiYen * 12 * years;

  // 更新料（2年ごと）
  let koushinTotal = 0;
  if (res.koushinRyo !== "none") {
    const koushinMonths = parseFloat(res.koushinRyo);
    const koushinCount = Math.floor(years / 2);
    koushinTotal = Math.round(rentYen * koushinMonths) * koushinCount;
  }

  // 火災保険更新（初回は初期費用に含まれるため追加分のみ）
  let kasaiRenewalTotal = 0;
  const kasaiHokenBase = kasaiHokenAmount;
  if (res.kasaiRenewal === "2") {
    const renewCount = Math.floor(years / 2);
    kasaiRenewalTotal = kasaiHokenBase * renewCount;
  } else {
    const renewCount = Math.floor(years / 4);
    kasaiRenewalTotal = kasaiHokenBase * renewCount;
  }

  // 退去費用
  let cleaningCost = 0;
  if (dep.cleaning === "auto") {
    cleaningCost = CLEANING_COSTS[dep.madori] ?? 35000;
  } else {
    cleaningCost = parseInt(dep.customCleaning || "0", 10) || 0;
  }

  let shikikinReturnAmount = 0;
  if (dep.shikikinReturn === "full") shikikinReturnAmount = shikikinAmount;
  else if (dep.shikikinReturn === "half")
    shikikinReturnAmount = Math.round(shikikinAmount * 0.5);

  const genjoAmount = (parseFloat(dep.genjoCost || "0") || 0) * 10000;
  const departureNet = Math.max(
    0,
    cleaningCost + genjoAmount - shikikinReturnAmount
  );

  const grandTotal =
    shokiHiyo +
    totalYachin +
    koushinTotal +
    kasaiRenewalTotal +
    departureNet;
  const monthlyReal = Math.round(grandTotal / (years * 12));

  return {
    shokiHiyo,
    shikikinAmount,
    reikinAmount,
    chukaiAmount,
    maeYachinAmount,
    kagiKokanAmount,
    kasaiHokenAmount,
    hoshoAmount,
    otherAmount,
    monthlyTotal,
    yearlyTotal,
    totalYachin,
    koushinTotal,
    kasaiRenewalTotal,
    departureNet,
    cleaningCost,
    shikikinReturnAmount,
    genjoAmount,
    grandTotal,
    monthlyReal,
  };
}

const defaultProperty: PropertyInputs = {
  name: "",
  rent: "",
  kanrihi: "5000",
  shikikin: "1",
  reikin: "1",
  chukai: "1",
  maeYachin: "1",
  kagiKokan: "15000",
  kasaiHoken: "15000",
  hosho: "50",
  hoshoOther: "",
  kagiKokanOther: "",
  kasaiHokenOther: "",
  otherShoki: "",
};

const defaultResidence: ResidenceInputs = {
  years: "2",
  koushinRyo: "1",
  kasaiRenewal: "2",
  yachinUp: "0",
};

const defaultDeparture: DepartureInputs = {
  cleaning: "auto",
  madori: "1K",
  shikikinReturn: "half",
  genjoCost: "0",
  customCleaning: "",
};

// ---- Sub-components ----
function PropertyForm({
  prop,
  label,
  onChange,
}: {
  prop: PropertyInputs;
  label: string;
  onChange: (key: keyof PropertyInputs, val: string) => void;
}) {
  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent";
  const selectCls = inputCls;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-3">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 物件名 */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            物件名（任意）
          </label>
          <input
            type="text"
            className={inputCls}
            value={prop.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="例：グリーンハイツ201"
          />
        </div>

        {/* 月額家賃 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            月額家賃 <span className="text-danger">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className={inputCls}
              value={prop.rent}
              onChange={(e) => onChange("rent", e.target.value)}
              placeholder="例：8"
              min="0"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
          </div>
        </div>

        {/* 管理費 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            管理費・共益費
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className={inputCls}
              value={prop.kanrihi}
              onChange={(e) => onChange("kanrihi", e.target.value)}
              min="0"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">円/月</span>
          </div>
        </div>

        {/* 敷金 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">敷金</label>
          <select
            className={selectCls}
            value={prop.shikikin}
            onChange={(e) => onChange("shikikin", e.target.value)}
          >
            <option value="0">0ヶ月</option>
            <option value="0.5">0.5ヶ月</option>
            <option value="1">1ヶ月</option>
            <option value="2">2ヶ月</option>
          </select>
        </div>

        {/* 礼金 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">礼金</label>
          <select
            className={selectCls}
            value={prop.reikin}
            onChange={(e) => onChange("reikin", e.target.value)}
          >
            <option value="0">0ヶ月</option>
            <option value="0.5">0.5ヶ月</option>
            <option value="1">1ヶ月</option>
            <option value="2">2ヶ月</option>
          </select>
        </div>

        {/* 仲介手数料 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            仲介手数料
          </label>
          <select
            className={selectCls}
            value={prop.chukai}
            onChange={(e) => onChange("chukai", e.target.value)}
          >
            <option value="0">0ヶ月</option>
            <option value="0.5">0.5ヶ月（+消費税）</option>
            <option value="1">1ヶ月（+消費税）</option>
          </select>
        </div>

        {/* 前家賃 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            前払い賃料（前家賃）
          </label>
          <select
            className={selectCls}
            value={prop.maeYachin}
            onChange={(e) => onChange("maeYachin", e.target.value)}
          >
            <option value="0">0ヶ月</option>
            <option value="1">1ヶ月</option>
          </select>
        </div>

        {/* 鍵交換 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            鍵交換費用
          </label>
          <div className="flex items-center gap-2">
            <select
              className={selectCls}
              value={prop.kagiKokan}
              onChange={(e) => onChange("kagiKokan", e.target.value)}
            >
              <option value="0">なし</option>
              <option value="10000">1万円</option>
              <option value="15000">1.5万円</option>
              <option value="20000">2万円</option>
              <option value="other">その他</option>
            </select>
            {prop.kagiKokan === "other" && (
              <input
                type="number"
                className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                value={prop.kagiKokanOther}
                onChange={(e) => onChange("kagiKokanOther", e.target.value)}
                placeholder="円"
              />
            )}
          </div>
        </div>

        {/* 火災保険 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            火災保険料（2年）
          </label>
          <div className="flex items-center gap-2">
            <select
              className={selectCls}
              value={prop.kasaiHoken}
              onChange={(e) => onChange("kasaiHoken", e.target.value)}
            >
              <option value="10000">1万円</option>
              <option value="15000">1.5万円</option>
              <option value="20000">2万円</option>
              <option value="25000">2.5万円</option>
              <option value="other">その他</option>
            </select>
            {prop.kasaiHoken === "other" && (
              <input
                type="number"
                className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                value={prop.kasaiHokenOther}
                onChange={(e) => onChange("kasaiHokenOther", e.target.value)}
                placeholder="円"
              />
            )}
          </div>
        </div>

        {/* 保証会社 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            保証会社費用
          </label>
          <div className="flex items-center gap-2">
            <select
              className={selectCls}
              value={prop.hosho}
              onChange={(e) => onChange("hosho", e.target.value)}
            >
              <option value="none">なし</option>
              <option value="30">家賃の30%</option>
              <option value="50">家賃の50%</option>
              <option value="100">家賃の100%</option>
              <option value="other">その他（円指定）</option>
            </select>
            {prop.hosho === "other" && (
              <input
                type="number"
                className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                value={prop.hoshoOther}
                onChange={(e) => onChange("hoshoOther", e.target.value)}
                placeholder="円"
              />
            )}
          </div>
        </div>

        {/* その他初期費用 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            その他初期費用
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className={inputCls}
              value={prop.otherShoki}
              onChange={(e) => onChange("otherShoki", e.target.value)}
              placeholder="0"
              min="0"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">円</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">害虫駆除・消毒費など</p>
        </div>
      </div>
    </div>
  );
}

function ResultBreakdown({
  result,
  years,
  propName,
}: {
  result: PropertyResult;
  years: number;
  propName: string;
}) {
  const thCls = "px-4 py-2 text-left font-semibold";
  const tdCls = "px-4 py-2 text-gray-700";
  const tdRCls = "px-4 py-2 text-right";

  return (
    <div className="space-y-6">
      {/* 初期費用内訳 */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {propName ? `【${propName}】` : ""}初期費用の内訳
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-kon text-white">
                <th className={thCls}>項目</th>
                <th className="px-4 py-2 text-right font-semibold">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { label: "敷金", val: result.shikikinAmount },
                { label: "礼金", val: result.reikinAmount },
                { label: "仲介手数料（税込）", val: result.chukaiAmount },
                { label: "前払い賃料", val: result.maeYachinAmount },
                { label: "鍵交換", val: result.kagiKokanAmount },
                { label: "火災保険料（2年分）", val: result.kasaiHokenAmount },
                { label: "保証会社費用", val: result.hoshoAmount },
                { label: "その他", val: result.otherAmount },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-gray-50">
                  <td className={tdCls}>{row.label}</td>
                  <td className={tdRCls}>{fmtYen(row.val)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-4 py-2 text-kon">初期費用合計</td>
                <td className="px-4 py-2 text-right text-kon">
                  {fmtMan(result.shokiHiyo)}
                </td>
              </tr>
              {result.shikikinAmount > 0 && (
                <tr className="bg-green-50">
                  <td className="px-4 py-2 text-green-700 text-xs">
                    ↩ うち返ってくる可能性がある金額（敷金）
                  </td>
                  <td className="px-4 py-2 text-right text-green-700 text-xs">
                    {fmtYen(result.shikikinAmount)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 月額・年額 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">月額コスト（家賃+管理費）</p>
          <p className="text-lg font-bold text-gray-900">
            {fmtYen(result.monthlyTotal)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">年間コスト</p>
          <p className="text-lg font-bold text-gray-900">
            {fmtMan(result.yearlyTotal)}
          </p>
        </div>
      </div>

      {/* 居住期間トータル */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {years}年間 トータルコスト
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className={thCls}>項目</th>
                <th className="px-4 py-2 text-right font-semibold">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className={tdCls}>初期費用</td>
                <td className={tdRCls}>{fmtMan(result.shokiHiyo)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className={tdCls}>{years}年間の家賃・管理費合計</td>
                <td className={tdRCls}>{fmtMan(result.totalYachin)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className={tdCls}>更新料合計</td>
                <td className={tdRCls}>{fmtMan(result.koushinTotal)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className={tdCls}>火災保険更新合計</td>
                <td className={tdRCls}>{fmtMan(result.kasaiRenewalTotal)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className={tdCls}>退去時実質負担</td>
                <td className={tdRCls}>{fmtMan(result.departureNet)}</td>
              </tr>
              <tr className="bg-indigo-50 font-bold">
                <td className="px-4 py-2 text-indigo-800">生涯賃貸総コスト</td>
                <td className="px-4 py-2 text-right text-indigo-800 text-lg">
                  {fmtMan(result.grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <p className="text-sm text-yellow-700">
            実質月額コスト（トータル÷{years * 12}ヶ月）
          </p>
          <p className="text-2xl font-bold text-yellow-800 mt-1">
            {fmtYen(result.monthlyReal)}
            <span className="text-base font-normal">/月</span>
          </p>
        </div>
      </div>

      {/* 退去費用の目安 */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          退去時費用の目安
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className={tdCls}>クリーニング費用</td>
                <td className={tdRCls}>{fmtYen(result.cleaningCost)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className={tdCls}>原状回復費用（追加）</td>
                <td className={tdRCls}>{fmtYen(result.genjoAmount)}</td>
              </tr>
              <tr className="hover:bg-gray-50 text-green-700">
                <td className="px-4 py-2">敷金返還（見込み）</td>
                <td className="px-4 py-2 text-right">
                  −{fmtYen(result.shikikinReturnAmount)}
                </td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2 text-kon">退去時実質負担</td>
                <td className="px-4 py-2 text-right text-kon">
                  {fmtYen(result.departureNet)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function RentalCostCalculatorPage() {
  const [mode, setMode] = useState<"1" | "2">("1");
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [propA, setPropA] = useState<PropertyInputs>({ ...defaultProperty });
  const [propB, setPropB] = useState<PropertyInputs>({ ...defaultProperty });
  const [residence, setResidence] = useState<ResidenceInputs>({
    ...defaultResidence,
  });
  const [departure, setDeparture] = useState<DepartureInputs>({
    ...defaultDeparture,
  });
  const [resultA, setResultA] = useState<PropertyResult | null>(null);
  const [resultB, setResultB] = useState<PropertyResult | null>(null);
  const [error, setError] = useState("");

  function updatePropA(key: keyof PropertyInputs, val: string) {
    setPropA((prev) => ({ ...prev, [key]: val }));
    setResultA(null);
    setError("");
  }

  function updatePropB(key: keyof PropertyInputs, val: string) {
    setPropB((prev) => ({ ...prev, [key]: val }));
    setResultB(null);
    setError("");
  }

  function updateResidence(key: keyof ResidenceInputs, val: string) {
    setResidence((prev) => ({ ...prev, [key]: val }));
    setResultA(null);
    setResultB(null);
  }

  function updateDeparture(key: keyof DepartureInputs, val: string) {
    setDeparture((prev) => ({ ...prev, [key]: val }));
    setResultA(null);
    setResultB(null);
  }

  function handleCalculate() {
    const rentA = parseFloat(propA.rent);
    if (!propA.rent || isNaN(rentA) || rentA <= 0) {
      setError(
        mode === "2"
          ? "物件Aの月額家賃を入力してください。"
          : "月額家賃を入力してください。"
      );
      return;
    }
    if (mode === "2") {
      const rentB = parseFloat(propB.rent);
      if (!propB.rent || isNaN(rentB) || rentB <= 0) {
        setError("物件Bの月額家賃を入力してください。");
    setMascotState("error");
        return;
      }
    }
    setError("");
    setResultA(calcProperty(propA, residence, departure));
    if (mode === "2") {
      setResultB(calcProperty(propB, residence, departure));
    } else {
      setResultB(null);
    }
  }

  function handleReset() {
    setPropA({ ...defaultProperty });
    setPropB({ ...defaultProperty });
    setResidence({ ...defaultResidence });
    setDeparture({ ...defaultDeparture });
    setResultA(null);
    setResultB(null);
    setError("");
  }

  const years = parseInt(residence.years, 10);

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <nav className="text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-ai">
              ホーム
            </Link>{" "}
            &gt;{" "}
            <Link href="/realestate" className="hover:text-ai">
              不動産・住まい
            </Link>{" "}
            &gt; <span>賃貸 敷金礼金 トータルコスト計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            賃貸 敷金礼金 トータルコスト計算機
          </h1>
          <p className="text-gray-600 text-sm">
            敷金・礼金・仲介手数料だけでなく、鍵交換・火災保険・更新料・退去クリーニングまで
            <strong>すべての賃貸コストを一括計算</strong>
            。2物件の比較機能付き。
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* モード切り替え */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              計算モード
            </label>
            <div className="flex gap-3">
              {(["1", "2"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setResultA(null);
                    setResultB(null);
                    setError("");
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    mode === m
                      ? "bg-kon text-white border-kon"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {m === "1" ? "1物件" : "2物件比較"}
                </button>
              ))}
            </div>
          </div>

          {/* 物件情報 */}
          <div
            className={
              mode === "2"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
                : "mb-6"
            }
          >
            <div
              className={
                mode === "2" ? "border border-gray-200 rounded-lg p-4" : ""
              }
            >
              <PropertyForm
                prop={propA}
                label={mode === "2" ? "物件A" : "物件情報"}
                onChange={updatePropA}
              />
            </div>
            {mode === "2" && (
              <div className="border border-gray-200 rounded-lg p-4">
                <PropertyForm
                  prop={propB}
                  label="物件B"
                  onChange={updatePropB}
                />
              </div>
            )}
          </div>

          {/* 居住条件 */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4">
              居住条件
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  居住予定年数
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  value={residence.years}
                  onChange={(e) => updateResidence("years", e.target.value)}
                >
                  {["1", "2", "3", "5", "7", "10"].map((y) => (
                    <option key={y} value={y}>
                      {y}年
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  更新料（2年ごと）
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  value={residence.koushinRyo}
                  onChange={(e) =>
                    updateResidence("koushinRyo", e.target.value)
                  }
                >
                  <option value="none">なし</option>
                  <option value="0.5">0.5ヶ月</option>
                  <option value="1">1ヶ月</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  火災保険の更新
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  value={residence.kasaiRenewal}
                  onChange={(e) =>
                    updateResidence("kasaiRenewal", e.target.value)
                  }
                >
                  <option value="2">2年ごとに更新</option>
                  <option value="4">4年一括</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  家賃の値上がり
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  value={residence.yachinUp}
                  onChange={(e) => updateResidence("yachinUp", e.target.value)}
                >
                  <option value="0">なし</option>
                  <option value="0.005">年0.5%</option>
                  <option value="0.01">年1%</option>
                  <option value="0.02">年2%</option>
                </select>
              </div>
            </div>
          </div>

          {/* 退去時費用 */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4">
              退去時費用（任意）
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  退去時クリーニング費用
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  value={departure.cleaning}
                  onChange={(e) => updateDeparture("cleaning", e.target.value)}
                >
                  <option value="auto">相場（間取りで自動計算）</option>
                  <option value="custom">カスタム入力</option>
                </select>
              </div>
              {departure.cleaning === "auto" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    間取り
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                    value={departure.madori}
                    onChange={(e) =>
                      updateDeparture("madori", e.target.value)
                    }
                  >
                    <option value="1K">ワンルーム/1K（約3.5万円）</option>
                    <option value="1DK">1DK（約4万円）</option>
                    <option value="1LDK">1LDK（約5万円）</option>
                    <option value="2K2DK">2K/2DK（約5.5万円）</option>
                    <option value="2LDK">2LDK（約6.5万円）</option>
                    <option value="3LDK">3LDK以上（約8万円）</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    クリーニング費用
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                      value={departure.customCleaning}
                      onChange={(e) =>
                        updateDeparture("customCleaning", e.target.value)
                      }
                      placeholder="例：40000"
                      min="0"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      円
                    </span>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  敷金からの返還
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  value={departure.shikikinReturn}
                  onChange={(e) =>
                    updateDeparture("shikikinReturn", e.target.value)
                  }
                >
                  <option value="full">全額返還</option>
                  <option value="half">半額返還</option>
                  <option value="none">返還なし</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  原状回復費用（追加）
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                    value={departure.genjoCost}
                    onChange={(e) =>
                      updateDeparture("genjoCost", e.target.value)
                    }
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    万円
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCalculate}
              className="flex-1 py-3 px-6 rounded-lg bg-kon text-white font-semibold text-sm hover:bg-ai transition-colors shadow-sm"
            >
              計算する
            </button>
            <button
              onClick={handleReset}
              className="py-3 px-6 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>

        {/* Results */}
        {resultA && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">初期費用合計</p>
                <p className="text-xl font-bold text-gray-900">
                  {fmtMan(resultA.shokiHiyo)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  うち敷金 {fmtYen(resultA.shikikinAmount)}（返還可能性あり）
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">実質月額コスト</p>
                <p className="text-xl font-bold text-gray-900">
                  {fmtYen(resultA.monthlyReal)}/月
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  月額家賃+管理費: {fmtYen(resultA.monthlyTotal)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {years}年間 総コスト
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {fmtMan(resultA.grandTotal)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  初期費用〜退去費用まで
                </p>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div
              className={
                mode === "2" && resultB
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
                  : "mb-6"
              }
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <ResultBreakdown
                  result={resultA}
                  years={years}
                  propName={mode === "2" ? propA.name || "物件A" : ""}
                />
              </div>
              {mode === "2" && resultB && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <ResultBreakdown
                    result={resultB}
                    years={years}
                    propName={propB.name || "物件B"}
                  />
                </div>
              )}
            </div>

            {/* 2物件比較表 */}
            {mode === "2" && resultB && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  2物件 比較表
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-kon text-white">
                        <th className="px-4 py-3 text-left font-semibold">
                          項目
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {propA.name || "物件A"}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {propB.name || "物件B"}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          差額
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        {
                          label: "初期費用",
                          a: resultA.shokiHiyo,
                          b: resultB.shokiHiyo,
                        },
                        {
                          label: "月額コスト",
                          a: resultA.monthlyTotal,
                          b: resultB.monthlyTotal,
                        },
                        {
                          label: `${years}年間 家賃総額`,
                          a: resultA.totalYachin,
                          b: resultB.totalYachin,
                        },
                        {
                          label: "更新料合計",
                          a: resultA.koushinTotal,
                          b: resultB.koushinTotal,
                        },
                        {
                          label: "退去時実質負担",
                          a: resultA.departureNet,
                          b: resultB.departureNet,
                        },
                        {
                          label: `${years}年間 総コスト`,
                          a: resultA.grandTotal,
                          b: resultB.grandTotal,
                        },
                        {
                          label: "実質月額コスト",
                          a: resultA.monthlyReal,
                          b: resultB.monthlyReal,
                        },
                      ].map((row) => {
                        const diff = row.a - row.b;
                        const isHighlight =
                          row.label.includes("総コスト") ||
                          row.label.includes("実質月額");
                        return (
                          <tr
                            key={row.label}
                            className={`hover:bg-gray-50 ${isHighlight ? "font-semibold bg-gray-50" : ""}`}
                          >
                            <td className="px-4 py-2 text-gray-700">
                              {row.label}
                            </td>
                            <td
                              className={`px-4 py-2 text-right ${diff > 0 ? "text-danger" : diff < 0 ? "text-green-600" : ""}`}
                            >
                              {fmtMan(row.a)}
                            </td>
                            <td
                              className={`px-4 py-2 text-right ${diff < 0 ? "text-danger" : diff > 0 ? "text-green-600" : ""}`}
                            >
                              {fmtMan(row.b)}
                            </td>
                            <td
                              className={`px-4 py-2 text-right ${diff > 0 ? "text-danger" : diff < 0 ? "text-green-600" : "text-gray-500"}`}
                            >
                              {diff === 0
                                ? "同じ"
                                : `${diff > 0 ? "A高" : "B高"} ${fmtMan(Math.abs(diff))}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-kon">
                  <p className="text-sm font-semibold text-kon">
                    {(() => {
                      const diff = resultA.grandTotal - resultB.grandTotal;
                      if (diff === 0)
                        return `${years}年間住む場合、両物件のコストはほぼ同じです。`;
                      const cheaper =
                        diff > 0
                          ? propB.name || "物件B"
                          : propA.name || "物件A";
                      return `${years}年間住む場合、${cheaper}の方が約${fmtMan(Math.abs(diff))}お得です。`;
                    })()}
                  </p>
                </div>
              </div>
            )}

            <AdUnit slot="6291847305" format="horizontal" className="mb-6" />
          </>
        )}

        {/* SEO: 初期費用早見表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            賃貸初期費用の目安早見表
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            家賃10万円の物件を借りる場合の目安：
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    項目
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    相場
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    金額目安
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { item: "敷金", rate: "1ヶ月", amount: "10万円" },
                  { item: "礼金", rate: "1ヶ月", amount: "10万円" },
                  { item: "仲介手数料", rate: "1ヶ月+税", amount: "11万円" },
                  { item: "前家賃", rate: "1ヶ月", amount: "10万円" },
                  { item: "鍵交換", rate: "固定", amount: "1.5万円" },
                  { item: "火災保険", rate: "2年分", amount: "1.5万円" },
                  { item: "保証会社", rate: "50%", amount: "5万円" },
                  { item: "合計", rate: "", amount: "約49万円" },
                ].map((row) => (
                  <tr
                    key={row.item}
                    className={`hover:bg-gray-50 ${row.item === "合計" ? "font-bold bg-gray-50" : ""}`}
                  >
                    <td className="px-4 py-2 text-gray-700">{row.item}</td>
                    <td className="px-4 py-2 text-right text-gray-500">
                      {row.rate}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-900">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: 基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            賃貸コストの基礎知識
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              賃貸物件を借りる際は、家賃以外にも多くの初期費用がかかります。
              一般的に初期費用は
              <strong>「家賃4〜6ヶ月分」</strong>が目安です。
            </p>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                返ってくるお金と返ってこないお金
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>敷金</strong>
                  ：退去時に原状回復費用を差し引いた残額が返還されます
                </li>
                <li>
                  <strong>礼金</strong>：大家さんへの謝礼で返還されません
                </li>
                <li>
                  <strong>仲介手数料</strong>
                  ：不動産会社への報酬で返還されません
                </li>
                <li>
                  <strong>前家賃</strong>
                  ：居住期間の家賃として使われるため実質的には損しません
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                礼金ゼロ物件の注意点
              </h3>
              <p>
                礼金がゼロの物件でも、退去時のクリーニング費用が礼金代わりに請求されるケースがあります。
                入居前に退去費用の負担条件を確認しましょう。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                更新料について
              </h3>
              <p>
                多くの物件では2年ごとに更新料として家賃1ヶ月分が必要です。
                更新料がない物件でも、火災保険の更新や保証会社の更新料がかかる場合があります。
                長期居住ほど更新コストの積み上がりに注意が必要です。
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            よくある質問
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "賃貸の初期費用を安くする方法はありますか？",
                a: "いくつかの方法があります。①礼金ゼロ・敷金ゼロ物件を選ぶ②フリーレント（入居後数ヶ月家賃無料）物件を探す③仲介手数料を交渉する（法律上は0.5ヶ月が上限だが1ヶ月を請求する業者が多い）④引越し時期を繁忙期（2〜3月）を避ける⑤保証会社を自分で選べる物件を選ぶ、などが有効です。",
              },
              {
                q: "敷金は全額返ってきますか？",
                a: "国土交通省のガイドラインでは、通常の生活による劣化・消耗（自然損耗）は貸主負担とされています。借主負担となるのは故意・過失による損傷です。ただし実際には原状回復費用を多く請求されるケースも多く、入居時の物件状態を写真で記録しておくことをお勧めします。",
              },
              {
                q: "仲介手数料は値引き交渉できますか？",
                a: "可能な場合があります。宅地建物取引業法では仲介手数料の上限は「賃料の1ヶ月分+消費税」ですが、借主からの承諾なしに1ヶ月分を請求することは本来できません。特に空室が多い時期や閑散期には交渉しやすくなります。",
              },
              {
                q: "保証会社の費用はどのくらいですか？",
                a: "初回保証料は家賃の30〜100%が一般的です（家賃10万円なら3〜10万円）。また毎年または2年ごとに更新料（1万円程度）が発生する場合があります。保証会社によって費用が大きく異なるため、入居前に確認しましょう。",
              },
              {
                q: "退去時の原状回復費用の相場はいくらですか？",
                a: "通常の使用の場合、ハウスクリーニング費用が主な負担となり、1K〜1LDKで3〜6万円程度が相場です。タバコによる汚れ・ペットによる傷などがある場合はさらに追加されます。国土交通省の「原状回復をめぐるトラブルとガイドライン」を参考に、不当な請求に対しては交渉することも可能です。",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 text-sm list-none flex items-start gap-2">
                  <span className="text-kon font-bold shrink-0">
                    Q{i + 1}.
                  </span>
                  {item.q}
                </summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            あわせて使えるツール
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                href: "/realestate/rent-vs-buy",
                label: "家賃 vs 購入 比較計算機",
                desc: "賃貸と購入、どちらがお得かシミュレーション",
              },
              {
                href: "/realestate/moving-cost-calculator",
                label: "引越し費用 見積もり計算機",
                desc: "引越し業者の費用相場を計算",
              },
              {
                href: "/realestate/acquisition-tax",
                label: "不動産取得税 計算機",
                desc: "軽減措置を自動適用して税額を計算",
              },
              {
                href: "/finance/jutaku-loan",
                label: "住宅ローン計算機",
                desc: "月々の返済額・総返済額をシミュレーション",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-ai transition-all group"
              >
                <p className="font-semibold text-gray-900 group-hover:text-ai text-sm mb-1">
                  {tool.label}
                </p>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
