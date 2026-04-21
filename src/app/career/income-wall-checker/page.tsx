"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ============================================================
// Types
// ============================================================

type Role = "dependent" | "supporter" | "both";
type CompanySize = "under51" | "51to100" | "over101";
type EmploymentType = "part" | "fulltime" | "contract";
type WallStatusType = "safe" | "approaching" | "warning" | "over" | "not_applicable";

interface FormState {
  role: Role;
  // dependent/both: own income evaluated against walls
  // supporter:      spouse's (dependent's) income evaluated against walls
  income: string;
  // dependent/both: supporter's income (for tax rate / eligibility)
  spouseIncome: string;
  // supporter only: supporter's own income (for tax rate / eligibility gate)
  supporterIncome: string;
  companySize: CompanySize;
  employmentType: EmploymentType;
  inDependency: boolean;
  healthInsuranceBySpouse: boolean;
  enrolledInSocialInsurance: boolean;
  age: string;
}

interface WallStatus {
  name: string;
  amount: number;
  amountLabel: string;
  description: string;
  impact: string;
  impactAmount: string;
  status: WallStatusType;
  distanceMan: number;
  applicable: boolean;
  is2026New: boolean;
  advice: string;
}

interface DiagnosisResult {
  walls: WallStatus[];
  currentZone: string;
  nextWall: WallStatus | null;
  recommendation: string;
  estimatedTakeHome: number;
  optimalIncomeAdvice: string;
}

// ============================================================
// Schema
// ============================================================

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "年収の壁 診断ツール",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "100万・103万・106万・130万・150万・178万円の壁を一括診断。2026年税制改正（178万円の壁）対応。パート・アルバイトの方の手取り最大化をサポート。",
      "url": "https://yamada-tools.jp/career/income-wall-checker"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "年収の壁 診断ツール", "item": "https://yamada-tools.jp/career/income-wall-checker" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "2026年から103万円の壁はなくなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2026年度税制改正により所得税の非課税ライン（103万円の壁）が178万円に引き上げられる方向で議論が進んでいます。ただし住民税の100万円の壁・社会保険の106万円の壁・扶養の130万円の壁は別制度のため引き続き注意が必要です。" }
        },
        {
          "@type": "Question",
          "name": "年収103万円を少し超えたらどれだけ損しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "103万円をわずかに超えた場合、本人の所得税が発生し、配偶者の配偶者控除（38万円）が消滅します。配偶者の税率20%の場合、約7.6万円の増税となります。2026年改正後はこのラインが178万円に変わる予定です。" }
        },
        {
          "@type": "Question",
          "name": "106万円の壁は全員に適用されますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "いいえ、従業員51人以上の企業で週20時間以上・月収88,000円以上・2ヶ月超の雇用見込みの条件をすべて満たす場合に適用されます。50人以下の企業では現状この壁は適用されません。" }
        },
        {
          "@type": "Question",
          "name": "扶養の130万円の壁を超えたら何が変わりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "配偶者の健康保険の扶養から外れ自分で健康保険に加入する必要があります。国民健康保険料は前年所得に基づくため年収によっては年20万円以上の負担が発生します。" }
        },
        {
          "@type": "Question",
          "name": "年収の壁を気にせず働くためにはどうすればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "壁を超えた場合に手取りが逆転しない年収水準まで一気に上げることが最も効果的です。106万円の壁を超える場合は社会保険料負担（約15〜16万円/年）を上回る収入増（約120万円以上）を目指すと手取りが増えます。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "年収の壁の診断方法",
      "description": "現在の年収から該当する壁と影響額を診断する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "立場と年収を入力", "text": "扶養されている側か扶養する側かを選択し、現在の年収を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "勤務状況を入力", "text": "勤務先の従業員数・雇用形態・社会保険の加入状況を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "診断ボタンを押す", "text": "「診断する」を押すと各壁のステータスと影響額、推奨アクションが表示されます。" }
      ]
    }
  ]
};

// ============================================================
// Calculation logic
// ============================================================

function getSupporterTaxRate(supporterIncomeMan: number): number {
  const income = supporterIncomeMan * 10000;
  if (income <= 3300000) return 0.10;
  if (income <= 6950000) return 0.20;
  if (income <= 9000000) return 0.23;
  return 0.33;
}

