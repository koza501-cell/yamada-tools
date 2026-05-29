import { Metadata } from "next";
import MedicalStaffPayrollClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "医療スタッフ給与計算機｜看護師・歯科衛生士・医療事務の夜勤手当・深夜割増を自動計算 | yamada-tools.jp",
  description: "看護師・歯科衛生士・医療事務の月給を職種別に計算。夜勤手当（看護師2交代¥11,368）、深夜割増（25%）、残業（25%）、オンコール手当に対応。日本看護協会データと比較。完全無料。",
  keywords: ["看護師 給与計算", "夜勤手当 計算", "深夜割増 医療", "歯科衛生士 月給", "医療事務 給与", "クリニック 給与"],
  alternates: { canonical: "https://yamada-tools.jp/clinic/medical-staff-payroll-calculator" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "医療スタッフ給与計算機",
      "description": "看護師・歯科衛生士・医療事務の月給計算ツール。夜勤手当・深夜割増・残業・オンコール手当に対応。",
      "url": "https://yamada-tools.jp/clinic/medical-staff-payroll-calculator",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "クリニック経営", "item": "https://yamada-tools.jp/clinic" },
        { "@type": "ListItem", "position": 3, "name": "医療スタッフ給与計算機", "item": "https://yamada-tools.jp/clinic/medical-staff-payroll-calculator" },
      ],
    },
    {
      "@type": "HowTo",
      "name": "医療スタッフ給与計算機の使い方",
      "step": [
        { "@type": "HowToStep", "position": 1, "text": "職種と勤務形態を選択（夜勤手当の業界平均が自動入力）" },
        { "@type": "HowToStep", "position": 2, "text": "基本給と月間労働時間を入力" },
        { "@type": "HowToStep", "position": 3, "text": "夜勤回数・残業時間・休日出勤時間を入力" },
        { "@type": "HowToStep", "position": 4, "text": "諸手当（通勤・住宅・資格・役職）を入力" },
        { "@type": "HowToStep", "position": 5, "text": "「計算する」ボタンで月給内訳と業界平均比較を確認" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "看護師の夜勤手当の相場は？",
          "acceptedAnswer": { "@type": "Answer", "text": "日本看護協会「2023年病院看護実態調査」によると、2交代制は1回平均11,368円、3交代制の準夜勤は4,234円、深夜勤は5,199円です。" },
        },
        {
          "@type": "Question",
          "name": "深夜残業の割増率は？",
          "acceptedAnswer": { "@type": "Answer", "text": "深夜時間帯（22:00〜5:00）の時間外労働は、残業25% + 深夜25% = 合計50%の割増となります。" },
        },
      ],
    },
  ],
};

const tool = getToolById("medical-staff-payroll")!;

export default function MedicalStaffPayrollPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MedicalStaffPayrollClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
