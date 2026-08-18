"use client";
import { AdUnit } from "@/components/common/AdUnit";

import Link from "next/link";
import SeatPickerTool from "@/components/tools/SeatPickerTool";
import Mascot from "@/components/common/Mascot";

const FAQ = [
  {
    q: "席替えをランダムに決めるにはどうすればいいですか？",
    a: "このツールを使えば簡単です。生徒や参加者の名前をカンマ区切りまたは改行で入力し、「席替えする！」ボタンを押すだけで全員の席が公平にランダムで決まります。登録・インストールは一切不要で、スマホからでも使えます。",
  },
  {
    q: "何人まで対応していますか？",
    a: "人数制限はありません。5人の少人数から40人クラス、100人規模の職場まで対応しています。「出席番号1〜40」ボタンを使えば40人分を一度に入力できます。",
  },
  {
    q: "教室のような座席表を表示できますか？",
    a: "はい、「教室グリッド」表示モードに切り替えると、黒板を前にした教室レイアウトで座席表が表示されます。列数は4〜8列から選べるので、教室の形に合わせて調整できます。",
  },
  {
    q: "座席表を印刷できますか？",
    a: "はい、「印刷する」ボタンをタップすると印刷画面が開きます。印刷時は広告やナビゲーションが自動的に非表示になり、座席表のみがきれいに印刷されます。",
  },
  {
    q: "出席番号で席替えする方法は？",
    a: "「出席番号1〜40」ボタンをタップすると、1から40までの番号が自動入力されます。「席替えする！」を押すと各番号がランダムな席番号に割り当てられます。",
  },
  {
    q: "結果を先生や参加者に共有する方法は？",
    a: "「結果をコピー」ボタンで「1番席 → 田中\n2番席 → 山田」形式のテキストがクリップボードにコピーされます。LINEやメールに貼り付けて共有してください。URLコピー機能でページリンクも共有できます。",
  },
  {
    q: "入力した名前はどこかに保存されますか？",
    a: "いいえ、入力したデータはブラウザ内のみで処理され、外部サーバーには送信・保存されません。個人情報を安心して入力いただけます。",
  },
  {
    q: "職場やオフィスの席替えにも使えますか？",
    a: "はい、学校だけでなく職場やオフィスの席替えにも最適です。社員名を入力してランダムにシャッフルし、教室グリッド表示でフロアレイアウトに近い座席表を作成できます。",
  },
  {
    q: "特定の生徒を隣同士にしたい・離したいなどの条件を設定できますか？",
    a: "現在のバージョンでは完全ランダムのみ対応しています。特定の条件がある場合は、一度全体をランダムで決めた後、問題のある席のみ手動で入れ替える方法をおすすめします。",
  },
  {
    q: "スマホから使えますか？iPhoneとAndroid両方対応？",
    a: "はい、iPhone・Androidどちらのブラウザからでも使えます。アプリのインストールや会員登録は不要です。学校や職場のWi-Fiがなくてもモバイルデータ通信で利用できます。",
  },
];

