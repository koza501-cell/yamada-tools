import { Metadata } from "next";
import EnvelopePrintClient from "./client";

export const metadata: Metadata = {
  title: "封筒印刷・宛名印刷 | 無料オンラインツール - Yamada Tools",
  description:
    "封筒の宛名印刷が無料でできるオンラインツール。長形3号・角形2号・洋形など日本の全封筒サイズに対応。縦書き・横書き、郵便番号枠、差出人、会社ロゴにも対応。登録不要・インストール不要でブラウザから直接PDF出力。",
  keywords: [
    "封筒印刷",
    "宛名印刷",
    "封筒 テンプレート",
    "長形3号",
    "角形2号",
    "洋形封筒",
    "縦書き",
    "横書き",
    "郵便番号",
    "無料",
    "PDF",
    "オンライン",
  ],
  openGraph: {
    title: "封筒印刷・宛名印刷 | 無料オンラインツール",
    description:
      "日本の全封筒サイズに対応した無料の宛名印刷ツール。縦書き・横書き、郵便番号枠、ロゴ対応。",
    type: "website",
  },
};

export default function EnvelopePrintPage() {
  return <EnvelopePrintClient />;
}
