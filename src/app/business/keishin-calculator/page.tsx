import { Metadata } from "next";
import KeishinClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "経審点数（P点）簡易計算機【建設業】| yamada-tools",
  description: "経営事項審査の総合評定値P点を簡易計算。X1完成工事高・X2自己資本・Y経営状況・Z技術力・W社会性の5指標から公共工事入札参加前の評点目安を確認",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "経審点数（P点）簡易計算機",
  description: "建設業の経営事項審査総合評定値P点を試算するツール",
  url: "https://yamada-tools.jp/business/keishin-calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
};

const tool = getToolById("keishin-calculator")!;

export default function KeishinPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KeishinClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
