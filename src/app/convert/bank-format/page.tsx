import { Metadata } from "next";
import BankFormatClient from "./client";

export const metadata: Metadata = {
  title: "全銀フォーマット変換 - 無料で振込データを全銀形式に変換 | yamada-tools.jp",
  description: "CSVやExcelの振込データを全銀協規定フォーマット（FBデータ）に無料で変換。総合振込・給与振込に対応。ネットバンキングにそのままアップロード可能。",
  keywords: ["全銀フォーマット", "全銀協", "FBデータ", "総合振込", "給与振込", "振込データ変換", "ネットバンキング"],
  openGraph: {
    title: "全銀フォーマット変換 - 振込データを全銀形式に変換",
    description: "CSVの振込データを全銀協規定フォーマットに無料で変換。ネットバンキングに対応。",
    type: "website",
  },
};

export default function BankFormatPage() {
  return <BankFormatClient />;
}
