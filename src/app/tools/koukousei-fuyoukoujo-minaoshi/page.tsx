import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import KoukouseiSimulator from "@/components/tools/KoukouseiSimulator";

export const metadata: Metadata = {
  title: "高校生扶養控除 見直し動向シミュレーター2026｜縮小案の増税影響と児童手当との差し引き計算",
  description:
    "16〜18歳の子どもを扶養する世帯向け。扶養控除縮小案（未確定）が実施された場合の所得税・住民税の増税影響を年収別に試算。児童手当（年12万円/人）との差し引きで純損益を計算。2026年7月時点の情報。",
  keywords: [
    "高校生 扶養控除 縮小",
    "特定扶養控除 見直し",
    "扶養控除 廃止 シミュレーション",
    "児童手当 扶養控除",
    "高校生 税制改正 2026",
    "扶養控除 増税 計算",
    "16歳 17歳 18歳 扶養控除",
    "令和8年度 税制改正",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/koukousei-fuyoukoujo-minaoshi",
  },
  openGraph: {
    title: "高校生扶養控除 見直し動向シミュレーター2026",
    description:
      "縮小案（未確定）実施時の増税影響と児童手当との差し引きを年収別に計算。16〜18歳の子どもを扶養する全世帯向け。",
    url: "https://yamada-tools.jp/tools/koukousei-fuyoukoujo-minaoshi",
  },
};

const faq = [
  {
    question: "高校生の扶養控除縮小は決まっていますか？",
    answer:
      "決まっていません。2025年12月の令和8年度税制改正大綱に盛り込まれず、実施時期は未定です。このシミュレーターは「もし実施されたら」の仮定計算です。",
  },
  {
    question: "令和8年度税制改正で確定した変更点は何ですか？",
    answer:
      "扶養親族の合計所得金額要件が58万円以下→62万円以下へ引き上げ（確定）。2024年10月から高校生年代の児童手当（月1万円）が所得制限なしで開始（確定済み）。",
  },
  {
    question: "大学生（19〜22歳）の特定扶養控除（63万円）は変わりますか？",
    answer: "変わりません。今回の議論は16〜18歳に限定されており、19〜22歳の特定扶養控除63万円は対象外です。",
  },
  {
    question: "児童手当は所得に関係なく受け取れますか？",
    answer:
      "2024年10月以降、所得制限が完全撤廃されたため、全世帯が高校生年代（16〜18歳）の子ども1人あたり月10,000円（年120,000円）を受け取れます。",
  },
];

export default function Page() {
  return (
    <>
      <ToolSchema
        tool={{
          nameJa: "高校生扶養控除 見直し動向シミュレーター",
          description:
            "16〜18歳の子どもを扶養する世帯向け。扶養控除縮小案（未確定）実施時の増税影響と児童手当との差し引き計算。",
          path: "/tools/koukousei-fuyoukoujo-minaoshi",
        }}
        faq={faq}
      />
      <KoukouseiSimulator />
    </>
  );
}
