// 年末調整・還付金計算ライブラリ (2026年度対応)
// 所得税法に基づく正確な計算

// ============================================================
// Types
// ============================================================

export type DisabilityType = "none" | "normal" | "special" | "specialLiving";
export type SpouseDisabilityType = "none" | "normal" | "special";

export interface NenmatsuInput {
  annualIncome: number;             // 年間給与収入
  withholdingTax: number;           // 源泉徴収税額（実額）
  useEstimatedWithholding: boolean; // 源泉徴収税額を自動推計

  // 社会保険料
  socialInsurance: number;
  useEstimatedSocialInsurance: boolean; // 14.42%で自動推計

  // 配偶者
  hasSpouse: boolean;
  spouseIncome: number;             // 配偶者の給与収入
  spouseIsDisabled: boolean;        // 配偶者が障害者

  // 扶養控除（人数）
  generalDependents: number;        // 一般扶養 (16-18歳, 23-69歳)
  specificDependents: number;       // 特定扶養 (19-22歳)
  elderlyDependents: number;        // 老人扶養 70歳以上（別居）
  elderlyLivingDependents: number;  // 同居老人扶養 70歳以上（同居）

  // 生命保険料控除 (新制度2012年以降)
  lifeInsuranceGeneral: number;     // 一般生命保険料
  lifeInsuranceNursing: number;     // 介護医療保険料
  lifeInsurancePension: number;     // 個人年金保険料

  // その他控除
  earthquakeInsurance: number;      // 地震保険料
  ideco: number;                    // iDeCo年額
  smallEnterprise: number;          // 小規模企業共済年額
  mortgageLoanBalance: number;      // 住宅ローン年末残高 (0.7%控除)
  mortgageTaxCreditManual: number;  // 住宅ローン控除実額入力 (0=自動計算)
  medicalExpenses: number;          // 医療費実額
  furusatoNozei: number;            // ふるさと納税寄付額
  disability: DisabilityType;       // 本人の障害者控除
  spouseDisability: SpouseDisabilityType; // 配偶者の障害者控除
}

export interface DeductionBreakdown {
  kyuyoShotokuKojo: number;
  kyuyoShotoku: number;
  basicDeduction: number;
  socialInsuranceDeduction: number;
  spouseDeduction: number;
  spouseDeductionType: "配偶者控除" | "配偶者特別控除" | "";
  dependentDeduction: number;
  lifeInsuranceDeduction: number;
  earthquakeDeduction: number;
  idecoCombinedDeduction: number;
  medicalDeduction: number;
  furusatoDeduction: number;
  disabilityDeduction: number;
  spouseDisabilityDeduction: number;
  totalDeductions: number;
}

export interface PotentialSaving {
  key: string;
  icon: string;
  label: string;
  description: string;
  additionalRefund: number;
}

export interface NenmatsuResult {
  annualIncome: number;
  deductions: DeductionBreakdown;
  taxableIncome: number;
  grossIncomeTax: number;
  mortgageTaxCredit: number;
  finalTax: number;
  withholdingTax: number;
  refundAmount: number;
  effectiveTaxRate: number;
  bracketRate: number;
  bracketLabel: string;
  nextBracketGap: number;
  potentialSavings: PotentialSaving[];
  // For spouse wall display
  spouseWall103Gap: number;
  spouseWall150Gap: number;
  spouseWall201Gap: number;
}

// ============================================================
// Helper functions
// ============================================================

export function calcKyuyoShotokuKojo(annualIncome: number): number {
  if (annualIncome <= 1625000)  return 550000;
  if (annualIncome <= 1800000)  return Math.floor(annualIncome * 0.4) - 100000;
  if (annualIncome <= 3600000)  return Math.floor(annualIncome * 0.3) + 80000;
  if (annualIncome <= 6600000)  return Math.floor(annualIncome * 0.2) + 440000;
  if (annualIncome <= 8500000)  return Math.floor(annualIncome * 0.1) + 1100000;
  return 1950000;
}

