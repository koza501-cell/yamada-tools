"use client";
import { AdUnit } from "@/components/common/AdUnit";

import Link from "next/link";
import RandomPickerTool from "@/components/tools/RandomPickerTool";
import Mascot from "@/components/common/Mascot";

const PAGE_URL = "https://yamada-tools.jp/generator/random-picker/christmas";

const PRESETS = [
  { label: "📝 参加者を追加（テキストボックスに入力）", names: "" },
  { label: "👥 サンプル4名で試す", names: "田中,山田,鈴木,佐藤" },
];

const FAQ = [
  {
    q: "シークレットサンタの相手決めはどうやって使えばいいですか？",
    a: "全員の名前を入力し、抽選人数を「1」にして1人ずつ抽選します。最初に引いた人が2番目の人にプレゼントを渡す、というように順番に割り当てていくと、シークレットサンタのペアが公平に決まります。",
  },
  {
    q: "プレゼント交換の相手を全員分まとめて決めることはできますか？",
    a: "はい、全員の名前を入力し、抽選人数を参加人数と同じに設定して一度に抽選することで、全員のランダムな並び順が決まります。1番目の人が2番目の人に、2番目が3番目に、という形でペアを決める方法がおすすめです。",
  },
  {
    q: "自分が自分に当たってしまうことはありますか？",
    a: "完全ランダムのため、理論上は自分が自分に当たる可能性があります。その場合は、その人だけ再抽選するか、隣の人とペアを交換する方法が一般的です。次バージョンでの自己当選排除機能を開発中です。",
  },
  {
    q: "プレゼントの予算はどう決めればいいですか？",
    a: "このツールは相手決めのみを行います。プレゼントの予算は参加者間で事前に話し合って決めておくことをおすすめします。一般的な会社の忘年会では500円〜1,000円、友人グループでは1,000円〜3,000円が相場です。",
  },
  {
    q: "LINEグループで結果を共有する方法は？",
    a: "抽選後に表示される「LINEでシェア」ボタンをタップするか、「URLをコピー」してLINEグループに貼り付けることで、抽選結果を全員に共有できます。",
  },
  {
    q: "何人まで対応していますか？費用はかかりますか？",
    a: "人数制限はなく、完全無料です。3人のグループから100人規模の会社の忘年会まで対応しています。",
  },
  {
    q: "クリスマス以外のプレゼント交換（誕生日会・送別会など）にも使えますか？",
    a: "もちろんです。誕生日会、送別会、ハロウィンパーティー、ホワイトデーなど、あらゆるプレゼント交換イベントに対応しています。",
  },
  {
    q: "入力した参加者の名前は他人に見られる可能性はありますか？",
    a: "ありません。入力したデータは日本国内サーバーで処理され、他のユーザーに公開されることは一切ありません。SSL暗号化通信を使用しており、安全にご利用いただけます。",
  },
];

