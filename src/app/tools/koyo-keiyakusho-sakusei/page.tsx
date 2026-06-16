import { Metadata } from "next";
import KoyoKeiyakushoGenerator from "@/components/tools/KoyoKeiyakushoGenerator";

export const metadata: Metadata = {
  title: "雇用契約書作成ツール｜無料テンプレート・PDF出力対応【2026年労基法対応】",
  description: "雇用契約書を無料で作成。正社員・パート・アルバイト・契約社員に対応。2026年労働基準法準拠。入力するだけでPDF出力できる無料オンラインツール。",
  keywords: ["雇用契約書", "雇用契約書 テンプレート 無料", "雇用契約書 作成", "パート 雇用契約書", "雇用契約書 PDF"],
  alternates: { canonical: "https://yamada-tools.jp/tools/koyo-keiyakusho-sakusei" },
  openGraph: {
    title: "雇用契約書作成ツール｜無料テンプレート・PDF出力対応【2026年労基法対応】",
    description: "正社員・パート・アルバイト・契約社員に対応した雇用契約書を無料で作成。PDF出力対応。",
    url: "https://yamada-tools.jp/tools/koyo-keiyakusho-sakusei",
  },
};

export default function Page() { return <KoyoKeiyakushoGenerator />; }
