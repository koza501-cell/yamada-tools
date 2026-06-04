import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "年金受給額の計算・医療費控除・家計貯蓄シミュレーション完全ガイド【2025年版】";
const description = "老齢年金の受給額を繰上げ・繰下げ別に計算。医療費控除の節税額、毎月の貯蓄目標額も無料ツールで一発計算。老後資金2000万円問題も解説。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("年金受給額の計算・医療費控除・家計貯蓄シミュレーション")}&type=blog&category=${encodeURIComponent("老後・資産形成")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["年金受給額", "繰下げ受給", "繰上げ受給", "医療費控除", "老後資金", "家計貯蓄", "2000万円問題"],
  alternates: { canonical: "https://yamada-tools.jp/blog/nenkin-iryouhi-kakeibo" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-07", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function NenkinIryouhiKakeiboBlog() {
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
            "author": {"@type": "Person", "name": "山田 フェサル", "knowsAbout": ["日本の経理実務", "PDF活用術", "ビジネス効率化", "日本の税務", "不動産情報"]},
            "publisher": { "@type": "Organization", "name": "合同会社山田トレード", "logo": { "@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp" } },
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/nenkin-iryouhi-kakeibo" }
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
              { "@type": "Question", "name": "年金の繰下げ受給は何歳まで得？損益分岐点は？", "acceptedAnswer": { "@type": "Answer", "text": "70歳まで繰下げた場合（月0.7%×60か月=42%増）、65歳受給との累計額が逆転するのは約82歳です。75歳まで繰下げると84%増になりますが、損益分岐点は約87歳になります。平均寿命（男性81歳・女性87歳）を考えると、70歳繰下げが多くの人にとって合理的な選択です。" } },
              { "@type": "Question", "name": "医療費控除は年間いくらから申告できる？", "acceptedAnswer": { "@type": "Answer", "text": "医療費控除は、年間の医療費合計から保険金補填額を引き、さらに10万円（または所得の5%の低い方）を差し引いた金額が控除額になります。つまり医療費が10万円を超えた分から控除でき、年収が少ない場合（所得200万円未満）は所得の5%超から控除できます。" } },
              { "@type": "Question", "name": "老後資金2000万円問題は本当？", "acceptedAnswer": { "@type": "Answer", "text": "2019年に金融庁が示した試算はモデルケース（夫65歳・妻60歳の無職世帯）で月約5万円の赤字が30年続くと約2,000万円不足するというものです。実際の必要額は受給年金額・生活スタイル・住居費によって大きく異なります。自分の年金受給見込みと生活費から試算することが重要です。" } },
              { "@type": "Question", "name": "セルフメディケーション税制と医療費控除はどちらが得？", "acceptedAnswer": { "@type": "Answer", "text": "年間の対象OTC薬購入額から1.2万円を引いた額がセルフメディケーション税制の控除額（上限8.8万円）です。医療費控除と選択適用のため、年間医療費が10万円に届かない場合でも特定OTC薬を多く購入しているならセルフメディケーション税制が有利なことがあります。具体的にはOTC薬費用が1.2万円を超えるかどうかで判断します。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ai">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-ai">ブログ</Link>
        <span className="mx-2">/</span>
        <span>年金・医療費控除・家計貯蓄ガイド</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("年金受給額・医療費控除・家計貯蓄")}&type=blog&category=${encodeURIComponent("老後・資産形成")}`} alt="年金受給額計算・医療費控除・家計貯蓄完全ガイド" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約9分</p>

      <div className="bg-gray-50 border-l-4 border-kon p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 老齢年金（基礎年金＋厚生年金）の計算方法と具体例</li>
          <li>✓ 繰上げ・繰下げ受給の損益分岐点（何歳で逆転するか）</li>
          <li>✓ 医療費控除でいくら節税できるか具体的な計算例</li>
          <li>✓ セルフメディケーション税制との比較・どちらが得か</li>
          <li>✓ 老後資金2000万円を月いくら積み立てれば達成できるか</li>
          <li>✓ 家計の貯蓄率診断と目標別積立計算</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">老齢年金はいくらもらえる？計算方法を解説</h2>
        <p className="text-gray-700 mb-4">
          老齢年金は<strong className="text-kon">老齢基礎年金（国民年金）</strong>と<strong className="text-kon">老齢厚生年金</strong>の2階建て構造です。それぞれの計算方法を確認しましょう。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-kon mb-3">1階：老齢基礎年金（国民年金）</h3>
            <div className="bg-white rounded p-3 mb-3 text-sm">
              <p className="font-semibold mb-1">満額 = 816,000円/年（2024年度）</p>
              <p className="text-gray-600">実際の受給額 = 満額 × 保険料納付月数 ÷ 480か月</p>
            </div>
            <p className="text-sm text-gray-700">40年間（480か月）すべて納付した場合に満額。未納・猶予月数があれば減額されます。</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">2階：老齢厚生年金</h3>
            <div className="bg-white rounded p-3 mb-3 text-sm">
              <p className="font-semibold mb-1">年額 = 平均標準報酬月額 × 5.481 ÷ 1000 × 加入月数</p>
              <p className="text-gray-600 text-xs">※2003年4月以降加入分の計算式（旧計算式と加重平均）</p>
            </div>
            <p className="text-sm text-gray-700">会社員・公務員のみが対象。収入が高く加入期間が長いほど多くもらえます。</p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">具体例：会社員30年（平均月収35万円）の場合</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600">老齢基礎年金</span>
              <span className="font-bold">816,000円 × 360 ÷ 480 = <span className="text-kon">612,000円/年</span></span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600">老齢厚生年金</span>
              <span className="font-bold">350,000 × 5.481 ÷ 1,000 × 360 = <span className="text-green-600">690,606円/年</span></span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 rounded p-2">
              <span className="font-bold text-gray-800">合計受給額</span>
              <span className="text-xl font-bold text-kon">約1,302,606円/年（約108,000円/月）</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-3">※ 上記は概算です。実際の受給額はねんきん定期便またはねんきんネットで確認できます。</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
          <p className="font-bold text-yellow-800 mb-2">📋 ねんきん定期便の見方</p>
          <p className="text-gray-700 text-sm">
            毎年誕生日月に届く「ねんきん定期便」に記載の「老齢年金の見込み額」を確認してください。35歳・45歳・59歳の節目には直近の加入実績に基づく詳細版が届きます。オンラインでは「ねんきんネット」（<span className="text-kon">nenkin.go.jp</span>）で最新の見込み額を確認できます。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">繰上げ・繰下げ受給どちらが得？損益分岐点を計算</h2>
        <p className="text-gray-700 mb-4">
          年金は通常65歳から受給しますが、<strong className="text-kon">受給開始時期を変えることで毎月の受給額が変わります</strong>。繰下げると増額、繰上げると減額になります。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">受給開始年齢</th>
                <th className="p-3 text-center">増減率</th>
                <th className="p-3 text-center">月10万円の場合</th>
                <th className="p-3 text-center">65歳との損益分岐点</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["60歳（繰上げ最大）", "▲24%", "76,000円/月", "—（65歳より常に少ない）"],
                ["62歳（繰上げ）", "▲14.4%", "85,600円/月", "—"],
                ["65歳（通常）", "±0%", "100,000円/月", "基準"],
                ["68歳（繰下げ）", "+25.2%", "125,200円/月", "約80歳"],
                ["70歳（繰下げ）", "+42%", "142,000円/月", "約82歳"],
                ["75歳（繰下げ最大）", "+84%", "184,000円/月", "約87歳"],
              ].map(([age, rate, amt, breakeven], i) => (
                <tr key={i} className={
                  i === 2 ? "bg-gray-50 font-semibold" :
                  i < 2 ? "bg-gray-50" :
                  i === 4 ? "bg-green-50" :
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }>
                  <td className="p-3 border border-gray-200">{age}</td>
                  <td className={`p-3 border border-gray-200 text-center font-bold ${i < 2 ? "text-danger" : i > 2 ? "text-green-600" : ""}`}>{rate}</td>
                  <td className="p-3 border border-gray-200 text-center">{amt}</td>
                  <td className="p-3 border border-gray-200 text-center text-gray-600">{breakeven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2">繰下げが有利な人</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・健康状態が良く長生きが見込まれる</li>
              <li>・65〜70歳の生活費が年金以外で賄える</li>
              <li>・就労継続や資産取り崩しで生活できる</li>
              <li>・家族に長寿が多い</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">繰上げが有利な人（or繰下げに注意）</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・持病があり平均寿命より短命が見込まれる</li>
              <li>・65〜70歳の生活費がひっ迫している</li>
              <li>・配偶者の遺族年金を考慮する必要がある</li>
              <li>・在職老齢年金で支給停止になる所得がある</li>
            </ul>
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          ※ 繰上げ受給すると障害年金の請求権を失うデメリットもあります。また、繰下げ中に死亡した場合は未受給分が5年分まで一括支給（死亡一時金的扱い）されますが、超過分は受け取れません。家族・健康状態を総合的に考慮して決断しましょう。
        </p>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">医療費控除でいくら節税できる？計算方法</h2>
        <p className="text-gray-700 mb-4">
          年間の医療費が一定額を超えると、確定申告で<strong className="text-kon">医療費控除</strong>を受けられます。意外と見落とされがちな節税手段です。
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-kon mb-3">医療費控除の計算式</h3>
          <div className="bg-white rounded-lg p-4 text-sm">
            <p className="font-bold text-lg text-kon mb-2">控除額 = 医療費合計 − 保険金補填 − 10万円（または所得の5%の低い方）</p>
            <p className="text-gray-600">※ 控除額の上限は200万円</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-700 mb-2">✅ 対象となる医療費</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・病院・歯科の治療費・診察料</li>
              <li>・処方された薬代（医師の処方箋）</li>
              <li>・通院交通費（電車・バス）</li>
              <li>・入院費（差額ベッド代は一部除外）</li>
              <li>・出産費用（正常分娩含む）</li>
              <li>・介護サービス費（医療系サービス）</li>
              <li>・歯科矯正（機能的な問題がある場合）</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">❌ 対象外の医療費</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・健康食品・サプリメント</li>
              <li>・美容目的の手術・医療（美容整形など）</li>
              <li>・人間ドック（異常が見つかった場合は対象）</li>
              <li>・インフルエンザ等の予防接種（通常）</li>
              <li>・近視のコンタクト・メガネ（診療目的除く）</li>
              <li>・疾病予防・健康維持のための費用</li>
            </ul>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">具体例：医療費控除の節税額計算</h3>
          <p className="text-gray-600 text-sm mb-4">条件：年間医療費30万円・保険金補填5万円・課税所得400万円（所得税20%・住民税10%）</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span>控除額 = 30万 − 5万（補填） − 10万（基準額）</span>
              <span className="font-bold">= 15万円</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span>所得税節税 = 15万円 × 20%</span>
              <span className="font-bold text-kon">= 30,000円</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span>住民税節税 = 15万円 × 10%</span>
              <span className="font-bold text-kon">= 15,000円</span>
            </div>
            <div className="flex justify-between bg-gray-50 rounded p-2 mt-2">
              <span className="font-bold">合計節税額</span>
              <span className="font-bold text-kon text-lg">45,000円</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">セルフメディケーション税制とどちらが得？</h2>
        <p className="text-gray-700 mb-4">
          2017年に始まった<strong className="text-kon">セルフメディケーション税制</strong>は、医療費控除の特例として、市販薬（特定OTC医薬品）の購入費用を控除できる制度です。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">比較項目</th>
                <th className="p-3 text-center">医療費控除</th>
                <th className="p-3 text-center">セルフメディケーション税制</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["控除対象", "病院・歯科等の医療費", "特定OTC医薬品（指定薬）"],
                ["最低控除ライン", "医療費10万円超（or所得の5%）", "OTC薬1.2万円超"],
                ["控除上限", "200万円", "8.8万円"],
                ["適用条件", "特になし", "健康診断・予防接種等を受けていること"],
                ["両方の適用", "不可（どちらかを選択）", "不可（どちらかを選択）"],
              ].map(([item, a, b], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{item}</td>
                  <td className="p-3 border border-gray-200 text-center">{a}</td>
                  <td className="p-3 border border-gray-200 text-center">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="font-bold text-green-800 mb-2">💡 どちらが得かの判断基準</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・<strong>年間医療費が10万円以上</strong>かつ多い → 医療費控除が有利（控除額が大きい）</li>
            <li>・<strong>医療費が10万円未満</strong>だが特定OTC薬を1.2万円以上購入 → セルフメディケーション税制が有利</li>
            <li>・OTC薬購入額が少ない・医療費も少ない → どちらも大差ない</li>
          </ul>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">老後資金2000万円問題と毎月の貯蓄目標</h2>
        <p className="text-gray-700 mb-4">
          2019年に話題になった「老後2000万円問題」。実際に必要な金額と、今から積み立てる場合の<strong className="text-kon">月々の目標額</strong>を試算します。
        </p>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <p className="font-bold text-yellow-800 mb-2">📊 2000万円問題の実態</p>
          <p className="text-gray-700 text-sm">
            金融庁の試算はモデルケース（夫65歳無職・妻60歳無職）で<strong>月5.5万円の収支赤字が30年続くと約2,000万円不足</strong>するというものです。これはあくまで一つのモデルであり、実際の必要額は年金受給額・生活費・住居費・医療費によって個人差があります。自分の年金見込み額と生活費から計算することが重要です。
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">2000万円を貯めるための月積立額</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-kon text-white">
                  <th className="p-2 border border-kon text-left">現在の年齢</th>
                  <th className="p-2 border border-kon text-center">65歳まで</th>
                  <th className="p-2 border border-kon text-center">貯蓄のみ（0%）</th>
                  <th className="p-2 border border-kon text-center">年利3%運用</th>
                  <th className="p-2 border border-kon text-center">年利5%運用</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["25歳", "40年", "41,667円", "24,364円", "14,679円"],
                  ["30歳", "35年", "47,619円", "29,619円", "19,364円"],
                  ["35歳", "30年", "55,556円", "37,161円", "26,011円"],
                  ["40歳", "25年", "66,667円", "47,891円", "35,846円"],
                  ["45歳", "20年", "83,333円", "64,615円", "52,196円"],
                  ["50歳", "15年", "111,111円", "93,297円", "80,237円"],
                ].map(([age, years, a, b, c], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200 font-medium">{age}</td>
                    <td className="p-2 border border-gray-200 text-center text-gray-500">{years}</td>
                    <td className="p-2 border border-gray-200 text-center">{a}</td>
                    <td className="p-2 border border-gray-200 text-center text-kon font-semibold">{b}</td>
                    <td className="p-2 border border-gray-200 text-center text-green-600 font-semibold">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs mt-2">※ 複利計算。NISAやiDeCoを活用した場合の実質税引後利回りを想定。</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="font-bold text-kon mb-2">貯蓄率の目安</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded p-3 text-center">
              <p className="font-bold text-gray-700">手取りの20%以上</p>
              <p className="text-green-600 font-bold">理想的</p>
              <p className="text-gray-500 text-xs">老後資金＋緊急資金の積立が可能</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="font-bold text-gray-700">手取りの10〜20%</p>
              <p className="text-kon font-bold">標準的</p>
              <p className="text-gray-500 text-xs">老後資金の積立は可能</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="font-bold text-gray-700">手取りの10%未満</p>
              <p className="text-danger font-bold">要改善</p>
              <p className="text-gray-500 text-xs">固定費の見直しが急務</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">家計の貯蓄ができているか診断</h2>
        <p className="text-gray-700 mb-4">
          貯蓄ができない原因は多くの場合、<strong className="text-kon">支出の構造的な問題</strong>にあります。以下のチェックポイントで自分の家計を診断してみてください。
        </p>

        <div className="space-y-3 mb-6">
          {[
            {
              check: "緊急資金（生活費6か月分）が確保できているか",
              ok: "Yes → 次のステップへ",
              ng: "No → まずここから。毎月の積立で先に確保"
            },
            {
              check: "固定費（家賃・通信費・保険・サブスク）が手取りの40%以内か",
              ok: "Yes → 変動費の見直しへ",
              ng: "No → 固定費削減が最優先。1,000円の固定費削減は年間12,000円の効果"
            },
            {
              check: "毎月の収支がプラスか（収入>支出）",
              ok: "Yes → 余剰資金を運用へ",
              ng: "No → 変動費（食費・外食・娯楽）の見直しが必要"
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-2">Check {i + 1}: {item.check}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-green-50 rounded p-2">
                  <span className="text-green-600 font-bold">✅ </span>{item.ok}
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <span className="text-danger font-bold">❌ </span>{item.ng}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料ツールで今すぐシミュレーション</h2>
        <p className="text-gray-700 mb-6">
          年金・医療費控除・家計貯蓄はすべて自分の数字を入れてシミュレーションするのが最も正確です。以下の無料ツールで今すぐ確認できます。
        </p>

        <div className="bg-gradient-to-r from-slate-900 to-kon text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">年金受給額シミュレーター</p>
          <p className="text-sm opacity-90 mb-4">生年月日・職業・平均収入を入力すると老齢年金の概算受給額を計算。繰上げ・繰下げ別の損益分岐点も表示。</p>
          <Link href="/finance/nenkin-simulator" className="inline-block bg-white text-kon font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            年金額を試算する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">医療費控除計算機</p>
            <p className="text-sm text-gray-600 mb-3">年間医療費・保険補填・所得を入力して控除額と節税額を即計算。セルフメディケーション税制との比較も。</p>
            <Link href="/finance/iryouhi-koujo-calculator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">家計貯蓄シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">収入・支出・目標金額を入力して、何年で目標達成できるか計算。毎月の積立目標額も算出。</p>
            <Link href="/life/kakeibo-simulator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">iDeCo・NISA節税計算機</p>
            <p className="text-sm text-gray-600 mb-3">老後資金を効率的に積み立てるiDeCo・NISAの節税効果と運用シミュレーション。</p>
            <Link href="/finance/ideco-nisa-calculator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：年金・医療費控除・家計管理の重要ポイント</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-kon font-bold">①</span> 年金は「基礎年金＋厚生年金」の2階建て。加入期間と平均収入で受給額が決まる</li>
            <li className="flex gap-2"><span className="text-kon font-bold">②</span> 70歳まで繰下げると42%増額。損益分岐点は82歳（健康なら繰下げが有利）</li>
            <li className="flex gap-2"><span className="text-kon font-bold">③</span> 医療費控除は年間10万円超から申告可能。30万円の医療費で約4.5万円の節税効果</li>
            <li className="flex gap-2"><span className="text-kon font-bold">④</span> セルフメディケーション税制は医療費が少ない人向け。1.2万円超のOTC薬購入で適用可</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑤</span> 老後2000万円は35歳からなら月3.7万円（年利3%）の積立で達成可能</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑥</span> 貯蓄率20%以上を目標に。固定費削減が最も効果的な節約手段</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/nenkin-iryouhi-kakeibo" title={title} />
    </article>
  );
}