export default function ChristmasClient() {
  return (
    <div style={{ background: "#f8faff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #16a34a 100%)",
          borderRadius: "0 0 20px 20px",
          padding: "48px 32px 40px",
          textAlign: "center",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", top: -30, right: -30,
            width: 160, height: 160,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }} />
          <div aria-hidden style={{
            position: "absolute", bottom: -20, left: -20,
            width: 100, height: 100,
            background: "rgba(255,255,255,0.04)",
            borderRadius: "50%",
          }} />

          <div style={{ fontSize: "3rem", marginBottom: 12, letterSpacing: 4 }} aria-hidden>
            🎄 ⭐ 🎁
          </div>
          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: 12,
            lineHeight: 1.3,
            letterSpacing: "-0.3px",
          }}>
            プレゼント交換の相手をランダムに決めよう
          </h1>
          <p style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
            color: "rgba(255,255,255,0.85)",
            marginBottom: 24,
          }}>
            シークレットサンタ・クリスマス会・誕生日会の相手決めに対応
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {[
              "✅ 完全無料",
              "✅ 何人でも",
              "✅ 自己当選は再抽選推奨",
              "✅ LINE共有OK",
            ].map((b) => (
              <span key={b} style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: "0.84rem",
                color: "#fff",
                fontWeight: 600,
              }}>{b}</span>
            ))}
          </div>
        </div>

        {/* AdSense Slot — below hero, above tool */}
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CHRISTMAS_TOP ?? ""} />

        {/* ── Tool UI ── */}
        <section aria-label="プレゼント交換 相手決めツール" style={{ marginBottom: 32 }}>
          <Mascot state="welcome" />
          <RandomPickerTool
            presets={PRESETS}
            pageUrl={PAGE_URL}
            shareMessage="🎄 プレゼント交換の担当が決まりました！グループLINEでシェアしよう🎁"
            shareTextPrefix="【クリスマスプレゼント交換】"
          />
        </section>

        {/* AdSense Slot — between tool and content */}
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CHRISTMAS_MID ?? ""} />

        {/* ── What is Secret Santa ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            シークレットサンタ（プレゼント交換）とは？
          </h2>
          <div style={{
            background: "#fff",
            borderRadius: 14,
            padding: "24px",
            border: "1.5px solid rgba(34,58,112,0.09)",
            boxShadow: "0 2px 12px rgba(34,58,112,0.06)",
          }}>
            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.85 }}>
              シークレットサンタとは、グループ全員でプレゼントを交換するゲームです。
              誰が誰にプレゼントを渡すかをあらかじめ秘密で決め、当日に一斉に渡し合います。
              プレゼントの予算を統一することで、全員が平等にプレゼントをもらえるのが特徴です。
              クリスマスパーティーや忘年会、友人グループでの恒例イベントとして人気があります。
            </p>
            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.85, marginTop: 12 }}>
              このツールを使えば、参加者全員の名前を入力するだけで、公平にランダムな相手を決めることができます。
              幹事が手動で決める手間もなく、全員が納得できる公平な方法で進行できます。
            </p>
          </div>
        </section>

        {/* ── How to use ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            プレゼント交換の相手の決め方（使い方）
          </h2>

          <HowToStep step={1} title="参加者の名前をすべて入力する">
            <p>
              テキストボックスに参加者全員の名前を入力します。
              「田中,山田,鈴木,佐藤」のようにカンマ区切りで入力するか、
              1行に1人の名前を改行で入力します。ニックネームでもOKです。
            </p>
          </HowToStep>

          <HowToStep step={2} title="抽選人数を設定する">
            <p>
              「抽選人数」を参加者と同じ人数に設定します。
              例えば6人参加なら「6」に設定します。
              これで全員のランダムな順番が一度に決まります。
            </p>
          </HowToStep>

          <HowToStep step={3} title="「抽選する！」を押す">
            <p>
              ボタンを押すとランダムに並び替えられた名前リストが表示されます。
              「1番目の人が2番目の人に」「2番目が3番目に」…という形でペアを割り当てます。
              最後の人は最初の人にプレゼントを渡すと、全員が誰かにプレゼントを渡す形になります。
            </p>
          </HowToStep>

          <HowToStep step={4} title="LINEで結果をシェアする" last>
            <p>
              「LINEでシェア」ボタンをタップして、グループLINEに結果を共有します。
              全員がどの順番になったか確認でき、誰が誰にプレゼントを渡すか一目瞭然です。
              参加者が自分のスマホで直接確認できるので、幹事が個別に連絡する手間も省けます。
            </p>
          </HowToStep>
        </section>

        {/* ── Tips ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            シークレットサンタをもっと楽しくする3つのコツ
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[
              {
                icon: "💰",
                title: "予算を事前に決める",
                desc: "友人グループなら1,000〜3,000円、職場なら500〜1,000円が一般的。事前に全員合意を取りましょう。",
              },
              {
                icon: "🎁",
                title: "ほしいものリストを共有",
                desc: "参加者がほしいものや好みをリスト化してシェアすると、相手に喜ばれるプレゼントが選びやすくなります。",
              },
              {
                icon: "🤫",
                title: "秘密厳守でサプライズ感を演出",
                desc: "誰が誰に渡すかは当日まで秘密に。全員が同時に開封するルールにするとサプライズ感が高まります。",
              },
            ].map((tip) => (
              <div key={tip.title} style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 18px",
                border: "1.5px solid rgba(34,58,112,0.09)",
                boxShadow: "0 2px 10px rgba(34,58,112,0.05)",
              }}>
                <span style={{ fontSize: "1.8rem" }}>{tip.icon}</span>
                <p style={{ fontWeight: 700, color: "#223A70", fontSize: "0.95rem", margin: "10px 0 6px" }}>{tip.title}</p>
                <p style={{ fontSize: "0.84rem", color: "#666", lineHeight: 1.7 }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Other use cases ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            クリスマス以外でも使える！プレゼント交換シーン別ガイド
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "🎂", scene: "誕生日会のプレゼント交換", desc: "友達グループで集まる誕生日会でのプレゼント交換相手決めに。人数が少なくても公平に決められます。" },
              { icon: "👋", scene: "送別会・転勤のはなむけプレゼント", desc: "退職・転勤する方へのプレゼント担当者を公平にランダムに決めたいときにも使えます。" },
              { icon: "🎃", scene: "ハロウィンパーティー", desc: "ハロウィンパーティーでの仮装担当やプレゼント交換相手の決定にも活用できます。" },
              { icon: "🌸", scene: "歓迎会・新歓パーティー", desc: "新しいメンバーの歓迎会で、誰がプレゼントを贈るか決めるのに最適。初対面でも公平に進められます。" },
            ].map((item) => (
              <div key={item.scene} style={{
                display: "flex",
                gap: 16,
                background: "#fff",
                borderRadius: 12,
                padding: "16px 20px",
                border: "1.5px solid rgba(34,58,112,0.09)",
              }}>
                <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: "#223A70", fontSize: "0.95rem", marginBottom: 4 }}>{item.scene}</p>
                  <p style={{ fontSize: "0.88rem", color: "#555", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AdSense Slot — after tips, before FAQ */}
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CHRISTMAS_BOTTOM ?? ""} />

        {/* ── FAQ ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            よくある質問（FAQ）
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQ.map((item, i) => (
              <details key={i} style={{
                background: "#fff",
                borderRadius: 12,
                border: "1.5px solid rgba(34,58,112,0.1)",
                overflow: "hidden",
              }}>
                <summary style={{
                  padding: "16px 20px",
                  fontWeight: 700,
                  color: "#223A70",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  userSelect: "none",
                }}>
                  <span>Q. {item.q}</span>
                  <span style={{ flexShrink: 0, fontSize: "1rem", color: "#aaa" }}>▾</span>
                </summary>
                <div style={{
                  padding: "0 20px 18px",
                  borderTop: "1px solid rgba(34,58,112,0.08)",
                  color: "#555",
                  fontSize: "0.92rem",
                  lineHeight: 1.75,
                }}>
                  <p style={{ marginTop: 14 }}>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Related tools ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            関連ツール・おすすめページ
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
            <RelatedLink href="/generator/random-picker" icon="🎲" title="ランダム抽選ツール（メインページ）" />
            <RelatedLink href="/generator/random-picker/nenkai" icon="🎊" title="忘年会・新年会 抽選ツール" />
            <RelatedLink href="/generator/random-picker/seat" icon="💺" title="席替えランダム抽選" />
          </div>
        </section>

      </div>

      {/* AdSense Slot 4 — bottom sticky (mobile only) */}
      <div className="mobile-ad-sticky" style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#fff",
        borderTop: "1px solid rgba(34,58,112,0.1)",
        padding: "4px 0",
      }}>
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CHRISTMAS_BOTTOM ?? ""} className="!my-0" />
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mobile-ad-sticky { display: none !important; }
        }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  );
}

