"use client";
import { AdUnit } from "@/components/common/AdUnit";

import Link from "next/link";
import RandomPickerTool from "@/components/tools/RandomPickerTool";
import Mascot from "@/components/common/Mascot";

const PAGE_URL = "https://yamada-tools.jp/generator/random-picker/nenkai";

const PRESETS = [
  { label: "🎋 全員で幹事を決める（名前を入力してください）", names: "" },
  { label: "🏆 1等〜5等で景品抽選", names: "1等,2等,3等,4等,5等" },
];

const FAQ = [
  {
    q: "忘年会の幹事をランダムに決めるにはどうすればいいですか？",
    a: "このツールを使えば簡単です。参加者全員の名前をカンマ区切りで入力し、「抽選する！」ボタンを押すだけで公平にランダムで幹事を決めることができます。スマホでも使えるので、飲み会の席でその場で実施できます。登録・インストールは不要です。",
  },
  {
    q: "忘年会の景品抽選に何人まで対応していますか？",
    a: "人数制限はありません。10人でも100人でも、参加者全員の名前を入力して抽選できます。複数の景品がある場合も「抽選人数」を増やすことで複数名を同時に選べます。重複なしで連続抽選も可能です。",
  },
  {
    q: "プレゼント交換（シークレットサンタ）の相手はこのツールで決められますか？",
    a: "はい、最適です。全員の名前を入力して1人ずつ抽選することで、誰が誰にプレゼントを渡すかをランダムに決めることができます。公平で誰も文句のない相手決めができます。",
  },
  {
    q: "忘年会の出し物や罰ゲームの順番決めにも使えますか？",
    a: "はい、発表順番や出し物の順番決めにも使えます。参加者の名前を入力して全員分を一度に抽選することで、公平な順番を瞬時に決定できます。",
  },
  {
    q: "スマホで忘年会の会場から使えますか？",
    a: "はい、iPhone・Androidどちらからでも使えます。ブラウザを開いてURLを入力するだけで、アプリのインストールや会員登録なしにすぐ使えます。Wi-FiがなくてもモバイルデータでOKです。",
  },
  {
    q: "無料ですか？課金は必要ですか？",
    a: "完全無料です。機能制限もなく、何度でも何人でも使えます。会員登録・クレジットカードの入力も一切不要です。",
  },
  {
    q: "入力した参加者の名前はどこかに保存されますか？",
    a: "いいえ、入力したデータは外部に保存・送信されません。すべての処理は日本国内のサーバーで完結し、セッション終了後にデータは削除されます。個人情報を安心して入力いただけます。",
  },
  {
    q: "抽選結果をLINEや他のメンバーにシェアできますか？",
    a: "はい、抽選後に「結果をシェアする」ボタンが表示されます。URLをコピーしてLINEに貼り付けるか、LINEシェアボタンを使って参加者全員に結果を共有できます。",
  },
];

