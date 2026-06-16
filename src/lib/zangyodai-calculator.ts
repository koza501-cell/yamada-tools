export type WageType = "monthly" | "daily" | "hourly";
export type OvertimeMode = "simple" | "detailed" | "daily";
export type DayType = "normal" | "nonStatutoryHoliday" | "statutoryHoliday";

export interface Allowance {
  id: string;
  name: string;
  amount: number;
  included: boolean;
}

export interface DailyRow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  dayType: DayType;
}

export interface ZangyodaiInput {
  wageType: WageType;
  baseWage: number;
  allowances: Allowance[];
  hoursPerDay: number;
  annualWorkDays: number;
  overtimeMode: OvertimeMode;
  simpleOvertimeHours: number;
  dOvertimeUnder60: number;
  dOvertimeOver60: number;
  dHolidayStatutory: number;
  dHolidayNonStatutory: number;
  dNighttime: number;
  dailyRows: DailyRow[];
  unpaidMonths: number;
}

export interface ZangyodaiBreakdownItem {
  key: string;
  label: string;
  hours: number;
  rate: number;
  rateLabel: string;
  amount: number;
}

export interface ZangyodaiResult {
  baseHourlyRate: number;
  monthlyScheduledHours: number;
  includedWage: number;
  breakdown: ZangyodaiBreakdownItem[];
  totalOvertimeHours: number;
  totalOvertimePay: number;
  unpaidTotal: number;
  hoursUntil60: number;
}

function parseTimeMin(t: string): number {
  const [h = "0", m = "0"] = t.split(":");
  return parseInt(h, 10) * 60 + parseInt(m, 10);
}

// Returns minutes overlapping with night period (22:00-05:00) within [start, end)
function nightOverlapMin(startMin: number, endMinRaw: number): number {
  const endMin = endMinRaw <= startMin ? endMinRaw + 1440 : endMinRaw;
  let n = 0;
  // 22:00–24:00 window
  n += Math.max(0, Math.min(endMin, 1440) - Math.max(startMin, 1320));
  // 24:00–29:00 window (00:00–05:00 next day in extended time)
  n += Math.max(0, Math.min(endMin, 1740) - Math.max(startMin, 1440));
  // 00:00–05:00 window for early morning starts (no midnight crossing)
  if (startMin < 300) {
    n += Math.max(0, Math.min(endMin, 300) - startMin);
  }
  return Math.max(0, n);
}

function calcDailyRows(input: ZangyodaiInput): {
  otUnder60: number;
  otOver60: number;
  holStatutory: number;
  holNonStatutory: number;
  nighttimeOT: number;
  nighttimeHoliday: number;
  nighttimeOnly: number;
} {
  const schedMin = input.hoursPerDay * 60;
  let cumOTMin = 0;
  let otUnder60 = 0, otOver60 = 0;
  let holStatutory = 0, holNonStatutory = 0;
  let nighttimeOT = 0, nighttimeHoliday = 0, nighttimeOnly = 0;

  for (const row of input.dailyRows) {
    if (!row.startTime || !row.endTime) continue;
    const s = parseTimeMin(row.startTime);
    const eRaw = parseTimeMin(row.endTime);
    const e = eRaw <= s ? eRaw + 1440 : eRaw;
    const workedMin = Math.max(0, e - s - row.breakMinutes);
    if (workedMin <= 0) continue;

    const totalNightMin = nightOverlapMin(s, eRaw);

    if (row.dayType === "statutoryHoliday") {
      const nightH = totalNightMin / 60;
      const dayH = workedMin / 60 - nightH;
      holStatutory += Math.max(0, dayH);
      nighttimeHoliday += nightH;
    } else {
      const otMin = Math.max(0, workedMin - schedMin);
      const regMin = workedMin - otMin;
      const nightInReg = Math.min(totalNightMin, regMin);
      const nightInOT = Math.max(0, totalNightMin - nightInReg);
      nighttimeOnly += nightInReg / 60;

      if (row.dayType === "nonStatutoryHoliday") {
        const rem = Math.max(0, 3600 - cumOTMin);
        holNonStatutory += Math.min(workedMin, rem) / 60;
        otOver60 += Math.max(0, workedMin - rem) / 60;
        nighttimeOT += nightInOT / 60;
        cumOTMin += workedMin;
      } else {
        if (otMin > 0) {
          const rem = Math.max(0, 3600 - cumOTMin);
          otUnder60 += Math.min(otMin, rem) / 60;
          otOver60 += Math.max(0, otMin - rem) / 60;
          nighttimeOT += nightInOT / 60;
          cumOTMin += otMin;
        }
      }
    }
  }

  return { otUnder60, otOver60, holStatutory, holNonStatutory, nighttimeOT, nighttimeHoliday, nighttimeOnly };
}

