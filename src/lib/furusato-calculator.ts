// ふるさと納税 控除上限額計算ライブラリ (2026年度対応)
// 総務省方式の正確な計算式を実装

// ============================================================
// Types
// ============================================================

export interface FurusatoInput {
  annualIncome: number;        // 年収（給与）
  sideIncome: number;          // 副業・事業所得（純利益）
  spouseIncome: number;        // 配偶者年収（0なら配偶者なし）
  hasSpouse: boolean;          // 配偶者あり
  dependents1618: number;      // 一般扶養 16〜18歳
  dependents1922: number;      // 特定扶養 19〜22歳
  dependentsOther: number;     // 一般扶養 23〜69歳
  dependents70plus: number;    // 老人扶養 70歳以上（別居）
  mortgageDeductionTotal: number; // 住宅ローン控除額（年間合計）
  medicalExpenses: number;     // 医療費支出（年額）
  idecoAnnual: number;         // iDeCo掛金（年額）
}

export interface FurusatoResult {
  // Inputs echoed
  annualIncome: number;

  // Income calculation
  kyuyoShotokuKojo: number;    // 給与所得控除
  kyuyoShotoku: number;        // 給与所得
  totalIncome: number;         // 合計所得（副業含む）

  // Deductions (IT = income tax basis, RT = resident tax basis)
  socialInsurance: number;     // 社会保険料控除（推計）
  spouseDeductionIT: number;   // 配偶者控除/特別控除（所得税）
  spouseDeductionRT: number;   // 配偶者控除/特別控除（住民税）
  dependentsIT: number;        // 扶養控除（所得税）
  dependentsRT: number;        // 扶養控除（住民税）
  medicalDeduction: number;    // 医療費控除
  idecoDeduction: number;      // iDeCo（小規模企業共済等掛金）控除
  basicDeductionIT: number;    // 基礎控除（所得税）480,000
  basicDeductionRT: number;    // 基礎控除（住民税）430,000
  totalDeductionsIT: number;   // 所得控除合計（所得税）
  totalDeductionsRT: number;   // 所得控除合計（住民税）

  // Taxable income
  taxableIT: number;           // 課税所得（所得税）
  taxableRT: number;           // 課税所得（住民税）

  // Tax
  marginalRate: number;        // 所得税率（限界税率）
  incomeTax: number;           // 所得税額（復興特別含む）
  mortgageIT: number;          // 住宅ローン控除（所得税から）
  residentTaxBeforeAdj: number; // 住民税所得割（調整前）
  choseiKoyo: number;          // 調整控除
  mortgageRT: number;          // 住宅ローン控除（住民税から）
  residentTaxOwed: number;     // 住民税所得割（最終）

  // Furusato
  furusatoLimit: number;       // 控除上限額
  selfBurden: number;          // 自己負担（常に2,000）
  effectiveDonation: number;   // 実質的な節税効果（上限-2,000）
  taxSaving: number;           // 節税効果額

  // Comparison
  singleLimit: number;         // 独身の場合の上限額（比較用）
}

// ============================================================
// 給与所得控除（2020年以降）
// ============================================================

function kyuyoShotokuKojo(annualGross: number): number {
  if (annualGross <= 1625000)  return 550000;
  if (annualGross <= 1800000)  return Math.floor(annualGross * 0.4) - 100000;
  if (annualGross <= 3600000)  return Math.floor(annualGross * 0.3) + 80000;
  if (annualGross <= 6600000)  return Math.floor(annualGross * 0.2) + 440000;
  if (annualGross <= 8500000)  return Math.floor(annualGross * 0.1) + 1100000;
  return 1950000;
}

// ============================================================
// 所得税率（限界税率）
// ============================================================

function getMarginalRate(taxableIncome: number): number {
  if (taxableIncome <= 1950000)   return 0.05;
  if (taxableIncome <= 3300000)   return 0.10;
  if (taxableIncome <= 6950000)   return 0.20;
  if (taxableIncome <= 9000000)   return 0.23;
  if (taxableIncome <= 18000000)  return 0.33;
  if (taxableIncome <= 40000000)  return 0.40;
  return 0.45;
}

