export interface FuyoInput {
  spouseIncome: number;       // 配偶者の年収（万円）
  ownIncome: number;          // 本人の年収（万円）
  spouseAge: number;          // 配偶者の年齢
  ownAge: number;             // 本人の年齢
  hasDisability: boolean;     // 配偶者が障害者
}

export interface WallInfo {
  threshold: number;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface FuyoResult {
  // 扶養の種類
  isTaxDependent: boolean;          // 税法上の扶養（配偶者控除）
  isSocialInsDependent: boolean;    // 社会保険の扶養（130万円の壁）
  isCompanyAllowanceDependent: boolean; // 106万円の壁（大企業）

  // 控除額
  spouseDeduction: number;          // 配偶者控除（万円）
  spouseSpecialDeduction: number;   // 配偶者特別控除（万円）

  // 現在位置
  currentWall: string;             // どの「壁」にいるか
  nextWall: WallInfo | null;       // 次の壁
  prevWall: WallInfo | null;       // 前の壁（超えた壁）

  // アドバイス
  advice: string[];
  taxSaving: number;               // 税負担軽減額（概算、万円）
}

export const WALLS: WallInfo[] = [
  { threshold: 100, label: "100万円の壁", description: "住民税が発生（均等割）", color: "text-yellow-700", bgColor: "bg-yellow-50" },
  { threshold: 103, label: "103万円の壁", description: "所得税が発生・配偶者控除が縮小開始", color: "text-orange-700", bgColor: "bg-orange-50" },
  { threshold: 106, label: "106万円の壁", description: "大企業等で社会保険加入義務（51人以上）", color: "text-red-600", bgColor: "bg-red-50" },
  { threshold: 130, label: "130万円の壁", description: "社会保険の扶養から外れる（健康保険・年金）", color: "text-red-700", bgColor: "bg-red-50" },
  { threshold: 150, label: "150万円の壁", description: "配偶者特別控除の満額（38万円）適用終了", color: "text-purple-700", bgColor: "bg-purple-50" },
  { threshold: 201, label: "201万円の壁", description: "配偶者特別控除がゼロになる", color: "text-gray-600", bgColor: "bg-gray-50" },
];

// 配偶者控除額（本人の所得に応じる）
// 本人年収→所得→控除額
function getSpouseDeduction(spouseIncome: number, ownIncome: number, spouseAge: number): { deduction: number; specialDeduction: number } {
  // 配偶者の給与所得控除後の所得
  const spouseGivingIncome = calcGivenIncome(spouseIncome);

  // 配偶者控除（配偶者の所得48万以下 = 年収103万以下）
  let deduction = 0;
  if (spouseGivingIncome <= 48) {
    const ownGivenIncome = calcGivenIncome(ownIncome);
    if (ownGivenIncome <= 900) {
      deduction = spouseAge >= 70 ? 48 : 38;
    } else if (ownGivenIncome <= 950) {
      deduction = spouseAge >= 70 ? 32 : 26;
    } else if (ownGivenIncome <= 1000) {
      deduction = spouseAge >= 70 ? 16 : 13;
    }
  }

  // 配偶者特別控除（配偶者の所得48万超133万以下）
  let specialDeduction = 0;
  if (spouseGivingIncome > 48 && spouseGivingIncome <= 133) {
    const ownGivenIncome = calcGivenIncome(ownIncome);
    if (ownGivenIncome <= 900) {
      if (spouseGivingIncome <= 95) specialDeduction = 38;
      else if (spouseGivingIncome <= 100) specialDeduction = 36;
      else if (spouseGivingIncome <= 105) specialDeduction = 31;
      else if (spouseGivingIncome <= 110) specialDeduction = 26;
      else if (spouseGivingIncome <= 115) specialDeduction = 21;
      else if (spouseGivingIncome <= 120) specialDeduction = 16;
      else if (spouseGivingIncome <= 125) specialDeduction = 11;
      else if (spouseGivingIncome <= 130) specialDeduction = 6;
      else if (spouseGivingIncome <= 133) specialDeduction = 3;
    } else if (ownGivenIncome <= 950) {
      if (spouseGivingIncome <= 95) specialDeduction = 26;
      else if (spouseGivingIncome <= 100) specialDeduction = 24;
      else if (spouseGivingIncome <= 105) specialDeduction = 21;
      else if (spouseGivingIncome <= 110) specialDeduction = 18;
      else if (spouseGivingIncome <= 115) specialDeduction = 14;
      else if (spouseGivingIncome <= 120) specialDeduction = 11;
      else if (spouseGivingIncome <= 125) specialDeduction = 8;
      else if (spouseGivingIncome <= 130) specialDeduction = 4;
      else if (spouseGivingIncome <= 133) specialDeduction = 2;
    } else if (ownGivenIncome <= 1000) {
      if (spouseGivingIncome <= 95) specialDeduction = 13;
      else if (spouseGivingIncome <= 100) specialDeduction = 12;
      else if (spouseGivingIncome <= 105) specialDeduction = 11;
      else if (spouseGivingIncome <= 110) specialDeduction = 9;
      else if (spouseGivingIncome <= 115) specialDeduction = 7;
      else if (spouseGivingIncome <= 120) specialDeduction = 6;
      else if (spouseGivingIncome <= 125) specialDeduction = 4;
      else if (spouseGivingIncome <= 130) specialDeduction = 2;
      else if (spouseGivingIncome <= 133) specialDeduction = 1;
    }
  }

  return { deduction, specialDeduction };
}

// 給与所得控除後の所得（万円）
function calcGivenIncome(income: number): number {
  if (income <= 162.5) return Math.max(0, income - 55);
  if (income <= 180) return income * 0.6 + 10;
  if (income <= 360) return income * 0.7 - 8;
  if (income <= 660) return income * 0.8 - 44;
  if (income <= 850) return income * 0.9 - 110;
  return income - 195;
}

export function calcFuyo(input: FuyoInput): FuyoResult {
  const inc = input.spouseIncome;
  const { deduction, specialDeduction } = getSpouseDeduction(inc, input.ownIncome, input.spouseAge);

  const isTaxDependent = inc <= 103;
  const isSocialInsDependent = inc < 130;
  const isCompanyAllowanceDependent = inc < 106;

  // 現在地の壁判定
  let currentWall = "0〜100万円：各種扶養の対象内";
  if (inc >= 201) currentWall = "201万円超：配偶者控除・特別控除なし";
  else if (inc >= 150) currentWall = "150〜201万円：配偶者特別控除（逓減）";
  else if (inc >= 130) currentWall = "130〜150万円：社会保険の扶養外・特別控除あり";
  else if (inc >= 106) currentWall = "106〜130万円：社会保険加入の可能性あり";
  else if (inc >= 103) currentWall = "103〜106万円：所得税発生・配偶者控除縮小";
  else if (inc >= 100) currentWall = "100〜103万円：住民税発生";

  const nextWall = WALLS.find(w => w.threshold > inc) ?? null;
  const prevWalls = WALLS.filter(w => w.threshold <= inc);
  const prevWall = prevWalls.length > 0 ? prevWalls[prevWalls.length - 1] : null;

  // 税節約額概算（所得税20%+住民税10%）
  const totalDeduction = deduction + specialDeduction;
  const taxSaving = Math.round(totalDeduction * 0.3 * 10) / 10;

  const advice: string[] = [];
  if (inc >= 100 && inc < 103) advice.push("住民税が発生しています。103万円未満に抑えると所得税・配偶者控除が維持できます。");
  if (inc >= 103 && inc < 106) advice.push("所得税が発生し配偶者控除が縮小しています。106万円未満なら社会保険の扶養は維持できます。");
  if (inc >= 106 && inc < 130) advice.push("大企業勤務の場合、社会保険に加入する義務が生じる可能性があります。130万円未満なら配偶者の社会保険扶養は維持できます。");
  if (inc >= 130 && inc < 150) advice.push("社会保険の扶養から外れました。自身で国民健康保険・国民年金に加入する必要があります。150万円まで働くと配偶者特別控除の満額（38万円）が適用されます。");
  if (inc >= 150 && inc < 201) advice.push("配偶者特別控除は収入増加とともに段階的に減少します。201万円を超えると控除がゼロになります。");
  if (inc >= 201) advice.push("配偶者控除・特別控除の対象外です。世帯収入最大化を目指して働くことを検討しましょう。");
  if (inc < 100) advice.push("住民税・所得税ともに非課税です。103万円未満を維持すると所得税も非課税のまま配偶者控除を満額受けられます。");

  return {
    isTaxDependent,
    isSocialInsDependent,
    isCompanyAllowanceDependent,
    spouseDeduction: deduction,
    spouseSpecialDeduction: specialDeduction,
    currentWall,
    nextWall,
    prevWall,
    advice,
    taxSaving,
  };
}
