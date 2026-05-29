"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FormState {
  age: string;
  currentSalary: string;
  industry: string;
  jobType: string;
  experience: string;
  education: string;
  skillCount: string;
  management: string;
  english: string;
  jobChanges: string;
  achievement: string;
  negotiationPurpose: string;
  targetSalary: string;
  companySize: string;
}

interface CalcResult {
  marketSalary: number;
  minLine: number;
  realisticTarget: number;
  stretchTarget: number;
  currentSalary: number;
  gap: number;
  gapRate: number;
  stance: string;
  stanceType: "high" | "low" | "normal";
  talkingPoints: string[];
  negotiationAdvice: string;
}

const DEFAULT_FORM: FormState = {
  age: "",
  currentSalary: "",
  industry: "",
  jobType: "",
  experience: "",
  education: "大学卒（文系）",
  skillCount: "なし",
  management: "なし",
  english: "不要・なし",
  jobChanges: "1〜2回",
  achievement: "特になし",
  negotiationPurpose: "転職時の年収交渉",
  targetSalary: "",
  companySize: "大企業（301人以上）",
};

// Base salary table: industry × jobType (万円, 30代・経験5年・大卒基準)
const BASE_SALARY: Record<string, Record<string, number>> = {
  "IT・ソフトウェア": {
    "エンジニア・IT": 550,
    "マーケティング": 480,
    "営業": 500,
    "経理・財務": 460,
    "人事・労務": 440,
    "企画・経営": 500,
    "研究・開発": 520,
    "デザイン": 460,
    "医療・看護": 420,
    "事務・アシスタント": 400,
    "管理職・マネージャー": 650,
    "その他": 460,
  },
  "金融・保険": {
    "エンジニア・IT": 540,
    "マーケティング": 500,
    "営業": 580,
    "経理・財務": 520,
    "人事・労務": 480,
    "企画・経営": 600,
    "研究・開発": 520,
    "デザイン": 440,
    "医療・看護": 420,
    "事務・アシスタント": 430,
    "管理職・マネージャー": 700,
    "その他": 500,
  },
  "コンサルティング": {
    "エンジニア・IT": 650,
    "マーケティング": 600,
    "営業": 620,
    "経理・財務": 580,
    "人事・労務": 560,
    "企画・経営": 700,
    "研究・開発": 620,
    "デザイン": 520,
    "医療・看護": 480,
    "事務・アシスタント": 460,
    "管理職・マネージャー": 800,
    "その他": 580,
  },
  "医療・製薬": {
    "エンジニア・IT": 500,
    "マーケティング": 520,
    "営業": 480,
    "経理・財務": 460,
    "人事・労務": 440,
    "企画・経営": 520,
    "研究・開発": 600,
    "デザイン": 420,
    "医療・看護": 480,
    "事務・アシスタント": 400,
    "管理職・マネージャー": 650,
    "その他": 460,
  },
  "メーカー（製造業）": {
    "エンジニア・IT": 480,
    "マーケティング": 450,
    "営業": 450,
    "経理・財務": 440,
    "人事・労務": 420,
    "企画・経営": 480,
    "研究・開発": 500,
    "デザイン": 420,
    "医療・看護": 400,
    "事務・アシスタント": 380,
    "管理職・マネージャー": 600,
    "その他": 440,
  },
  "商社・卸売": {
    "エンジニア・IT": 500,
    "マーケティング": 520,
    "営業": 550,
    "経理・財務": 480,
    "人事・労務": 460,
    "企画・経営": 580,
    "研究・開発": 500,
    "デザイン": 440,
    "医療・看護": 420,
    "事務・アシスタント": 420,
    "管理職・マネージャー": 650,
    "その他": 480,
  },
  "小売・サービス": {
    "エンジニア・IT": 420,
    "マーケティング": 400,
    "営業": 380,
    "経理・財務": 380,
    "人事・労務": 360,
    "企画・経営": 400,
    "研究・開発": 400,
    "デザイン": 360,
    "医療・看護": 360,
    "事務・アシスタント": 350,
    "管理職・マネージャー": 500,
    "その他": 370,
  },
  "不動産・建設": {
    "エンジニア・IT": 480,
    "マーケティング": 460,
    "営業": 520,
    "経理・財務": 440,
    "人事・労務": 420,
    "企画・経営": 480,
    "研究・開発": 460,
    "デザイン": 420,
    "医療・看護": 400,
    "事務・アシスタント": 380,
    "管理職・マネージャー": 620,
    "その他": 450,
  },
  "広告・メディア": {
    "エンジニア・IT": 480,
    "マーケティング": 480,
    "営業": 450,
    "経理・財務": 420,
    "人事・労務": 400,
    "企画・経営": 480,
    "研究・開発": 450,
    "デザイン": 460,
    "医療・看護": 380,
    "事務・アシスタント": 370,
    "管理職・マネージャー": 600,
    "その他": 430,
  },
  "教育": {
    "エンジニア・IT": 420,
    "マーケティング": 380,
    "営業": 380,
    "経理・財務": 380,
    "人事・労務": 360,
    "企画・経営": 400,
    "研究・開発": 440,
    "デザイン": 360,
    "医療・看護": 380,
    "事務・アシスタント": 340,
    "管理職・マネージャー": 500,
    "その他": 380,
  },
  "公務員・非営利": {
    "エンジニア・IT": 420,
    "マーケティング": 400,
    "営業": 400,
    "経理・財務": 420,
    "人事・労務": 420,
    "企画・経営": 440,
    "研究・開発": 440,
    "デザイン": 380,
    "医療・看護": 420,
    "事務・アシスタント": 380,
    "管理職・マネージャー": 520,
    "その他": 420,
  },
  "その他": {
    "エンジニア・IT": 440,
    "マーケティング": 420,
    "営業": 420,
    "経理・財務": 420,
    "人事・労務": 400,
    "企画・経営": 440,
    "研究・開発": 440,
    "デザイン": 400,
    "医療・看護": 400,
    "事務・アシスタント": 360,
    "管理職・マネージャー": 540,
    "その他": 420,
  },
};