// ============================================================
// 所得税額（復興特別所得税 2.1% 含む）
// ============================================================

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  let tax: number;
  if      (taxableIncome <= 1950000)  tax = taxableIncome * 0.05;
  else if (taxableIncome <= 3300000)  tax = taxableIncome * 0.10 - 97500;
  else if (taxableIncome <= 6950000)  tax = taxableIncome * 0.20 - 427500;
  else if (taxableIncome <= 9000000)  tax = taxableIncome * 0.23 - 636000;
  else if (taxableIncome <= 18000000) tax = taxableIncome * 0.33 - 1536000;
  else if (taxableIncome <= 40000000) tax = taxableIncome * 0.40 - 2796000;
  else                                tax = taxableIncome * 0.45 - 4796000;
  return Math.max(0, Math.round(tax * 1.021));
}

// ============================================================
// 配偶者控除 / 配偶者特別控除
// ============================================================

function calcSpouseDeduction(
  spouseIncome: number,
  taxpayerNetIncome: number,
): { it: number; rt: number } {
  if (spouseIncome <= 0) return { it: 0, rt: 0 };

  // 配偶者の給与所得（合計所得）
  const spouseKojo = kyuyoShotokuKojo(spouseIncome);
  const spouseNet = Math.max(0, spouseIncome - spouseKojo);

  // 納税者の合計所得による段階削減
  let scale = 1.0;
  if (taxpayerNetIncome > 10000000)      scale = 0;
  else if (taxpayerNetIncome > 9500000)  scale = 1 / 3;
  else if (taxpayerNetIncome > 9000000)  scale = 2 / 3;

  if (scale === 0) return { it: 0, rt: 0 };

  // 配偶者控除（spouseNet ≤ 480,000）
  if (spouseNet <= 480000) {
    return { it: Math.round(380000 * scale), rt: Math.round(330000 * scale) };
  }

  // 配偶者特別控除テーブル（spouseNet 480,001〜1,330,000）
  type Row = [number, number, number]; // [upper, it, rt]
  const table: Row[] = [
    [950000,  380000, 330000],
    [1000000, 360000, 310000],
    [1050000, 310000, 260000],
    [1100000, 260000, 210000],
    [1150000, 210000, 160000],
    [1200000, 160000, 110000],
    [1250000, 110000,  60000],
    [1300000,  60000,  30000],
    [1330000,  30000,      0],
  ];

  for (const [upper, it, rt] of table) {
    if (spouseNet <= upper) {
      return { it: Math.round(it * scale), rt: Math.round(rt * scale) };
    }
  }
  return { it: 0, rt: 0 };
}

// ============================================================
// 人的控除差額（所得税-住民税）→ 調整控除計算に使用
// ============================================================

function calcPersonalDiff(
  spouseDeductionIT: number,
  spouseDeductionRT: number,
  dependents1618: number,
  dependents1922: number,
  dependentsOther: number,
  dependents70plus: number,
): number {
  // 基礎控除差額: 480,000 - 430,000 = 50,000
  let diff = 50000;
  // 配偶者控除差額
  diff += spouseDeductionIT - spouseDeductionRT;
  // 一般扶養差額: 380,000 - 330,000 = 50,000 / person
  diff += (dependents1618 + dependentsOther) * 50000;
  // 特定扶養差額: 630,000 - 450,000 = 180,000 / person
  diff += dependents1922 * 180000;
  // 老人扶養差額（別居）: 480,000 - 380,000 = 100,000 / person
  diff += dependents70plus * 100000;
  return diff;
}

// ============================================================
// メイン計算関数
// ============================================================