function HowToStep({ step, title, children, last = false }: {
  step: number; title: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      gap: 20,
      background: "#fff",
      borderRadius: 14,
      padding: "20px 22px",
      marginBottom: last ? 0 : 12,
      border: "1.5px solid rgba(34,58,112,0.09)",
      boxShadow: "0 2px 10px rgba(34,58,112,0.05)",
    }}>
      <div style={{
        width: 40,
        height: 40,
        background: "linear-gradient(135deg, #166534, #16a34a)",
        borderRadius: "50%",
        color: "#fff",
        fontWeight: 800,
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {step}
      </div>
      <div>
        <h3 style={{ fontSize: "1.02rem", fontWeight: 800, color: "#223A70", marginBottom: 8 }}>
          ステップ{step}：{title}
        </h3>
        <div style={{ fontSize: "0.92rem", color: "#555", lineHeight: 1.8 }}>
          {children}
        </div>
        <AdUnit position="mid" format="horizontal" />
      </div>
    </div>
  );
}

function RelatedLink({ href, icon, title }: { href: string; icon: string; title: string }) {
  return (
    <Link href={href} style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "#fff",
      border: "1.5px solid rgba(34,58,112,0.12)",
      borderRadius: 12,
      padding: "14px 18px",
      textDecoration: "none",
      color: "#223A70",
      fontWeight: 600,
      fontSize: "0.88rem",
      boxShadow: "0 2px 8px rgba(34,58,112,0.06)",
    }}>
      <span style={{ fontSize: "1.4rem" }}>{icon}</span>
      <span>{title}</span>
    </Link>
  );
}