export function calcZangyodai(input: ZangyodaiInput): ZangyodaiResult {
  const monthlyScheduledHours = (input.annualWorkDays * input.hoursPerDay) / 12;

  const includedAllowances = input.allowances
    .filter((a) => a.included)
    .reduce((s, a) => s + a.amount, 0);

  let monthlyBaseWage: number;
  switch (input.wageType) {
    case "monthly":
      monthlyBaseWage = input.baseWage;
      break;
    case "daily":
      monthlyBaseWage = input.baseWage * (input.annualWorkDays / 12);
      break;
    case "hourly":
      monthlyBaseWage = input.baseWage * monthlyScheduledHours;
      break;
  }

  const includedWage = monthlyBaseWage + includedAllowances;
  const baseHourlyRate = monthlyScheduledHours > 0 ? includedWage / monthlyScheduledHours : 0;

  let otUnder60 = 0, otOver60 = 0, holStatutory = 0, holNonStatutory = 0;
  let nighttimeOT = 0, nighttimeHoliday = 0, nighttimeOnly = 0;

  if (input.overtimeMode === "simple") {
    const t = Math.max(0, input.simpleOvertimeHours);
    otUnder60 = Math.min(t, 60);
    otOver60 = Math.max(0, t - 60);
  } else if (input.overtimeMode === "detailed") {
    otUnder60 = Math.max(0, input.dOvertimeUnder60);
    otOver60 = Math.max(0, input.dOvertimeOver60);
    holStatutory = Math.max(0, input.dHolidayStatutory);
    holNonStatutory = Math.max(0, input.dHolidayNonStatutory);
    nighttimeOnly = Math.max(0, input.dNighttime);
  } else {
    const d = calcDailyRows(input);
    otUnder60 = d.otUnder60;
    otOver60 = d.otOver60;
    holStatutory = d.holStatutory;
    holNonStatutory = d.holNonStatutory;
    nighttimeOT = d.nighttimeOT;
    nighttimeHoliday = d.nighttimeHoliday;
    nighttimeOnly = d.nighttimeOnly;
  }

  const h = baseHourlyRate;
  const breakdown: ZangyodaiBreakdownItem[] = [];

  const add = (key: string, label: string, hours: number, rate: number, rateLabel: string) => {
    if (hours <= 0) return;
    breakdown.push({ key, label, hours, rate, rateLabel, amount: Math.round(hours * h * rate) });
  };

  add("ot60u", "\u6642\u9593\u5916\uff0860h\u4ee5\u5185\uff09", otUnder60, 1.25, "125%");
  add("ot60o", "\u6642\u9593\u5916\uff0860h\u8d85\uff09", otOver60, 1.50, "150%");
  add("holS", "\u6cd5\u5b9a\u4f11\u65e5\u52b4\u50cd", holStatutory, 1.35, "135%");
  add("holN", "\u6cd5\u5b9a\u5916\u4f11\u65e5\u52b4\u50cd", holNonStatutory, 1.25, "125%");
  add("nightOT", "\u6df1\u591c+\u6642\u9593\u5916\u52b4\u50cd", nighttimeOT, 1.50, "150%");
  add("nightH", "\u6df1\u591c+\u6cd5\u5b9a\u4f11\u65e5\u52b4\u50cd", nighttimeHoliday, 1.60, "160%");
  // nighttimeOnly: only the +25% premium (worker already paid for regular hours)
  if (nighttimeOnly > 0) {
    breakdown.push({
      key: "nightOnly",
      label: "\u6df1\u591c\u5272\u5897\uff08\u901a\u5e38\u52e4\u52d9\u5185\uff09",
      hours: nighttimeOnly,
      rate: 0.25,
      rateLabel: "+25%",
      amount: Math.round(nighttimeOnly * h * 0.25),
    });
  }

  const totalOvertimeHours = otUnder60 + otOver60 + holNonStatutory;
  const totalOvertimePay = breakdown.reduce((s, b) => s + b.amount, 0);
  const unpaidTotal = totalOvertimePay * input.unpaidMonths;
  const hoursUntil60 = 60 - (otUnder60 + holNonStatutory);

  return {
    baseHourlyRate: Math.round(baseHourlyRate * 10) / 10,
    monthlyScheduledHours,
    includedWage,
    breakdown,
    totalOvertimeHours,
    totalOvertimePay,
    unpaidTotal,
    hoursUntil60,
  };
}
