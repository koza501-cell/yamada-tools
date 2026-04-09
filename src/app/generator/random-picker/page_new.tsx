import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ランダム抽選ツール【無料】くじ引き・順番決め・名前ガチャ",
  description: "名前や選択肢をランダムに選ぶ無料の抽選ツール。登録不要・スマホOK。忘年会・新年会・プレゼント交換など各種シーン対応版もあり。",
  alternates: { canonical: "https://yamada-tools.jp/generator/random-picker" },
};

const VARIANTS = [
  {
    href: "/generator/random-picker/nenkai",
    icon: "🎊",
    title: "忘年会・新年会 抽選ツール",
    desc: "幹事決め・景品抽選・プレゼント交換向けの専用ページ。シーズン対応ガイド付き。",
    badge: "人気",
    badgeColor: "#f97316",
  },
  {
    href: "/generator/random-picker/christmas",
    icon: "🎄",
    title: "クリスマス プレゼント交換",
    desc: "シークレットサンタの相手決めに特化。使い方ガイド・FAQ付き。",
    badge: "クリスマス",
    badgeColor: "#16a34a",
  },
  {
    href: "/generator/random-picker/seat",
    icon: "🏫",
    title: "席替えランダム決めツール",
    desc: "クラス・職場の座席をシャッフル。教室グリッド表示・印刷対応。",
    badge: "印刷対応",
    badgeColor: "#1d3557",
  },
];

export default function RandomPickerIndexPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <nav aria-label="パンくずリスト" style={{ fontSize: "0.82rem", color: "#888", marginBottom: 32 }}>
        <Link href="/" style={{ color: "#223A70", textDecoration: "none" }}>ホーム</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/generator" style={{ color: "#223A70", textDecoration: "none" }}>計算・生成ツール</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span>ランダム抽選</span>
      </nav>

      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#223A70", marginBottom: 8 }}>
        🎲 ランダム抽選ツール
      </h1>
      <p style={{ color: "#666", marginBottom: 40 }}>
        名前や選択肢をランダムに選ぶ無料の抽選ツールです。シーン別に最適化された専用ページもあります。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {VARIANTS.map((v) => (
          <Link key={v.href} href={v.href} style={{
            display: "block",
            background: "#fff",
            border: "1.5px solid rgba(34,58,112,0.12)",
            borderRadius: 16,
            padding: "28px 24px",
            textDecoration: "none",
            boxShadow: "0 2px 14px rgba(34,58,112,0.08)",
            position: "relative",
            overflow: "hidden",
          }}>
            <span style={{
              position: "absolute", top: 14, right: 14,
              background: v.badgeColor, color: "#fff",
              borderRadius: 6, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700,
            }}>{v.badge}</span>
            <span style={{ fontSize: "2.2rem" }}>{v.icon}</span>
            <p style={{ fontWeight: 800, color: "#223A70", fontSize: "1.05rem", margin: "12px 0 8px" }}>{v.title}</p>
            <p style={{ fontSize: "0.86rem", color: "#666", lineHeight: 1.6 }}>{v.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