function calcIncomeTaxBase(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 1950000)   return taxableIncome * 0.05;
  if (taxableIncome <= 3300000)   return taxableIncome * 0.10 - 97500;
  if (taxableIncome <= 6950000)   return taxableIncome * 0.20 - 427500;
  if (taxableIncome <= 9000000)   return taxableIncome * 0.23 - 636000;
  if (taxableIncome <= 18000000)  return taxableIncome * 0.33 - 1536000;
  if (taxableIncome <= 40000000)  return taxableIncome * 0.40 - 2796000;
  return taxableIncome * 0.45 - 4796000;
}

function calcIncomeTax(taxableIncome: number): number {
  return Math.max(0, Math.round(calcIncomeTaxBase(taxableIncome) * 1.021));
}

function getBracket(taxableIncome: number): { rate: number; label: string; nextBreak: number } {
  if (taxableIncome <= 1950000)  return { rate: 0.05, label: "5%",  nextBreak: 1950000 - taxableIncome };
  if (taxableIncome <= 3300000)  return { rate: 0.10, label: "10%", nextBreak: 3300000 - taxableIncome };
  if (taxableIncome <= 6950000)  return { rate: 0.20, label: "20%", nextBreak: 6950000 - taxableIncome };
  if (taxableIncome <= 9000000)  return { rate: 0.23, label: "23%", nextBreak: 9000000 - taxableIncome };
  if (taxableIncome <= 18000000) return { rate: 0.33, label: "33%", nextBreak: 18000000 - taxableIncome };
  if (taxableIncome <= 40000000) return { rate: 0.40, label: "40%", nextBreak: 40000000 - taxableIncome };
  return { rate: 0.45, label: "45%", nextBreak: 0 };
}

// 生命保険料控除（新制度・所得税）
function calcLifeInsuranceSingle(premium: number): number {
  if (premium <= 0)      return 0;
  if (premium <= 20000)  return premium;
  if (premium <= 40000)  return Math.floor(premium / 2) + 10000;
  if (premium <= 80000)  return Math.floor(premium / 4) + 20000;
  return 40000;
}

// 配偶者の所得（給与のみ想定）
function spouseGrossToShotoku(grossIncome: number): number {
  if (grossIncome <= 0) return 0;
  return Math.max(0, grossIncome - calcKyuyoShotokuKojo(grossIncome));
}

// 配偶者控除/配偶者特別控除
function calcSpouseDeduction(
  taxPayerShotoku: number,
  spouseGrossIncome: number,
): { amount: number; type: "配偶者控除" | "配偶者特別控除" | "" } {
  if (taxPayerShotoku > 10000000) return { amount: 0, type: "" };
  const spouseShotoku = spouseGrossToShotoku(spouseGrossIncome);

  const factor =
    taxPayerShotoku <= 9000000 ? 0 :
    taxPayerShotoku <= 9500000 ? 1 : 2;

  // 配偶者控除 (配偶者所得 ≤ 48万)
  if (spouseShotoku <= 480000) {
    const amounts = [380000, 260000, 130000];
    return { amount: amounts[factor], type: "配偶者控除" };
  }

  // 配偶者特別控除 (配偶者所得 48万超〜133万)
  if (spouseShotoku <= 1330000) {
    const tableBase = [
      [380000, 260000, 130000], // ≤950000
      [360000, 240000, 120000], // ≤1000000
      [310000, 210000, 100000], // ≤1050000
      [260000, 180000,  90000], // ≤1100000
      [210000, 140000,  70000], // ≤1150000
      [160000, 110000,  60000], // ≤1200000
      [110000,  80000,  40000], // ≤1250000
      [ 60000,  40000,  20000], // ≤1300000
      [ 30000,  20000,  10000], // ≤1330000
    ];
    const thresholds = [950000, 1000000, 1050000, 1100000, 1150000, 1200000, 1250000, 1300000, 1330000];
    const row = thresholds.findIndex((t) => spouseShotoku <= t);
    return { amount: tableBase[row < 0 ? 8 : row][factor], type: "配偶者特別控除" };
  }

  return { amount: 0, type: "" };
}

// ============================================================
// Main calculation
// ============================================================

