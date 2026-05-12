"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FAQS } from "./faqs";
import {
  translateBuildingType,
  translateStructure,
  translateFloorPlan,
  translateQuarter,
  translateTerrain,
  translateYear,
  translateOperator,
} from "./translations";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api-staging.yamada-tools.jp";

// ─── Types ───────────────────────────────────────────────────────────────────

type HazardFlood = {
  detected: boolean;
  risk: string;
  depth_label: string | null;
  river: string | null;
  desc: string | null;
};

type LandslideItem = {
  level: string;
  risk: string;
  type: string;
  icon: string;
  desc: string | null;
  area: string | null;
};

type HazardLandslide = {
  detected: boolean;
  risk: string;
  items: LandslideItem[];
};

type HazardLiquefaction = {
  detected: boolean;
  risk: string;
  label: string | null;
  desc: string | null;
  terrain: string | null;
};

type HazardSimple = { detected: boolean; risk: string };

type HazardEnglish = {
  overall_risk: string;
  flood: HazardFlood;
  landslide: HazardLandslide;
  liquefaction: HazardLiquefaction;
  tsunami: HazardSimple;
  storm_surge: HazardSimple;
};

type ZoningEnglish = {
  zone_code: number;
  zone_name: string;
  zone_friendly: string;
  coverage_ratio_pct: number | null;
  floor_area_ratio_pct: number | null;
  height_limit_applies: boolean;
  height_note: string;
  shadow_regulation: boolean;
  confidence: string;
};

type LandPriceEnglish = {
  nearest_point: {
    distance_m: number;
    location: string;
    standard_lot_number: string;
    target_year: string;
    land_price_type: string;
  };
  price: {
    current_per_sqm: string | null;
    current_per_sqm_raw: number | null;
    current_per_tsubo: string | null;
    last_year_per_sqm: string | null;
    change_rate_pct: number;
    change_direction: string;
  };
  land_use: { category: string; zone: string; surrounding: string };
  nearest_station: string;
  station_distance: string;
  area_stats_3km: {
    count: number;
    avg_per_sqm: string | null;
    min_per_sqm: string | null;
    max_per_sqm: string | null;
  };
};

type TxStats = {
  count: number;
  avg_per_sqm?: string | null;
  min_per_sqm?: string | null;
  max_per_sqm?: string | null;
  avg_per_tsubo?: string | null;
  avg_total?: string | null;
};

type TxTransaction = {
  period: string;
  land_type: string;
  use_category: string;
  district: string;
  city: string;
  area: string;
  total_price: string | null;
  price_per_sqm: string | null;
  price_per_tsubo: string | null;
  floor_plan: string | null;
  construction_year: string | null;
  structure: string | null;
};

type TransactionEnglish = {
  period: string;
  total_transactions: number;
  most_common_type: string | null;
  overall_stats: TxStats;
  type_stats: TxStats;
  recent_transactions: TxTransaction[];
};

type School = {
  school_name: string;
  operator: string;
  address: string;
  maps_url: string;
} | null;

type SchoolEnglish = {
  elementary: School;
  junior_high: School;
  note: string;
  commercial_use_warning: string;
};

type PopTrend = {
  year: number;
  population: number;
  change_from_2020_pct: number | null;
};

type PopEnglish = {
  trend_direction: string;
  trend_description: string;
  population_trend: PopTrend[];
  summary: {
    base_year: number;
    base_population: number | null;
    projected_2050: number | null;
    change_to_2050_pct: number | null;
  };
  densely_inhabited_district: {
    in_did: boolean;
    info: {
      city: string;
      population: number | null;
      area_km2: number | null;
      density: number | null;
      year: number;
    } | null;
  };
};

type SectionOf<T> = { raw_jp: T | null; english: T | null; commercial_use_ok: boolean };

