import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "飲食店の原価率の目安と計算方法・フードロス削減で利益を最大化【無料計算ツール付き】";
const description = "飲食店の原価率の業態別目安（ラーメン・カフェ・居酒屋）と正しい計算方法を解説。フードロス削減で年間数百万円の利益改善も可能。無料ツールで今すぐ計算。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("飲食店の原価率の目安と計算方法・フードロス削減")}&type=blog&category=${encodeURIComponent("飲食・経営")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["原価率", "飲食店", "フードロス", "FL比率", "食品ロス", "飲食店経営", "原価計算"],
  alternates: { canonical: "https://yamada-tools.jp/blog/inshokuten-genka-foodloss" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-07", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function InshokuteiGenkaFoodlossBlog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "datePublished": "2025-05-07",
            "dateModified": "2025-05-07",
            "author": { "@type": "Organization", "name": "山田ツール編集部" },
            "publisher": { "@type": "Organization", "name": "合同会社山田トレード", "logo": { "@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp" } },
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/inshokuten-genka-foodloss" }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "飲食店の適正原価率はいくら？", "acceptedAnswer": { "@type": "Answer", "text": "業態によって異なりますが、一般的な目安は25〜35%です。カフェや居酒屋のドリンクは20〜25%と低め、寿司・高級食材を使う店は40〜50%になることもあります。重要なのは原価率単体より、人件費を加えたFL比率（60%以内が目安）で管理することです。" } },
              { "@type": "Question", "name": "FL比率が60%を超えたらどうすれば良い？", "acceptedAnswer": { "@type": "Answer", "text": "食材費（F）か人件費（L）のどちらが高いかを特定して対策を立てます。食材費が高い場合は仕入れ先の見直し・メニュー改廃・フードロス削減、人件費が高い場合はシフト最適化・ホールとキッチンの兼務検討が有効です。どちらか一方だけ下げると品質低下につながるため、バランスを見て対処します。" } },
              { "@type": "Question", "name": "フードロスはどれくらい飲食店の利益を圧迫している？", "acceptedAnswer": { "@type": "Answer", "text": "飲食店の平均フードロス率は10〜15%と言われています。月仕入れ100万円の店でロス率12%なら年間144万円が無駄になっている計算です。ロスを5%に下げるだけで年間84万円の利益改善効果があり、これは売上を約300万円伸ばすのと同等の効果があります。" } },
              { "@type": "Question", "name": "メニューの売価はどうやって決める？", "acceptedAnswer": { "@type": "Answer", "text": "目標原価率から逆算します。食材費が300円で原価率30%に収めたい場合、売価=300÷0.30=1,000円となります。ただし、競合店の価格・地域の相場・客単価との兼ね合いも重要です。原価率が多少高くなっても、集客力がある看板メニューとして機能するなら許容できるケースもあります。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>飲食店の原価率とフードロス削減</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("飲食店の原価率・フードロス削減")}&type=blog&category=${encodeURIComponent("飲食・経営")}`} alt="飲食店原価率とフードロス削減完全ガイド" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約8分</p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 飲食店の原価率の正しい計算方法</li>
          <li>✓ 業態別（ラーメン・カフェ・居酒屋）の原価率目安</li>
          <li>✓ FL比率とは何か・目安と改善方法</li>
          <li>✓ フードロスが年間利益に与えるインパクト</li>
          <li>✓ フードロス削減の具体的な5つの方法</li>
          <li>✓ 適正売価の決め方と値上げのタイミング</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">飲食店の原価率とは？基本の計算式</h2>
        <p className="text-gray-700 mb-4">
          原価率とは<strong className="text-blue-600">売上に対する食材費（仕入れコスト）の割合</strong>です。飲食店経営の最重要指標のひとつで、これが高すぎると利益が出ません。
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-blue-800 mb-3 text-lg">原価率の計算式</h3>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700 mb-2">原価率（%）＝ 食材費 ÷ 売上 × 100</p>
            <p className="text-gray-600 text-sm">例：食材費30万円・売上100万円 → 原価率30%</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <p className="font-bold text-yellow-800 mb-2">⚠️ 「原価」と「原価率」の違い</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">原価（Food Cost）</p>
              <p>1品あたりの食材費の絶対額。ラーメン1杯の麺・スープ・チャーシューの合計コストなど。</p>
            </div>
            <div>
              <p className="font-semibold mb-1">原価率</p>
              <p>原価÷売価×100。同じ原価でも売価が高ければ原価率は下がる。経営管理で使うのは原価率。</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-2">原価率が高すぎるとどうなる？</h3>
          <p className="text-gray-700 text-sm mb-3">原価率40%の店と30%の店を比較してみます（月商200万円の場合）：</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-200 text-left">項目</th>
                  <th className="p-2 border border-gray-200 text-center">原価率30%</th>
                  <th className="p-2 border border-gray-200 text-center">原価率40%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["月商", "200万円", "200万円"],
                  ["食材費", "60万円", "80万円"],
                  ["食材費の差", "—", "▲20万円"],
                  ["年間の差", "—", "▲240万円"],
                ].map(([item, a, b], i) => (
                  <tr key={i} className={i === 3 ? "bg-red-50 font-bold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200">{item}</td>
                    <td className="p-2 border border-gray-200 text-center">{a}</td>
                    <td className="p-2 border border-gray-200 text-center text-red-600">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-xs mt-2">原価率が10%高いだけで、年間240万円もの差が生まれます。</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">業態別・原価率の平均と目安</h2>
        <p className="text-gray-700 mb-4">
          業態によって適正原価率は大きく異なります。同じ「飲食店」でも食材の性質・客単価・席回転数が違うため、他業態と単純比較しないことが重要です。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-3 text-left">業態</th>
                <th className="p-3 text-left">原価率の目安</th>
                <th className="p-3 text-left">ポイント</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ラーメン店", "25〜30%", "麺・スープ・チャーシューのコスト管理が重要。トッピング原価率は低め"],
                ["カフェ", "25〜35%", "コーヒー単体は低原価率だが、フードメニューが高め。ランチで収益改善"],
                ["居酒屋（フード）", "30〜35%", "フードは35%前後。ドリンクは15〜20%と低いため、ドリンク注文促進が鍵"],
                ["居酒屋（ドリンク）", "15〜20%", "高利益率。飲み放題メニューで客単価を安定させやすい"],
                ["寿司・海鮮", "40〜50%", "高級食材のため原価率が高め。客単価が高いことで利益を確保"],
                ["ファストフード", "30〜35%", "大量仕入れでコスト抑制。標準化されたメニューで廃棄ロスを最小化"],
                ["デリバリー専門", "20〜25%", "ホール人件費が不要なため低原価率でも運営可能"],
                ["高級フレンチ・和食", "35〜45%", "食材品質にコストをかけることで客単価・ブランド価値を高める"],
              ].map(([type, rate, point], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{type}</td>
                  <td className="p-3 border border-gray-200 font-bold text-orange-600">{rate}</td>
                  <td className="p-3 border border-gray-200 text-gray-600">{point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm">
          ※ 上記はあくまで目安です。同じ業態でも地域・立地・客単価によって適正範囲が変わります。重要なのは自店の原価率トレンドを毎月モニタリングすることです。
        </p>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">FL比率とは？飲食店経営で最重要の指標</h2>
        <p className="text-gray-700 mb-4">
          原価率と同様に重要なのが<strong className="text-blue-600">FL比率</strong>です。FはFood（食材費）、LはLabor（人件費）の頭文字で、経営の健全性を測る指標です。
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-blue-800 mb-2">FLコスト = 食材費(F) + 人件費(L)</p>
              <p className="text-2xl font-bold text-blue-700">FL比率（%）= FLコスト ÷ 売上 × 100</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-green-100 rounded p-2">
                <span className="font-semibold">50%以下</span>
                <span className="text-green-700 font-bold">優良</span>
              </div>
              <div className="flex justify-between items-center bg-blue-100 rounded p-2">
                <span className="font-semibold">50〜55%</span>
                <span className="text-blue-700 font-bold">良好</span>
              </div>
              <div className="flex justify-between items-center bg-yellow-100 rounded p-2">
                <span className="font-semibold">55〜60%</span>
                <span className="text-yellow-700 font-bold">注意が必要</span>
              </div>
              <div className="flex justify-between items-center bg-red-100 rounded p-2">
                <span className="font-semibold">60%超</span>
                <span className="text-red-700 font-bold">危険信号</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">具体例：月商100万円の居酒屋の場合</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-200 text-left">項目</th>
                  <th className="p-2 border border-gray-200 text-center">金額</th>
                  <th className="p-2 border border-gray-200 text-center">売上比</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["月商（売上）", "100万円", "100%"],
                  ["食材費（F）", "32万円", "32%"],
                  ["人件費（L）", "25万円", "25%"],
                  ["FLコスト合計", "57万円", "57%（FL比率）"],
                  ["残り（家賃・光熱費・利益）", "43万円", "43%"],
                ].map(([item, amt, ratio], i) => (
                  <tr key={i} className={i === 3 ? "bg-blue-50 font-bold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200">{item}</td>
                    <td className="p-2 border border-gray-200 text-center">{amt}</td>
                    <td className="p-2 border border-gray-200 text-center">{ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-xs mt-2">FL比率57%は「注意が必要」な水準。家賃・光熱費・設備償却を引くと利益はわずかになります。</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">フードロスが飲食店の利益を蝕む</h2>
        <p className="text-gray-700 mb-4">
          多くの飲食店経営者が見落としがちなのが<strong className="text-red-600">フードロスの経済的インパクト</strong>です。食材の腐敗・売れ残り・調理ミスによるロスは、積み重なると年間数百万円にのぼることもあります。
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-red-800 mb-4">フードロスの年間コスト試算</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-red-100">
                  <th className="p-2 border border-red-200 text-left">月仕入れ額</th>
                  <th className="p-2 border border-red-200 text-center">ロス率10%</th>
                  <th className="p-2 border border-red-200 text-center">ロス率15%</th>
                  <th className="p-2 border border-red-200 text-center">ロスを5%に改善</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["50万円", "年間60万円のロス", "年間90万円のロス", "年間30万円削減効果"],
                  ["100万円", "年間120万円のロス", "年間180万円のロス", "年間60万円削減効果"],
                  ["200万円", "年間240万円のロス", "年間360万円のロス", "年間120万円削減効果"],
                ].map(([qty, a, b, c], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-red-50"}>
                    <td className="p-2 border border-red-200 font-medium">{qty}</td>
                    <td className="p-2 border border-red-200 text-center text-red-600">{a}</td>
                    <td className="p-2 border border-red-200 text-center text-red-700 font-bold">{b}</td>
                    <td className="p-2 border border-red-200 text-center text-green-600 font-bold">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">フードロスの主な原因</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-center">
            {[
              { icon: "🥬", label: "食材の腐敗", desc: "管理不足・古い在庫" },
              { icon: "📦", label: "過剰仕入れ", desc: "需要予測のミス" },
              { icon: "🍽️", label: "調理ミス", desc: "作り直し・廃棄" },
              { icon: "😔", label: "売れ残り", desc: "日替わりメニュー等" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className="font-semibold text-gray-800">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">フードロス削減の具体的な方法5選</h2>
        <p className="text-gray-700 mb-4">
          フードロスを5〜8%削減できれば、月商100万円の店で年間60〜100万円以上の利益改善が可能です。以下の方法を1つでも実践してみてください。
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              num: "1",
              title: "適正発注量の管理（POSデータ・曜日別分析）",
              desc: "POSレジのデータを活用して曜日・天気・時間帯別の売れ行きを分析し、仕入れ量を最適化します。経験や勘に頼った発注から、データドリブンな発注に移行するだけでロス率を3〜5%改善できます。"
            },
            {
              num: "2",
              title: "FIFO（先入れ先出し）の徹底",
              desc: "冷蔵庫・冷凍庫・棚の整理で古い食材が奥に埋もれないよう、入荷した食材を後ろに置き古いものを前に出す「先入れ先出し」を全スタッフに徹底します。食材の使用期限管理にも有効です。"
            },
            {
              num: "3",
              title: "冷凍保存・真空パックの活用",
              desc: "使い切れない食材は早めに冷凍・真空保存することで賞味期限を延ばせます。特に肉・魚介類は冷凍対応しやすく、味の劣化も少ない食材から順次対応を検討してください。"
            },
            {
              num: "4",
              title: "見切り品・スタッフ賄いへの転用",
              desc: "商品化できないが食べられる食材は、スタッフの賄いとして活用します。賄い食材費を削減しながらフードロスも減らせる一石二鳥の対策です。"
            },
            {
              num: "5",
              title: "メニュー設計での食材の使い回し",
              desc: "同じ食材を複数のメニューで使えるよう設計（食材の共通化）することで、1種類の食材が余っても他メニューで消費できます。特に仕入れ量が多い食材は複数メニューへの組み込みを検討しましょう。"
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0 text-sm">{item.num}</div>
              <div>
                <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">適正売価の決め方と値上げのタイミング</h2>
        <p className="text-gray-700 mb-4">
          原価率を管理するもう一つのアプローチが<strong className="text-blue-600">売価の最適化</strong>です。仕入れコストが上がった時の値上げ判断も含めて解説します。
        </p>

        <div className="bg-blue-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-blue-800 mb-3">目標原価率から逆算する売価の計算方法</h3>
          <div className="bg-white rounded-lg p-4 text-sm space-y-2">
            <p className="font-semibold">売価 = 食材費 ÷ 目標原価率</p>
            <p className="text-gray-600">例：食材費300円・目標原価率30%の場合</p>
            <p className="text-blue-700 font-bold text-lg">売価 = 300円 ÷ 0.30 = 1,000円（税抜）</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-2">値上げのタイミング</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・原材料費が3か月連続で上昇している場合</li>
              <li>・原価率が目標値より3〜5%以上高い状態が続く場合</li>
              <li>・競合店が値上げを実施したタイミング</li>
              <li>・新メニュー導入・リニューアルのタイミング</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-2">値上げを受け入れてもらうコツ</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・小幅な値上げを複数回に分ける（一度に10%より2度に5%）</li>
              <li>・「原材料費高騰のため」と明示する</li>
              <li>・値上げと同時にメニューの質・量を向上させる</li>
              <li>・常連客への事前告知</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料ツールで今すぐ計算</h2>
        <p className="text-gray-700 mb-6">
          自店の原価率・FL比率・フードロスコストを数値で把握するために、以下の無料ツールをお使いください。毎月の経営チェックに活用できます。
        </p>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">飲食店原価率計算機</p>
          <p className="text-sm opacity-90 mb-4">食材費・売上・業態を入力するだけでFL比率・適正原価率を即計算。改善余地も自動診断。</p>
          <Link href="/food/genka-calculator" className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors">
            原価率を計算する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">フードロスコスト計算機</p>
            <p className="text-sm text-gray-600 mb-3">月仕入れ額とロス率を入力すると年間損失額が計算できます。ロス改善目標を設定すると削減効果も試算。</p>
            <Link href="/food/foodloss-calculator" className="text-blue-600 text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">栄養成分表示計算機</p>
            <p className="text-sm text-gray-600 mb-3">食材の配合比率から栄養成分（カロリー・たんぱく質・脂質・炭水化物）を計算。食品表示対応に。</p>
            <Link href="/food/nutrition-label-calculator" className="text-blue-600 text-sm font-medium hover:underline">試してみる →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：飲食店の利益を最大化するポイント</h2>
        <div className="bg-orange-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-orange-600 font-bold">①</span> 適正原価率は業態で異なるが、目安は25〜35%（寿司・高級食材は例外）</li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">②</span> FL比率（食材費＋人件費）は60%以内が健全経営の目安</li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">③</span> フードロス10%→5%の改善で月商100万円の店は年間60万円の利益改善</li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">④</span> FIFO徹底・POSデータ活用・食材の共通化がフードロス削減の三本柱</li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">⑤</span> 売価は「食材費 ÷ 目標原価率」で逆算して設定する</li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">⑥</span> 無料ツールで毎月の原価率・FL比率をモニタリングして改善サイクルを回す</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/inshokuten-genka-foodloss" title={title} />
    </article>
  );
}