function getAgeCoeff(age: number): number {
  if (age <= 24) return 0.65;
  if (age <= 29) return 0.82;
  if (age <= 34) return 1.00;
  if (age <= 39) return 1.15;
  if (age <= 44) return 1.22;
  if (age <= 49) return 1.18;
  if (age <= 54) return 1.10;
  return 0.95;
}

function getExperiencePremium(years: number): number {
  if (years <= 2) return 0;
  if (years <= 5) return 20;
  if (years <= 10) return 50;
  if (years <= 15) return 80;
  if (years <= 20) return 100;
  return 110;
}

function getEducationPremium(education: string): number {
  const map: Record<string, number> = {
    "高校卒": -30,
    "専門学校卒": -10,
    "大学卒（文系）": 0,
    "大学卒（理系）": 20,
    "大学院卒（修士）": 40,
    "大学院卒（博士）": 50,
    "MBA・専門職学位": 80,
  };
  return map[education] ?? 0;
}

function getSkillPremium(skillCount: string): number {
  const map: Record<string, number> = {
    "なし": 0,
    "1〜2個": 20,
    "3〜5個": 40,
    "6個以上": 70,
  };
  return map[skillCount] ?? 0;
}

function getManagementPremium(management: string): number {
  const map: Record<string, number> = {
    "なし": 0,
    "1〜5人のチームリード": 30,
    "6〜20人のマネージャー": 60,
    "20人以上の管理職": 100,
  };
  return map[management] ?? 0;
}

function getEnglishPremium(english: string): number {
  const map: Record<string, number> = {
    "不要・なし": 0,
    "日常会話レベル": 10,
    "ビジネスレベル": 40,
    "ネイティブレベル": 80,
  };
  return map[english] ?? 0;
}

function getJobChangesPremium(jobChanges: string): number {
  const map: Record<string, number> = {
    "0回（初転職）": 10,
    "1〜2回": 0,
    "3〜4回": -10,
    "5回以上": -30,
  };
  return map[jobChanges] ?? 0;
}

function getAchievementPremium(achievement: string): number {
  const map: Record<string, number> = {
    "特になし": 0,
    "目標達成（100%程度）": 20,
    "目標大幅達成（120%以上）": 50,
    "表彰・社内外から高評価": 80,
    "事業立ち上げ・重要プロジェクト主導": 100,
  };
  return map[achievement] ?? 0;
}

