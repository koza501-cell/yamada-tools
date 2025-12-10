import { Metadata } from "next";
import ColorConvertClient from "./client";

export const metadata: Metadata = {
  title: "カラーコード変換 | 山田ツール - HEX/RGB/HSL変換",
  description: "HEX・RGB・HSL形式のカラーコードを相互変換。カラーピッカー付き。登録不要、完全無料。",
  keywords: ["カラーコード変換", "HEX", "RGB", "HSL", "無料"],
  openGraph: {
    title: "カラーコード変換 | 山田ツール",
    description: "カラーコードを相互変換。完全無料。",
    url: "https://yamada-tools.jp/generator/color-convert",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/color-convert",
  },
};

export default function ColorConvertPage() {
  return <ColorConvertClient />;
}
