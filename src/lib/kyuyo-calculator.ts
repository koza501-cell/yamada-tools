import { PREFECTURE_HEALTH_RATES_2026 } from "@/data/prefecture-health-insurance-2026";

// ============================================================
// Types
// ============================================================

export interface KyuyoInput {
  monthlyGross: number;
  annualBonus: number;
  age: number;
  dependents: number;
  prefecture: string;
  employmentType: "seishain" | "part";
  commuteMonthly: number;
}

export interface KyuyoResult {
  monthlyGross: number;
  monthlyTakeHome: number;
  pension: number;
  healthInsurance: number;
  nursingInsurance: number;
  childcareLevy: number;
  employmentInsurance: number;
  totalSocialInsurance: number;
  incomeTax: number;
  residentTax: number;
  totalTax: number;
  totalDeductions: number;
  annualGross: number;
  annualBonus: number;
  annualTotalGross: number;
  annualTakeHome: number;
  annualIncomeTax: number;
  annualResidentTax: number;
  annualSocialInsurance: number;
  annualTotalDeductions: number;
  hyojunHoshu: number;
  hyojunGrade: number;
  pcts: {
    takeHome: number;
    pension: number;
    healthInsurance: number;
    nursingInsurance: number;
    childcareLevy: number;
    employmentInsurance: number;
    incomeTax: number;
    residentTax: number;
  };
}

// ============================================================
// 標準報酬月額テーブル（健康保険: 全50等級 / 厚生年金上限: 第35等級 650,000円）
// upper = この等級の上限（未満で該当）
// ============================================================

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

// 厚生年金の標準報酬月額上限（第35等級）
const PENSION_MAX_HYOJUN = 650000;

function getHyojunHoshu(monthly: number): { grade: number; amount: number } {
  for (const row of HYOJUN_TABLE) {
    if (monthly < row.upper) {
      return { grade: row.grade, amount: row.amount };
    }
  }
  return { grade: 50, amount: 1390000 };
}

// ============================================================
// 給与所得控除（2020年以降）
// ============================================================

function calcKyuyoShotokuKojo(annualGross: number): number {
  if (annualGross <= 1625000)  return 550000;
  if (annualGross <= 1800000)  return Math.floor(annualGross * 0.4) - 100000;
  if (annualGross <= 3600000)  return Math.floor(annualGross * 0.3) + 80000;
  if (annualGross <= 6600000)  return Math.floor(annualGross * 0.2) + 440000;
  if (annualGross <= 8500000)  return Math.floor(annualGross * 0.1) + 1100000;
  return 1950000;
}

// ============================================================
// 所得税額（累進税率 + 復興特別所得税 2.1%）
// ============================================================

function calcIncomeTaxAmount(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  let tax: number;
  if      (taxableIncome <= 1950000)   tax = taxableIncome * 0.05;
  else if (taxableIncome <= 3300000)   tax = taxableIncome * 0.10 - 97500;
  else if (taxableIncome <= 6950000)   tax = taxableIncome * 0.20 - 427500;
  else if (taxableIncome <= 9000000)   tax = taxableIncome * 0.23 - 636000;
  else if (taxableIncome <= 18000000)  tax = taxableIncome * 0.33 - 1536000;
  else if (taxableIncome <= 40000000)  tax = taxableIncome * 0.40 - 2796000;
  else                                 tax = taxableIncome * 0.45 - 4796000;
  return Math.max(0, Math.round(tax * 1.021)); // +復興特別所得税
}

// ============================================================
// Main: 手取り計算
// ============================================================

