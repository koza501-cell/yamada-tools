import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】消費税計算機Pro｜税抜・税込・軽減税率8%対応｜複数明細一括計算 | 山田ツール",
  description: "消費税10%・軽減税率8%に対応した無料計算機。税抜→税込、税込→税抜の両方向計算、複数明細の一括計算、端数処理選択に対応。インボイス制度対応。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