type PropertyReport = {
  address: {
    input: string;
    normalized_jp: string;
    romaji: string | null;
    lat: number;
    lng: number;
  };
  hazard: SectionOf<HazardEnglish>;
  zoning: SectionOf<ZoningEnglish>;
  land_price: SectionOf<LandPriceEnglish>;
  transaction_price: SectionOf<TransactionEnglish>;
  school_district: SectionOf<SchoolEnglish>;
  population: SectionOf<PopEnglish>;
  data_source: string;
  credit_text: string;
  generated_at: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SAMPLE_ADDRESSES = [
  "東京都千代田区千代田1-1",
  "大阪市北区梅田1-1-1",
  "東京都渋谷区渋谷2-21-1",
  "名古屋市中村区名駅1-1",
];

function computePricePerSqm(totalPrice: string | null, area: string | null): string | null {
  if (!totalPrice || !area) return null;
  const totalNum = parseFloat(totalPrice.replace(/[¥,\s]/g, ""));
  const areaNum = parseFloat(area.split(/[-〜～]/)[0].replace(/[㎡坪\s]/g, ""));
  if (isNaN(totalNum) || isNaN(areaNum) || areaNum === 0) return null;
  return `¥${Math.round(totalNum / areaNum).toLocaleString()}`;
}

function riskColor(risk: string) {
  const r = risk.toLowerCase();
  if (r === "high")   return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700";
  if (r === "medium") return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700";
  if (r === "low")    return "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700";
  return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600";
}

function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${riskColor(risk)}`}>
      {risk}
    </span>
  );
}

function SectionCard({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-bold text-gray-900 dark:text-white text-base">{title}</h2>
        {badge}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function RawJpToggle({ data }: { data: unknown }) {
  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        Show raw Japanese data (開発者用)
      </summary>
      <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

function NA() {
  return <span className="text-gray-400 dark:text-gray-500 text-sm">N/A</span>;
}

// ─── Section components ───────────────────────────────────────────────────────

function HazardSection({ section }: { section: SectionOf<HazardEnglish> }) {
  const en = section.english;
  if (!en) return <SectionCard title="Hazard Summary"><p className="text-gray-500 text-sm">No hazard data available for this address.</p></SectionCard>;

  const rows: Array<{ label: string; value: string | null; extra?: React.ReactNode }> = [
    { label: "Flood Risk", value: en.flood.detected ? `${en.flood.risk}${en.flood.depth_label ? ` — ${en.flood.depth_label}` : ""}` : "None detected" },
    { label: "Landslide Risk", value: en.landslide.detected ? `${en.landslide.risk}${en.landslide.items.length ? ` (${en.landslide.items.map(i => i.type).join(", ")})` : ""}` : "None detected" },
    { label: "Liquefaction Risk", value: en.liquefaction.detected ? `${en.liquefaction.risk}${en.liquefaction.label ? ` — ${en.liquefaction.label}` : ""}` : "None detected" },
    { label: "Tsunami Risk", value: en.tsunami.detected ? en.tsunami.risk : "None detected" },
    { label: "Storm Surge Risk", value: en.storm_surge.detected ? en.storm_surge.risk : "None detected" },
  ];

  return (
    <SectionCard
      title="Hazard Summary"
      badge={<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${riskColor(en.overall_risk)}`}>Overall: {en.overall_risk}</span>}
    >
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-4 py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">{r.label}</span>
            <span className="text-sm text-gray-900 dark:text-white text-right">{r.value}</span>
          </div>
        ))}
      </div>
      {en.flood.detected && en.flood.desc && (
        <p className="mt-3 text-sm text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 rounded px-3 py-2">
          Flood note: {en.flood.desc}
        </p>
      )}
      {en.liquefaction.detected && en.liquefaction.desc && (
        <p className="mt-2 text-sm text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 rounded px-3 py-2">
          Liquefaction note: {translateTerrain(en.liquefaction.desc)}
        </p>
      )}
      {en.landslide.detected && en.landslide.items.map((item, i) => (
        <p key={i} className="mt-2 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/30 rounded px-3 py-2">
          {item.icon} {item.level}: {item.type}{item.desc ? ` — ${item.desc}` : ""}
        </p>
      ))}
      <RawJpToggle data={section.raw_jp} />
    </SectionCard>
  );
}

