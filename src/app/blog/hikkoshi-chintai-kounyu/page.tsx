import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "引越し費用の相場と賃貸vs購入を完全比較【2025年最新・無料計算ツール付き】";
const description = "引越し費用の相場を時期・距離・人数別に解説。賃貸と購入どちらが得かも中立シミュレーターで比較。繁忙期を避けて50%節約する方法も。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("引越し費用の相場と賃貸vs購入を完全比較")}&type=blog&category=${encodeURIComponent("生活・住まい")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["引越し費用", "引越し相場", "賃貸 購入", "引越し 節約", "引越し 繁忙期", "賃貸 持ち家", "生涯コスト"],
  alternates: { canonical: "https://yamada-tools.jp/blog/hikkoshi-chintai-kounyu" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-07", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function HikkoshiChintaiKounyuBlog() {
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
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/hikkoshi-chintai-kounyu" }
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
              { "@type": "Question", "name": "引越し費用が一番安い時期はいつ？", "acceptedAnswer": { "@type": "Answer", "text": "5〜8月と11〜2月の閑散期が最も安くなります。特に6月・7月・1月は需要が低く、3〜4月の繁忙期と比べて30〜50%安くなることもあります。さらに平日午後便を選ぶと土日比で10〜20%追加で節約できます。" } },
              { "@type": "Question", "name": "引越し見積もりは何社取れば良い？", "acceptedAnswer": { "@type": "Answer", "text": "最低3社、できれば5社以上から見積もりを取ることを推奨します。一括見積もりサービスを使えば1回の入力で複数社に依頼でき、競合させることで費用が大幅に下がるケースがあります。" } },
              { "@type": "Question", "name": "賃貸と購入、生涯コストはどちらが安い？", "acceptedAnswer": { "@type": "Answer", "text": "一概にどちらが安いとは言えません。購入は固定資産税・修繕費・管理費がかかる一方、賃貸は家賃を払い続けます。一般的に同じ立地・広さなら35年で見た生涯コストは大差ないケースが多いですが、売却益・金利水準・居住年数によって大きく変わります。無料シミュレーターで自分の条件を入力して比較するのが最も正確です。" } },
              { "@type": "Question", "name": "引越し費用の初期費用はどのくらいかかる？", "acceptedAnswer": { "@type": "Answer", "text": "新居の初期費用（敷金・礼金・仲介手数料・前払い家賃）は家賃の4〜6か月分が目安です。家賃10万円なら40〜60万円。これに引越し業者費用が加わるため、一人暮らしでも合計50〜80万円程度は用意しておく必要があります。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ai">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-ai">ブログ</Link>
        <span className="mx-2">/</span>
        <span>引越し費用相場・賃貸vs購入</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("引越し費用の相場と賃貸vs購入")}&type=blog&category=${encodeURIComponent("生活・住まい")}`} alt="引越し費用相場と賃貸vs購入完全比較" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約8分</p>

      <div className="bg-gray-50 border-l-4 border-kon p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 引越し費用の人数・距離・時期別の相場早見表</li>
          <li>✓ 繁忙期（3〜4月）を避けて50%節約する方法</li>
          <li>✓ 引越し費用を安くする7つの具体的テクニック</li>
          <li>✓ 賃貸vs購入、35年間の生涯コスト比較</li>
          <li>✓ どちらが向いているか判断するチェックリスト</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">引越し費用の相場はいくら？人数・距離別に解説</h2>
        <p className="text-gray-700 mb-4">
          引越し費用は<strong className="text-kon">荷物量（家族人数）と移動距離</strong>で大きく変わります。以下の早見表を参考にしてください。金額は繁忙期（3〜4月）を除く通常期（閑散期）の目安です。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-kon text-white">
                <th className="p-3 text-left">家族構成</th>
                <th className="p-3 text-left">同市区内（〜15km）</th>
                <th className="p-3 text-left">近距離（15〜50km）</th>
                <th className="p-3 text-left">遠距離（100km超）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["単身（1人）", "3〜6万円", "5〜10万円", "6〜8万円"],
                ["2人家族", "5〜10万円", "9〜18万円", "13〜25万円"],
                ["3〜4人家族", "8〜15万円", "15〜30万円", "20〜40万円"],
                ["5人以上", "12〜20万円", "20〜40万円", "30〜55万円"],
              ].map(([type, s, m, l], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{type}</td>
                  <td className="p-3 border border-gray-200">{s}</td>
                  <td className="p-3 border border-gray-200">{m}</td>
                  <td className="p-3 border border-gray-200">{l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          ※ 上記は基本的な荷物のみの目安。エアコン取り付け・ピアノ・大型家具がある場合は追加料金が発生します。オプション（梱包サービス・ハウスクリーニング）も含めると1.5〜2倍になる場合があります。
        </p>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
          <p className="font-bold text-yellow-800 mb-2">💡 引越し初期費用の総額目安</p>
          <p className="text-gray-700 text-sm">
            引越し費用だけでなく、新居の<strong>敷金・礼金・仲介手数料・前払い家賃</strong>（家賃4〜6か月分）も必要です。家賃10万円なら初期費用だけで40〜60万円。引越し業者費用も合わせると一人暮らしでも<strong className="text-danger">総額60〜80万円</strong>の用意が必要です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">引越し費用が最も高い・安い時期はいつ？</h2>
        <p className="text-gray-700 mb-4">
          引越し費用は同じ条件でも<strong className="text-kon">時期によって2倍近く変わる</strong>ことがあります。繁忙期を避けるだけで数万円の節約が可能です。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">時期</th>
                <th className="p-3 text-left">費用目安</th>
                <th className="p-3 text-left">主な理由</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["繁忙期（3〜4月）", "通常の1.5〜2倍", "進学・就職・転勤で需要集中"],
                ["準繁忙期（9〜10月）", "通常の1.2〜1.5倍", "転勤・新学期の需要増"],
                ["閑散期（5〜8月）", "最安値水準", "需要が少なく値引き交渉しやすい"],
                ["閑散期（11〜2月）", "最安値水準", "年末年始を除いて需要が低い"],
              ].map(([month, rate, reason], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{month}</td>
                  <td className={`p-3 border border-gray-200 font-bold ${i < 2 ? "text-danger" : "text-green-600"}`}>{rate}</td>
                  <td className="p-3 border border-gray-200">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">3月・4月に引越す場合の実例</h3>
            <p className="text-sm text-gray-700">単身・近距離の引越しが繁忙期は<strong>10〜15万円</strong>になるケースも。閑散期なら同じ条件で<strong>5〜8万円</strong>に抑えられることもあります。差額は5〜7万円以上。</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-700 mb-2">平日 vs 土日の違い</h3>
            <p className="text-sm text-gray-700">同じ月でも<strong>平日は土日より10〜20%安く</strong>なります。特に「午後便」（午後から開始）はトラックの帰り便になるため、さらに格安になることも。</p>
          </div>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">引越し費用を安くする7つの方法</h2>
        <p className="text-gray-700 mb-4">
          知っているだけで数万円節約できるテクニックを7つ紹介します。全部実践すれば<strong className="text-kon">繁忙期でも30〜40%のコスト削減</strong>が可能です。
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              num: "1",
              title: "繁忙期（3〜4月・9〜10月）を避ける",
              desc: "最も効果的な節約法。1〜2か月ずらすだけで同じ業者・距離でも30〜50%安くなることがあります。賃貸契約の開始日を交渉して移動時期を調整するのが理想。",
              color: "blue"
            },
            {
              num: "2",
              title: "平日・午後便を指定する",
              desc: "土日より平日、朝便より午後便（PM便）が安くなります。午後便は前の現場次第で時間が変動しますが、費用は1〜2万円安くなるケースも。",
              color: "blue"
            },
            {
              num: "3",
              title: "3社以上から相見積もりを取る",
              desc: "引越し一括見積もりサービスで複数社を競合させると、最初の見積もりから20〜40%値下がりすることがよくあります。最低3社、できれば5社以上に依頼しましょう。",
              color: "green"
            },
            {
              num: "4",
              title: "梱包を自分で行う",
              desc: "業者の梱包サービスは便利ですが、1〜3万円追加になります。ダンボールは業者からもらい、梱包作業は自分で行うことで節約可能。",
              color: "green"
            },
            {
              num: "5",
              title: "不用品を事前に処分する",
              desc: "荷物が少ないほど費用が下がります。フリマアプリ・粗大ごみ回収・引越し業者の買取サービスを活用して、引越し前に荷物を減らしましょう。",
              color: "green"
            },
            {
              num: "6",
              title: "エアコン・照明の取り外しは自分でできるものを",
              desc: "エアコン脱着は業者に頼むと1台あたり1〜2万円。資格が必要な冷媒回収以外の作業（照明・カーテンレールなど）は自分で対応を。",
              color: "orange"
            },
            {
              num: "7",
              title: "引越しと同時に不用品買取を依頼する",
              desc: "一部の引越し業者は不用品の買取サービスを提供しています。引越し費用から差し引けるケースもあり、実質費用を下げられます。",
              color: "orange"
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4">
              <div className={`bg-${item.color}-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0 text-sm`}>{item.num}</div>
              <div>
                <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">賃貸 vs 購入、生涯コストを中立的に比較</h2>
        <p className="text-gray-700 mb-4">
          「賃貸か購入か」は多くの人が直面する大きな決断です。ここでは<strong className="text-kon">中立的な視点で35年間の生涯コスト</strong>を比較します。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-kon mb-3 text-lg">🏠 賃貸のメリット・デメリット</h3>
            <div className="mb-3">
              <p className="font-semibold text-green-700 mb-1">✅ メリット</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>・転勤・転職に合わせて住み替えやすい</li>
                <li>・修繕・固定資産税の負担なし</li>
                <li>・ライフスタイルの変化に対応しやすい</li>
                <li>・住宅ローンの金利上昇リスクなし</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-danger mb-1">❌ デメリット</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>・老後も家賃を払い続ける</li>
                <li>・資産が残らない</li>
                <li>・高齢になると審査が通りにくくなる</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-kon mb-3 text-lg">🏡 購入のメリット・デメリット</h3>
            <div className="mb-3">
              <p className="font-semibold text-green-700 mb-1">✅ メリット</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>・老後の住居費ゼロに近づける</li>
                <li>・住宅ローン控除（最大455万円）が使える</li>
                <li>・資産として売却・相続できる</li>
                <li>・リフォームが自由にできる</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-danger mb-1">❌ デメリット</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>・固定資産税・修繕費・管理費が継続発生</li>
                <li>・住み替えに手間と費用がかかる</li>
                <li>・売却価格が下がるリスク</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">35年間の生涯コスト試算例</h3>
          <p className="text-gray-600 text-sm mb-4">条件：東京近郊・3LDK・家賃10万円 or 購入価格4,000万円（35年ローン・金利1.5%）</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border border-gray-200">コスト項目</th>
                  <th className="p-3 text-center border border-gray-200">賃貸</th>
                  <th className="p-3 text-center border border-gray-200">購入</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["家賃 / ローン返済", "4,200万円（10万×420か月）", "5,452万円（月13万×420か月）"],
                  ["固定資産税", "なし", "約420万円（年12万×35年）"],
                  ["修繕・管理費", "なし", "約700万円（月2万×35年）"],
                  ["引越し・初期費用", "約50万円（数回分）", "約200万円（諸費用5%）"],
                  ["住宅ローン控除", "なし", "▲最大455万円"],
                  ["合計（目安）", "約4,250万円", "約6,300万円（控除後5,800万円）"],
                ].map(([item, rent, buy], i) => (
                  <tr key={i} className={i === 5 ? "bg-yellow-50 font-bold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200">{item}</td>
                    <td className="p-3 border border-gray-200 text-center">{rent}</td>
                    <td className="p-3 border border-gray-200 text-center">{buy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            ※ 購入の場合、売却価格（残余資産価値）を考慮すると実質コストは大幅に変わります。立地・物件の将来価値次第で「購入が得」になるケースも多くあります。
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-green-800 mb-3">どちらが向いているかチェックリスト</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-kon mb-2">賃貸が向いている人</p>
              <ul className="text-gray-700 space-y-1">
                <li>□ 転勤や転職の可能性がある</li>
                <li>□ 独身またはライフスタイルが変わりやすい</li>
                <li>□ 住む場所を柔軟に変えたい</li>
                <li>□ まとまった頭金が用意できない</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-kon mb-2">購入が向いている人</p>
              <ul className="text-gray-700 space-y-1">
                <li>□ 同じ場所に10年以上住む見込みがある</li>
                <li>□ 家族が固まっており将来の生活が見通せる</li>
                <li>□ 老後の住居費を確定させたい</li>
                <li>□ 資産形成・相続対策を考えている</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料ツールで今すぐ計算</h2>
        <p className="text-gray-700 mb-6">
          実際の引越し費用や賃貸vs購入の比較は、自分の条件を入力してシミュレーションするのが最も正確です。すべて無料・登録不要でご利用いただけます。
        </p>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">引越し費用かんたん計算機</p>
          <p className="text-sm opacity-90 mb-4">人数・距離・時期を入力するだけで引越し費用の目安をすぐ計算。繁忙期割増も自動反映。</p>
          <Link href="/life/hikkoshi-hiyou-calculator" className="inline-block bg-white text-green-700 font-bold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
            引越し費用を計算する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">賃貸vs購入 比較シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">物件価格・家賃・ローン条件を入力して35年間の生涯コストを中立的に比較。損益分岐点（何年で購入が得になるか）も算出。</p>
            <Link href="/realestate/chintai-vs-kounyu" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">仲介手数料計算機</p>
            <p className="text-sm text-gray-600 mb-3">賃貸・売買の仲介手数料の上限額を自動計算。法定上限と実際の請求額を比較できます。</p>
            <Link href="/realestate/chukaishusuryocalculator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：引越し費用と賃貸vs購入の判断基準</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-kon font-bold">①</span> 引越し費用は繁忙期（3〜4月）を避けるだけで30〜50%削減可能</li>
            <li className="flex gap-2"><span className="text-kon font-bold">②</span> 複数社への相見積もりで競合させると20〜40%の値下がりが期待できる</li>
            <li className="flex gap-2"><span className="text-kon font-bold">③</span> 平日午後便＋自分で梱包でさらに1〜3万円節約</li>
            <li className="flex gap-2"><span className="text-kon font-bold">④</span> 賃貸vs購入は35年生涯コストだけでなく「流動性」と「安心感」も考慮する</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑤</span> 10年以上同じ場所に住む見込みがあれば購入の方が有利になるケースが多い</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑥</span> 無料ツールで自分の条件を入力してシミュレーションするのが最も正確</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/hikkoshi-chintai-kounyu" title={title} />
    </article>
  );
}