export default function NenkaiClient() {
  return (
    <div style={{ background: "#f8faff", minHeight: "100vh" }}>
      {/* ── Page wrapper ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #223A70 60%, #1a56db 100%)",
          borderRadius: "0 0 20px 20px",
          padding: "48px 32px 40px",
          textAlign: "center",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative blobs */}
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
            🎊 🍾 🎁
          </div>
          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: 12,
            lineHeight: 1.3,
            letterSpacing: "-0.3px",
          }}>
            忘年会・新年会の抽選はこれで決まり！
          </h1>
          <p style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
            color: "rgba(255,255,255,0.85)",
            marginBottom: 24,
          }}>
            幹事決め・景品抽選・プレゼント交換に対応｜無料・登録不要・スマホOK
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["✅ 完全無料", "✅ 登録不要", "✅ スマホOK", "✅ 日本国内サーバー"].map((b) => (
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
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_NENKAI_TOP ?? ""} />

        {/* ── Tool UI ── */}
        <section aria-label="抽選ツール" style={{ marginBottom: 32 }}>
          <Mascot state="welcome" />
          <RandomPickerTool
            presets={PRESETS}
            pageUrl={PAGE_URL}
            shareMessage="🎉 忘年会の抽選結果が決まりました！みんなにシェアしよう"
            shareTextPrefix="【忘年会抽選結果】"
          />
        </section>

        {/* AdSense Slot — between tool and use-cases */}
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_NENKAI_MID ?? ""} />

        {/* ── Use cases ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 28, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            忘年会・新年会でこんな用途に使えます
          </h2>

          <UseCase icon="🎋" title="幹事・司会をランダムに決める">
            <p>
              全員の名前を入力して「抽選する！」ボタンを押すだけで、公平にランダムで幹事を決められます。
              「なんで私が幹事なの？」という不満も、完全ランダムなら誰も文句を言えません。
              その場でスマホから実施できるので、「じゃあ今決めよう」という空気になったときにすぐ対応できます。
            </p>
          </UseCase>

          <UseCase icon="🎁" title="景品抽選・ビンゴの商品を誰が取るか決める">
            <p>
              忘年会の目玉イベント、景品抽選。1等から5等まで複数の景品がある場合も、
              「抽選人数」を設定することで複数名を同時に選べます。重複なし設定で公平な抽選ができます。
              プロジェクターやテレビに映して、みんなで一緒に結果を見ると盛り上がります。
            </p>
          </UseCase>

          <UseCase icon="🎅" title="プレゼント交換（シークレットサンタ）の相手決め">
            <p>
              クリスマスパーティーや忘年会でのプレゼント交換（シークレットサンタ）にも最適です。
              全員の名前を入力し、1人ずつ順番に「誰にプレゼントを渡すか」を抽選することで、
              公平でスムーズに相手を決められます。予算を決めてから使うと完璧です。
            </p>
          </UseCase>

          <UseCase icon="🎤" title="出し物・カラオケの発表順番決め">
            <p>
              忘年会の出し物やカラオケの歌う順番も、このツールで決められます。
              参加者名を全員入力して複数人同時抽選をすれば、発表順が一瞬で決まります。
            </p>
          </UseCase>

          <UseCase icon="🍺" title="二次会の幹事・お会計係を決める" last>
            <p>
              二次会の幹事やお会計係もランダムに決めましょう。
              一次会が終わった後でも、スマホですぐに実施できます。
            </p>
          </UseCase>
        </section>

        {/* ── How-to ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            忘年会の抽選ツールの使い方（3ステップ）
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { step: 1, title: "参加者の名前を入力", desc: "カンマ区切りまたは改行で入力OK。何人でも対応。" },
              { step: 2, title: "抽選人数を設定", desc: "「＋」「－」ボタンで当選者数を調整する。" },
              { step: 3, title: "「抽選する！」を押す", desc: "ボタンを押すだけで瞬時に公平なランダム結果が表示。" },
            ].map((s) => (
              <div key={s.step} style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 18px",
                border: "1.5px solid rgba(34,58,112,0.1)",
                boxShadow: "0 2px 12px rgba(34,58,112,0.06)",
              }}>
                <div style={{
                  width: 36, height: 36,
                  background: "#223A70",
                  borderRadius: "50%",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12,
                }}>
                  {s.step}
                </div>
                <p style={{ fontWeight: 700, color: "#223A70", fontSize: "0.95rem", marginBottom: 6 }}>{s.title}</p>
                <p style={{ fontSize: "0.84rem", color: "#666", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AdSense Slot — after how-to */}
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_NENKAI_BOTTOM ?? ""} />

        {/* ── Seasonal guide ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#223A70", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid rgba(34,58,112,0.1)" }}>
            忘年会・送別会・歓迎会のシーズン別活用ガイド
          </h2>

          <SeasonCard icon="❄️" season="11〜12月：忘年会シーズン">
            年末の忘年会は1年で最も抽選ツールが活躍するシーズンです。
            幹事決め・店選び・席順・プレゼント交換・ゲームの罰ゲーム決めなど、
            あらゆる場面でランダム抽選が活躍します。
          </SeasonCard>

          <SeasonCard icon="🎍" season="1〜2月：新年会シーズン">
            新年の抱負を発表する順番決めや、初詣のおみくじ代わりとして使う方も増えています。
            新年会の幹事決めにもご活用ください。
          </SeasonCard>

          <SeasonCard icon="🌸" season="3〜4月：送別会・歓迎会シーズン" last>
            送別会でのプレゼント担当決めや、新入社員・新入生歓迎会でのゲーム進行にも使えます。
            席順をランダムに決めて、初対面の人ともすぐに打ち解けられます。
          </SeasonCard>
        </section>

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
            <RelatedLink href="/generator/random-picker/christmas" icon="🎄" title="プレゼント交換 相手決め（クリスマス）" />
            <RelatedLink href="/generator/random-picker/seat" icon="💺" title="席替えランダム抽選" />
          </div>
        </section>

      </div>

      {/* AdSense Slot 4 — bottom sticky (mobile only) */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#fff",
        borderTop: "1px solid rgba(34,58,112,0.1)",
        padding: "4px 0",
        display: "block",
      }} className="mobile-ad-sticky">
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_NENKAI_BOTTOM ?? ""} className="!my-0" />
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

function UseCase({ icon, title, children, last = false }: {
  icon: string; title: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      padding: "22px 24px",
      marginBottom: last ? 0 : 14,
      border: "1.5px solid rgba(34,58,112,0.09)",
      boxShadow: "0 2px 10px rgba(34,58,112,0.05)",
    }}>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#223A70", marginBottom: 10 }}>
        {icon} {title}
      </h3>
      <div style={{ fontSize: "0.92rem", color: "#555", lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

function SeasonCard({ icon, season, children, last = false }: {
  icon: string; season: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      gap: 18,
      background: "#fff",
      borderRadius: 12,
      padding: "18px 20px",
      marginBottom: last ? 0 : 12,
      border: "1.5px solid rgba(34,58,112,0.09)",
    }}>
      <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{icon}</span>
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#223A70", marginBottom: 6 }}>{season}</h3>
        <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.75 }}>{children}</p>
        <AdUnit slot="5612038947" format="horizontal" />
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
      transition: "all 0.15s",
    }}>
      <span style={{ fontSize: "1.4rem" }}>{icon}</span>
      <span>{title}</span>
    </Link>
  );
}