function getCompanySizePremium(companySize: string, purpose: string): number {
  if (purpose === "現職での昇給交渉") return 0;
  const map: Record<string, number> = {
    "スタートアップ（50人未満）": -20,
    "中小企業（51〜300人）": -30,
    "大企業（301人以上）": 0,
    "外資系企業": 80,
    "上場企業": 20,
  };
  return map[companySize] ?? 0;
}

function getNegotiationAdvice(purpose: string): string {
  if (purpose === "現職での昇給交渉") {
    return "期末・評価面談の1〜2ヶ月前が最適。実績データを数字で準備しましょう。";
  }
  if (purpose === "転職時の年収交渉") {
    return "内定後・入社承諾前が交渉の最大チャンス。複数社の内定があると交渉力が上がります。";
  }
  return "熱意を示しつつ、市場データを根拠に提示しましょう。上記の現実的目標を基準点に。";
}

function calculate(form: FormState): CalcResult | null {
  const age = parseInt(form.age);
  const currentSalary = parseInt(form.currentSalary);
  const experience = parseInt(form.experience);

  if (!age || !currentSalary || !form.industry || !form.jobType || form.experience === "") {
    return null;
  }

  const industryData = BASE_SALARY[form.industry] ?? BASE_SALARY["その他"];
  const baseSalary = industryData[form.jobType] ?? industryData["その他"] ?? 420;

  const ageCoeff = getAgeCoeff(age);
  const experiencePremium = getExperiencePremium(experience);
  const educationPremium = getEducationPremium(form.education);
  const skillPremium = getSkillPremium(form.skillCount);
  const managementPremium = getManagementPremium(form.management);
  const englishPremium = getEnglishPremium(form.english);
  const achievementPremium = getAchievementPremium(form.achievement);
  const jobChangesPremium = getJobChangesPremium(form.jobChanges);
  const companySizePremium = getCompanySizePremium(form.companySize, form.negotiationPurpose);

  const marketSalary = Math.round(
    baseSalary * ageCoeff
    + experiencePremium
    + educationPremium
    + skillPremium
    + managementPremium
    + englishPremium
    + achievementPremium
    + jobChangesPremium
    + companySizePremium
  );

  const minLine = Math.round(Math.max(currentSalary * 1.05, marketSalary * 0.90));
  const realisticTarget = marketSalary;
  const stretchTarget = Math.round(marketSalary * 1.15);

  const gap = marketSalary - currentSalary;
  const gapRate = Math.round((gap / currentSalary) * 100);

  let stance: string;
  let stanceType: "high" | "low" | "normal";
  if (currentSalary >= marketSalary * 1.10) {
    stance = "現在の年収は市場水準より高めです。現状維持を重視しつつ、スキルアップで更なる上昇を狙いましょう。";
    stanceType = "high";
  } else if (currentSalary <= marketSalary * 0.85) {
    stance = "現在の年収は市場水準より大幅に低い可能性があります。積極的な交渉または転職検討を強くお勧めします。";
    stanceType = "low";
  } else {
    stance = "現在の年収は市場水準に近い水準です。実績と市場データを根拠に適切な交渉を行いましょう。";
    stanceType = "normal";
  }

  const talkingPoints: string[] = [
    `${form.industry}業界での${experience}年の経験と実績から、市場水準である${realisticTarget}万円を希望します`,
    `同業他社の水準（${Math.round(marketSalary * 0.95)}〜${Math.round(marketSalary * 1.05)}万円帯）と比較しても妥当な金額です`,
  ];
  if (form.management !== "なし") {
    const mgmtMap: Record<string, string> = {
      "1〜5人のチームリード": "1〜5人規模",
      "6〜20人のマネージャー": "6〜20人規模",
      "20人以上の管理職": "20人以上規模",
    };
    talkingPoints.push(`${mgmtMap[form.management] ?? ""}のチームマネジメント経験を加味した金額です`);
  }
  if (form.english === "ビジネスレベル" || form.english === "ネイティブレベル") {
    talkingPoints.push("英語でのビジネス対応が可能なため、グローバル案件への貢献も見込んでいます");
  }
  if (form.achievement === "表彰・社内外から高評価" || form.achievement === "事業立ち上げ・重要プロジェクト主導") {
    talkingPoints.push("直近の高評価実績・プロジェクト主導経験を年収水準に反映していただきたいと考えております");
  }
  if (form.skillCount === "3〜5個" || form.skillCount === "6個以上") {
    talkingPoints.push(`複数の専門資格・スキルを保有しており、即戦力として貢献できます`);
  }

  const negotiationAdvice = getNegotiationAdvice(form.negotiationPurpose);

  return {
    marketSalary,
    minLine,
    realisticTarget,
    stretchTarget,
    currentSalary,
    gap,
    gapRate,
    stance,
    stanceType,
    talkingPoints,
    negotiationAdvice,
  };
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "給与交渉額シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "業界・職種・経験・スキルから市場適正年収と給与交渉レンジを自動計算。交渉トーキングポイントも自動生成。転職・昇給交渉を成功させる無料シミュレーター。",
      "url": "https://yamada-tools.jp/career/salary-negotiation",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "給与交渉額シミュレーター", "item": "https://yamada-tools.jp/career/salary-negotiation" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "給与交渉は転職時しかできませんか？",
          "acceptedAnswer": { "@type": "Answer", "text": "いいえ、現職での昇給交渉も十分可能です。最も効果的なタイミングは評価面談の1〜2ヶ月前または期末です。実績を数字で示し、市場データを根拠にした交渉は成功率が高まります。" },
        },
        {
          "@type": "Question",
          "name": "希望年収を高く言いすぎると内定が取り消されますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "極端に市場から外れた金額でなければ内定取り消しになることは稀です。市場水準の115%程度を上限の目安にしましょう。" },
        },
        {
          "@type": "Question",
          "name": "転職エージェント経由の場合、給与交渉はどうすればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "転職エージェントは給与交渉を代行してくれます。希望年収と最低ラインをエージェントに明確に伝えることが重要です。エージェントは企業の予算感を知っていることが多いため現実的なアドバイスも得られます。" },
        },
        {
          "@type": "Question",
          "name": "現在の年収を正直に伝える必要がありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "法的義務はありませんが後で発覚した場合の信頼失墜リスクがあります。正直に伝えた上で市場水準に合わせた年収を希望していると交渉する方が長期的に良い関係を築けます。" },
        },
        {
          "@type": "Question",
          "name": "年収交渉で使える具体的なフレーズを教えてください。",
          "acceptedAnswer": { "@type": "Answer", "text": "効果的な例：「御社のポジションと私の経験・スキルを考慮すると市場水準であるXXX万円程度を希望しております」「前職でのXXの実績から、XXX万円が適正と考えております」" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "給与交渉額の計算方法",
      "description": "業界・職種・経験から市場適正年収と交渉レンジを算出する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "プロフィールを入力", "text": "年齢・現在の年収・業界・職種・経験年数・学歴を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "スキル・実績を入力", "text": "保有資格・マネジメント経験・英語力・直近の実績を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "交渉状況を選択", "text": "現職昇給・転職交渉・内定交渉のいずれかを選択します。" },
        { "@type": "HowToStep", "position": 4, "name": "計算ボタンを押す", "text": "「計算する」を押すと市場年収・交渉レンジ・トーキングポイントが表示されます。" },
      ],
    },
  ],
};

