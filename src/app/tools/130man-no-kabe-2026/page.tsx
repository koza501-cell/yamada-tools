import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import Kabe130manSimulator from "@/components/tools/Kabe130manSimulator";

export const metadata: Metadata = {
  title: "130万円の壁 シミュレーター2026｜2026年4月改正対応・通勤手当込みで正確判定",
  description:
    "2026年4月から変わった130万円の壁の判定基準（実収入ベース→契約ベース）に対応。時給・所定労働時間・通勤手当を入力して扶養内に収まるか判定。超過時の社会保険料負担も計算。",
  keywords: [
    "130万円の壁 2026",
    "130万の壁 シミュレーター",
    "扶養 社会保険 判定",
    "契約ベース 130万",
    "通勤手当 社会保険 収入",
    "106万円の壁 2026",
    "社会保険 被扶養者 計算",
    "パート 扶養 判定",
    "130万円 扶養 シミュレーション",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/130man-no-kabe-2026",
  },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "130万円の壁 シミュレーター2026｜2026年4月改正対応",
    description:
      "契約ベース判定（2026年4月〜）対応。通勤手当込みの正確な計算で扶養内か即判定。超過時の保険料負担も試算。",
    url: "https://yamada-tools.jp/tools/130man-no-kabe-2026",
  },
};

const faq = [
  {
    question: "2026年4月の改正で130万円の壁は変わりましたか？",
    answer:
      "判定基準が変わりました。「残業代を含む実際の収入見込み」から「労働契約上の年収見込み」へ移行。繁忙期に一時的に超えても、契約上の年収が130万円未満なら扶養を維持できます。",
  },
  {
    question: "通勤手当は130万円の計算に入りますか？",
    answer:
      "入ります。社会保険の被扶養者判定では通勤手当も年収に含まれます。所得税では月15万円まで非課税ですが、社会保険の扱いは異なります。見落としやすい点です。",
  },
  {
    question: "106万円の壁はなくなりましたか？",
    answer:
      "事実上形骸化しています。2026年3月末に全都道府県の最低賃金が時給1,016円を超えたため、週20時間働くだけで月収が実質的に106万円相当を超えます。2026年10月に賃金要件自体が撤廃予定です。",
  },
  {
    question: "パートを2か所でしている場合はどう計算しますか？",
    answer:
      "2か所以上の収入を合算して判定します。各勤め先での時間が少なくても、合算で週20時間以上になる場合は特定適用事業所であれば社会保険加入義務が生じます。",
  },
];

export default function Page() {
  return (
    <>
      <ToolSchema
        tool={{
          nameJa: "130万円の壁 シミュレーター（2026年4月改正対応）",
          description:
            "時給・所定労働時間・通勤手当を入力して被扶養者（130万円の壁）に収まるか判定。超過時の社会保険料も計算。",
          path: "/tools/130man-no-kabe-2026",
        }}
        faq={faq}
      />
      <Kabe130manSimulator />
    </>
  );
}
