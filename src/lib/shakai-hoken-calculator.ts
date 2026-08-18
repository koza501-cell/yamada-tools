import { PREFECTURE_HEALTH_RATES_2026 } from "@/data/prefecture-health-insurance-2026";

export type CalcTarget = "monthly" | "bonus" | "both";
export type EmploymentCategory = "general" | "agriculture" | "construction";

export interface ShakaiHokenInput {
  calcTarget: CalcTarget;
  monthlyGross: number;
  bonus: number;
  prefecture: string;
  age: number;
  employmentCategory: EmploymentCategory;
  workersAccidentRate: number; // percent, e.g. 0.3
}

export interface InsuranceItem {
  key: string;
  label: string;
  employeeAmt: number;
  employerAmt: number;
  employeeRate: string;
  employerRate: string;
  note?: string;
}

export interface ShakaiHokenMonthlyResult {
  hyojunHoshu: number;
  hyojunGrade: number;
  pensionHyojun: number;
  items: InsuranceItem[];
  totalEmployee: number;
  totalEmployer: number;
}

export interface ShakaiHokenBonusResult {
  hyojunBonus: number;
  items: InsuranceItem[];
  totalEmployee: number;
  totalEmployer: number;
}

export interface ShakaiHokenResult {
  monthly: ShakaiHokenMonthlyResult | null;
  bonus: ShakaiHokenBonusResult | null;
}

// 標準報酬月額テーブル（全50等級）
const HYOJUN_TABLE: ReadonlyArray<{ grade: number; amount: number; upper: number }> = [
  { grade: 1,  amount: 58000,   upper: 63000 },
  { grade: 2,  amount: 68000,   upper: 73000 },
  { grade: 3,  amount: 78000,   upper: 83000 },
  { grade: 4,  amount: 88000,   upper: 93000 },
  { grade: 5,  amount: 98000,   upper: 101000 },
  { grade: 6,  amount: 104000,  upper: 107000 },
  { grade: 7,  amount: 110000,  upper: 114000 },
  { grade: 8,  amount: 118000,  upper: 122000 },
  { grade: 9,  amount: 126000,  upper: 130000 },
  { grade: 10, amount: 134000,  upper: 138000 },
  { grade: 11, amount: 142000,  upper: 146000 },
  { grade: 12, amount: 150000,  upper: 155000 },
  { grade: 13, amount: 160000,  upper: 165000 },
  { grade: 14, amount: 170000,  upper: 175000 },
  { grade: 15, amount: 180000,  upper: 185000 },
  { grade: 16, amount: 190000,  upper: 195000 },
  { grade: 17, amount: 200000,  upper: 210000 },
  { grade: 18, amount: 220000,  upper: 230000 },
  { grade: 19, amount: 240000,  upper: 250000 },
  { grade: 20, amount: 260000,  upper: 270000 },
  { grade: 21, amount: 280000,  upper: 290000 },
  { grade: 22, amount: 300000,  upper: 310000 },
  { grade: 23, amount: 320000,  upper: 330000 },
  { grade: 24, amount: 340000,  upper: 350000 },
  { grade: 25, amount: 360000,  upper: 370000 },
  { grade: 26, amount: 380000,  upper: 395000 },
  { grade: 27, amount: 410000,  upper: 425000 },
  { grade: 28, amount: 440000,  upper: 455000 },
  { grade: 29, amount: 470000,  upper: 485000 },
  { grade: 30, amount: 500000,  upper: 515000 },
  { grade: 31, amount: 530000,  upper: 545000 },
  { grade: 32, amount: 560000,  upper: 575000 },
  { grade: 33, amount: 590000,  upper: 605000 },
  { grade: 34, amount: 620000,  upper: 635000 },
  { grade: 35, amount: 650000,  upper: 665000 },
  { grade: 36, amount: 680000,  upper: 695000 },
  { grade: 37, amount: 710000,  upper: 730000 },
  { grade: 38, amount: 750000,  upper: 770000 },
  { grade: 39, amount: 790000,  upper: 810000 },
  { grade: 40, amount: 830000,  upper: 855000 },
  { grade: 41, amount: 880000,  upper: 905000 },
  { grade: 42, amount: 930000,  upper: 955000 },
  { grade: 43, amount: 980000,  upper: 1005000 },
  { grade: 44, amount: 1030000, upper: 1055000 },
  { grade: 45, amount: 1090000, upper: 1115000 },
  { grade: 46, amount: 1150000, upper: 1175000 },
  { grade: 47, amount: 1210000, upper: 1235000 },
  { grade: 48, amount: 1270000, upper: 1295000 },
  { grade: 49, amount: 1330000, upper: 1355000 },
  { grade: 50, amount: 1390000, upper: Number.MAX_SAFE_INTEGER },
];

export function getHyojunHoshu(monthly: number): { grade: number; amount: number } {
  for (const row of HYOJUN_TABLE) {
    if (monthly < row.upper) return { grade: row.grade, amount: row.amount };
  }
  return { grade: 50, amount: 1390000 };
}

const PENSION_MAX_HYOJUN = 650000;
const PENSION_BONUS_MAX = 1500000;
const HEALTH_BONUS_ANNUAL_MAX = 5730000;

const EMP_INS_RATES: Record<EmploymentCategory, { employee: number; employer: number }> = {
  general:      { employee: 0.005,  employer: 0.0105 },
  agriculture:  { employee: 0.006,  employer: 0.0115 },
  construction: { employee: 0.006,  employer: 0.0115 },
};

