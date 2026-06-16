export type CompanySize = "small" | "large"; // 中小企業 vs 大企業

export interface HojinZeiInput {
  profit: number;          // 課税所得（万円）
  companySize: CompanySize;
  capital: number;         // 資本金（万円）
  employees: number;       // 従業員数
  applyBoeiSurtax: boolean; // 防衛特別法人税（2027年以降）
}

export interface TaxLayer {
  label: string;
  amount: number;   // 万円
  rate: number;     // %
  color: string;
}

export interface HojinZeiResult {
  // 法人税
  corporateTax: number;
  corporateTaxRate: number;

  // 地方法人税（10.3%）
  localCorporateTax: number;

  // 法人住民税（均等割+法人税割）
  residentTax: number;

  // 法人事業税
  businessTax: number;

  // 防衛特別法人税（2027年〜）
  boeiSurtax: number;
  boeiSurtaxRate: number;

  // 合計
  totalTax: number;
  effectiveRate: number;   // 実効税率（%）
  afterTaxProfit: number;  // 税引後利益

  // 積み上げグラフ用
  layers: TaxLayer[];

  // 比較（防衛増税前後）
  totalTaxWithout: number;
  totalTaxWith: number;
}

// 法人税率（2026年度）
function calcCorporateTax(profit: number, size: CompanySize): { tax: number; rate: number } {
  if (size === "small") {
    // 中小企業: 年800万以下15%、超23.2%
    const low = Math.min(profit, 800);
    const high = Math.max(0, profit - 800);
    const tax = low * 0.15 + high * 0.232;
    const rate = profit > 0 ? (tax / profit) * 100 : 0;
    return { tax, rate };
  } else {
    // 大企業: 一律23.2%
    return { tax: profit * 0.232, rate: 23.2 };
  }
}

// 法人事業税率（標準税率、所得割）
function calcBusinessTax(profit: number, size: CompanySize): number {
  if (size === "small") {
    // 中小企業 軽減税率
    const l1 = Math.min(profit, 400);
    const l2 = Math.min(Math.max(0, profit - 400), 400);
    const l3 = Math.max(0, profit - 800);
    return l1 * 0.035 + l2 * 0.07 + l3 * 0.07;
  }
  // 大企業（付加価値割・資本割省略、所得割のみ簡易計算）
  return profit * 0.095;
}

// 法人住民税（簡易：法人税割+均等割）
function calcResidentTax(corporateTax: number, companySize: CompanySize, employees: number): number {
  // 法人税割: 法人税額×10.4%（標準税率）
  const taxWari = corporateTax * 0.104;
  // 均等割: 簡易（資本金・従業員数により1〜380万円）省略して10万円固定
  const kintoWari = 0.10;
  return taxWari + kintoWari;
}

export function calcHojinZei(input: HojinZeiInput): HojinZeiResult {
  const { profit, companySize, employees } = input;

  const { tax: corporateTax, rate: corporateTaxRate } = calcCorporateTax(profit, companySize);
  const localCorporateTax = corporateTax * 0.103;
  const businessTax = calcBusinessTax(profit, companySize);
  const residentTax = calcResidentTax(corporateTax, companySize, employees);

  // 防衛特別法人税（2027年〜、法人税額×4%）
  const boeiSurtax = input.applyBoeiSurtax ? corporateTax * 0.04 : 0;
  const boeiSurtaxRate = input.applyBoeiSurtax ? 4 : 0;

  const totalTax = Math.round((corporateTax + localCorporateTax + businessTax + residentTax + boeiSurtax) * 10) / 10;
  const effectiveRate = profit > 0 ? Math.round((totalTax / profit) * 1000) / 10 : 0;
  const afterTaxProfit = Math.round((profit - totalTax) * 10) / 10;

  const totalTaxWithout = Math.round((corporateTax + localCorporateTax + businessTax + residentTax) * 10) / 10;
  const totalTaxWith = Math.round((corporateTax + localCorporateTax + businessTax + residentTax + corporateTax * 0.04) * 10) / 10;

  const layers: TaxLayer[] = [
    { label: "法人税", amount: Math.round(corporateTax * 10) / 10, rate: corporateTaxRate, color: "bg-blue-500" },
    { label: "地方法人税", amount: Math.round(localCorporateTax * 10) / 10, rate: 10.3, color: "bg-blue-300" },
    { label: "法人事業税", amount: Math.round(businessTax * 10) / 10, rate: Math.round((businessTax / profit) * 1000) / 10, color: "bg-indigo-400" },
    { label: "法人住民税", amount: Math.round(residentTax * 10) / 10, rate: Math.round((residentTax / profit) * 1000) / 10, color: "bg-violet-400" },
  ];

  if (boeiSurtax > 0) {
    layers.push({ label: "防衛特別法人税", amount: Math.round(boeiSurtax * 10) / 10, rate: 4, color: "bg-red-400" });
  }

  return {
    corporateTax: Math.round(corporateTax * 10) / 10,
    corporateTaxRate: Math.round(corporateTaxRate * 10) / 10,
    localCorporateTax: Math.round(localCorporateTax * 10) / 10,
    residentTax: Math.round(residentTax * 10) / 10,
    businessTax: Math.round(businessTax * 10) / 10,
    boeiSurtax: Math.round(boeiSurtax * 10) / 10,
    boeiSurtaxRate,
    totalTax,
    effectiveRate,
    afterTaxProfit,
    layers,
    totalTaxWithout,
    totalTaxWith,
  };
}
