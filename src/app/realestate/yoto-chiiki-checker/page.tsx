import { Metadata } from "next";
import YotoChiikiClient from "./client";

export const metadata: Metadata = {
  title: "用途地域チェッカー — 住所を入力するだけ | 山田ツール",
  description:
    "住所を入力するだけで用途地域を即座に確認。第一種低層住居専用地域など13種類をわかりやすく解説。建ぺい率・容積率も自動表示。国土交通省データ使用、完全無料。",
  keywords: [
    "用途地域 調べ方",
    "用途地域 わかりやすく",
    "建ぺい率 容積率 確認",
    "クリニック 開業 用途地域",
    "店舗 用途地域 確認",
    "用途地域チェッカー",
  ],
  openGraph: {
    title: "用途地域チェッカー — 住所を入力するだけ",
    description:
      "住所だけで用途地域・建ぺい率・容積率を即座に確認。13種類を平易な日本語で解説。",
    type: "website",
  },
};

export default function YotoChiikiPage() {
  return <YotoChiikiClient />;
}