export function calcNenmatsu(input: NenmatsuInput): NenmatsuResult {
  const {
    annualIncome,
    hasSpouse, spouseIncome, spouseIsDisabled,
    generalDependents, specificDependents, elderlyDependents, elderlyLivingDependents,
    lifeInsuranceGeneral, lifeInsuranceNursing, lifeInsurancePension,
    earthquakeInsurance, ideco, smallEnterprise,
    mortgageLoanBalance, mortgageTaxCreditManual,
    medicalExpenses, furusatoNozei,
    disability, spouseDisability,
  } = input;

  // ── 給与所得 ───────────────────────────────────────────────
  const kyuyoShotokuKojo = calcKyuyoShotokuKojo(annualIncome);
  const kyuyoShotoku     = Math.max(0, annualIncome - kyuyoShotokuKojo);

  // ── 社会保険料控除 ─────────────────────────────────────────
  const socialInsuranceDeduction = input.useEstimatedSocialInsurance
    ? Math.round(annualIncome * 0.1442)
    : Math.max(0, input.socialInsurance);

  // ── 基礎控除 ───────────────────────────────────────────────
  // 合計所得2400万以下 → ¥480,000
  const basicDeduction = kyuyoShotoku <= 24000000 ? 480000 : 0;

  // ── 配偶者控除/配偶者特別控除 ──────────────────────────────
  const { amount: spouseDeduction, type: spouseDeductionType } = hasSpouse
    ? calcSpouseDeduction(kyuyoShotoku, spouseIncome)
    : { amount: 0, type: "" as const };

  // ── 扶養控除 ───────────────────────────────────────────────
  const dependentDeduction =
    generalDependents        * 380000 +
    specificDependents       * 630000 +
    elderlyDependents        * 480000 +
    elderlyLivingDependents  * 580000;

  // ── 生命保険料控除 ─────────────────────────────────────────
  const lifeInsuranceDeduction = Math.min(
    calcLifeInsuranceSingle(lifeInsuranceGeneral) +
    calcLifeInsuranceSingle(lifeInsuranceNursing) +
    calcLifeInsuranceSingle(lifeInsurancePension),
    120000,
  );

  // ── 地震保険料控除 ─────────────────────────────────────────
  const earthquakeDeduction = Math.min(Math.max(0, earthquakeInsurance), 50000);

  // ── 小規模企業共済等掛金控除 ──────────────────────────────
  const idecoCombinedDeduction = Math.max(0, ideco) + Math.max(0, smallEnterprise);

  // ── 医療費控除 ─────────────────────────────────────────────
  const threshold = Math.min(kyuyoShotoku * 0.05, 100000);
  const medicalDeduction = Math.min(
    Math.max(0, medicalExpenses - threshold),
    2000000,
  );

  // ── 寄附金控除 (ふるさと納税) ─────────────────────────────
  const furusatoDeduction = Math.max(0, furusatoNozei - 2000);

  // ── 障害者控除 ─────────────────────────────────────────────
  const disabilityAmounts: Record<DisabilityType, number> = {
    none: 0, normal: 270000, special: 400000, specialLiving: 750000,
  };
  const spouseDisabilityAmounts: Record<SpouseDisabilityType, number> = {
    none: 0, normal: 270000, special: 400000,
  };
  const disabilityDeduction = disabilityAmounts[disability];
  const spouseDisabilityDeduction = hasSpouse
    ? (spouseIsDisabled
        ? spouseDisabilityAmounts[spouseDisability]
        : spouseDisabilityAmounts[spouseDisability])
    : 0;

  // ── 所得控除合計 ───────────────────────────────────────────
  const totalDeductions =
    socialInsuranceDeduction +
    basicDeduction +
    spouseDeduction +
    dependentDeduction +
    lifeInsuranceDeduction +
    earthquakeDeduction +
    idecoCombinedDeduction +
    medicalDeduction +
    furusatoDeduction +
    disabilityDeduction +
    spouseDisabilityDeduction;

  // ── 課税所得 ───────────────────────────────────────────────
  const taxableIncome = Math.max(0, kyuyoShotoku - totalDeductions);
  // 千円未満切捨て
  const taxableIncomeFloor = Math.floor(taxableIncome / 1000) * 1000;

  // ── 所得税（復興特別所得税込み）─────────────────────────────
  const grossIncomeTax = calcIncomeTax(taxableIncomeFloor);

  // ── 住宅ローン控除（税額控除）─────────────────────────────
  const mortgageTaxCredit = mortgageTaxCreditManual > 0
    ? Math.min(Math.max(0, mortgageTaxCreditManual), grossIncomeTax)
    : Math.min(Math.round(mortgageLoanBalance * 0.007), 210000, grossIncomeTax);

  // ── 最終税額 ───────────────────────────────────────────────
  const finalTax = Math.max(0, grossIncomeTax - mortgageTaxCredit);

  // ── 源泉徴収税額（実額 or 推計）─────────────────────────────
  let withholdingTax: number;
  if (input.useEstimatedWithholding) {
    const estTaxable = Math.max(
      0,
      Math.floor((kyuyoShotoku - basicDeduction - socialInsuranceDeduction) / 1000) * 1000,
    );
    withholdingTax = calcIncomeTax(estTaxable);
  } else {
    withholdingTax = Math.max(0, input.withholdingTax);
  }

  // ── 還付/追徴 ──────────────────────────────────────────────
  const refundAmount = withholdingTax - finalTax;

  // ── 実効税率・ブラケット ───────────────────────────────────
  const effectiveTaxRate = annualIncome > 0 ? (finalTax / annualIncome) * 100 : 0;
  const bracket = getBracket(taxableIncomeFloor);

  // ── 節税アドバイス ─────────────────────────────────────────
  const potentialSavings: PotentialSaving[] = [];
  const marginalTaxRate = bracket.rate * 1.021;

  if (ideco === 0) {
    const idecoMax = 276000; // 23,000×12 会社員の場合
    const saving = Math.round(idecoMax * marginalTaxRate);
    potentialSavings.push({
      key: "ideco",
      icon: "🏦",
      label: "iDeCo（個人型確定拠出年金）",
      description: `月23,000円（年¥276,000）拠出すると`,
      additionalRefund: saving,
    });
  }

  if (lifeInsuranceGeneral === 0 && lifeInsuranceNursing === 0 && lifeInsurancePension === 0) {
    const lifeMax = 120000;
    const saving = Math.round(lifeMax * marginalTaxRate);
    potentialSavings.push({
      key: "life",
      icon: "🛡️",
      label: "生命保険料控除",
      description: `年間保険料を申告すると最大¥120,000の控除`,
      additionalRefund: saving,
    });
  }

  if (furusatoNozei === 0 && annualIncome >= 3000000) {
    const estFurusato = Math.round(annualIncome * 0.03); // rough 3% estimate
    const furusatoDeductionEst = Math.max(0, estFurusato - 2000);
    const saving = Math.round(furusatoDeductionEst * marginalTaxRate);
    potentialSavings.push({
      key: "furusato",
      icon: "❤️",
      label: "ふるさと納税",
      description: `上限額まで寄付すると実質2,000円の自己負担`,
      additionalRefund: saving,
    });
  }

  if (mortgageLoanBalance === 0 && mortgageTaxCreditManual === 0) {
    potentialSavings.push({
      key: "mortgage",
      icon: "🏠",
      label: "住宅ローン控除",
      description: "住宅ローン残高の0.7%が税額から直接控除",
      additionalRefund: 0,
    });
  }

  // ── 配偶者の壁 ─────────────────────────────────────────────
  const spouseWall103Gap = hasSpouse ? Math.max(0, 1030000 - spouseIncome) : 0;
  const spouseWall150Gap = hasSpouse ? Math.max(0, 1500000 - spouseIncome) : 0;
  const spouseWall201Gap = hasSpouse ? Math.max(0, 2010000 - spouseIncome) : 0;

  return {
    annualIncome,
    deductions: {
      kyuyoShotokuKojo,
      kyuyoShotoku,
      basicDeduction,
      socialInsuranceDeduction,
      spouseDeduction,
      spouseDeductionType,
      dependentDeduction,
      lifeInsuranceDeduction,
      earthquakeDeduction,
      idecoCombinedDeduction,
      medicalDeduction,
      furusatoDeduction,
      disabilityDeduction,
      spouseDisabilityDeduction,
      totalDeductions,
    },
    taxableIncome: taxableIncomeFloor,
    grossIncomeTax,
    mortgageTaxCredit,
    finalTax,
    withholdingTax,
    refundAmount,
    effectiveTaxRate,
    bracketRate: bracket.rate,
    bracketLabel: bracket.label,
    nextBracketGap: bracket.nextBreak,
    potentialSavings,
    spouseWall103Gap,
    spouseWall150Gap,
    spouseWall201Gap,
  };
}