export function calcFurusato(input: FurusatoInput): FurusatoResult {
  const {
    annualIncome,
    sideIncome,
    spouseIncome,
    hasSpouse,
    dependents1618,
    dependents1922,
    dependentsOther,
    dependents70plus,
    mortgageDeductionTotal,
    medicalExpenses,
    idecoAnnual,
  } = input;

  if (annualIncome <= 0) {
    const zero: FurusatoResult = {
      annualIncome: 0, kyuyoShotokuKojo: 0, kyuyoShotoku: 0, totalIncome: 0,
      socialInsurance: 0, spouseDeductionIT: 0, spouseDeductionRT: 0,
      dependentsIT: 0, dependentsRT: 0, medicalDeduction: 0, idecoDeduction: 0,
      basicDeductionIT: 480000, basicDeductionRT: 430000,
      totalDeductionsIT: 0, totalDeductionsRT: 0,
      taxableIT: 0, taxableRT: 0, marginalRate: 0, incomeTax: 0,
      mortgageIT: 0, residentTaxBeforeAdj: 0, choseiKoyo: 0, mortgageRT: 0,
      residentTaxOwed: 0, furusatoLimit: 0, selfBurden: 2000,
      effectiveDonation: 0, taxSaving: 0, singleLimit: 0,
    };
    return zero;
  }

  // ── 給与所得 ─────────────────────────────────────────────
  const kojo = kyuyoShotokuKojo(annualIncome);
  const kyuyoShotoku = Math.max(0, annualIncome - kojo);
  const totalIncome = kyuyoShotoku + Math.max(0, sideIncome);

  // ── 社会保険料控除（推計: 年収×14.42%）────────────────────
  const socialInsurance = Math.round(annualIncome * 0.1442);

  // ── 配偶者控除 / 特別控除 ────────────────────────────────
  const spouseEffective = hasSpouse ? spouseIncome : 0;
  const { it: spouseIT, rt: spouseRT } = calcSpouseDeduction(
    spouseEffective,
    totalIncome,
  );

  // ── 扶養控除 ─────────────────────────────────────────────
  const dependentsIT =
    dependents1618 * 380000 +
    dependents1922 * 630000 +
    dependentsOther * 380000 +
    dependents70plus * 480000;
  const dependentsRT =
    dependents1618 * 330000 +
    dependents1922 * 450000 +
    dependentsOther * 330000 +
    dependents70plus * 380000;

  // ── 医療費控除 ───────────────────────────────────────────
  // max(医療費 - max(100,000, 合計所得×5%), 0)
  const medicalThreshold = Math.max(100000, totalIncome * 0.05);
  const medicalDeduction = Math.max(0, medicalExpenses - medicalThreshold);

  // ── iDeCo ────────────────────────────────────────────────
  const idecoDeduction = Math.max(0, idecoAnnual);

  // ── 課税所得（所得税）────────────────────────────────────
  const basicIT = totalIncome > 25000000 ? 0 : 480000;
  const totalDeductionsIT =
    basicIT + socialInsurance + spouseIT + dependentsIT + medicalDeduction + idecoDeduction;
  const taxableIT = Math.max(0, totalIncome - totalDeductionsIT);

  // ── 所得税 ────────────────────────────────────────────────
  const marginalRate = getMarginalRate(taxableIT);
  const incomeTaxBeforeMortgage = calcIncomeTax(taxableIT);
  const mortgageIT = Math.min(mortgageDeductionTotal, incomeTaxBeforeMortgage);
  const incomeTax = Math.max(0, incomeTaxBeforeMortgage - mortgageIT);

  // ── 課税所得（住民税）────────────────────────────────────
  const basicRT = totalIncome > 25000000 ? 0 : 430000;
  const totalDeductionsRT =
    basicRT + socialInsurance + spouseRT + dependentsRT + medicalDeduction + idecoDeduction;
  const taxableRT = Math.max(0, totalIncome - totalDeductionsRT);

  // ── 住民税所得割 ─────────────────────────────────────────
  const residentTaxBeforeAdj = Math.round(taxableRT * 0.10);

  // 調整控除
  const personDiff = calcPersonalDiff(spouseIT, spouseRT, dependents1618, dependents1922, dependentsOther, dependents70plus);
  const choseiKoyo = Math.round(Math.min(personDiff, taxableRT) * 0.05);

  // 住宅ローン控除（住民税分）
  const mortgageRTMax = Math.min(
    mortgageDeductionTotal - mortgageIT,
    Math.round(residentTaxBeforeAdj * 0.05),
    97500,
  );
  const mortgageRT = Math.max(0, mortgageRTMax);

  const residentTaxOwed = Math.max(0, residentTaxBeforeAdj - choseiKoyo - mortgageRT);

  // ── ふるさと納税 上限額（総務省方式）──────────────────────
  // 上限 = (住民税所得割×20%) / (90% - 所得税率×1.021) + 2,000
  const denominator = 0.9 - marginalRate * 1.021;
  const furusatoLimit = denominator > 0
    ? Math.floor((residentTaxOwed * 0.20) / denominator) + 2000
    : 2000;

  const taxSaving = Math.max(0, furusatoLimit - 2000);
  const effectiveDonation = taxSaving;

  // ── 独身の場合の比較 ─────────────────────────────────────
  const singleResult = calcFurusato({
    ...input,
    hasSpouse: false,
    spouseIncome: 0,
    dependents1618: 0,
    dependents1922: 0,
    dependentsOther: 0,
    dependents70plus: 0,
    mortgageDeductionTotal: 0,
    medicalExpenses: 0,
    idecoAnnual: 0,
    sideIncome: 0,
  });

  return {
    annualIncome,
    kyuyoShotokuKojo: kojo,
    kyuyoShotoku,
    totalIncome,
    socialInsurance,
    spouseDeductionIT: spouseIT,
    spouseDeductionRT: spouseRT,
    dependentsIT,
    dependentsRT,
    medicalDeduction,
    idecoDeduction,
    basicDeductionIT: basicIT,
    basicDeductionRT: basicRT,
    totalDeductionsIT,
    totalDeductionsRT,
    taxableIT,
    taxableRT,
    marginalRate,
    incomeTax,
    mortgageIT,
    residentTaxBeforeAdj,
    choseiKoyo,
    mortgageRT,
    residentTaxOwed,
    furusatoLimit,
    selfBurden: 2000,
    effectiveDonation,
    taxSaving,
    singleLimit: singleResult.furusatoLimit,
  };
}