function ZoningSection({ section }: { section: SectionOf<ZoningEnglish> }) {
  const en = section.english;
  if (!en) return <SectionCard title="Zoning Classification"><p className="text-gray-500 text-sm">No zoning data available for this address.</p></SectionCard>;

  return (
    <SectionCard title="Zoning Classification" badge={
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-kon/10 dark:bg-kon/30 text-kon dark:text-gray-200 border border-kon/20">
        Zone {en.zone_code}
      </span>
    }>
      <div className="mb-3">
        <p className="text-lg font-bold text-gray-900 dark:text-white">{en.zone_name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{en.zone_friendly}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <StatBox label="Coverage Ratio" value={en.coverage_ratio_pct != null ? `${en.coverage_ratio_pct}%` : "—"} />
        <StatBox label="Floor Area Ratio" value={en.floor_area_ratio_pct != null ? `${en.floor_area_ratio_pct}%` : "—"} />
        <StatBox label="Height Limit" value={en.height_limit_applies ? "Yes" : "None"} />
        <StatBox label="Shadow Reg." value={en.shadow_regulation ? "Applies" : "None"} />
      </div>
      {en.height_note && (
        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded px-3 py-2">
          Height / shadow: {en.height_note}
        </p>
      )}
      {en.confidence === "low" && (
        <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
          ⚠ Low confidence — nearest zone boundary used. Verify with municipal planning office.
        </p>
      )}
      <RawJpToggle data={section.raw_jp} />
    </SectionCard>
  );
}

function LandPriceSection({ section }: { section: SectionOf<LandPriceEnglish> }) {
  const en = section.english;
  if (!en) return <SectionCard title="Land Price &amp; Trend"><p className="text-gray-500 text-sm">No land price data available for this address.</p></SectionCard>;

  const p = en.price;
  const dirColor = p.change_direction === "Rising"
    ? "text-green-700 dark:text-green-300"
    : p.change_direction === "Falling"
    ? "text-red-700 dark:text-red-300"
    : "text-gray-600 dark:text-gray-400";
  const dirArrow = p.change_direction === "Rising" ? "↑" : p.change_direction === "Falling" ? "↓" : "→";

  return (
    <SectionCard title="Land Price &amp; Trend">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatBox label="Price / ㎡" value={p.current_per_sqm || "—"} />
        <StatBox label="Price / tsubo" value={p.current_per_tsubo || "—"} />
        <StatBox label="Last Year / ㎡" value={p.last_year_per_sqm || "—"} />
        <StatBox label="YoY Change" value={`${dirArrow} ${p.change_rate_pct > 0 ? "+" : ""}${p.change_rate_pct}%`} valueClass={dirColor} />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
        <p><span className="font-medium text-gray-700 dark:text-gray-300">Survey type:</span> {en.nearest_point.land_price_type}</p>
        <p><span className="font-medium text-gray-700 dark:text-gray-300">Sample point:</span> {en.nearest_point.location} ({en.nearest_point.distance_m}m away)</p>
        {en.nearest_station && <p><span className="font-medium text-gray-700 dark:text-gray-300">Nearest station:</span> {en.nearest_station} {en.station_distance}</p>}
      </div>
      {en.area_stats_3km.count > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Area comparison (3 km radius, {en.area_stats_3km.count} sample points)</p>
          <div className="flex gap-6 text-gray-600 dark:text-gray-400">
            <span>Avg: {en.area_stats_3km.avg_per_sqm || "—"}/㎡</span>
            <span>Min: {en.area_stats_3km.min_per_sqm || "—"}</span>
            <span>Max: {en.area_stats_3km.max_per_sqm || "—"}</span>
          </div>
        </div>
      )}
      <RawJpToggle data={section.raw_jp} />
    </SectionCard>
  );
}

