import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "計算・生成ツール一覧 | 山田ツール",
  description: "ランダム抽選、計算、生成など便利なオンラインツール一覧。完全無料・登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/generator" },
};

const TOOLS = [
  {
    href: "/generator/random-picker/nenkai",
    icon: "🎊",
    name: "忘年会・新年会 抽選ツール",
    desc: "幹事決め・景品抽選・プレゼント交換に対応",
  },
  {
    href: "/generator/random-picker/christmas",
    icon: "🎄",
    name: "クリスマス プレゼント交換",
    desc: "シークレットサンタの相手をランダムに決める",
  },
  {
    href: "/generator/random-picker/seat",
    icon: "🏫",
    name: "席替えランダム決めツール",
    desc: "クラス・職場の座席をシャッフル。印刷対応。",
  },
  {
    href: "/generator/random-picker",
    icon: "🎲",
    name: "ランダム抽選ツール",
    desc: "汎用ランダム抽選・くじ引きツール",
  },
];

export default function GeneratorPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <nav aria-label="パンくずリスト" style={{ fontSize: "0.82rem", color: "#888", marginBottom: 32 }}>
        <Link href="/" style={{ color: "#223A70", textDecoration: "none" }}>ホーム</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span>計算・生成ツール</span>
      </nav>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#223A70", marginBottom: 8 }}>
        計算・生成ツール
      </h1>
      <p style={{ color: "#666", marginBottom: 40 }}>ランダム抽選や計算など、無料で使えるオンラインツール一覧です。</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} style={{
            display: "block",
            background: "#fff",
            border: "1.5px solid rgba(34,58,112,0.12)",
            borderRadius: 14,
            padding: "24px 20px",
            textDecoration: "none",
            boxShadow: "0 2px 12px rgba(34,58,112,0.07)",
            transition: "all 0.18s",
          }}>
            <span style={{ fontSize: "2rem" }}>{t.icon}</span>
            <p style={{ fontWeight: 700, color: "#223A70", fontSize: "1rem", margin: "10px 0 6px" }}>{t.name}</p>
            <p style={{ fontSize: "0.84rem", color: "#666" }}>{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
