import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "副業の確定申告はいくらから必要？20万円ルール・住民税・経費を完全解説【2025年版】";
const description = "会社員・サラリーマンの副業確定申告を完全解説。20万円ルール、住民税の落とし穴、会社バレ防止、経費の認め方まで。無料の判定ツールで今すぐチェック。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("副業の確定申告はいくらから必要？")}&type=blog&category=${encodeURIComponent("税金・確定申告")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["副業", "確定申告", "20万円ルール", "住民税", "経費", "サラリーマン", "副業バレ"],
  alternates: { canonical: "https://yamada-tools.jp/blog/fukugyou-kakutei-shinkoku" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-07", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function FukugyouKakuteiShinkokuBlog() {
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
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/fukugyou-kakutei-shinkoku" }
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
              { "@type": "Question", "name": "副業収入が20万円以下なら確定申告は完全に不要？", "acceptedAnswer": { "@type": "Answer", "text": "所得税の確定申告は不要ですが、住民税の申告は必要です。20万円以下でも住民税は別途申告しなければならず、これを怠ると後から追徴課税されるリスクがあります。" } },
              { "@type": "Question", "name": "メルカリの売上は副業収入に含まれる？", "acceptedAnswer": { "@type": "Answer", "text": "不用品の売却は原則非課税です。ただし、転売目的で仕入れて販売している場合は事業性ありとみなされ、所得として申告が必要になります。" } },
              { "@type": "Question", "name": "副業を会社にバレないようにするには？", "acceptedAnswer": { "@type": "Answer", "text": "確定申告時に住民税の徴収方法を「普通徴収」に設定することで、副業分の住民税を自分で納付でき、会社の給与天引きに副業分が上乗せされるのを防げます。" } },
              { "@type": "Question", "name": "確定申告しないとどうなる？", "acceptedAnswer": { "@type": "Answer", "text": "無申告加算税（納税額の15〜20%）、延滞税（最大年8.7%）が課されます。悪質な場合は重加算税（35〜40%）の対象にもなります。税務署からの指摘が来てからでは遅いため、早めの申告が重要です。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ai">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-ai">ブログ</Link>
        <span className="mx-2">/</span>
        <span>副業の確定申告完全解説</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("副業の確定申告はいくらから？")}&type=blog&category=${encodeURIComponent("税金・確定申告")}`} alt="副業確定申告完全解説" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約8分</p>

      <div className="bg-gray-50 border-l-4 border-kon p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 副業収入20万円ルールの正確な意味</li>
          <li>✓ 収入と所得の違い（経費を引いた後が「所得」）</li>
          <li>✓ 20万円以下でも住民税申告が必要な理由</li>
          <li>✓ 副業で認められる経費の具体例</li>
          <li>✓ 確定申告しなかった場合のペナルティ</li>
          <li>✓ 会社に副業をバレないようにする方法</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業の確定申告、いくらから必要？結論から解説</h2>
        <p className="text-gray-700 mb-4">
          会社員（給与所得者）の場合、<strong className="text-kon">副業の「所得」が年間20万円を超えると確定申告が必要</strong>になります。これを「20万円ルール」と呼びます。
        </p>
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <p className="font-bold text-yellow-800 mb-2">⚠️ 重要：「収入」ではなく「所得」が基準</p>
          <p className="text-gray-700 text-sm">
            「所得」＝「収入」−「経費」です。たとえば副業で50万円稼いでも、仕入れ代・通信費などの経費が35万円あれば、所得は15万円となり申告不要です。逆に収入が30万円でも経費がゼロなら所得30万円で申告が必要になります。
          </p>
        </div>
        <p className="text-gray-700 mb-4">
          また、勤め先が1か所だけの場合（いわゆる会社員）と、2か所以上から給与をもらっている場合で判断が変わります。2か所以上から給与を受け取っている場合は、メインの会社で年末調整されない給与について、20万円超かどうかに関わらず別途確認が必要です。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-2">✅ 申告不要のケース</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・給与1か所＋副業所得20万円以下</li>
              <li>・副業が赤字または損益ゼロ</li>
              <li>・不用品売却（転売目的でない）</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-bold text-danger mb-2">❗ 申告が必要なケース</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>・副業所得が年間20万円超</li>
              <li>・給与を2か所以上からもらっている</li>
              <li>・医療費控除・住宅ローン控除を受けたい</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業の種類別・確定申告が必要なケース</h2>
        <p className="text-gray-700 mb-4">
          副業の種類によって所得の区分が異なります。それぞれの特徴を把握しておきましょう。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-kon text-white">
                <th className="p-3 text-left">副業の種類</th>
                <th className="p-3 text-left">所得区分</th>
                <th className="p-3 text-left">申告判断基準</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["フリーランス・業務委託", "事業所得または雑所得", "所得20万円超で申告必要"],
                ["アルバイト・パート（掛け持ち）", "給与所得", "年末調整外の給与20万円超"],
                ["メルカリ・せどり・転売", "雑所得", "所得20万円超で申告必要"],
                ["アフィリエイト・YouTube・ブログ", "雑所得または事業所得", "所得20万円超で申告必要"],
                ["FX・仮想通貨（暗号資産）", "雑所得（総合課税）", "所得20万円超で申告必要"],
                ["株式投資（特定口座・源泉徴収あり）", "申告分離課税", "原則申告不要（選択可）"],
              ].map(([type, category, rule], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{type}</td>
                  <td className="p-3 border border-gray-200">{category}</td>
                  <td className="p-3 border border-gray-200">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          ※ フリーランスや業務委託は、帳簿をつけて継続的に行っているなら「事業所得」、そうでなければ「雑所得」に区分されます。事業所得は損益通算や青色申告特別控除（最大65万円）が使えるため有利です。
        </p>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">20万円以下でも確定申告したほうがいいケース</h2>
        <p className="text-gray-700 mb-4">
          副業所得が20万円以下であっても、確定申告をすることで<strong className="text-kon">税金が還付される</strong>ケースがあります。
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-2">① 源泉徴収されている場合</h3>
            <p className="text-gray-700 text-sm">
              アフィリエイト収益や業務委託報酬は、支払い元に10.21%の源泉徴収をされるケースがあります。実際の税率より多く徴収されている場合は確定申告すると還付を受けられます。
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-2">② 医療費控除・住宅ローン控除を受けたい場合</h3>
            <p className="text-gray-700 text-sm">
              医療費が年間10万円超（または所得の5%超）かかった場合や、住宅ローン控除の初年度（年末調整で処理できない）は確定申告が必要です。副業所得の有無に関わらず申告することで節税できます。
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border-l-4 border-danger p-4 mb-6">
          <p className="font-bold text-danger mb-2">🚨 住民税は20万円以下でも別途申告が必要！</p>
          <p className="text-gray-700 text-sm">
            「20万円ルール」は<strong>所得税</strong>の確定申告免除の特例です。<strong>住民税には適用されません。</strong>副業所得が1円でもあれば、翌年3月15日までに市区町村に住民税の申告が必要です。住民税申告を怠ると後から追徴課税されるリスクがあります。ただし、確定申告をした場合はその情報が自動的に住民税にも反映されるため、確定申告さえすれば住民税の別途申告は不要です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業で認められる経費とは？</h2>
        <p className="text-gray-700 mb-4">
          副業にかかった費用は「経費」として所得から差し引けます。経費として認められると課税対象の所得が減り、納税額を抑えられます。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-kon mb-3">フリーランス・業務委託</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>📱 通信費（スマホ・インターネット代）</li>
              <li>📚 書籍代・セミナー受講料</li>
              <li>🚃 交通費（仕事関連の移動）</li>
              <li>💻 PC・周辺機器（仕事用）</li>
              <li>☕ 打ち合わせの飲食代</li>
              <li>🏠 自宅作業スペースの家賃（家事按分）</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-kon mb-3">せどり・転売・ハンドメイド</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🛒 仕入れ代・材料費</li>
              <li>📦 梱包材・段ボール代</li>
              <li>🚚 送料・配送手数料</li>
              <li>💻 販売プラットフォーム利用料</li>
              <li>🏪 仕入れ先への交通費</li>
              <li>📷 商品撮影用の小道具</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-kon mb-3">アフィリエイト・ブログ・YouTube</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🌐 サーバー代・ドメイン代</li>
              <li>🎨 デザインツール（Canvaなど）</li>
              <li>📹 撮影機材・マイク</li>
              <li>📝 ライティングツール・SEOツール</li>
              <li>📱 ソフトウェア・サブスクリプション</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-700 mb-3">家事按分の考え方</h3>
            <p className="text-sm text-gray-700 mb-2">
              自宅で副業をしている場合、家賃・電気代・通信費などを「仕事に使った割合」で按分できます。
            </p>
            <div className="bg-gray-50 rounded p-2 text-sm">
              <p className="font-medium">例）家賃8万円・部屋全体20㎡・作業スペース5㎡</p>
              <p className="text-kon font-bold">経費算入額 = 8万円 × 5/20 = 2万円/月</p>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          ※ 経費として計上するためには、その支出が「副業と関連する」ことを説明できる必要があります。領収書・レシートは最低7年間保管しましょう。
        </p>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">確定申告しないとどうなる？ペナルティを解説</h2>
        <p className="text-gray-700 mb-4">
          確定申告が必要なのに申告しなかった場合、後から税務署に指摘されると本来の税額に加えてペナルティが課されます。
        </p>

        <div className="space-y-3 mb-6">
          {[
            { name: "無申告加算税", rate: "15〜20%", desc: "申告を怠った場合に追加で課される税金。納税額50万円以下なら15%、超える部分は20%。税務署から指摘を受ける前に自主的に申告した場合は5%に軽減。" },
            { name: "延滞税", rate: "最大8.7%/年", desc: "納付期限（3月15日）を過ぎた場合に発生。2か月以内は2.4%、2か月超は8.7%（2024年度）。毎日複利で増えていくため放置するほど金額が膨らみます。" },
            { name: "重加算税", rate: "35〜40%", desc: "仮装・隠蔽など意図的な脱税の場合に課される。過去5〜7年分にさかのぼって調査され、場合によっては刑事告発の対象にもなります。" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-4">
              <div className="min-w-fit">
                <span className="font-bold text-danger text-lg">{item.rate}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">{item.name}</p>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業を会社にバレないようにする方法</h2>
        <p className="text-gray-700 mb-4">
          副業を会社にバレる主なルートは「住民税の金額」です。副業収入がある場合、住民税が高くなり、会社の経理担当者に気づかれることがあります。
        </p>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-kon mb-4 text-lg">普通徴収を選択する方法</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">1</span>
              <p>確定申告書（第二表）の「住民税・事業税に関する事項」欄を確認する</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">2</span>
              <p>「給与から差し引き」ではなく<strong>「自分で納付（普通徴収）」</strong>を選択する</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-kon text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">3</span>
              <p>これにより副業分の住民税が会社の給与天引き（特別徴収）に含まれなくなる</p>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-4">※ ただし、会社が就業規則で副業禁止を定めている場合は、副業自体が問題になる可能性があります。住民税の工夫はあくまで「税務上の手続き」であり、副業自体を隠す方法ではありません。</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">副業確定申告ツールで今すぐ判定</h2>
        <p className="text-gray-700 mb-6">
          自分の副業に確定申告が必要かどうか、複数の副業をまとめて判定できる無料ツールをご用意しています。副業の種類・収入・経費を入力するだけで、申告要否と理由が即座に表示されます。
        </p>

        <div className="bg-gradient-to-r from-slate-900 to-indigo-600 text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">副業 確定申告 必要判定ツール</p>
          <p className="text-sm opacity-90 mb-4">複数の副業をまとめて入力 → 申告要否を即判定。20万円ルール・住民税まで自動チェック。</p>
          <Link href="/finance/fukugyou-shinkoku-checker" className="inline-block bg-white text-kon font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            無料で判定する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">法人化シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">副業収入が増えてきたら法人化で節税。損益分岐点の年収を計算。</p>
            <Link href="/finance/hojinka-simulator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">医療費控除計算機</p>
            <p className="text-sm text-gray-600 mb-3">確定申告のついでに医療費控除も確認。セルフメディケーション税制との比較も。</p>
            <Link href="/finance/iryouhi-koujo-calculator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：副業確定申告の重要ポイント</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-kon font-bold">①</span> 副業の「所得（収入−経費）」が20万円を超えると確定申告が必要</li>
            <li className="flex gap-2"><span className="text-kon font-bold">②</span> 20万円以下でも住民税の申告は別途必要（確定申告すれば一緒に処理される）</li>
            <li className="flex gap-2"><span className="text-kon font-bold">③</span> アフィリエイト・転売・FXなど副業の種類で所得区分が異なる</li>
            <li className="flex gap-2"><span className="text-kon font-bold">④</span> 通信費・書籍代・仕入れ代などは経費として所得から差し引ける</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑤</span> 会社バレを防ぐには確定申告時に「普通徴収」を選択</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑥</span> 無申告は無申告加算税・延滞税のペナルティあり。早めの申告が大切</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/fukugyou-kakutei-shinkoku" title={title} />
    </article>
  );
}
