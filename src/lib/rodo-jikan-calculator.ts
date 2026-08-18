export type DayMemo = "normal" | "paid" | "absent" | "holiday" | "statutory";

export interface DayRow {
  date: string;       // "YYYY-MM-DD"
  dayOfWeek: number;  // 0=Sun … 6=Sat
  inTime: string;     // "HH:MM" or ""
  outTime: string;
  breakMin: number;
  memo: DayMemo;
}

export interface DayResult {
  workedMin: number;
  scheduledMin: number;
  regularMin: number;
  overtimeMin: number;
  nightMin: number;
  statutoryHolidayMin: number;
  isPaid: boolean;
  isAbsent: boolean;
}

export interface MonthlyResult {
  days: DayResult[];
  totalWorkedMin: number;
  totalOvertimeMin: number;
  totalNightMin: number;
  totalStatutoryHolidayMin: number;
  paidDays: number;
  absentDays: number;
}

function parseMin(t: string): number {
  const [h = "0", m = "0"] = t.split(":");
  return parseInt(h, 10) * 60 + parseInt(m, 10);
}

function nightOverlapMin(startMin: number, endMinRaw: number): number {
  const endMin = endMinRaw <= startMin ? endMinRaw + 1440 : endMinRaw;
  let n = 0;
  n += Math.max(0, Math.min(endMin, 1440) - Math.max(startMin, 1320)); // 22-24
  n += Math.max(0, Math.min(endMin, 1740) - Math.max(startMin, 1440)); // 24-29 (0-5 next day)
  if (startMin < 300) n += Math.max(0, Math.min(endMin, 300) - startMin);
  return Math.max(0, n);
}

export function calcDay(row: DayRow, scheduledHoursPerDay: number, isScheduledWorkDay: boolean): DayResult {
  const scheduledMin = scheduledHoursPerDay * 60;

  if (row.memo === "paid") return { workedMin: 0, scheduledMin, regularMin: scheduledMin, overtimeMin: 0, nightMin: 0, statutoryHolidayMin: 0, isPaid: true, isAbsent: false };
  if (row.memo === "absent") return { workedMin: 0, scheduledMin, regularMin: 0, overtimeMin: 0, nightMin: 0, statutoryHolidayMin: 0, isPaid: false, isAbsent: true };
  if (!row.inTime || !row.outTime) return { workedMin: 0, scheduledMin: isScheduledWorkDay ? scheduledMin : 0, regularMin: 0, overtimeMin: 0, nightMin: 0, statutoryHolidayMin: 0, isPaid: false, isAbsent: false };

  const s = parseMin(row.inTime);
  const eRaw = parseMin(row.outTime);
  const e = eRaw <= s ? eRaw + 1440 : eRaw;
  const workedMin = Math.max(0, e - s - row.breakMin);
  const nightMin = nightOverlapMin(s, eRaw);

  if (row.memo === "statutory") {
    return { workedMin, scheduledMin: 0, regularMin: 0, overtimeMin: 0, nightMin, statutoryHolidayMin: workedMin, isPaid: false, isAbsent: false };
  }

  const overtimeMin = Math.max(0, workedMin - scheduledMin);
  const regularMin = workedMin - overtimeMin;
  return { workedMin, scheduledMin: isScheduledWorkDay ? scheduledMin : 0, regularMin, overtimeMin, nightMin, statutoryHolidayMin: 0, isPaid: false, isAbsent: false };
}

export function calcMonth(rows: DayRow[], scheduledHoursPerDay: number, scheduledWeekdays: boolean[]): MonthlyResult {
  const days: DayResult[] = rows.map(r => {
    const dow = r.dayOfWeek === 0 ? 6 : r.dayOfWeek - 1; // convert Sun=0 to Mon=0 index
    const isScheduled = scheduledWeekdays[r.dayOfWeek === 0 ? 6 : r.dayOfWeek - 1];
    return calcDay(r, scheduledHoursPerDay, isScheduled);
  });

  return {
    days,
    totalWorkedMin: days.reduce((s, d) => s + d.workedMin, 0),
    totalOvertimeMin: days.reduce((s, d) => s + d.overtimeMin, 0),
    totalNightMin: days.reduce((s, d) => s + d.nightMin, 0),
    totalStatutoryHolidayMin: days.reduce((s, d) => s + d.statutoryHolidayMin, 0),
    paidDays: days.filter(d => d.isPaid).length,
    absentDays: days.filter(d => d.isAbsent).length,
  };
}

export function minsToHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

export function getDaysInMonth(year: number, month: number): DayRow[] {
  const rows: DayRow[] = [];
  const d = new Date(year, month - 1, 1);
  while (d.getMonth() === month - 1) {
    rows.push({ date: d.toISOString().slice(0, 10), dayOfWeek: d.getDay(), inTime: "", outTime: "", breakMin: 60, memo: "normal" });
    d.setDate(d.getDate() + 1);
  }
  return rows;
}
