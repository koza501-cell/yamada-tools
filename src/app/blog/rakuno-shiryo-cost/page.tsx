import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "酪農・畜産の飼料コスト計算と削減方法【飼料高騰対策2025年版】";
const description = "乳牛・肉牛・豚・鶏の頭数別飼料費を無料計算。配合飼料は2020年比40%高騰。自給飼料・補助金活用による飼料費削減の具体策を解説。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("酪農・畜産の飼料コスト計算と削減方法")}&type=blog&category=${encodeURIComponent("農業・畜産")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["酪農 飼料費 計算", "畜産 飼料 高騰 対策", "配合飼料 価格 2025", "乳牛 飼料 コスト", "肉牛 飼料費 計算", "飼料費 削減 方法", "自給飼料 拡大", "畜産 経営 改善"],
  alternates: { canonical: "https://yamada-tools.jp/blog/rakuno-shiryo-cost" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-08", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function RakunoShiryoCostBlog() {
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
            "datePublished": "2025-05-08",
            "dateModified": "2025-05-08",
            "author": { "@type": "Organization", "name": "山田ツール編集部" },
            "publisher": { "@type": "Organization", "name": "合同会社山田トレード", "logo": { "@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp" } },
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/rakuno-shiryo-cost" }
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
              { "@type": "Question", "name": "配合飼料の価格は2020年からどれくらい上がりましたか？", "acceptedAnswer": { "@type": "Answer", "text": "2020年比で約40%上昇しています。ウクライナ紛争による穀物価格高騰と円安が主な原因です。2025年時点でも高止まりが続いており、酪農家・畜産農家の経営を圧迫しています。" } },
              { "@type": "Question", "name": "乳牛1頭あたりの月間飼料費はいくらですか？", "acceptedAnswer": { "@type": "Answer", "text": "泌乳牛1頭あたりの月間飼料費は、配合飼料と粗飼料を合わせて約42,000円/月が目安です（2025年度価格水準）。乾乳牛は約9,000円/月と少なくなります。" } },
              { "@type": "Question", "name": "飼料費削減の最も効果的な方法は何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "最も効果的なのは自給飼料の拡大です。輸入乾草（65,000円/t）から国産WCS（35,000円/t）に切り替えると約46%のコスト削減になります。飼料米の活用（水田活用直接支払い交付金対象）も有効です。" } },
              { "@type": "Question", "name": "配合飼料価格安定制度とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "農畜産業振興機構（ALIC）が運営する制度で、配合飼料価格が一定水準を超えた際に生産者に補填金が支払われます。畜産農家は生産者積立金を積み立てることで、価格高騰時に補填を受けられます。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>酪農・畜産 飼料コスト削減ガイド</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("酪農・畜産の飼料コスト計算と削減方法")}&type=blog&category=${encodeURIComponent("農業・畜産")}`} alt="酪農・畜産飼料コスト計算・削減方法ガイド" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約8分</p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 配合飼料価格の現状（2020年比40%高騰）</li>
          <li>✓ 乳牛・肉牛・豚・鶏の頭数別・月間飼料費の目安</li>
          <li>✓ 乳牛50頭規模の月間・年間飼料費シミュレーション</li>
          <li>✓ 飼料費削減の5つの具体策（自給飼料・飼料米・TMR等）</li>
          <li>✓ 飼料高騰対策の補助金・支援制度の活用方法</li>
          <li>✓ 無料ツールで自農場の月間飼料費を今すぐ計算</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">飼料高騰の現状：2020年から何が変わったか</h2>
        <p className="text-gray-700 mb-4">
          2022年以降、酪農・畜産農家を直撃しているのが<strong className="text-red-600">配合飼料価格の急騰</strong>です。2020年を基準にすると、2025年時点で約40%上昇しており、経営を圧迫する最大要因となっています。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="font-bold text-red-700 mb-2">配合飼料価格上昇</p>
            <p className="text-3xl font-bold text-red-600">+40%</p>
            <p className="text-sm text-gray-600 mt-2">2020年比（2025年度）</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="font-bold text-orange-700 mb-2">酪農家の離農</p>
            <p className="text-3xl font-bold text-orange-600">-6.4%</p>
            <p className="text-sm text-gray-600 mt-2">2023年・前年比戸数減少</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="font-bold text-yellow-700 mb-2">飼料費の割合</p>
            <p className="text-3xl font-bold text-yellow-600">40〜60%</p>
            <p className="text-sm text-gray-600 mt-2">総経費に占める飼料費</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">飼料価格高騰の主な原因</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 rounded p-3">
              <p className="font-bold text-gray-700 mb-1">ウクライナ紛争</p>
              <p className="text-gray-600">ウクライナ・ロシアは世界最大のトウモロコシ・小麦産地。紛争で輸出が激減し世界的な穀物高騰を招いた。</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <p className="font-bold text-gray-700 mb-1">円安の進行</p>
              <p className="text-gray-600">輸入飼料の8割以上をドル建てで購入。円安が進むほど飼料調達コストが上昇する構造。</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <p className="font-bold text-gray-700 mb-1">輸送コスト上昇</p>
              <p className="text-gray-600">海上運賃・燃料費の上昇が輸入飼料のコストに直接影響。コロナ後の物流コスト高止まりが続く。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">畜種別・飼料費の目安（2025年度）</h2>
        <p className="text-gray-700 mb-4">
          畜種・用途によって必要な飼料の種類と量が異なります。以下は<strong className="text-blue-600">2025年度の飼料価格水準</strong>における1頭（羽）あたりの月間飼料費の目安です。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">畜種・用途</th>
                <th className="p-3 text-left">主な飼料</th>
                <th className="p-3 text-center">飼料単価目安</th>
                <th className="p-3 text-center">1頭（羽）/月の飼料費</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["泌乳牛（乳牛）", "配合飼料＋輸入乾草", "配合95,000円/t、乾草65,000円/t", "約42,000円"],
                ["乾乳牛（乳牛）", "配合飼料", "95,000円/t", "約8,600円"],
                ["育成牛（乳牛）", "配合飼料", "95,000円/t", "約8,600円"],
                ["肉牛（肥育）", "配合飼料＋稲わら・乾草", "配合90,000円/t、稲わら30,000円/t", "約35,000円"],
                ["繁殖母牛", "配合飼料＋稲わら", "配合90,000円/t、稲わら30,000円/t", "約24,000円"],
                ["繁殖母豚", "配合飼料（繁殖用）", "75,000円/t", "約5,600円"],
                ["肥育豚", "配合飼料（肥育用）", "75,000円/t", "約5,600円"],
                ["採卵鶏", "配合飼料", "70,000円/t", "約242円"],
              ].map(([type, feed, price, cost], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{type}</td>
                  <td className="p-3 border border-gray-200 text-gray-600">{feed}</td>
                  <td className="p-3 border border-gray-200 text-center text-xs text-gray-600">{price}</td>
                  <td className="p-3 border border-gray-200 text-center text-blue-700 font-bold">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs">※ 上記は概算です。実際の飼料費は給与量・飼料品質・産地・購入方法によって異なります。</p>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">乳牛50頭規模の月間飼料費シミュレーション</h2>
        <p className="text-gray-700 mb-4">
          泌乳牛40頭・乾乳牛10頭の規模を例に、月間飼料費の内訳を計算します。
        </p>

        <div className="bg-white border-2 border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">条件：泌乳牛40頭＋乾乳牛10頭（計50頭）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 border border-blue-500 text-left">費目</th>
                  <th className="p-2 border border-blue-500 text-center">頭数</th>
                  <th className="p-2 border border-blue-500 text-center">1頭/日</th>
                  <th className="p-2 border border-blue-500 text-center">単価/t</th>
                  <th className="p-2 border border-blue-500 text-center">月間費用</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["泌乳牛 配合飼料", "40頭", "8kg", "95,000円", "約912,000円"],
                  ["泌乳牛 輸入乾草", "40頭", "10kg", "65,000円", "約780,000円"],
                  ["乾乳牛 配合飼料", "10頭", "3kg", "95,000円", "約85,500円"],
                  ["乾乳牛 稲わら等", "10頭", "5kg", "30,000円", "約45,000円"],
                ].map(([item, count, daily, price, cost], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200 font-medium">{item}</td>
                    <td className="p-2 border border-gray-200 text-center">{count}</td>
                    <td className="p-2 border border-gray-200 text-center">{daily}</td>
                    <td className="p-2 border border-gray-200 text-center">{price}</td>
                    <td className="p-2 border border-gray-200 text-center font-bold text-blue-700">{cost}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="p-2 border border-gray-200" colSpan={4}>月間飼料費合計</td>
                  <td className="p-2 border border-gray-200 text-center text-xl text-blue-700">約1,822,500円</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-blue-50 rounded p-3 text-center">
              <p className="text-sm text-gray-600">月間飼料費</p>
              <p className="text-xl font-bold text-blue-700">約182万円</p>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <p className="text-sm text-gray-600">年間飼料費</p>
              <p className="text-xl font-bold text-blue-700">約2,187万円</p>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <p className="text-sm text-gray-600">1頭あたり月間</p>
              <p className="text-xl font-bold text-blue-700">約36,450円</p>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-3">※ 上記は概算シミュレーションです。実際の飼料費は給与条件により異なります。</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-bold text-red-800 mb-2">📊 2020年と比較すると…</p>
          <p className="text-gray-700 text-sm">
            同条件で2020年の飼料価格（配合飼料68,000円/t・乾草47,000円/t）で計算すると月間約1,300万円程度。
            現在は<strong>月間約50万円以上の追加コスト</strong>が発生しており、年間では約600万円以上の負担増となっています。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">飼料費削減の5つの具体策</h2>

        <div className="space-y-5 mb-6">
          {[
            {
              num: "1",
              title: "自給飼料の拡大（WCS・稲わら活用）",
              color: "green",
              content: "輸入乾草（65,000円/t）から国産WCS（ホールクロップサイレージ）（35,000円/t）に切り替えると約46%の粗飼料コスト削減になります。耕作放棄地の活用や地域の耕畜連携により調達コストをさらに下げることも可能です。国産WCS生産拡大には農林水産省の「飼料生産基盤強化緊急対策」補助金が活用できます。",
              effect: "粗飼料費 最大46%削減"
            },
            {
              num: "2",
              title: "飼料米の活用",
              color: "yellow",
              content: "水田で生産した飼料米を配合飼料のトウモロコシ代替として活用する方法です。「水田活用の直接支払い交付金」（飼料米作付けで10a当たり最大10.5万円）を受けながら低コスト飼料を調達できます。飼料会社と連携したコントラクト方式も普及しており、専用品種（ホシアオバ等）の活用が有効です。",
              effect: "輸入依存を低減・交付金も受給"
            },
            {
              num: "3",
              title: "TMRセンターの利用",
              color: "blue",
              content: "地域のTMR（完全混合飼料）センターから配合済み飼料を購入することで、個別農家での飼料調合より効率よく低コスト化できます。飼料品質の安定化にも効果があり、哺乳量向上・繁殖成績改善につながります。JAや地域の農業法人が運営するTMRセンターを活用しましょう。",
              effect: "個別調達比5〜15%コスト削減"
            },
            {
              num: "4",
              title: "発酵TMR・コーンサイレージの自家生産",
              color: "purple",
              content: "コーンサイレージ（国産トウモロコシ）の自家生産は、初期投資（播種・収穫機械・サイロ）が必要ですが、長期的には大幅なコスト削減につながります。スラリー・堆肥の圃場還元と組み合わせることで肥料コストも削減でき、資源循環型農業の推進にも貢献します。",
              effect: "長期的に粗飼料費を大幅削減"
            },
            {
              num: "5",
              title: "購買組合・JAのまとめ買い活用",
              color: "orange",
              content: "JA購買や農業協同組合のまとめ買いを活用することで、個別購入より5〜10%安く飼料を調達できる場合があります。近隣農家との共同購入や、年間契約による価格固定も有効な対策です。配合飼料価格安定制度への加入も忘れずに確認しましょう。",
              effect: "購入価格5〜10%削減"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-8 h-8 bg-${item.color}-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0`}>{item.num}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <span className={`text-xs bg-${item.color}-100 text-${item.color}-700 px-2 py-0.5 rounded font-semibold`}>{item.effect}</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">飼料高騰対策の補助金・支援制度</h2>
        <p className="text-gray-700 mb-4">
          飼料高騰に対応した補助金・支援制度を積極的に活用しましょう。申請窓口は農林水産省または都道府県農業改良普及センターです。
        </p>

        <div className="space-y-3 mb-6">
          {[
            {
              name: "配合飼料価格安定制度",
              org: "農畜産業振興機構（ALIC）",
              content: "配合飼料価格が通常価格より上昇した際に補填金が支払われる制度。畜産農家は生産者積立金を積み立てることで加入できます。高騰時に最も直接的な支援となる制度です。"
            },
            {
              name: "畜産・酪農収益力強化整備等特別対策事業",
              org: "農林水産省",
              content: "牛舎・豚舎の改修、TMR機械の導入、自動給餌システムなど生産性向上・コスト削減につながる設備投資に対する補助。1/2〜2/3補助が一般的です。"
            },
            {
              name: "飼料生産基盤強化緊急対策",
              org: "農林水産省",
              content: "国産粗飼料（WCS・コーンサイレージ等）の生産拡大を支援する補助金。作付面積拡大・収穫機械導入・サイロ整備等が対象となります。"
            },
            {
              name: "水田活用の直接支払い交付金",
              org: "農林水産省",
              content: "水田で飼料米・飼料作物を作付けした際の交付金。飼料米は10a当たり最大10.5万円（主食用米並みの収量確保が条件）。酪農・畜産農家との連携で活用できます。"
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{item.org}</span>
              </div>
              <p className="text-gray-700 text-sm">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="font-bold text-yellow-800 mb-2">📞 申請・相談窓口</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・農林水産省 畜産振興課（補助金全般）</li>
            <li>・都道府県農業改良普及センター（地域の実情に応じた支援）</li>
            <li>・JA（農業協同組合）の営農指導員（配合飼料価格安定制度等）</li>
            <li>・農畜産業振興機構（ALIC）（配合飼料価格安定制度）</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">経営改善のための飼料費管理</h2>
        <p className="text-gray-700 mb-4">
          飼料費を適切に管理するには、月次での費用把握と<strong className="text-blue-600">飼料費/売上比率</strong>の定期チェックが不可欠です。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="font-bold text-green-700 mb-2">飼料費/売上比率の目標</p>
            <p className="text-2xl font-bold text-green-600">40%以内</p>
            <p className="text-sm text-gray-600 mt-2">これを超えると経営改善が急務</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="font-bold text-blue-700 mb-2">飼料効率（FCR）の目標</p>
            <p className="text-2xl font-bold text-blue-600">乳牛：1.3以下</p>
            <p className="text-sm text-gray-600 mt-2">飼料kg÷乳量kg</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="font-bold text-orange-700 mb-2">月次チェック頻度</p>
            <p className="text-2xl font-bold text-orange-600">毎月</p>
            <p className="text-sm text-gray-600 mt-2">前月比・前年比で比較</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-3">飼料費管理の実践チェックリスト</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><span className="text-blue-500">□</span> 飼料費の内訳（配合飼料・粗飼料・添加物）を区分して記録しているか</li>
            <li className="flex gap-2"><span className="text-blue-500">□</span> 畜種・用途別（泌乳牛・乾乳牛等）の飼料費を把握しているか</li>
            <li className="flex gap-2"><span className="text-blue-500">□</span> 飼料費/売上比率を月次で計算・記録しているか</li>
            <li className="flex gap-2"><span className="text-blue-500">□</span> 配合飼料価格安定制度に加入しているか</li>
            <li className="flex gap-2"><span className="text-blue-500">□</span> 自給飼料の生産コストを購入飼料と比較検討しているか</li>
            <li className="flex gap-2"><span className="text-blue-500">□</span> 補助金申請のスケジュールを把握しているか</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料ツールで今すぐ飼料費を計算</h2>
        <p className="text-gray-700 mb-6">
          畜種・頭数（羽数）・飼料種別を入力するだけで、月間・年間の飼料費を計算できます。飼料単価の調整機能もあり、価格変動時のシミュレーションにも対応しています。
        </p>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">酪農・畜産 飼料コスト計算機</p>
          <p className="text-sm opacity-90 mb-4">乳牛・肉牛・豚・鶏の頭数と飼料種別から月間・年間飼料費を自動計算。頭あたりコストも表示。</p>
          <Link href="/health/shiryo-cost-calculator" className="inline-block bg-white text-green-700 font-bold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
            今すぐ飼料費を計算する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">農業所得計算機</p>
            <p className="text-sm text-gray-600 mb-3">農業収入・経費・青色申告特別控除から農業所得・所得税を計算。飼料費の削減効果を所得ベースで確認できます。</p>
            <Link href="/health/nogyo-income-calculator" className="text-blue-600 text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">原価率計算機</p>
            <p className="text-sm text-gray-600 mb-3">生乳や食肉の販売価格に対する飼料費などの原価率を計算。適正な販売価格設定に活用できます。</p>
            <Link href="/food/genka-calculator" className="text-blue-600 text-sm font-medium hover:underline">試してみる →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：飼料費管理と削減の重要ポイント</h2>
        <div className="bg-green-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-green-600 font-bold">①</span> 配合飼料は2020年比約40%高騰。飼料費は総経費の40〜60%を占める最重要コスト</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">②</span> 泌乳牛50頭規模で月間飼料費は約182万円・年間約2,187万円（2025年度水準）</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">③</span> 自給飼料拡大（WCS活用）で粗飼料費を最大46%削減可能</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">④</span> 飼料米活用で輸入依存を低減し、水田活用の直接支払い交付金も受給できる</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">⑤</span> 配合飼料価格安定制度・畜産収益力強化補助金を必ず活用する</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">⑥</span> 飼料費/売上比率40%以内を目標に、月次で飼料費を管理・記録する</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/rakuno-shiryo-cost" title={title} />
    </article>
  );
}
