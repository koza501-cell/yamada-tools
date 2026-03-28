import type { Metadata } from "next";
import PricingClient from "@/components/PricingClient";

export const metadata: Metadata = {
  title: "料金プラン | 山田ツール",
  description: "山田ツールの料金プラン。無料で全86+ツールをご利用いただけます。PROプランで無制限・広告なしに。法人向けTEAMプラン、エンタープライズプランも。",
  alternates: {
    canonical: 'https://yamada-tools.jp/pricing',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