function diagnose(form: FormState): DiagnosisResult {
  // "income" always = the dependent-side income evaluated against all walls.
  // For dependent/both: form.income = own income.
  // For supporter:      form.income = spouse's (dependent's) income.
  const income = parseFloat(form.income) || 0;

  // Supporter's own income — used only for tax rate and eligibility gating.
  // For dependent/both: form.spouseIncome holds this.
  // For supporter:      form.supporterIncome holds this.
  const supporterIncomeVal = form.role === "supporter"
    ? (parseFloat(form.supporterIncome) || 0)
    : (parseFloat(form.spouseIncome) || 0);

  const age = parseInt(form.age) || 35;
  const isDependent = form.role === "dependent" || form.role === "both";
  const isSupporter = form.role === "supporter" || form.role === "both";
  const socialInsApplicable = form.companySize === "over101" || form.companySize === "51to100";

  // Gate: supporter income > 1,000万円 → 配偶者控除 unavailable
  const supporterIneligible = supporterIncomeVal > 1000;
  const supporterTaxRate = getSupporterTaxRate(supporterIncomeVal);
  const spouseBurden = Math.round(380000 * supporterTaxRate / 10000);

  // Returns approaching when 0 < diff <= 5, safe when diff > 5, over when <= 0
  function wallStatus(wallAmount: number, inc: number): { status: WallStatusType; distanceMan: number } {
    const diff = wallAmount - inc;
    if (diff > 5) return { status: "safe", distanceMan: diff };
    if (diff > 0) return { status: "approaching", distanceMan: diff };
    return { status: "over", distanceMan: diff };
  }

  // Wall 1: 100万円 住民税
  const w1 = wallStatus(100, income);
  const wall1: WallStatus = {
    name: "住民税の壁",
    amount: 100,
    amountLabel: "100万円",
    description: "住民税が発生するライン",
    impact: "住民税が発生（本人負担）",
    impactAmount: "年5,000〜10,000円",
    status: w1.status,
    distanceMan: w1.distanceMan,
    applicable: true,
    is2026New: false,
    advice: w1.status === "safe"
      ? `あと${w1.distanceMan.toFixed(1)}万円まで安全です。住民税の負担はまだありません。`
      : w1.status === "approaching"
      ? `壁まであと${w1.distanceMan.toFixed(1)}万円です。住民税は年5,000〜10,000円程度で影響は軽微です。`
      : "住民税が発生しています。年5,000〜10,000円程度の負担ですが、他の壁と比べて影響は小さいです。",
  };

  // Wall 2: 103万円 所得税・配偶者控除
  const w2 = wallStatus(103, income);
  const wall2: WallStatus = {
    name: "所得税の壁（→2026年改正で178万円へ）",
    amount: 103,
    amountLabel: "103万円",
    description: "所得税が発生・配偶者控除消滅のライン",
    impact: "本人の所得税発生 + 配偶者控除（38万円）消滅",
    impactAmount: supporterIneligible
      ? "扶養する側の年収が1,000万円超のため配偶者控除は適用外"
      : supporterIncomeVal > 0
      ? `扶養する側の増税 約${spouseBurden}万円/年`
      : "配偶者控除消滅（扶養する側の税率による）",
    status: w2.status,
    distanceMan: w2.distanceMan,
    applicable: true,
    is2026New: false,
    advice: w2.status === "safe"
      ? `あと${w2.distanceMan.toFixed(1)}万円まで安全です。2026年改正で178万円まで引き上げ予定（段階的実施）。`
      : w2.status === "approaching"
      ? `壁まであと${w2.distanceMan.toFixed(1)}万円です。2026年改正後は178万円まで引き上げ予定のため、改正後は気にしなくなります。`
      : `超過中。所得税が発生しています。2026年改正で178万円ラインに変わる予定のため、改正後は税負担が解消されます。`,
  };

  // Wall 3: 106万円 社会保険
  const w3 = wallStatus(106, income);
  const wall3: WallStatus = {
    name: "社会保険の壁",
    amount: 106,
    amountLabel: "106万円",
    description: "勤務先社会保険の加入義務ライン（101人以上企業）",
    impact: "健康保険料＋厚生年金保険料が発生",
    impactAmount: "年約15〜16万円（月約1.3万円）",
    status: !socialInsApplicable ? "not_applicable" as const : w3.status,
    distanceMan: w3.distanceMan,
    applicable: socialInsApplicable && form.employmentType === "part",
    is2026New: false,
    advice: !socialInsApplicable
      ? "勤務先が50人以下のため、現状この壁は適用されません。"
      : w3.status === "safe"
      ? `あと${w3.distanceMan.toFixed(1)}万円まで安全です。超える場合は年収を120万円以上にすることをお勧めします。`
      : w3.status === "approaching"
      ? `壁まであと${w3.distanceMan.toFixed(1)}万円です。超える場合は社会保険料（年15〜16万円）を上回る年収120万円以上を目指しましょう。`
      : `超過中。社会保険料負担（年15〜16万円）が発生しています。年収120万円以上にすると手取りが回復します。`,
  };

  // Wall 4: 130万円 扶養
  const w4 = wallStatus(130, income);
  const wall4: WallStatus = {
    name: "扶養の壁（健康保険）",
    amount: 130,
    amountLabel: "130万円",
    description: "配偶者の健康保険扶養から外れるライン",
    impact: "自分で健康保険に加入が必要",
    impactAmount: "年約19〜20万円（国保の場合）",
    status: w4.status,
    distanceMan: w4.distanceMan,
    applicable: isDependent && form.inDependency,
    is2026New: false,
    advice: !form.inDependency
      ? "現在、配偶者の扶養に入っていないため、この壁は直接影響しません。"
      : w4.status === "safe"
      ? `あと${w4.distanceMan.toFixed(1)}万円まで安全です。扶養内で健康保険の保険料は0円です。`
      : w4.status === "approaching"
      ? `壁まであと${w4.distanceMan.toFixed(1)}万円です。超える場合は勤務先社会保険か国保への切り替えが必要です。年収160万円以上にすると手取りが回復します。`
      : `超過中。自分で健康保険に加入する必要があります。年収160万円以上にすると手取りが改善します。`,
  };

  // Wall 5: 150万円 配偶者特別控除
  const w5 = wallStatus(150, income);
  const wall5: WallStatus = {
    name: "配偶者特別控除の壁",
    amount: 150,
    amountLabel: "150万円",
    description: "配偶者特別控除が満額（38万円）の上限",
    impact: "150万円超から配偶者特別控除が段階的に減少",
    impactAmount: supporterIneligible
      ? "扶養する側の年収が1,000万円超のため配偶者特別控除は適用外"
      : supporterIncomeVal > 0
      ? `扶養する側の増税 最大${Math.round(380000 * supporterTaxRate / 10000)}万円/年`
      : "配偶者の所得税率による",
    status: w5.status,
    distanceMan: w5.distanceMan,
    applicable: isDependent || isSupporter,
    is2026New: false,
    advice: w5.status === "safe"
      ? `あと${w5.distanceMan.toFixed(1)}万円まで配偶者特別控除が満額（38万円）適用されます。`
      : w5.status === "approaching"
      ? `壁まであと${w5.distanceMan.toFixed(1)}万円です。150万円を超えると配偶者特別控除が段階的に減少します。`
      : `超過中。配偶者特別控除が段階的に減少しています。201万円以上になると完全に消滅します。`,
  };

  // Wall 6: 178万円 2026年新設
  const w6 = wallStatus(178, income);
  const wall6: WallStatus = {
    name: "新・所得税の壁（2026年改正）",
    amount: 178,
    amountLabel: "178万円",
    description: "2026年税制改正による新しい非課税ライン",
    impact: "この壁を超えると所得税が発生（2026年改正後）",
    impactAmount: "超えた分の所得税（累進課税）",
    status: w6.status,
    distanceMan: w6.distanceMan,
    applicable: true,
    is2026New: true,
    advice: w6.status === "safe"
      ? `2026年改正後は178万円まで所得税が非課税になる予定です。あと${w6.distanceMan.toFixed(1)}万円まで安全圏です。`
      : w6.status === "approaching"
      ? `壁まであと${w6.distanceMan.toFixed(1)}万円です。2026年改正の新ラインに近づいています。`
      : `超過中。2026年改正後の新ラインを超えています。現行制度でも103万円の壁は超えているため、所得税が既に発生しています。`,
  };

  const walls = [wall1, wall2, wall3, wall4, wall5, wall6];

  // Current zone
  const sortedWalls = [100, 103, 106, 130, 150, 178];
  let currentZone = "178万円超";
  for (let i = 0; i < sortedWalls.length; i++) {
    if (income <= sortedWalls[i]) {
      currentZone = i === 0 ? "100万円未満" : `${sortedWalls[i-1]}万円〜${sortedWalls[i]}万円`;
      break;
    }
  }

  // Next wall: first wall with positive distance that is applicable
  const nextWall = walls.find(w => w.distanceMan > 0 && w.applicable) || null;

  // Recommendation
  let recommendation = "";
  let optimalIncomeAdvice = "";
  if (income < 100) {
    recommendation = "現在は全ての壁の手前にいます。年収100万円まで住民税の負担はありません。";
    optimalIncomeAdvice = "年収100万円未満に抑えると住民税も発生しません。";
  } else if (income < 103) {
    recommendation = "住民税の壁を超えていますが、他の主要な壁はまだ先です。";
    optimalIncomeAdvice = "年収103万円（2026年改正後178万円）未満に抑えると所得税・配偶者控除の影響がありません。";
  } else if (income < 106) {
    recommendation = "103万円の壁を超えています。所得税と配偶者控除への影響が出ています。";
    optimalIncomeAdvice = socialInsApplicable ? "次の106万円の壁に近いため、年収を103万円以下か120万円以上にすることをお勧めします。" : "次の130万円の壁まで距離があります。";
  } else if (income < 130) {
    recommendation = "社会保険の壁付近にいます。手取り逆転ゾーンに入る可能性があります。";
    optimalIncomeAdvice = "年収120万円以上にすると社会保険料負担をカバーできます。または103万円以下に抑えましょう。";
  } else if (income < 150) {
    recommendation = "扶養の壁を超えています。健康保険を自分で負担する必要があります。";
    optimalIncomeAdvice = "年収160万円以上にすると健康保険料の負担をカバーできます。";
  } else if (income < 178) {
    recommendation = "配偶者特別控除の減少ゾーンにいます。2026年改正の178万円の壁が最後の壁です。";
    optimalIncomeAdvice = "年収178万円以上にすると2026年改正後の非課税ラインを超えます。それ以上稼ぐか150万円以下に抑えましょう。";
  } else {
    recommendation = "全ての壁を超えています。扶養の枠にとらわれず、収入を最大化することが最もお得です。";
    optimalIncomeAdvice = "全ての壁を超えているため、働く時間を増やして収入を最大化するのがベストです。";
  }

  // Rough take-home estimate
  const annualIncome = income * 10000;
  let deductions = 0;
  if (income > 100) deductions += 7500;
  if (income > 103) deductions += Math.max(0, (annualIncome - 1030000) * 0.05);
  if (income > 106 && socialInsApplicable) deductions += 155000;
  else if (income > 130) deductions += 195000;
  const estimatedTakeHome = Math.max(0, annualIncome - deductions);

  return { walls, currentZone, nextWall, recommendation, estimatedTakeHome, optimalIncomeAdvice };
}

