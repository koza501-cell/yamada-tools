import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】所得税・住民税 計算機｜年収から手取りを自動計算 ",
  description: "年収・家族構成・各種控除を入力するだけで所得税・住民税・手取り額を自動計算。2024年度税制対応の無料シミュレーター。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