export default function SeatClient() {
  return (
    <div style={{ background: "#f8faff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #1d3557 0%, #2a4a7f 60%, #457b9d 100%)",
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
            🏫 📋 🪑
          </div>
          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: 12,
            lineHeight: 1.3,
            letterSpacing: "-0.3px",
          }}>
            席替えランダム決めツール
          </h1>
          <p style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
            color: "rgba(255,255,255,0.85)",
            marginBottom: 24,
          }}>
            クラス・職場の席替えを公平にシャッフル｜座席表表示・印刷対応
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["✅ 完全無料", "✅ 何人でもOK", "✅ 座席表表示", "✅ 印刷対応", "✅ 登録不要"].map((b) => (
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
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_SEAT_TOP ?? ""} />

        {/* ── Tool UI ── */}
        <section aria-label="席替えランダム決めツール" style={{ marginBottom: 32 }}>
          <Mascot state="welcome" />
          <SeatPickerTool pageUrl="https://yamada-tools.jp/generator/random-picker/seat" />
        </section>

        {/* AdSense Slot — between tool and content */}
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_SEAT_MID ?? ""} />

        {/* ── What is this tool ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1d3557", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid rgba(29,53,87,0.1)" }}>
            席替えランダム決めツールとは
          </h2>
          <div style={{
            background: "#fff",
            borderRadius: 14,
            padding: "24px",
            border: "1.5px solid rgba(29,53,87,0.09)",
            boxShadow: "0 2px 12px rgba(29,53,87,0.06)",
          }}>
            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.85 }}>
              席替えランダム決めツールは、クラスや職場の座席をワンクリックで公平にシャッフルできる無料Webツールです。
              生徒や参加者の名前を入力するだけで、全員の席を瞬時にランダムに決定。
              教室グリッド表示で黒板を前にした座席表レイアウトを確認でき、そのまま印刷して配布することも可能です。
            </p>
            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.85, marginTop: 12 }}>
              「誰が前の席で、誰が後ろの席か」という不公平感をなくし、教師も生徒も納得できる完全ランダムに席替えできます。
              出席番号1〜40の一括入力プリセットも用意されており、毎学期の席替えを手間なく素早く行えます。
              アプリのインストールや会員登録は一切不要。スマホからでも使えます。
            </p>
          </div>
        </section>

        {/* ── Use cases ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1d3557", marginBottom: 28, paddingBottom: 12, borderBottom: "2px solid rgba(29,53,87,0.1)" }}>
            こんな席替えに使えます
          </h2>

          <UseCase icon="🏫" title="学校・クラスの席替え">
            <p>
              毎学期の定番行事、クラスの席替えに最適です。出席番号1〜40のプリセットボタンで一括入力すれば、
              番号を打ち込む手間ゼロ。「席替えする！」を押すだけで全40席がランダムに決定します。
              教室グリッド表示に切り替えて列数を合わせると、そのまま黒板に掲示できる座席表になります。
            </p>
          </UseCase>

          <UseCase icon="💼" title="職場・オフィスの席替え">
            <p>
              定期的なオフィスの席替えも、このツールで公平に決められます。
              社員名を入力してシャッフルし、グリッド表示の列数をフロアのレイアウトに合わせれば
              座席表として活用可能です。「なぜあの人が窓側ばかり」という不満も完全ランダムで解決。
            </p>
          </UseCase>

          <UseCase icon="🎓" title="塾・習い事・ゼミの席順決め">
            <p>
              塾や英会話教室、大学ゼミなど少人数グループの席順決めにも使えます。
              毎回同じ顔ぶれが隣になりがちな環境でも、ランダムシャッフルで新鮮な組み合わせを演出。
              参加者同士の交流が深まる効果もあります。
            </p>
          </UseCase>

          <UseCase icon="🎪" title="イベント・会議の席順決め">
            <p>
              社内研修、セミナー、懇親会など、参加者の着席順をランダムに決めたいシーンに対応。
              名前を入力して席番号と紐付けることで、当日の席案内がスムーズになります。
              印刷機能で会場担当者への配布資料にも使えます。
            </p>
          </UseCase>

          <UseCase icon="🏃" title="体育・班活動のグループ分け" last>
            <p>
              席替えだけでなく、体育の班分けや委員会・班活動のグループ分けにも応用できます。
              全員の名前をランダムに並べ、「上から6人が1班、次の6人が2班」という方式で
              公平なグループ編成が素早くできます。
            </p>
          </UseCase>
        </section>

        {/* ── How-to ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1d3557", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid rgba(29,53,87,0.1)" }}>
            席替えツールの使い方（ステップガイド）
          </h2>

          <HowToStep step={1} title="名前を入力する">
            <p>
              テキストボックスに生徒や参加者の名前を入力します。
              「田中,山田,鈴木」のようにカンマ区切りでも、1行1人の改行入力でもOKです。
              「出席番号1〜40」ボタンを押すと1から40の番号が一括で入力されます。
            </p>
          </HowToStep>

          <HowToStep step={2} title="「席替えする！」を押す">
            <p>
              ボタンをタップするとシャッフルが開始され、0.8秒後に全員分の座席が決定します。
              何度でも押し直せるので、「もう一度やり直したい」ときも安心です。
            </p>
          </HowToStep>

          <HowToStep step={3} title="表示モードを選んで確認する">
            <p>
              「リスト表示」では「1番席 → 田中」形式の一覧が表示されます。
              「教室グリッド」に切り替えると黒板を前にした教室レイアウトで座席表が表示されます。
              列数は4〜8列から選べるので、実際の教室やオフィスのレイアウトに合わせられます。
            </p>
          </HowToStep>

          <HowToStep step={4} title="印刷・共有する" last>
            <p>
              「印刷する」ボタンで座席表をそのまま印刷できます（広告・ナビは自動で非表示）。
              「結果をコピー」ボタンでテキスト形式の結果をコピーし、LINEやメールで共有できます。
              URLコピーでページリンクを他の先生や参加者と共有することも可能です。
            </p>
          </HowToStep>
        </section>

        {/* AdSense Slot — after how-to, before tips */}
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_SEAT_BOTTOM ?? ""} />

        {/* ── Tips ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1d3557", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid rgba(29,53,87,0.1)" }}>
            席替えのコツ・よくある悩みと解決策
          </h2>

          <TipCard icon="🎯" title="特定の生徒を離したい場合は？">
            <p>
              このツールは完全ランダムのため、特定の条件指定はできません。
              ただし、まず全体をランダムで決めた後、問題のある席のみ手動で2人を入れ替える「微調整方式」が実用的です。
              9割はランダムに決まるので、先生の恣意性なく公平な席替えが実現できます。
            </p>
          </TipCard>

          <TipCard icon="🖨️" title="座席表を印刷して掲示したい">
            <p>
              「教室グリッド」表示に切り替えてから「印刷する」ボタンを押してください。
              印刷時は広告・ナビゲーション・ボタン類が自動で非表示になり、座席グリッドだけがきれいに印刷されます。
              A4横向きで印刷すると6列程度まで見やすく収まります。
            </p>
          </TipCard>

          <TipCard icon="📱" title="その場でスマホから実施したい">
            <p>
              このページをスマホのブラウザでブックマークしておくと便利です。
              ホーム画面に追加することでアプリのように起動できます。
              学期初めの席替えの前に名前を入力しておき、教室でボタンを押して即発表、という流れも可能です。
            </p>
          </TipCard>

          <TipCard icon="🔢" title="出席番号と名前、どちらで入力すべき？" last>
            <p>
              名前で入力すると「1番席 → 田中」のように誰がどこに座るかが一目でわかります。
              出席番号で入力すると「1番席 → 出席番号17番」のように番号管理ができます。
              教室掲示用には名前、名簿管理には番号と使い分けるとスムーズです。
            </p>
          </TipCard>
        </section>

        {/* ── FAQ ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1d3557", marginBottom: 24, paddingBottom: 12, borderBottom: "2px solid rgba(29,53,87,0.1)" }}>
            よくある質問（FAQ）
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQ.map((item, i) => (
              <details key={i} style={{
                background: "#fff",
                borderRadius: 12,
                border: "1.5px solid rgba(29,53,87,0.1)",
                overflow: "hidden",
              }}>
                <summary style={{
                  padding: "16px 20px",
                  fontWeight: 700,
                  color: "#1d3557",
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
                  borderTop: "1px solid rgba(29,53,87,0.08)",
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
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1d3557", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid rgba(29,53,87,0.1)" }}>
            関連ツール・おすすめページ
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
            <RelatedLink href="/generator/random-picker" icon="🎲" title="ランダム抽選ツール（メインページ）" />
            <RelatedLink href="/generator/random-picker/nenkai" icon="🎊" title="忘年会・新年会 抽選ツール" />
            <RelatedLink href="/generator/random-picker/christmas" icon="🎄" title="クリスマス プレゼント交換" />
          </div>
        </section>

      </div>

      {/* AdSense Slot 12 — bottom sticky (mobile only) */}
      <div className="mobile-ad-sticky" style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#fff",
        borderTop: "1px solid rgba(29,53,87,0.1)",
        padding: "4px 0",
      }}>
        <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_SEAT_BOTTOM ?? ""} className="!my-0" />
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
      border: "1.5px solid rgba(29,53,87,0.09)",
      boxShadow: "0 2px 10px rgba(29,53,87,0.05)",
    }}>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1d3557", marginBottom: 10 }}>
        {icon} {title}
      </h3>
      <div style={{ fontSize: "0.92rem", color: "#555", lineHeight: 1.8 }}>
        {children}
      </div>
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
      border: "1.5px solid rgba(29,53,87,0.09)",
      boxShadow: "0 2px 10px rgba(29,53,87,0.05)",
    }}>
      <div style={{
        width: 40,
        height: 40,
        background: "linear-gradient(135deg, #2d6a4f, #40916c)",
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
        <h3 style={{ fontSize: "1.02rem", fontWeight: 800, color: "#1d3557", marginBottom: 8 }}>
          ステップ{step}：{title}
        </h3>
        <div style={{ fontSize: "0.92rem", color: "#555", lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function TipCard({ icon, title, children, last = false }: {
  icon: string; title: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      padding: "20px 24px",
      marginBottom: last ? 0 : 14,
      border: "1.5px solid rgba(29,53,87,0.09)",
      boxShadow: "0 2px 10px rgba(29,53,87,0.05)",
    }}>
      <h3 style={{ fontSize: "1.02rem", fontWeight: 800, color: "#1d3557", marginBottom: 10 }}>
        {icon} {title}
      </h3>
      <div style={{ fontSize: "0.92rem", color: "#555", lineHeight: 1.8 }}>
        {children}
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
      border: "1.5px solid rgba(29,53,87,0.12)",
      borderRadius: 12,
      padding: "14px 18px",
      textDecoration: "none",
      color: "#1d3557",
      fontWeight: 600,
      fontSize: "0.88rem",
      boxShadow: "0 2px 8px rgba(29,53,87,0.06)",
    }}>
      <span style={{ fontSize: "1.4rem" }}>{icon}</span>
      <span>{title}</span>
    </Link>
  );
}