const labelClass = "block text-xs font-medium text-gray-600 mb-1";
const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent";
const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent bg-white";

export default function SalaryNegotiationClient() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCalculate() {
    if (!form.age || parseInt(form.age) < 22 || parseInt(form.age) > 65) {
      setError("年齢を22〜65歳の範囲で入力してください");
    setMascotState("error");
      return;
    }
    if (!form.currentSalary || parseInt(form.currentSalary) <= 0) {
      setError("現在の年収を入力してください");
    setMascotState("error");
      return;
    }
    if (!form.industry) {
      setError("業界を選択してください");
    setMascotState("error");
      return;
    }
    if (!form.jobType) {
      setError("職種を選択してください");
    setMascotState("error");
      return;
    }
    if (form.experience === "") {
      setError("経験年数を入力してください");
    setMascotState("error");
      return;
    }
    setError("");
    const r = calculate(form);
    if (r) setResult(r);
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }


  const faqItems = [
    { question: "給与交渉で何%アップを要求するのが現実的ですか？", answer: "昇給交渉では現在の給与から5〜15%増が現実的なレンジです。転職時は10〜30%増を要求するケースも珍しくありません。業界水準や自身の希少性、会社の業績によって大きく変わります。" },
    { question: "給与交渉で失敗しないためのポイントは？", answer: "市場データに基づいた根拠を示すこと、感情ではなく実績・スキルを数字で示すこと、交渉のタイミングを見計らうこと、最低ラインと理想額の両方を準備することが重要です。" },
    { question: "転職オファーを他社交渉に使っても大丈夫ですか？", answer: "競合オファーを提示することは一般的な交渉手法ですが、実際に転職する意思があることを前提にすべきです。虚偽のオファーを使うと信頼関係を損なうリスクがあります。" },
    { question: "市場年収を調べるにはどうすればよいですか？", answer: "OpenWork（旧Vorkers）、転職サイト（リクナビ・doda）の年収目安、厚生労働省の賃金構造基本統計調査などが参考になります。本ツールでも業界・職種・経験年数から市場年収レンジを算出できます。" },
    { question: "給与交渉は書面でするべきですか？", answer: "まず口頭で意向を伝え、合意後に書面で確認するのが一般的です。交渉内容はメールで証拠を残すことをお勧めします。内定後の給与交渉はオファーレターを書面で受け取ってから行うとトラブルが減ります。" }
  ];
  const useCases = [
    { icon: "💬", persona: "昇給交渉を控えている会社員", title: "いくら要求するか根拠が欲しい", benefit: "業界・経験年数から現実的な交渉レンジを算出" },
    { icon: "✈️", persona: "転職内定後のオファー交渉", title: "いくら上乗せ要求できるか知りたい", benefit: "市場相場と希少性スコアから最適額を計算" },
    { icon: "📊", persona: "市場価値を客観的に知りたい方", title: "自分の年収は相場より高い?低い?", benefit: "業種・職種・経験年数別の市場年収レンジを確認" }
  ];
  return (
    <>
      <IntroSection title="給与交渉シミュレーター" paragraphs={["業界・職種・経験年数から市場年収レンジを算出し、給与交渉の最低ライン・目標額・ストレッチ目標を提示します。", "現職昇給交渉・転職時のオファー交渉・昇格時の交渉それぞれに最適な交渉アドバイスを提供します。", "登録不要・完全無料。市場データに基づいた根拠ある交渉準備に活用できます。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/career" className="hover:text-ai">転職・年収</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-600">給与交渉額シミュレーター</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">給与交渉額シミュレーター</h1>
          <p className="text-sm text-gray-500">
            業界・職種・経験・スキルから市場適正年収と交渉レンジを自動計算。交渉で使えるトーキングポイントも生成します。
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

            {/* Section 1 */}
            <h2 className="text-base font-semibold text-kon mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              あなたのプロフィール
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>年齢 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={22}
                      max={65}
                      value={form.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      placeholder="例: 32"
                      className={inputClass}
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">歳</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>現在の年収 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={form.currentSalary}
                      onChange={(e) => handleChange("currentSalary", e.target.value)}
                      placeholder="例: 450"
                      className={inputClass}
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>業界 <span className="text-danger">*</span></label>
                <select value={form.industry} onChange={(e) => handleChange("industry", e.target.value)} className={selectClass}>
                  <option value="">選択してください</option>
                  {["IT・ソフトウェア", "金融・保険", "コンサルティング", "医療・製薬", "メーカー（製造業）", "商社・卸売", "小売・サービス", "不動産・建設", "広告・メディア", "教育", "公務員・非営利", "その他"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>職種 <span className="text-danger">*</span></label>
                <select value={form.jobType} onChange={(e) => handleChange("jobType", e.target.value)} className={selectClass}>
                  <option value="">選択してください</option>
                  {["エンジニア・IT", "営業", "マーケティング", "経理・財務", "人事・労務", "企画・経営", "研究・開発", "デザイン", "医療・看護", "事務・アシスタント", "管理職・マネージャー", "その他"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>経験年数 <span className="text-danger">*</span></label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={form.experience}
                      onChange={(e) => handleChange("experience", e.target.value)}
                      placeholder="例: 7"
                      className={inputClass}
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">年</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>最終学歴</label>
                  <select value={form.education} onChange={(e) => handleChange("education", e.target.value)} className={selectClass}>
                    {["高校卒", "専門学校卒", "大学卒（文系）", "大学卒（理系）", "大学院卒（修士）", "大学院卒（博士）", "MBA・専門職学位"].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <h2 className="text-base font-semibold text-kon mt-6 mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              スキル・実績
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>保有資格・スキルの数</label>
                <select value={form.skillCount} onChange={(e) => handleChange("skillCount", e.target.value)} className={selectClass}>
                  {["なし", "1〜2個", "3〜5個", "6個以上"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>マネジメント経験</label>
                <select value={form.management} onChange={(e) => handleChange("management", e.target.value)} className={selectClass}>
                  {["なし", "1〜5人のチームリード", "6〜20人のマネージャー", "20人以上の管理職"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>英語力</label>
                <select value={form.english} onChange={(e) => handleChange("english", e.target.value)} className={selectClass}>
                  {["不要・なし", "日常会話レベル", "ビジネスレベル", "ネイティブレベル"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>転職回数</label>
                <select value={form.jobChanges} onChange={(e) => handleChange("jobChanges", e.target.value)} className={selectClass}>
                  {["0回（初転職）", "1〜2回", "3〜4回", "5回以上"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>直近の実績</label>
                <select value={form.achievement} onChange={(e) => handleChange("achievement", e.target.value)} className={selectClass}>
                  {["特になし", "目標達成（100%程度）", "目標大幅達成（120%以上）", "表彰・社内外から高評価", "事業立ち上げ・重要プロジェクト主導"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 3 */}
            <h2 className="text-base font-semibold text-kon mt-6 mb-4 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 bg-kon text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              交渉の状況
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>交渉の目的</label>
                <select value={form.negotiationPurpose} onChange={(e) => handleChange("negotiationPurpose", e.target.value)} className={selectClass}>
                  {["現職での昇給交渉", "転職時の年収交渉", "内定後の条件交渉"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>希望する年収（任意）</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.targetSalary}
                    onChange={(e) => handleChange("targetSalary", e.target.value)}
                    placeholder="例: 600"
                    className={inputClass}
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                </div>
              </div>

              {form.negotiationPurpose !== "現職での昇給交渉" && (
                <div>
                  <label className={labelClass}>転職先の規模</label>
                  <select value={form.companySize} onChange={(e) => handleChange("companySize", e.target.value)} className={selectClass}>
                    {["スタートアップ（50人未満）", "中小企業（51〜300人）", "大企業（301人以上）", "外資系企業", "上場企業"].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {error && (
              <p className="text-danger text-sm bg-gray-50 rounded-lg px-3 py-2 mt-4">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
              <button
                onClick={handleCalculate}
                className="flex-1 py-2.5 rounded-lg bg-kon text-white text-sm font-semibold hover:bg-ai transition-colors shadow-sm"
              >
                計算する
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            {result ? (
              <>
                {/* Card 1: 市場適正年収 */}
                <div className="bg-kon rounded-xl p-6 text-white shadow-sm">
                  <p className="text-sm font-medium opacity-80 mb-1">あなたの市場適正年収</p>
                  <p className="text-4xl font-bold mb-1">
                    {Math.round(result.marketSalary * 0.95)}〜{Math.round(result.marketSalary * 1.05)}
                    <span className="text-2xl ml-1 font-normal">万円</span>
                  </p>
                  <p className="text-xs opacity-70">業界・職種・経験・スキルに基づく推定値</p>
                </div>

                {/* Card 2: 交渉レンジ */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">交渉レンジ</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟡</span>
                        <div>
                          <p className="text-xs text-gray-500">最低ライン</p>
                          <p className="text-xs text-gray-400">これ以下は受けない</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-yellow-600">{result.minLine}<span className="text-sm font-normal text-gray-500 ml-1">万円</span></p>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟢</span>
                        <div>
                          <p className="text-xs text-gray-500">現実的目標</p>
                          <p className="text-xs text-gray-400">交渉の基準点</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-green-600">{result.realisticTarget}<span className="text-sm font-normal text-gray-500 ml-1">万円</span></p>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔵</span>
                        <div>
                          <p className="text-xs text-gray-500">ストレッチ目標</p>
                          <p className="text-xs text-gray-400">強気の場合</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-kon">{result.stretchTarget}<span className="text-sm font-normal text-gray-500 ml-1">万円</span></p>
                    </div>
                  </div>
                </div>

                {/* Card 3: 現年収との比較 */}
                <div className={`rounded-xl shadow-sm border p-5 ${
                  result.stanceType === "low" ? "bg-gray-50 border-gray-200" :
                  result.stanceType === "high" ? "bg-gray-50 border-gray-200" :
                  "bg-white border-gray-200"
                }`}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">現年収との比較</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">現在の年収</span>
                      <span className="font-semibold text-gray-900">{result.currentSalary}万円</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">市場適正年収</span>
                      <span className="font-semibold text-gray-900">{result.marketSalary}万円</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-500">差額</span>
                      <span className={`font-bold ${result.gap >= 0 ? "text-green-600" : "text-gray-600"}`}>
                        {result.gap >= 0 ? "+" : ""}{result.gap}万円（{result.gap >= 0 ? "+" : ""}{result.gapRate}%）
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-3 leading-relaxed ${
                    result.stanceType === "low" ? "text-kon" :
                    result.stanceType === "high" ? "text-gray-500" :
                    "text-gray-600"
                  }`}>{result.stance}</p>
                </div>

                {/* Card 4: タイミング・アドバイス */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">交渉タイミング・スタンス</h3>
                  <div className="flex items-start gap-2">
                    <span className="text-kon mt-0.5">●</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.negotiationAdvice}</p>
                  </div>
                  {form.targetSalary && parseInt(form.targetSalary) > 0 && (
                    <div className={`mt-3 px-3 py-2 rounded-lg text-xs ${
                      parseInt(form.targetSalary) <= result.stretchTarget
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      あなたの希望年収 {form.targetSalary}万円は
                      {parseInt(form.targetSalary) <= result.stretchTarget
                        ? "交渉可能な範囲内です"
                        : "ストレッチ目標を超えています。根拠の準備を十分に"}
                    </div>
                  )}
                </div>

                {/* Card 5: トーキングポイント */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">交渉で使えるトーキングポイント</h3>
                  <ul className="space-y-2">
                    {result.talkingPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-kon mt-0.5 shrink-0">▶</span>
                        <span>「{point}」</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-gray-400 px-1">
                  ※本シミュレーターの結果は市場データに基づく推定値です。実際の年収は企業・個人の状況により異なります。
                </p>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-64">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">左のフォームを入力して<br />「計算する」を押してください</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 space-y-10">

          {/* 職種別年収相場表 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">職種別・年齢別 年収相場早見表</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-kon text-white">
                      <th className="px-4 py-3 text-left font-semibold">職種</th>
                      <th className="px-4 py-3 text-center font-semibold">20代</th>
                      <th className="px-4 py-3 text-center font-semibold">30代</th>
                      <th className="px-4 py-3 text-center font-semibold">40代</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { job: "ITエンジニア", d20: "350〜450万", d30: "500〜700万", d40: "650〜900万" },
                      { job: "営業（大手）", d20: "300〜420万", d30: "450〜600万", d40: "550〜750万" },
                      { job: "コンサルタント", d20: "400〜550万", d30: "600〜900万", d40: "800万〜1,200万" },
                      { job: "経理・財務", d20: "300〜380万", d30: "420〜580万", d40: "520〜700万" },
                      { job: "マーケティング", d20: "300〜400万", d30: "430〜600万", d40: "550〜750万" },
                      { job: "人事・労務", d20: "280〜360万", d30: "380〜520万", d40: "480〜650万" },
                      { job: "外資系全般", d20: "400〜600万", d30: "600〜1,000万", d40: "800万〜1,500万" },
                    ].map((row) => (
                      <tr key={row.job} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{row.job}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{row.d20}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{row.d30}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{row.d40}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 給与交渉の成功法則 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">給与交渉の成功法則</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5 text-sm text-gray-700 leading-relaxed">
              <p>
                給与交渉で成功する人の共通点は「市場データ」と「実績の数値化」です。
              </p>

              <div>
                <p className="font-semibold text-gray-800 mb-2">交渉前の準備：</p>
                <ul className="space-y-1 pl-4">
                  {[
                    "業界・職種・年齢の市場年収データを収集する（本ツールを活用）",
                    "直近1〜2年の実績を数字で整理する（売上XX%増、コストXX万円削減など）",
                    "希望年収の根拠を3つ以上用意する",
                    "最低ライン・現実的目標・ストレッチ目標の3段階を設定する",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-kon mt-0.5">・</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">NGな交渉方法：</p>
                <ul className="space-y-1 pl-4">
                  {[
                    "「生活費が足りないから上げてほしい」（個人的事情はNG）",
                    "根拠なく高額を要求する",
                    "感情的になる",
                    "一度で決めようとする（複数回の交渉を前提に）",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-danger mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">転職時の交渉タイミング：</p>
                <p>
                  最も交渉力が高いのは「内定後・承諾前」です。企業側はすでにあなたを採用したいと決定しているため、この段階での交渉は成功率が高くなります。複数社の内定がある場合は、競合他社の条件を活用した交渉も有効です。
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
            <div className="space-y-3">
              {[
                {
                  q: "給与交渉は転職時しかできませんか？",
                  a: "いいえ、現職での昇給交渉も十分可能です。最も効果的なタイミングは評価面談の1〜2ヶ月前、または期末です。実績を数字で示し、市場データを根拠にした交渉は成功率が高まります。「給与を上げてほしい」ではなく「市場水準に合わせてほしい」という論点で交渉しましょう。",
                },
                {
                  q: "希望年収を高く言いすぎると内定が取り消されますか？",
                  a: "極端に市場から外れた金額でなければ、内定取り消しになることは稀です。ただし現実的目標より20〜30%以上高い要求は交渉決裂のリスクがあります。本ツールで算出したストレッチ目標（市場水準の115%程度）を上限の目安にしましょう。",
                },
                {
                  q: "転職エージェント経由の場合、給与交渉はどうすればいいですか？",
                  a: "転職エージェントは企業と求職者の橋渡し役として給与交渉を代行してくれます。希望年収と最低ラインをエージェントに明確に伝えることが重要です。エージェントは企業の予算感を知っていることが多いため、現実的な目標設定のアドバイスも得られます。",
                },
                {
                  q: "現在の年収を正直に伝える必要がありますか？",
                  a: "法的義務はありませんが、後で発覚した場合の信頼失墜リスクがあります。正直に伝えた上で「市場水準に合わせた年収を希望しています」と交渉する方が長期的に良い関係を築けます。現年収が市場より低い場合は、それ自体が交渉材料になります。",
                },
                {
                  q: "年収交渉で使える具体的なフレーズを教えてください。",
                  a: "効果的なフレーズ例：「御社のポジションと私の経験・スキルを考慮すると、市場水準であるXXX万円程度を希望しております」「前職・現職でのXXの実績から、XXX万円が適正と考えております」「複数社からオファーをいただいておりますが、御社を第一志望としているため、条件面でご配慮いただけますか」",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <p className="font-semibold text-gray-800 mb-2 text-sm">Q. {item.q}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">A. {item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 関連ツール */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/career/job-change-simulator", title: "転職年収シミュレーター", desc: "転職前後の手取り・社会保険を比較" },
                { href: "/career/overtime-calculator", title: "残業代オールインワン計算機", desc: "法定時間外・深夜・休日残業代を計算" },
                { href: "/career/income-wall-checker", title: "年収の壁 診断ツール", desc: "103万・130万・150万円の壁を診断" },
                { href: "/tax/income-tax-calculator", title: "所得税・住民税 計算機", desc: "年収から所得税・住民税を自動計算" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:border-ai hover:shadow-md transition-all group"
                >
                  <p className="font-semibold text-sm text-kon group-hover:text-ai mb-1">{tool.title}</p>
                  <p className="text-xs text-gray-500">{tool.desc}</p>
                </Link>
              ))}
            </div>
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