// ============================================================
// Default form
// ============================================================

const DEFAULT_FORM: FormState = {
  role: "dependent",
  income: "",
  spouseIncome: "",
  supporterIncome: "",
  companySize: "over101",
  employmentType: "part",
  inDependency: true,
  healthInsuranceBySpouse: true,
  enrolledInSocialInsurance: false,
  age: "35",
};

// ============================================================
// Component
// ============================================================

export default function IncomeWallCheckerPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError("");
  }

  function handleDiagnose() {
    if (form.role === "supporter") {
      if (!form.income || parseFloat(form.income) < 0) {
        setError("配偶者の年収を入力してください");
    setMascotState("error");
        return;
      }
    } else {
      if (!form.income || parseFloat(form.income) < 0) {
        setError("現在の年収（見込み）を入力してください");
    setMascotState("error");
        return;
      }
    }
    setResult(diagnose(form));
    setError("");
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const isSupporter = form.role === "supporter";
  const showSpouseIncome = form.role === "dependent" || form.role === "both";

  // Wall meter positions (out of 180 max)
  const WALLS = [100, 103, 106, 130, 150, 178];

  function meterPercent(val: number): number {
    return Math.min(100, (val / 180) * 100);
  }

  function statusIcon(status: WallStatusType): string {
    if (status === "not_applicable") return "➖";
    if (status === "approaching") return "🟡";
    if (status === "safe") return "✅";
    if (status === "warning") return "⚠️";
    return "🔴";
  }

  function statusLabel(status: WallStatusType): { label: string; cls: string } {
    if (status === "not_applicable") return { label: "適用外", cls: "bg-gray-100 text-gray-500" };
    if (status === "approaching") return { label: "接近中", cls: "bg-amber-100 text-amber-700" };
    if (status === "safe") return { label: "安全圏", cls: "bg-green-100 text-green-700" };
    if (status === "warning") return { label: "要注意", cls: "bg-yellow-100 text-yellow-700" };
    return { label: "超過済み", cls: "bg-red-100 text-red-700" };
  }

  const faqs = [
    {
      q: "2026年から103万円の壁はなくなりますか？",
      a: "2026年度税制改正により、所得税の非課税ライン（いわゆる103万円の壁）が178万円に引き上げられる方向で議論が進んでいます。ただし住民税の100万円の壁・社会保険の106万円の壁・扶養の130万円の壁は別の制度のため、引き続き注意が必要です。",
    },
    {
      q: "年収103万円を少し超えたらどれだけ損しますか？",
      a: "103万円をわずかに超えた場合の影響は主に2つです。①本人の所得税が発生（超えた分の5%）②配偶者の配偶者控除（38万円）が消滅し、配偶者の税負担が増加。配偶者の税率20%の場合、約7.6万円の増税となります。ただし2026年改正後はこのラインが178万円に変わる予定です。",
    },
    {
      q: "106万円の壁は全員に適用されますか？",
      a: "いいえ、従業員51人以上の企業で、週20時間以上・月収88,000円以上・2ヶ月超の雇用見込みの条件をすべて満たす場合に適用されます。50人以下の企業では現状この壁は適用されませんが、将来的な拡大も検討されています。",
    },
    {
      q: "扶養の130万円の壁を超えたら何が変わりますか？",
      a: "配偶者の健康保険の扶養から外れ、自分で健康保険に加入する必要があります。勤務先で社会保険に加入できる場合はそちらに、できない場合は国民健康保険に加入します。国民健康保険料は前年所得に基づくため、年収によっては年20万円以上の負担が発生します。",
    },
    {
      q: "年収の壁を気にせず働くためにはどうすればいいですか？",
      a: "壁を超えた場合に手取りが逆転しない年収水準まで一気に上げることが最も効果的です。例えば106万円の壁を超える場合は、社会保険料負担（約15〜16万円/年）を上回る収入増（約120万円以上）を目指すと手取りが増えます。また130万円の壁を超えてフルタイムに近い働き方をすれば、社会保険のデメリットより将来の年金受給額増加のメリットが上回ります。",
    },
  ];

  // Progress bar tracks the income evaluated against walls
  const incomeNum = parseFloat(form.income) || 0;


  const faqItems = [
    { question: "103万円の壁とは何ですか？", answer: "パート・アルバイトの給与収入が103万円を超えると所得税が発生し、配偶者の税制上の扶養から外れます。ただし2026年から基礎控除引き上げにより実質的な壁が変わります。" },
    { question: "130万円の壁とは？", answer: "給与収入が130万円を超えると、配偶者の健康保険の扶養から外れ、自身で国民健康保険か社会保険に加入する必要があります。社会保険料負担が年間20〜30万円増えるため手取りが大きく減少します。" },
    { question: "2026年の税制改正で何が変わりますか？", answer: "2026年より基礎控除が58万円（現行48万円）に引き上げられ、給与所得控除の最低額も改定されます。これにより従来の103万円の壁が実質的に178万円まで引き上げられる見込みです。" },
    { question: "年収の壁を超えると必ず損しますか？", answer: "必ずしもそうではありません。壁を超えた直後は手取りが減りますが、収入を十分に増やせば逆転します。本ツールで手取りが逆転しない安全な年収帯を確認し、計画的に働く時間を調整することをお勧めします。" },
    { question: "106万円の壁とは何ですか？", answer: "従業員101人以上の企業で週20時間以上働く場合、年収106万円（月額88,000円）を超えると勤め先の社会保険に加入する義務が生じます。2024年10月から51人以上の企業に対象が拡大されています。" }
  ];
  const useCases = [
    { icon: "👩‍💼", persona: "パート・アルバイトの方", title: "年収を増やしたいが壁が不安", benefit: "安全な年収帯と手取り逆転ゾーンを確認" },
    { icon: "🏠", persona: "扶養内で働く主婦・主夫", title: "130万円の壁を超えるか検討中", benefit: "社会保険加入の影響額を事前把握" },
    { icon: "📢", persona: "2026年税制改正が気になる方", title: "178万円の新しい壁を理解したい", benefit: "改正後の税負担変化をシミュレーション" }
  ];
  return (
    <>
      <IntroSection title="年収の壁 診断ツール" paragraphs={["年収の壁（103万・106万・130万・150万・178万円）を入力するだけで一括診断。手取りが逆転するゾーンと安全な年収帯をわかりやすく可視化します。", "2026年税制改正（基礎控除58万円引き上げ・178万円の壁新設）に完全対応。年収・雇用形態・扶養状況を入力するだけで影響額を計算できます。", "登録不要・完全無料。パート・アルバイトの方や配偶者を扶養している方の働き方計画に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">2026年改正対応</span>
            <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded">178万円の壁 NEW</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            年収の壁 診断ツール
          </h1>
          <p className="text-gray-600 text-sm">
            6つの年収の壁（100万・103万・106万・130万・150万・178万円）を一括診断。あなたの手取りが最大になる年収帯がわかります。
          </p>
        </div>

        {/* 2026 Reform Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-lg shrink-0">📢</span>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">2026年税制改正：103万円の壁が178万円に引き上げ予定</p>
              <p className="text-xs text-blue-700">この改正により、パート・アルバイトの方は最大178万円まで所得税・配偶者控除の影響を受けずに働けるようになります（段階的実施）。ただし100万円（住民税）・106万円（社会保険）・130万円（扶養）の壁は別制度のため引き続き注意が必要です。</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ========== INPUT CARD ========== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

            {/* Section 1 */}
            <div>
              <h2 className="text-base font-semibold text-blue-700 mb-4 pb-2 border-b-2 border-blue-100 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                あなたの状況
              </h2>
              <div className="space-y-4">

                {/* 立場 */}
                <div>
                  <label className={labelClass}>立場を選択 <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {([
                      ["dependent", "パート・アルバイトで働いている（扶養されている側）"],
                      ["supporter", "配偶者を扶養している（扶養する側）"],
                      ["both", "両方確認したい"],
                    ] as const).map(([val, lbl]) => (
                      <label key={val} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={val}
                          checked={form.role === val}
                          onChange={() => handleChange("role", val)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">{lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* === 扶養する側モード: 2つの年収フィールド === */}
                {isSupporter ? (
                  <>
                    {/* Field A: 自分の年収（扶養する側） */}
                    <div>
                      <label className={labelClass}>自分の年収（見込み）</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={form.supporterIncome}
                          onChange={(e) => handleChange("supporterIncome", e.target.value)}
                          placeholder="例: 500"
                          className={inputClass}
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">配偶者控除の適用判定に使用（1,000万円超は対象外）</p>
                    </div>

                    {/* Field B: 配偶者の年収（壁の診断対象） */}
                    <div>
                      <label className={labelClass}>配偶者の年収（見込み） <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={form.income}
                          onChange={(e) => handleChange("income", e.target.value)}
                          placeholder="例: 103"
                          className={inputClass}
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">配偶者控除・配偶者特別控除の計算に使用</p>
                      {incomeNum > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>0</span>
                            <span>100</span>
                            <span>106</span>
                            <span>130</span>
                            <span>178万</span>
                          </div>
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            {WALLS.map((w, i) => (
                              <div
                                key={i}
                                className="absolute top-0 bottom-0 w-px bg-gray-400"
                                style={{ left: `${meterPercent(w)}%` }}
                              />
                            ))}
                            <div
                              className={`absolute top-0 bottom-0 rounded-full transition-all ${
                                incomeNum >= 178 ? "bg-red-500" :
                                incomeNum >= 130 ? "bg-orange-500" :
                                incomeNum >= 106 ? "bg-yellow-500" :
                                incomeNum >= 103 ? "bg-yellow-400" :
                                "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(100, meterPercent(incomeNum))}%` }}
                            />
                            <div
                              className="absolute top-0 bottom-0 w-1 bg-blue-700 rounded"
                              style={{ left: `${Math.min(98, meterPercent(incomeNum))}%` }}
                            />
                          </div>
                          <div className="text-xs text-center text-blue-700 mt-1 font-medium">配偶者の年収: {incomeNum}万円</div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* === 扶養されている側 / 両方モード: 単一の年収フィールド + 配偶者年収 === */
                  <>
                    <div>
                      <label className={labelClass}>現在の年収（見込み） <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={form.income}
                          onChange={(e) => handleChange("income", e.target.value)}
                          placeholder="例: 103"
                          className={inputClass}
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                      </div>
                      {incomeNum > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>0</span>
                            <span>100</span>
                            <span>106</span>
                            <span>130</span>
                            <span>178万</span>
                          </div>
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            {WALLS.map((w, i) => (
                              <div
                                key={i}
                                className="absolute top-0 bottom-0 w-px bg-gray-400"
                                style={{ left: `${meterPercent(w)}%` }}
                              />
                            ))}
                            <div
                              className={`absolute top-0 bottom-0 rounded-full transition-all ${
                                incomeNum >= 178 ? "bg-red-500" :
                                incomeNum >= 130 ? "bg-orange-500" :
                                incomeNum >= 106 ? "bg-yellow-500" :
                                incomeNum >= 103 ? "bg-yellow-400" :
                                "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(100, meterPercent(incomeNum))}%` }}
                            />
                            <div
                              className="absolute top-0 bottom-0 w-1 bg-blue-700 rounded"
                              style={{ left: `${Math.min(98, meterPercent(incomeNum))}%` }}
                            />
                          </div>
                          <div className="text-xs text-center text-blue-700 mt-1 font-medium">現在: {incomeNum}万円</div>
                        </div>
                      )}
                    </div>

                    {showSpouseIncome && (
                      <div>
                        <label className={labelClass}>配偶者の年収（扶養する側）</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={form.spouseIncome}
                            onChange={(e) => handleChange("spouseIncome", e.target.value)}
                            placeholder="例: 600"
                            className={inputClass}
                          />
                          <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">配偶者控除の影響額計算に使用します</p>
                      </div>
                    )}
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>勤務先の従業員数</label>
                    <select
                      value={form.companySize}
                      onChange={(e) => handleChange("companySize", e.target.value as CompanySize)}
                      className={inputClass}
                    >
                      <option value="under51">51人未満</option>
                      <option value="51to100">51〜100人</option>
                      <option value="over101">101人以上</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>雇用形態</label>
                    <select
                      value={form.employmentType}
                      onChange={(e) => handleChange("employmentType", e.target.value as EmploymentType)}
                      className={inputClass}
                    >
                      <option value="part">パート・アルバイト</option>
                      <option value="fulltime">正社員</option>
                      <option value="contract">契約社員・派遣</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-base font-semibold text-blue-700 mb-4 pb-2 border-b-2 border-blue-100 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                現在の状況確認
              </h2>
              <div className="space-y-3">

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">現在、配偶者の扶養に入っていますか？</label>
                  <div className="flex gap-2">
                    {(["はい", "いいえ"] as const).map((lbl, i) => (
                      <button
                        key={i}
                        onClick={() => handleChange("inDependency", i === 0)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          form.inDependency === (i === 0)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">健康保険は配偶者の扶養で加入していますか？</label>
                  <div className="flex gap-2">
                    {(["はい", "いいえ"] as const).map((lbl, i) => (
                      <button
                        key={i}
                        onClick={() => handleChange("healthInsuranceBySpouse", i === 0)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          form.healthInsuranceBySpouse === (i === 0)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">勤務先で社会保険に加入していますか？</label>
                  <div className="flex gap-2">
                    {(["はい", "いいえ"] as const).map((lbl, i) => (
                      <button
                        key={i}
                        onClick={() => handleChange("enrolledInSocialInsurance", i === 0)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          form.enrolledInSocialInsurance === (i === 0)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>年齢</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={18}
                      max={75}
                      value={form.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">歳</span>
                    <span className="text-xs text-gray-400">（40歳以上は介護保険料加算）</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDiagnose}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-sm"
              >
                診断する
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
            </div>
          </div>

          {/* ========== RESULTS ========== */}
          <div>
            {!result && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-sm">左のフォームに入力して<br />「診断する」を押してください</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">

                {/* 現在地 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">あなたの現在地</h2>
                  <div className="bg-blue-50 rounded-lg px-4 py-3 mb-3">
                    <p className="text-sm text-blue-800">
                      {isSupporter ? "配偶者の年収" : "現在の年収"}{" "}
                      <span className="font-bold text-lg">{incomeNum}万円</span> は
                      <span className="font-semibold"> {result.currentZone}</span> にいます
                    </p>
                  </div>
                  {result.nextWall && (
                    <p className="text-sm text-gray-600">
                      次の壁（<span className="font-medium">{result.nextWall.amountLabel}</span>）まで
                      <span className="font-bold text-blue-700"> あと{result.nextWall.distanceMan.toFixed(1)}万円</span>
                    </p>
                  )}
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                    {result.recommendation}
                  </div>
                </div>

                {/* Fix 2: 2026年改正 callout when income >= 150 */}
                {incomeNum >= 150 && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <div className="flex items-center gap-2 font-bold text-blue-800 mb-1">
                      <span>📢</span>
                      <span>2026年税制改正 — あなたへの影響</span>
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full ml-1">NEW</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      2026年改正後は所得税の非課税ラインが<strong>178万円</strong>に引き上げ予定です。
                      現在の年収 <strong>{incomeNum}万円</strong> は改正後の新ラインに
                      {incomeNum >= 178 ? (
                        <>達しています。178万円を超えると所得税が発生します。</>
                      ) : (
                        <>まだ届きません。あと<strong>{178 - incomeNum}万円</strong>で新ラインに到達します。</>
                      )}
                    </p>
                  </div>
                )}

                {/* Wall Cards */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">各壁の詳細診断</h2>
                  <div className="space-y-3">
                    {result.walls.map((wall, i) => {
                      const sl = statusLabel(wall.status);
                      return (
                        <div
                          key={i}
                          className={`rounded-lg border p-3 ${
                            wall.status === "not_applicable" ? "border-gray-100 bg-gray-50 opacity-60" :
                            !wall.applicable ? "border-gray-100 bg-gray-50 opacity-60" :
                            wall.status === "over" ? "border-red-200 bg-red-50" :
                            wall.status === "approaching" ? "border-amber-200 bg-amber-50" :
                            wall.status === "warning" ? "border-yellow-200 bg-yellow-50" :
                            "border-green-100 bg-green-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm">{statusIcon(wall.status)}</span>
                                <span className="text-sm font-semibold text-gray-800">{wall.amountLabel}の壁</span>
                                {wall.is2026New && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">2026年新設</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{wall.description}</p>
                              <p className="text-xs text-gray-500">
                                影響: {wall.impact}（<span className="font-medium">{wall.impactAmount}</span>）
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className={`text-xs px-2 py-1 rounded font-medium ${sl.cls}`}>{sl.label}</span>
                              {wall.applicable && wall.status !== "not_applicable" && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {wall.distanceMan > 0
                                    ? `あと${wall.distanceMan.toFixed(1)}万円`
                                    : `${Math.abs(wall.distanceMan).toFixed(1)}万円超過`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200/60">
                            <p className="text-xs text-gray-600">💡 {wall.advice}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 総合診断 */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
                  <h3 className="text-sm font-semibold mb-3">総合診断・推奨アクション</h3>
                  <div className="bg-white/10 rounded-lg p-3 mb-3">
                    <p className="text-xs text-blue-100 mb-1">手取り概算（年間）</p>
                    <p className="text-2xl font-bold">約{Math.round(result.estimatedTakeHome / 10000)}万円</p>
                  </div>
                  <p className="text-xs text-blue-100 leading-relaxed">{result.optimalIncomeAdvice}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========== SEO CONTENT ========== */}

        {/* 壁一覧表 */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">年収の壁 一覧早見表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">壁の名称</th>
                  <th className="text-left py-2 text-gray-500 font-medium">金額</th>
                  <th className="text-left py-2 text-gray-500 font-medium">発生する影響</th>
                  <th className="text-left py-2 text-gray-500 font-medium">対象</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: "住民税の壁", amount: "100万円", impact: "住民税発生（年5,000〜10,000円）", target: "本人", highlight: false },
                  { name: "所得税の壁", amount: "103万円→178万円（2026年改正）", impact: "所得税発生・配偶者控除消滅", target: "本人・配偶者", highlight: false },
                  { name: "社会保険の壁", amount: "106万円", impact: "社会保険料発生（年15〜16万円）", target: "101人以上企業勤務者", highlight: false },
                  { name: "扶養の壁", amount: "130万円", impact: "健康保険扶養から外れる", target: "扶養されている側", highlight: false },
                  { name: "配偶者特別控除の壁", amount: "150万円", impact: "配偶者特別控除が減少し始める", target: "配偶者側", highlight: false },
                  { name: "新・所得税の壁", amount: "178万円", impact: "2026年改正後の所得税発生ライン", target: "本人", highlight: true },
                ].map((row, i) => (
                  <tr key={i} className={row.highlight ? "bg-blue-50" : ""}>
                    <td className="py-2 font-medium text-gray-800">
                      {row.name}
                      {row.highlight && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">2026年新設</span>}
                    </td>
                    <td className="py-2 text-gray-700">{row.amount}</td>
                    <td className="py-2 text-gray-600">{row.impact}</td>
                    <td className="py-2 text-gray-500 text-xs">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 基礎知識 */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">年収の壁の基礎知識</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">「年収の壁」とは</h3>
              <p>「年収の壁」とは、年収がある金額を超えると税金・社会保険料の負担が急激に増え、手取り収入が逆に減ってしまう現象のことです。パート・アルバイトで働く方が扶養の範囲内に収入を抑えようとする主な理由でもあります。</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">2026年税制改正のポイント</h3>
              <p className="text-blue-800">2026年度税制改正により、所得税の非課税ライン（103万円の壁）が178万円に引き上げられる方向で議論が進んでいます。この改正が実施されれば、パート・アルバイトで働く方の手取りが大幅に増加します。ただし段階的な実施が予定されており、詳細は今後の政府発表をご確認ください。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">106万円の壁の注意点（2024年10月改正）</h3>
              <p>2024年10月から、社会保険の加入義務が従業員51人以上の企業に拡大されました。週20時間以上・月収88,000円以上・2ヶ月超の雇用見込みの条件を満たすと加入義務が生じます。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">扶養する側（配偶者）への影響</h3>
              <p>配偶者の年収が103万円を超えると、扶養する側の配偶者控除（38万円）が消滅します。配偶者の所得税率が20%の場合、税負担が約7.6万円増加します。</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">手取り逆転ゾーンとは</h3>
              <p>壁を少し超えた年収帯では、増えた収入より増えた税・社会保険料の方が多くなり、手取りが逆に減る「手取り逆転ゾーン」が生じます。例えば106万円の壁を超えて107万円になると、社会保険料負担で手取りが約3〜4万円減ることがあります。</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">Q{i + 1}. {faq.q}</span>
                  <span className={`text-gray-400 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "各種控除を反映した正確な税額を計算" },
              { href: "/career/job-change-simulator", label: "転職年収シミュレーター", desc: "転職前後の手取りを詳しく比較" },
              { href: "/tax/furusato-nozei-calculator", label: "ふるさと納税 控除額計算機", desc: "自分の控除上限額を簡単に計算" },
              { href: "/insurance/life-insurance-calculator", label: "生命保険 必要保障額計算機", desc: "家族構成から必要な保障額を計算" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex flex-col gap-1 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-sm font-medium text-blue-700">{tool.label}</span>
                <span className="text-xs text-gray-500">{tool.desc}</span>
              </Link>
            ))}
          </div>
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/nenshu-kabe-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】年収の壁とは？103万・106万・130万・150万の壁を完全解説</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
        </div>

      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>

  </>
  );
}
