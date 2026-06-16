export interface IkukyuInput {
  monthlySalary: number;    // 月給（万円）
  startMonth: number;       // 育休開始月（1〜12）
  startYear: number;        // 育休開始年
  durationMonths: number;   // 育休期間（月数）
  isPartner: boolean;       // パパ育休かどうか
  useBonus: boolean;        // ボーナスあり
  bonusAmount: number;      // 賞与年額（万円）
}

export interface MonthEntry {
  month: number;
  year: number;
  label: string;
  days: number;
  rate: number;          // 67% or 50%
  benefit: number;       // 給付金（万円）
  isFirst180: boolean;
}

export interface IkukyuResult {
  months: MonthEntry[];
  totalBenefit: number;          // 合計給付金（万円）
  totalBenefit180: number;       // 180日以内分
  totalBenefitAfter180: number;  // 180日超分
  socialInsSaving: number;       // 社会保険料免除による節約（概算、万円）
  effectiveIncomeRate: number;   // 実質手取り率（%）
  ceilingMonthly: number;        // 上限額（万円）
}

// 2026年度の上限・下限
const UPPER_LIMIT_67 = 305570;   // 円/月（67%適用時の上限給付額）
const UPPER_LIMIT_50 = 228150;   // 円/月（50%適用時の上限給付額）
const LOWER_LIMIT = 80430;       // 円/月（最低保証額）

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function calcIkukyu(input: IkukyuInput): IkukyuResult {
  const dailySalary = (input.monthlySalary * 10000) / 30; // 日額賃金
  const months: MonthEntry[] = [];
  let totalDays = 0;

  for (let i = 0; i < input.durationMonths; i++) {
    const monthNum = ((input.startMonth - 1 + i) % 12) + 1;
    const yearNum = input.startYear + Math.floor((input.startMonth - 1 + i) / 12);
    const days = getDaysInMonth(yearNum, monthNum);
    const isFirst180 = totalDays < 180;
    const rate = isFirst180 ? 0.67 : 0.50;

    // 日額給付金計算（上限・下限適用）
    const rawDaily = dailySalary * rate;
    const upperDaily = (isFirst180 ? UPPER_LIMIT_67 : UPPER_LIMIT_50) / 30;
    const lowerDaily = LOWER_LIMIT / 30;
    const clampedDaily = Math.max(lowerDaily, Math.min(upperDaily, rawDaily));
    const benefit = Math.round((clampedDaily * days) / 10000 * 10) / 10;

    months.push({
      month: monthNum,
      year: yearNum,
      label: `${yearNum}年${monthNum}月`,
      days,
      rate,
      benefit,
      isFirst180,
    });

    totalDays += days;
  }

  const totalBenefit = Math.round(months.reduce((s, m) => s + m.benefit, 0) * 10) / 10;
  const totalBenefit180 = Math.round(months.filter(m => m.isFirst180).reduce((s, m) => s + m.benefit, 0) * 10) / 10;
  const totalBenefitAfter180 = Math.round(months.filter(m => !m.isFirst180).reduce((s, m) => s + m.benefit, 0) * 10) / 10;

  // 社会保険料免除額（健康保険+厚生年金 約14%）
  const socialInsSaving = Math.round(input.monthlySalary * 0.14 * input.durationMonths * 10) / 10;

  // 実質手取り率（給付金÷育休前月給×月数）
  const originalTotal = input.monthlySalary * input.durationMonths;
  const effectiveIncomeRate = originalTotal > 0
    ? Math.round(((totalBenefit + socialInsSaving) / originalTotal) * 100)
    : 0;

  const ceilingMonthly = Math.round(UPPER_LIMIT_67 / 10000 * 10) / 10;

  return { months, totalBenefit, totalBenefit180, totalBenefitAfter180, socialInsSaving, effectiveIncomeRate, ceilingMonthly };
}
