"use client";
import { useState, useId, forwardRef } from "react";
import * as Popover from "@radix-ui/react-popover";

type Era = "seireki" | "reiwa" | "heisei" | "showa";

interface EraInfo {
  label: string;
  startYear: number;
  endYear: number;
  eraStartOffset: number;
}

const ERA_INFO: Record<Exclude<Era, "seireki">, EraInfo> = {
  reiwa:  { label: "令和", startYear: 2019, endYear: 9999, eraStartOffset: 2018 },
  heisei: { label: "平成", startYear: 1989, endYear: 2019, eraStartOffset: 1988 },
  showa:  { label: "昭和", startYear: 1926, endYear: 1989, eraStartOffset: 1925 },
};

function adToEra(adYear: number): { era: Exclude<Era, "seireki">; eraYear: number } {
  if (adYear >= 2019) return { era: "reiwa",  eraYear: adYear - 2018 };
  if (adYear >= 1989) return { era: "heisei", eraYear: adYear - 1988 };
  return                     { era: "showa",  eraYear: adYear - 1925 };
}

function eraToAd(era: Exclude<Era, "seireki">, eraYear: number): number {
  return eraYear + ERA_INFO[era].eraStartOffset;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function formatDisplay(iso: string, era: Era): string {
  if (!iso) return "日付を選択";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "日付を選択";
  if (era === "seireki") return `${y}年${m}月${d}日`;
  const { era: e, eraYear } = adToEra(y);
  return `${ERA_INFO[e].label}${eraYear}年${m}月${d}日`;
}

export interface JPDateInputProps {
  value: string;
  onChange: (iso: string) => void;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
  disabled?: boolean;
}

export const JPDateInput = forwardRef<HTMLButtonElement, JPDateInputProps>(
  function JPDateInput(
    { value, onChange, id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy, className = "", disabled },
    ref
  ) {
    const innerId = useId();
    const buttonId = id ?? innerId;

    const now = new Date();
    const [yStr, mStr, dStr] = value ? value.split("-") : ["", "", ""];
    const adYear = yStr ? parseInt(yStr, 10) : now.getFullYear();
    const month  = mStr ? parseInt(mStr, 10) : now.getMonth() + 1;
    const day    = dStr ? parseInt(dStr, 10) : now.getDate();

    const [era, setEra] = useState<Era>("seireki");
    const [open, setOpen] = useState(false);
    const [pickYear, setPickYear] = useState(adYear);
    const [pickMonth, setPickMonth] = useState(month);
    const [pickDay, setPickDay] = useState(day);
    const [pickEraType, setPickEraType] = useState<Exclude<Era, "seireki">>("reiwa");
    const [pickEraYear, setPickEraYear] = useState(1);

    function syncFromValue() {
      if (value) {
        const [y, m, d] = value.split("-").map(Number);
        setPickYear(y);
        setPickMonth(m);
        setPickDay(d);
        const { era: e, eraYear } = adToEra(y);
        setPickEraType(e);
        setPickEraYear(eraYear);
      }
    }

    function handleOpenChange(o: boolean) {
      if (o) syncFromValue();
      setOpen(o);
    }

    function commit(y: number, m: number, d: number) {
      const safeD = Math.min(d, daysInMonth(y, m));
      const iso = `${y}-${String(m).padStart(2, "0")}-${String(safeD).padStart(2, "0")}`;
      onChange(iso);
      setOpen(false);
    }

    function handleYearChange(v: number) {
      setPickYear(v);
      const { era: e, eraYear } = adToEra(v);
      setPickEraType(e);
      setPickEraYear(eraYear);
    }

    function handleEraYearChange(eraYear: number) {
      setPickEraYear(eraYear);
      setPickYear(eraToAd(pickEraType, eraYear));
    }

    function handleEraTypeChange(e: Exclude<Era, "seireki">) {
      setPickEraType(e);
      const adY = eraToAd(e, 1);
      setPickYear(adY);
      setPickEraYear(1);
    }

    const currentYear = now.getFullYear();
    const yearOptions = Array.from({ length: 120 }, (_, i) => currentYear - i);
    const maxDay = daysInMonth(pickYear, pickMonth);
    const eraInfo = ERA_INFO[pickEraType];
    const eraYearMax = Math.min(eraInfo.endYear - eraInfo.startYear + 1, 100);
    const eraYearOptions = Array.from({ length: eraYearMax }, (_, i) => i + 1);
    const eraLabels: Record<Era, string> = { seireki: "西暦", reiwa: "令和", heisei: "平成", showa: "昭和" };

    return (
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            ref={ref}
            id={buttonId}
            type="button"
            disabled={disabled}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={`w-full px-3 py-2 border rounded-lg text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-kon/40 ${ariaInvalid ? "border-danger" : "border-gray-200"} ${className}`}
          >
            {formatDisplay(value, era)}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 w-72"
            sideOffset={4}
            align="start"
          >
            <div className="flex gap-1 mb-4">
              {(["seireki", "reiwa", "heisei", "showa"] as const).map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setEra(e);
                    if (e !== "seireki") handleEraTypeChange(e);
                  }}
                  className={`flex-1 text-xs py-1 rounded ${era === e ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {eraLabels[e]}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              {era === "seireki" ? (
                <select
                  className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm"
                  value={pickYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              ) : (
                <select
                  className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm"
                  value={pickEraYear}
                  onChange={(e) => handleEraYearChange(Number(e.target.value))}
                >
                  {eraYearOptions.map((y) => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              )}
              <select
                className="w-20 border border-gray-200 rounded px-2 py-1 text-sm"
                value={pickMonth}
                onChange={(e) => setPickMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
              <select
                className="w-20 border border-gray-200 rounded px-2 py-1 text-sm"
                value={pickDay}
                onChange={(e) => setPickDay(Number(e.target.value))}
              >
                {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => commit(pickYear, pickMonth, pickDay)}
              className="w-full py-2 bg-kon text-white rounded-lg text-sm font-medium hover:bg-ai"
            >
              確定
            </button>
            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }
);
