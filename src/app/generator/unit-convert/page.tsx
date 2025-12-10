import { Metadata } from "next";
import UnitConvertClient from "./client";

export const metadata: Metadata = {
  title: "単位変換 | 山田ツール - 長さ・重さ・温度変換",
  description: "長さ・重さ・面積・温度などの単位をかんたん変換。リアルタイム計算。登録不要、完全無料。",
  keywords: ["単位変換", "長さ変換", "重さ変換", "温度変換", "無料"],
  openGraph: {
    title: "単位変換 | 山田ツール",
    description: "各種単位をかんたん変換。完全無料。",
    url: "https://yamada-tools.jp/generator/unit-convert",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/unit-convert",
  },
};

export default function UnitConvertPage() {
  return <UnitConvertClient />;
}