function TransactionSection({ section }: { section: SectionOf<TransactionEnglish> }) {
  const en = section.english;
  if (!en) return <SectionCard title="Recent Transaction Prices"><p className="text-gray-500 text-sm">No transaction data available for this address.</p></SectionCard>;

  return (
    <SectionCard title="Recent Transaction Prices">
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div><span className="text-gray-500 dark:text-gray-400">Period: </span><span className="font-medium text-gray-900 dark:text-white">{translateQuarter(en.period)}</span></div>
        <div><span className="text-gray-500 dark:text-gray-400">Total transactions: </span><span className="font-medium text-gray-900 dark:text-white">{en.total_transactions.toLocaleString()}</span></div>
        {en.most_common_type && <div><span className="text-gray-500 dark:text-gray-400">Dominant type: </span><span className="font-medium text-gray-900 dark:text-white">{translateBuildingType(en.most_common_type)}</span></div>}
      </div>

      {en.overall_stats.count > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm mb-4">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">All types — {en.overall_stats.count} transactions</p>
          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
            {en.overall_stats.avg_per_sqm && <span>Avg/㎡: {en.overall_stats.avg_per_sqm}</span>}
            {en.overall_stats.min_per_sqm && <span>Min/㎡: {en.overall_stats.min_per_sqm}</span>}
            {en.overall_stats.max_per_sqm && <span>Max/㎡: {en.overall_stats.max_per_sqm}</span>}
            {en.overall_stats.avg_total && <span>Avg total: {en.overall_stats.avg_total}</span>}
          </div>
        </div>
      )}

      {en.recent_transactions.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Nearest transactions</p>
          <div className="space-y-2">
            {en.recent_transactions.map((t, i) => {
              const displayPricePerSqm = t.price_per_sqm || computePricePerSqm(t.total_price, t.area);
              return (
                <div key={i} className="border border-gray-100 dark:border-gray-700 rounded p-3 text-sm">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="font-medium text-gray-900 dark:text-white">{displayPricePerSqm || "—"}/㎡</span>
                    {t.total_price && <span className="text-gray-600 dark:text-gray-400">Total: {t.total_price}</span>}
                    <span className="text-gray-500 dark:text-gray-400">{translateQuarter(t.period)}</span>
                    {t.land_type && <span className="text-gray-500 dark:text-gray-400">{translateBuildingType(t.land_type)}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t.area && <span>Area: {t.area}</span>}
                    {t.floor_plan && <span>Floor plan: {translateFloorPlan(t.floor_plan)}</span>}
                    {t.construction_year && <span>Built: {translateYear(t.construction_year)}</span>}
                    {t.structure && <span>{translateStructure(t.structure)}</span>}
                    {t.district && <span>{t.district}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <RawJpToggle data={section.raw_jp} />
    </SectionCard>
  );
}

function SchoolSection({ section }: { section: SectionOf<SchoolEnglish> }) {
  const en = section.english;
  if (!en) return (
    <SectionCard title="Nearest Schools (Personal Use Only)">
      <p className="text-gray-500 text-sm">No school district data available for this address.</p>
    </SectionCard>
  );

  return (
    <SectionCard title="Nearest Schools" badge={
      <span className="inline-block px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700">
        Personal use only
      </span>
    }>
      <div className="space-y-3">
        {en.elementary && (
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Elementary School</p>
            <p className="font-medium text-gray-900 dark:text-white">{en.elementary.school_name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{en.elementary.address}</p>
            {en.elementary.operator && <p className="text-xs text-gray-500 dark:text-gray-500">Operator: {translateOperator(en.elementary.operator)}</p>}
            <a href={en.elementary.maps_url} target="_blank" rel="noopener noreferrer" className="text-xs text-kon dark:text-gray-300 hover:underline mt-1 inline-block">View on Google Maps →</a>
          </div>
        )}
        {en.junior_high && (
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Junior High School</p>
            <p className="font-medium text-gray-900 dark:text-white">{en.junior_high.school_name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{en.junior_high.address}</p>
            {en.junior_high.operator && <p className="text-xs text-gray-500 dark:text-gray-500">Operator: {translateOperator(en.junior_high.operator)}</p>}
            <a href={en.junior_high.maps_url} target="_blank" rel="noopener noreferrer" className="text-xs text-kon dark:text-gray-300 hover:underline mt-1 inline-block">View on Google Maps →</a>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 rounded px-3 py-2">
        {en.note}
      </p>
      <RawJpToggle data={section.raw_jp} />
    </SectionCard>
  );
}

function PopulationSection({ section }: { section: SectionOf<PopEnglish> }) {
  const en = section.english;
  if (!en) return <SectionCard title="Population Trend"><p className="text-gray-500 text-sm">No population data available for this address.</p></SectionCard>;

  const trendColor = en.trend_direction === "growing"
    ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30"
    : en.trend_direction === "slight_decline"
    ? "text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30"
    : en.trend_direction === "declining"
    ? "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30"
    : "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900";

  const s = en.summary;

  return (
    <SectionCard title="Population Trend">
      <div className={`rounded px-4 py-3 mb-4 text-sm font-medium ${trendColor}`}>
        {en.trend_description}
      </div>
      {s.base_population && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatBox label="2020 Population" value={s.base_population.toLocaleString()} />
          <StatBox label="2050 Projection" value={s.projected_2050 ? s.projected_2050.toLocaleString() : "—"} />
          <StatBox label="Change to 2050" value={s.change_to_2050_pct != null ? `${s.change_to_2050_pct > 0 ? "+" : ""}${s.change_to_2050_pct}%` : "—"} valueClass={s.change_to_2050_pct != null && s.change_to_2050_pct > 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"} />
        </div>
      )}
      {en.population_trend.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                {en.population_trend.map((t) => (
                  <th key={t.year} className="px-2 py-1 font-medium text-gray-500 dark:text-gray-400 text-center border-b border-gray-200 dark:border-gray-700">{t.year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {en.population_trend.map((t) => (
                  <td key={t.year} className="px-2 py-1.5 text-center text-gray-800 dark:text-gray-200">{t.population.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                {en.population_trend.map((t) => (
                  <td key={t.year} className={`px-2 py-1 text-center text-xs ${t.change_from_2020_pct != null && t.change_from_2020_pct > 0 ? "text-green-600 dark:text-green-400" : t.change_from_2020_pct != null && t.change_from_2020_pct < 0 ? "text-red-600 dark:text-red-400" : "text-gray-400"}`}>
                    {t.change_from_2020_pct != null ? `${t.change_from_2020_pct > 0 ? "+" : ""}${t.change_from_2020_pct}%` : ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {en.densely_inhabited_district.in_did && en.densely_inhabited_district.info && (
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded px-3 py-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Densely Inhabited District (DID):</span>{" "}
          This address is in an urban core zone. Population density: {en.densely_inhabited_district.info.density?.toLocaleString()} persons/km².
        </div>
      )}
      <RawJpToggle data={section.raw_jp} />
    </SectionCard>
  );
}

function StatBox({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`font-bold text-sm text-gray-900 dark:text-white ${valueClass || ""}`}>{value}</p>
    </div>
  );
}

// ─── Map placeholder ──────────────────────────────────────────────────────────

function MapSection({ lat, lng, address }: { lat: number; lng: number; address: string }) {
  const gsiUrl = `https://maps.gsi.go.jp/#15/${lat}/${lng}/`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <SectionCard title="Property Location">
      <iframe
        src={`https://maps.gsi.go.jp/#16/${lat}/${lng}/&base=std&ls=std&disp=1`}
        width="100%"
        height="300"
        style={{ border: "1px solid #ddd", borderRadius: "8px" }}
        title="GSI Map — Japan Property Location"
      />
      <div className="flex gap-3 mt-3 flex-wrap">
        <a href={gsiUrl} target="_blank" rel="noopener noreferrer"
           className="inline-block px-4 py-2 bg-kon hover:bg-ai text-white text-sm font-semibold rounded-lg transition">
          Open GSI Map (Official) →
        </a>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
           className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-semibold rounded-lg transition">
          Google Maps →
        </a>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {lat.toFixed(6)}, {lng.toFixed(6)} · GSI (Geospatial Information Authority of Japan) — official government map service. No Zenrin tiles used.
      </p>
    </SectionCard>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PropertyReportClient() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<PropertyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function runReport(addr: string) {
    if (!addr.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(
        `${API_URL}/api/property-report-en?address=${encodeURIComponent(addr)}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runReport(address);
  }

  if (!mounted) {
    return <div className="min-h-screen py-12 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">

      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav className="max-w-5xl mx-auto px-4 pt-6 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li>›</li>
          <li><Link href="/en/business" className="hover:underline">Business Tools</Link></li>
          <li>›</li>
          <li className="text-gray-700 dark:text-gray-200 font-medium">Property Report</li>
        </ol>
      </nav>

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="max-w-5xl mx-auto px-4 mt-6 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Japan Property Due Diligence Report — Free Address Check (English)
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Hazard map, zoning, land prices &amp; population trend in English for any Japanese address. Free, no sign-up.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-kon/30 text-kon dark:text-gray-300 rounded-full">
            <span aria-hidden>🛡️</span> Official MLIT data
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
            <span aria-hidden>🇯🇵</span> 6 data layers in one report
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-kon/30 text-kon dark:text-gray-300 rounded-full">
            <span aria-hidden>⚡</span> Free, instant, no signup
          </span>
        </div>
      </header>

      {/* ─── Direct-answer block ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mb-6">
        <div className="direct-answer-block bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-400 p-4 md:p-5 rounded-r-lg">
          <p className="text-gray-800 dark:text-gray-100 text-sm md:text-base leading-relaxed">
            <strong>How to check a Japan property address in English (free):</strong>{" "}
            Enter any Japanese address below — in kanji, kana, or postal code. This tool pulls{" "}
            <strong>six official government data layers</strong> for that address:{" "}
            (1) hazard map risks (flood, landslide, liquefaction, tsunami, storm surge),{" "}
            (2) zoning classification with building coverage and FAR ratios,{" "}
            (3) official land price benchmark with year-on-year trend,{" "}
            (4) recent transaction prices from actual completed sales,{" "}
            (5) nearest public school districts, and{" "}
            (6) 50-year population projections.{" "}
            All data is from{" "}
            <strong>MLIT REINFOLIB — Japan&apos;s official real estate information library</strong>.{" "}
            No signup required.
          </p>
        </div>
      </section>

      {/* ─── Search form ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mb-6" id="step1">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <label htmlFor="address-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Property address (Japanese kanji, kana, romaji, or postal code)
          </label>
          <div className="flex gap-2">
            <input
              id="address-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 東京都千代田区千代田1-1"
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kon"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="px-6 py-3 bg-kon hover:bg-ai disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold rounded-lg transition whitespace-nowrap"
            >
              {loading ? "Checking..." : "Check"}
            </button>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Try these sample addresses:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_ADDRESSES.map((s) => (
                <button key={s} type="button" onClick={() => { setAddress(s); runReport(s); }}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-ai/30 text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-600 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>

      {/* ─── Error ──────────────────────────────────────────────────── */}
      {error && (
        <section className="max-w-5xl mx-auto px-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        </section>
      )}

      {/* ─── Loading ────────────────────────────────────────────────── */}
      {loading && (
        <section className="max-w-5xl mx-auto px-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-1">Pulling 6 data layers from MLIT REINFOLIB...</p>
            <p className="text-sm text-gray-400">This usually takes 5–10 seconds.</p>
          </div>
        </section>
      )}

      {/* ─── Results ────────────────────────────────────────────────── */}
      {data && !loading && (
        <section className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">Report for:</span>{" "}
              {data.address.normalized_jp || data.address.input}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {data.address.lat.toFixed(6)}, {data.address.lng.toFixed(6)} · Generated {new Date(data.generated_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>

          <MapSection lat={data.address.lat} lng={data.address.lng} address={data.address.normalized_jp} />

          <div id="step2"><HazardSection section={data.hazard} /></div>
          <div id="step3"><ZoningSection section={data.zoning} /></div>
          <div id="step4">
            <LandPriceSection section={data.land_price} />
          </div>
          <TransactionSection section={data.transaction_price} />
          <div id="step5">
            <SchoolSection section={data.school_district} />
            <div className="mt-4"><PopulationSection section={data.population} /></div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>
              <strong className="text-gray-700 dark:text-gray-300">Data source:</strong>{" "}
              <a href="https://www.reinfolib.mlit.go.jp/" target="_blank" rel="noopener noreferrer" className="hover:underline text-kon dark:text-gray-300">
                {data.data_source}
              </a>
            </p>
            <p>{data.credit_text}</p>
            <p className="text-yellow-700 dark:text-yellow-300">
              <strong>Disclaimer:</strong> For informational purposes only. Always verify with a licensed Japanese real estate professional (宅地建物取引士) before any property transaction.
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ EDUCATIONAL CONTENT (always visible — SEO + GEO) ════════ */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* ─── Section 1: Use cases for foreigners ────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">When you need a property due diligence report</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Whether you&apos;re a foreign buyer exploring akiya, a B2B company vetting a new facility, or a relocation client comparing neighborhoods — this report gives you the official data points that Japanese real estate agents review before every transaction.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "🏚", title: "Akiya (vacant property) buyers", text: "Akiya are often attractive on price but can sit in flood or landslide zones, have near-zero resale value, or be in municipalities losing 30%+ of their population by 2050. This report surfaces all of these risks before you commit." },
              { icon: "🌏", title: "Foreign buyers and investors", text: "Japan has no restrictions on foreign property ownership, but zoning and hazard disclosures are legally required at purchase. Understanding these in English before viewing — or before engaging a Japanese agent — saves significant time." },
              { icon: "🏢", title: "B2B — siting a warehouse or office", text: "Commercial tenants and developers check zoning (can a loading dock operate here?), flood risk (will insurance premiums be prohibitive?), and land price benchmarks before lease negotiations." },
              { icon: "📍", title: "Relocation families", text: "Families moving to Japan check school districts and population trends to evaluate which neighborhoods have growing English-friendly communities versus declining ones." },
              { icon: "💼", title: "Due diligence for M&A or loans", text: "When a target company owns Japanese real estate, property condition and zoning affect asset value. This report provides a rapid first-pass view of each address without engaging a local appraiser." },
              { icon: "🔍", title: "Verifying a landlord claim", text: "A landlord claims the area is low-risk and commercially viable — run this report to verify independently before signing a lease or purchase agreement." },
            ].map((u) => (
              <div key={u.title} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0" aria-hidden>{u.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{u.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{u.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 2: How to read each section ────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to read each section</h2>
          <ol className="space-y-5">
            {[
              { id: "step2", n: 1, title: "Hazard Summary", text: "Five hazards are assessed. 'None detected' means the government data shows no hazard polygon covers this coordinate — not that the area is perfectly safe. 'High' flood risk means the address is inside an official inundation zone (洪水浸水想定区域) — this triggers a mandatory seller disclosure under Japan's Building Lots and Buildings Transaction Business Act." },
              { id: "step3", n: 2, title: "Zoning Classification", text: "Japan's 13 zones balance residential, commercial, and industrial uses. The Coverage Ratio (建蔽率) limits how much of the lot a building's footprint can cover. The Floor Area Ratio (容積率) limits the total floor space across all floors. Zones 1–4 are purely residential; zones 9–10 are downtown commercial; zones 12–13 are industrial and prohibit housing." },
              { id: "step4", n: 3, title: "Land Price & Transactions", text: "The land price shown is the nearest annual government survey point — a benchmark, not an appraisal. Transaction prices are from actual completed sales reported to MLIT. Both together tell you whether a listing price is reasonable: compare the asking price per ㎡ against the area average from transaction data." },
              { id: "step5", n: 4, title: "Population Trend", text: "Japan's national population is declining, but trends vary sharply by location. Tokyo's central wards are growing; some rural towns are losing 40%+ by 2070. For long-term investments (residential rental, retail, hospitality), a 'declining' trend in the mesh grid is a fundamental demand-side risk." },
            ].map((s) => (
              <li key={s.id} id={s.id} className="flex gap-4 scroll-mt-20">
                <span className="flex-shrink-0 w-9 h-9 bg-kon text-white rounded-full flex items-center justify-center font-bold text-sm">{s.n}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Section 3: Glossary ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Japan property terms glossary</h2>
          <dl className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {[
              { jp: "用途地域 (youto chiiki)", def: "Land-use zone — Japan's 13-category zoning system specifying what can be built and operated." },
              { jp: "建蔽率 (kenpei-ritsu)", def: "Building coverage ratio — maximum footprint of a building as a % of land area." },
              { jp: "容積率 (youseki-ritsu)", def: "Floor area ratio (FAR) — maximum total floor space across all floors as a % of land area." },
              { jp: "地価公示 (chika kooji)", def: "Official Land Price Survey — MLIT's annual benchmark land price at thousands of sample points." },
              { jp: "液状化 (ekijoka)", def: "Liquefaction — sandy saturated soil losing strength during earthquakes, risking building subsidence." },
              { jp: "土砂災害警戒区域", def: "Landslide warning zone — area designated as at risk of steep slope collapse, debris flow, or landslide." },
              { jp: "学区 (gakku)", def: "School catchment area — the geographic boundary determining which public school a child attends." },
              { jp: "DID (人口集中地区)", def: "Densely Inhabited District — census designation for urbanized areas with high population density." },
              { jp: "宅地建物取引士", def: "Licensed real estate transaction specialist — required on every Japanese property transaction; legally responsible for hazard and zoning disclosures." },
              { jp: "不動産鑑定士 (fudosan kantei-shi)", def: "Certified real estate appraiser — licensed by MLIT to produce formal property valuations." },
              { jp: "地盤調査 (jiban chosa)", def: "Ground (soil) survey — investigates bearing capacity and liquefaction risk. Essential before new construction." },
              { jp: "空き家 (akiya)", def: "Vacant/abandoned house — Japan has 8+ million akiya; many available cheaply but require due diligence on hazard and zoning before purchase." },
            ].map((t) => (
              <div key={t.jp}>
                <dt className="font-semibold text-gray-900 dark:text-white mb-0.5">{t.jp}</dt>
                <dd className="text-sm text-gray-700 dark:text-gray-300">{t.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Section 4: Red flags ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-gray-50 dark:bg-danger/20 border-2 border-gray-200 dark:border-danger rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-danger dark:text-gin mb-4">🚩 Red flags to watch for</h2>
          <div className="space-y-4">
            {[
              { title: "High flood inundation depth", text: "If the report shows flood depth of 3m or more (2nd floor level), the address is in a government-designated high-risk zone. Insurance premiums will be higher, evacuation planning is mandatory, and some lenders will not finance properties in these zones." },
              { title: "Zone 12 or 13 — industrial zoning", text: "Exclusively Industrial zones (Zone 13) legally prohibit residential use. If you're planning a home or apartment, this address requires rezoning approval — a long, uncertain process. Quasi-Industrial (Zone 11) allows housing but with noisy/polluting neighbors." },
              { title: "Landslide Special Warning Zone (red zone)", text: "A 'Landslide Special Warning Zone' (土砂災害特別警戒区域) is the highest-risk designation — property development requires structural engineering review, and some uses are prohibited entirely. Red zones are a serious structural constraint." },
              { title: "Population declining >20% by 2070", text: "In a municipality losing >20% of its population in 50 years, expect: falling land values, declining local services (hospitals, schools closing), and difficulty finding tenants or buyers. For investment properties, this is a fundamental demand-side risk." },
              { title: "Official land price much lower than listing price", text: "If a property is listed at ¥50M but the MLIT benchmark for that area is ¥100K/㎡ on a 50㎡ lot — the numbers don't add up. Either the land includes a premium building, or the listing price is overstated. Always compare ¥/㎡ against the area transaction data." },
              { title: "No hazard data returned", text: "If all hazard sections show 'No data available,' the address may be outside MLIT's tile coverage (common in some rural areas) or the geocoding returned a different location than expected. Verify the address normalization shown at the top of the report." },
            ].map((r) => (
              <div key={r.title} className="border-l-4 border-danger pl-4 py-1">
                <h3 className="font-semibold text-danger dark:text-gin mb-1">{r.title}</h3>
                <p className="text-sm text-danger/90 dark:text-gin/90">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5: About REINFOLIB ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About MLIT REINFOLIB — the data source</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This tool queries the{" "}
            <strong>MLIT Real Estate Information Library (REINFOLIB)</strong>, operated by{" "}
            <strong>Japan&apos;s Ministry of Land, Infrastructure, Transport and Tourism (国土交通省 — MLIT)</strong>.
            MLIT is the government ministry responsible for urban planning, real estate regulation, flood control infrastructure, and national land surveys.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            REINFOLIB aggregates official datasets from multiple MLIT and government sources:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1.5 mb-4 text-sm">
            <li><strong>Flood Hazard Maps (洪水浸水想定区域)</strong> — river authority inundation models</li>
            <li><strong>Landslide Warning Zones (土砂災害警戒区域)</strong> — Sediment Disaster Prevention Act designations</li>
            <li><strong>Liquefaction Risk Maps (液状化危険度)</strong> — earthquake ground response surveys</li>
            <li><strong>Zoning Map (用途地域)</strong> — City Planning Act land-use designations</li>
            <li><strong>Official Land Price Survey (地価公示)</strong> — annual MLIT benchmark valuations</li>
            <li><strong>Real Estate Transaction Price Survey (不動産取引価格情報)</strong> — mandatory post-transaction reporting</li>
            <li><strong>School District Boundaries (通学区域)</strong> — municipal board of education polygons</li>
            <li><strong>Population Mesh Data (将来推計人口)</strong> — national 500m-mesh projections to 2070</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            All data is provided as a public service by the Japanese government and is the same authoritative data used by Japanese real estate agencies, banks, and local government planning offices.
          </p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
            This service uses the MLIT Real Estate Information Library Web-API; data accuracy is not guaranteed by MLIT.
          </p>
        </div>
      </section>

      {/* ─── Section 6: FAQ ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <summary className="cursor-pointer px-4 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-gray-900 dark:text-white flex items-start gap-2">
                  <span className="text-kon dark:text-gray-300 group-open:rotate-90 transition-transform">▸</span>
                  <span>{faq.q}</span>
                </summary>
                <div className="faq-answer px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Japanese version link ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-gray-50 dark:bg-kon/20 border border-gray-200 dark:border-kon rounded-xl p-5">
          <h2 className="text-base font-semibold text-kon dark:text-gray-300 mb-2">Looking for the Japanese version?</h2>
          <p className="text-sm text-kon dark:text-gray-300 mb-3">
            日本語版の用途地域チェッカーをご利用いただけます。
          </p>
          <Link href="/realestate/yoto-chiiki-checker"
            className="inline-block px-4 py-2 bg-kon hover:bg-ai text-white text-sm font-semibold rounded-lg transition">
            日本語版 用途地域チェッカー →
          </Link>
        </div>
      </section>
    </div>
  );
}