export function calcTakeHome(input: KyuyoInput): KyuyoResult {
  const { monthlyGross, annualBonus, age, dependents, prefecture, commuteMonthly } = input;

  // 標準報酬月額
  const { grade, amount: hyojunHoshu } = getHyojunHoshu(monthlyGross);

  // ── 社会保険料（月額）────────────────────────────────────

  // 厚生年金: 9.15%（上限: 標準報酬65万円）
  const pensionHyojun = Math.min(hyojunHoshu, PENSION_MAX_HYOJUN);
  const pension = Math.floor(pensionHyojun * 0.0915);

  // 健康保険: 都道府県別合計料率 ÷ 2
  const healthTotalRate = (PREFECTURE_HEALTH_RATES_2026[prefecture] ?? 10.01) / 100;
  const healthInsurance = Math.floor(hyojunHoshu * (healthTotalRate / 2));

  // 介護保険: 1.60% ÷ 2 = 0.80%（40〜64歳のみ）
  const nursingInsurance = age >= 40 && age < 65
    ? Math.floor(hyojunHoshu * 0.008)
    : 0;

  // 子ども・子育て支援金: 0.05%（2026年4月〜）
  const childcareLevy = Math.floor(hyojunHoshu * 0.0005);

  // 雇用保険: 0.5%（月収ベース）
  const employmentInsurance = Math.floor(monthlyGross * 0.005);

  const totalSocialInsurance =
    pension + healthInsurance + nursingInsurance + childcareLevy + employmentInsurance;

  // ── 所得税・住民税（年額ベース→月割）────────────────────

  // 通勤手当の非課税限度: 月12,500円（年150,000円）
  const nonTaxableCommuteMonthly = Math.min(commuteMonthly, 12500);
  const annualTaxableGross = Math.max(
    0,
    monthlyGross * 12 + annualBonus - nonTaxableCommuteMonthly * 12,
  );

  // 給与所得 = 給与収入 − 給与所得控除
  const kyuyoShotokuKojo = calcKyuyoShotokuKojo(annualTaxableGross);
  const kyuyoShotoku = Math.max(0, annualTaxableGross - kyuyoShotokuKojo);

  const annualSocialInsurance = totalSocialInsurance * 12;
  const dependentsDeduction = dependents * 380000; // 一般扶養控除

  // 所得税: 基礎控除480,000円
  const taxableIT = Math.max(
    0,
    kyuyoShotoku - 480000 - annualSocialInsurance - dependentsDeduction,
  );
  const annualIncomeTax = calcIncomeTaxAmount(taxableIT);
  const monthlyIncomeTax = Math.round(annualIncomeTax / 12);

  // 住民税: 基礎控除430,000円 + 均等割5,500円
  const taxableJT = Math.max(
    0,
    kyuyoShotoku - 430000 - annualSocialInsurance - dependentsDeduction,
  );
  const annualResidentTax = Math.round(taxableJT * 0.10) + 5500;
  const monthlyResidentTax = Math.round(annualResidentTax / 12);

  // ── 合計 ─────────────────────────────────────────────────

  const totalTax = monthlyIncomeTax + monthlyResidentTax;
  const totalDeductions = totalSocialInsurance + totalTax;
  const monthlyTakeHome = Math.max(0, monthlyGross - totalDeductions);

  const annualGross = monthlyGross * 12;
  const annualTotalGross = annualGross + annualBonus;
  const annualTakeHome = monthlyTakeHome * 12;
  const annualTotalDeductions = totalDeductions * 12;

  const base = monthlyGross || 1;

  return {
    monthlyGross,
    monthlyTakeHome,
    pension,
    healthInsurance,
    nursingInsurance,
    childcareLevy,
    employmentInsurance,
    totalSocialInsurance,
    incomeTax: monthlyIncomeTax,
    residentTax: monthlyResidentTax,
    totalTax,
    totalDeductions,
    annualGross,
    annualBonus,
    annualTotalGross,
    annualTakeHome,
    annualIncomeTax,
    annualResidentTax,
    annualSocialInsurance,
    annualTotalDeductions,
    hyojunHoshu,
    hyojunGrade: grade,
    pcts: {
      takeHome:             (monthlyTakeHome / base) * 100,
      pension:              (pension / base) * 100,
      healthInsurance:      (healthInsurance / base) * 100,
      nursingInsurance:     (nursingInsurance / base) * 100,
      childcareLevy:        (childcareLevy / base) * 100,
      employmentInsurance:  (employmentInsurance / base) * 100,
      incomeTax:            (monthlyIncomeTax / base) * 100,
      residentTax:          (monthlyResidentTax / base) * 100,
    },
  };
}
