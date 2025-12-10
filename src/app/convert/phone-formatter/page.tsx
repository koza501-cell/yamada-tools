import { Metadata } from "next";
import PhoneFormatterClient from "./client";

export const metadata: Metadata = {
  title: "電話番号整形 | 山田ツール - ハイフン自動挿入",
  description: "電話番号を正しい形式に自動整形。固定電話・携帯電話・フリーダイヤルに対応。ハイフン自動挿入。登録不要、完全無料。",
  keywords: ["電話番号", "整形", "フォーマット", "ハイフン", "携帯電話", "固定電話"],
  openGraph: {
    title: "電話番号整形 | 山田ツール",
    description: "電話番号を正しい形式に自動整形。完全無料。",
    url: "https://yamada-tools.jp/convert/phone-formatter",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/phone-formatter",
  },
};

export default function PhoneFormatterPage() {
  return <PhoneFormatterClient />;
}
