export type EmploymentType = "seishain" | "part" | "keiyaku" | "haken";
export type WageType = "monthly" | "daily" | "hourly";

export interface Allowance { id: string; name: string; amount: number }

export interface ContractInput {
  employmentType: EmploymentType;
  companyName: string;
  companyAddress: string;
  representativeName: string;
  employeeName: string;
  employeeAddress: string;
  employeeDOB: string;
  startDate: string;
  hasFixedTerm: boolean;
  contractEndDate: string;
  workLocation: string;
  jobDescription: string;
  workStartTime: string;
  workEndTime: string;
  breakMinutes: number;
  workDays: boolean[];   // [月火水木金土日]
  holidays: string;
  hasOvertime: boolean;
  wageType: WageType;
  baseWage: number;
  allowances: Allowance[];
  paymentClosingDay: string;
  paymentDay: string;
  paymentMethodTransfer: boolean;
  healthInsurance: boolean;
  pension: boolean;
  employmentInsurance: boolean;
  workersAccident: boolean;
  hasProbationPeriod: boolean;
  probationPeriodMonths: number;
}

export interface ContractSection { article: number; title: string; content: string }

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];
const EMP_LABELS: Record<EmploymentType, string> = {
  seishain: "正社員", part: "パート・アルバイト", keiyaku: "契約社員", haken: "派遣社員",
};

function yen(n: number) { return `¥${n.toLocaleString()}`; }

export function generateSections(inp: ContractInput): ContractSection[] {
  const sections: ContractSection[] = [];
  let art = 1;

  const workDayStr = DAY_LABELS.filter((_, i) => inp.workDays[i]).join("・") || "別途定める";
  const termStr = inp.hasFixedTerm
    ? `${inp.startDate || "　　年　　月　　日"} から ${inp.contractEndDate || "　　年　　月　　日"} まで`
    : `${inp.startDate || "　　年　　月　　日"} から（期間の定めなし）`;

  sections.push({
    article: art++, title: "雇用形態および雇用期間",
    content: `雇用形態：${EMP_LABELS[inp.employmentType]}\n雇用期間：${termStr}`,
  });

  sections.push({
    article: art++, title: "就業場所および業務内容",
    content: `就業場所：${inp.workLocation || "　　　　　　　　（会社が指定する場所）"}\n業務内容：${inp.jobDescription || "　　　　　　　　（会社が指定する業務）"}`,
  });

  const wageLabel = inp.wageType === "monthly" ? "月給" : inp.wageType === "daily" ? "日給" : "時給";
  const allowStr = inp.allowances.filter(a => a.name && a.amount > 0)
    .map(a => `　　${a.name}：${yen(a.amount)}`).join("\n");

  sections.push({
    article: art++, title: "労働時間・休憩・休日・時間外労働",
    content: [
      `所定労働時間：${inp.workStartTime || "09:00"} ～ ${inp.workEndTime || "18:00"}`,
      `休憩時間：${inp.breakMinutes}分`,
      `所定労働日：${workDayStr}`,
      `休　　　日：${inp.holidays || "土曜・日曜・祝日・年末年始"}`,
      `時間外労働：${inp.hasOvertime ? "あり（36協定の範囲内で命じることがある）" : "なし"}`,
    ].join("\n"),
  });

  sections.push({
    article: art++, title: "賃金",
    content: [
      `賃金形態：${wageLabel}制　基本給：${yen(inp.baseWage)}`,
      allowStr,
      `締め日：毎月${inp.paymentClosingDay || "末"}日締め`,
      `支払日：毎月${inp.paymentDay || "25"}日払い`,
      `支払方法：${inp.paymentMethodTransfer ? "銀行振込" : "現金手渡し"}`,
    ].filter(Boolean).join("\n"),
  });

  const ins = [
    inp.healthInsurance && "健康保険",
    inp.pension && "厚生年金保険",
    inp.employmentInsurance && "雇用保険",
    inp.workersAccident && "労災保険",
  ].filter(Boolean) as string[];

  sections.push({
    article: art++, title: "社会保険・労働保険",
    content: ins.length > 0 ? `加入保険：${ins.join("、")}` : "法令に基づき適用する。",
  });

  if (inp.hasProbationPeriod) {
    sections.push({
      article: art++, title: "試用期間",
      content: `雇用開始日から${inp.probationPeriodMonths}ヶ月間を試用期間とする。試用期間中に本採用が不適当と認められた場合は、本採用を見合わせることがある。試用期間中の労働条件は本採用後と同条件とする。`,
    });
  }

  sections.push({
    article: art++, title: "退職および解雇",
    content: "乙が退職する場合は、少なくとも14日前に甲へ書面で申し出るものとする。甲が乙を解雇する場合は、労働基準法第20条に従い、30日前に予告するか又は30日分以上の平均賃金を解雇予告手当として支払うものとする。",
  });

  sections.push({
    article: art++, title: "服務規律",
    content: "乙は、甲の就業規則その他の社内規程を遵守し、誠実に業務を遂行するものとする。業務上知り得た機密情報は在職中はもちろん、退職後も第三者に漏洩してはならない。",
  });

  return sections;
}

export function completionRate(inp: ContractInput): number {
  const checks = [
    inp.companyName, inp.companyAddress, inp.representativeName,
    inp.employeeName, inp.startDate, inp.workLocation, inp.jobDescription,
    String(inp.baseWage > 0), inp.workStartTime, inp.workEndTime,
  ];
  return Math.round(checks.filter(Boolean).length / checks.length * 100);
}