// ============================================================
// 早見表生成（年収別）
// ============================================================

export interface QuickTableRow {
  income: number;
  single: number;
  married: number;
  marriedWithChild: number;
}

export function generateQuickTable(): QuickTableRow[] {
  const incomes = [3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 10000000, 15000000];
  return incomes.map((income) => ({
    income,
    single: calcFurusato({
      annualIncome: income, sideIncome: 0, spouseIncome: 0, hasSpouse: false,
      dependents1618: 0, dependents1922: 0, dependentsOther: 0, dependents70plus: 0,
      mortgageDeductionTotal: 0, medicalExpenses: 0, idecoAnnual: 0,
    }).furusatoLimit,
    married: calcFurusato({
      annualIncome: income, sideIncome: 0, spouseIncome: 1030000, hasSpouse: true,
      dependents1618: 0, dependents1922: 0, dependentsOther: 0, dependents70plus: 0,
      mortgageDeductionTotal: 0, medicalExpenses: 0, idecoAnnual: 0,
    }).furusatoLimit,
    marriedWithChild: calcFurusato({
      annualIncome: income, sideIncome: 0, spouseIncome: 1030000, hasSpouse: true,
      dependents1618: 0, dependents1922: 1, dependentsOther: 0, dependents70plus: 0,
      mortgageDeductionTotal: 0, medicalExpenses: 0, idecoAnnual: 0,
    }).furusatoLimit,
  }));
}
