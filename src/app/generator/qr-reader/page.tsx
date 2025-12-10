import { Metadata } from "next";
import QrReaderClient from "./client";

export const metadata: Metadata = {
  title: "QRコード読み取り | 山田ツール - 無料QRスキャナー",
  description: "画像からQRコードを読み取り。URL・テキストを抽出。カメラ対応。登録不要、完全無料。",
  keywords: ["QRコード読み取り", "QRスキャン", "バーコード", "カメラ", "無料"],
  openGraph: {
    title: "QRコード読み取り | 山田ツール",
    description: "QRコードを読み取り。完全無料。",
    url: "https://yamada-tools.jp/generator/qr-reader",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/qr-reader",
  },
};

export default function QrReaderPage() {
  return <QrReaderClient />;
}
