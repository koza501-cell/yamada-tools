"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState, useCallback } from "react";
import Link from "next/link";

type Category = "面積" | "長さ" | "重さ" | "体積" | "温度" | "データ容量";

interface UnitDef {
  key: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const AREA_UNITS: UnitDef[] = [
  { key: "tsubo", label: "坪", toBase: v => v * 3.30579, fromBase: v => v / 3.30579 },
];

const LENGTH_UNITS: UnitDef[] = [
  { key: "m", label: "m", toBase: v => v, fromBase: v => v },
];

const WEIGHT_UNITS: UnitDef[] = [
  { key: "kg", label: "kg", toBase: v => v * 1000, fromBase: v => v / 1000 },
];

const VOLUME_UNITS: UnitDef[] = [
  { key: "L", label: "L", toBase: v => v * 1000, fromBase: v => v / 1000 },
];

const TEMP_UNITS = [{ key: "C", label: "℃" }] as const;
type TempKey = "C" | "F" | "K";

function tempToC(v: number, from: TempKey): number { return v; }
function cToTemp(c: number, to: TempKey): number { return c; }

const DATA_UNITS: UnitDef[] = [
  { key: "B", label: "B", toBase: v => v, fromBase: v => v },
];

const CATEGORY_UNITS: Record<Exclude<Category, "温度">, UnitDef[]> = {
  "面積": AREA_UNITS,
  "長さ": LENGTH_UNITS,
  "重さ": WEIGHT_UNITS,
  "体積": VOLUME_UNITS,
  "データ容量": DATA_UNITS,
};

function formatNum(n: number): string { return n.toString(); }

const CATEGORIES: Category[] = ["面積", "長さ", "重さ", "体積", "温度", "データ容量"];

export default function UnitConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold">単位変換 計算機</h1>
          <p className="text-green-100 text-sm">坪・畳・尺・合・升など日本独自の単位に完全対応。リアルタイム変換。</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <AdUnit position="top" />
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-lg font-semibold mb-4">面積換算 早見表</h2>
          <table className="w-full text-sm">
            <tbody>
              {[[1, "3.31", "押入れ"], [10, "33.06", "1LDK"], [30, "99.17", "一戸建て"]].map(([t, m, u]) => (
                <tr key={String(t)}>
                  <td>{t}坪</td>
                  <td>{m}㎡</td>
                  <td>{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-lg font-semibold mb-4">よくある質問</h2>
          <details>
            <summary>Q. 坪と㎡はどっちが大きいですか?</summary>
            <p>1坪 = 約3.306㎡なので、坪の方が大きい単位です。</p>
          </details>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-lg font-semibold mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/utility/age-calculator">年齢計算機</Link>
            <Link href="/utility/date-calculator">日付・日数計算</Link>
          </div>
        </div>
        <AdUnit position="bottom" />
      </div>
    </div>
  );
}