function buildItems(
  base: number,
  healthHalfRate: number,
  nursingApplies: boolean,
  empInsBase: number,
  empInsRate: { employee: number; employer: number },
  workAccRate: number,
  isPension: boolean,
  pensionBase: number,
  workersAccidentRate: number,
): InsuranceItem[] {
  const pensionEmp = Math.floor(pensionBase * 0.0915);
  const pensionCo  = Math.floor(pensionBase * 0.0915);
  const healthEmp  = Math.floor(base * healthHalfRate);
  const healthCo   = Math.floor(base * healthHalfRate);
  const nursingEmp = nursingApplies ? Math.floor(base * 0.008) : 0;
  const nursingCo  = nursingApplies ? Math.floor(base * 0.008) : 0;
  const childEmp   = Math.floor(base * 0.00025);
  const childCo    = Math.floor(base * 0.00025);
  const empInsEmp  = Math.floor(empInsBase * empInsRate.employee);
  const empInsCo   = Math.floor(empInsBase * empInsRate.employer);
  const workAccCo  = Math.floor(empInsBase * workAccRate);

  const items: InsuranceItem[] = [
    {
      key: "pension",
      label: "厚生年金保険料",
      employeeAmt: pensionEmp,
      employerAmt: pensionCo,
      employeeRate: "9.15%",
      employerRate: "9.15%",
      note: isPension && pensionBase < base ? `上限適用 ¥${PENSION_MAX_HYOJUN.toLocaleString()}` : undefined,
    },
    {
      key: "health",
      label: "健康保険料",
      employeeAmt: healthEmp,
      employerAmt: healthCo,
      employeeRate: `${(healthHalfRate * 100).toFixed(3)}%`,
      employerRate: `${(healthHalfRate * 100).toFixed(3)}%`,
    },
  ];

  if (nursingApplies) {
    items.push({
      key: "nursing",
      label: "介護保険料",
      employeeAmt: nursingEmp,
      employerAmt: nursingCo,
      employeeRate: "0.800%",
      employerRate: "0.800%",
      note: "40〜64歳のみ",
    });
  }

  items.push(
    {
      key: "child",
      label: "子ども・子育て支援金",
      employeeAmt: childEmp,
      employerAmt: childCo,
      employeeRate: "0.025%",
      employerRate: "0.025%",
      note: "2026年4月〜",
    },
    {
      key: "empIns",
      label: "雇用保険料",
      employeeAmt: empInsEmp,
      employerAmt: empInsCo,
      employeeRate: `${(empInsRate.employee * 100).toFixed(1)}%`,
      employerRate: `${(empInsRate.employer * 100).toFixed(2)}%`,
    },
    {
      key: "workAcc",
      label: "労災保険料",
      employeeAmt: 0,
      employerAmt: workAccCo,
      employeeRate: "—",
      employerRate: `${workersAccidentRate.toFixed(2)}%`,
      note: "会社全額負担",
    },
  );

  return items;
}

export function calcShakaiHoken(input: ShakaiHokenInput): ShakaiHokenResult {
  const { calcTarget, monthlyGross, bonus, prefecture, age, employmentCategory, workersAccidentRate } = input;
  const withMonthly = calcTarget === "monthly" || calcTarget === "both";
  const withBonus   = calcTarget === "bonus"   || calcTarget === "both";

  const healthTotalRate = (PREFECTURE_HEALTH_RATES_2026[prefecture] ?? 10.01) / 100;
  const healthHalfRate  = healthTotalRate / 2;
  const empInsRate      = EMP_INS_RATES[employmentCategory];
  const workAccRate     = workersAccidentRate / 100;
  const nursingApplies  = age >= 40 && age < 65;

  let monthly: ShakaiHokenMonthlyResult | null = null;
  if (withMonthly && monthlyGross > 0) {
    const { grade, amount: hyojunHoshu } = getHyojunHoshu(monthlyGross);
    const pensionHyojun = Math.min(hyojunHoshu, PENSION_MAX_HYOJUN);

    const items = buildItems(
      hyojunHoshu,
      healthHalfRate,
      nursingApplies,
      monthlyGross,
      empInsRate,
      workAccRate,
      true,
      pensionHyojun,
      workersAccidentRate,
    );

    monthly = {
      hyojunHoshu,
      hyojunGrade: grade,
      pensionHyojun,
      items,
      totalEmployee: items.reduce((s, i) => s + i.employeeAmt, 0),
      totalEmployer: items.reduce((s, i) => s + i.employerAmt, 0),
    };
  }

  let bonusResult: ShakaiHokenBonusResult | null = null;
  if (withBonus && bonus > 0) {
    const rawHyojun    = Math.floor(bonus / 1000) * 1000;
    const hyojunBonus  = Math.min(rawHyojun, PENSION_BONUS_MAX);
    const hyojunHealth = Math.min(rawHyojun, HEALTH_BONUS_ANNUAL_MAX);

    const items = buildItems(
      hyojunHealth,
      healthHalfRate,
      nursingApplies,
      bonus,
      empInsRate,
      workAccRate,
      false,
      hyojunBonus,
      workersAccidentRate,
    );
    // fix pension base for bonus
    items[0].employeeAmt = Math.floor(hyojunBonus * 0.0915);
    items[0].employerAmt = Math.floor(hyojunBonus * 0.0915);
    if (hyojunBonus < rawHyojun) {
      items[0].note = `上限適用 ¥${PENSION_BONUS_MAX.toLocaleString()}`;
    }

    bonusResult = {
      hyojunBonus,
      items,
      totalEmployee: items.reduce((s, i) => s + i.employeeAmt, 0),
      totalEmployer: items.reduce((s, i) => s + i.employerAmt, 0),
    };
  }

  return { monthly, bonus: bonusResult };
}
