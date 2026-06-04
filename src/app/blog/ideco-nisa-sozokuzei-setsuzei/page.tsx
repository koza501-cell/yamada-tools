import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "iDeCo・NISA・相続税・法人化の節税を完全解説【無料シミュレーターで計算】";
const description = "iDeCoで年間最大27万円節税、NISAで非課税運用、相続税の基礎控除計算、法人化の損益分岐点まで。日本一わかりやすく解説。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("iDeCo・NISA・相続税・法人化の節税完全解説")}&type=blog&category=${encodeURIComponent("資産運用・節税")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["iDeCo", "NISA", "相続税", "法人化", "節税", "資産運用", "フリーランス", "個人事業主"],
  alternates: { canonical: "https://yamada-tools.jp/blog/ideco-nisa-sozokuzei-setsuzei" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-07", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function IdecoNisaSozokuzeiSetsuzei() {
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
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/ideco-nisa-sozokuzei-setsuzei" }
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
              { "@type": "Question", "name": "iDeCoとNISA、どちらを先に始めるべき？", "acceptedAnswer": { "@type": "Answer", "text": "まずiDeCoがおすすめです。掛金が全額所得控除になるため、現在の税負担を直接下げられます。NISAは運用益の非課税が主なメリットで投資余力がある場合に追加で活用しましょう。どちらも早く始めるほど複利効果が高まります。" } },
              { "@type": "Question", "name": "相続税がかかるかどうかはどう判断する？", "acceptedAnswer": { "@type": "Answer", "text": "遺産総額が「3,000万円＋600万円×法定相続人数」の基礎控除額を超えた場合に相続税がかかります。たとえば法定相続人が3人なら基礎控除は4,800万円です。これを超えた部分に10〜55%の税率が適用されます。" } },
              { "@type": "Question", "name": "個人事業主の法人化はいくらから得？", "acceptedAnswer": { "@type": "Answer", "text": "一般的な目安は年収（売上）700万〜1,000万円超です。法人税率は実効税率約33%であるのに対し、個人の所得税は累進課税で最高45%。さらに役員報酬・経費の幅が広がるため、高所得ほど節税効果が大きくなります。" } },
              { "@type": "Question", "name": "iDeCoの60歳まで引き出せないデメリットはどう考えるべき？", "acceptedAnswer": { "@type": "Answer", "text": "生活費の緊急資金（3〜6か月分）を別途確保した上でiDeCoに拠出するのが基本です。NISAは引き出し制限がないため、中期の資金もNISAで運用し、長期の老後資金はiDeCoに分けて考えると安心です。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ai">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-ai">ブログ</Link>
        <span className="mx-2">/</span>
        <span>iDeCo・NISA・相続税・法人化節税解説</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("iDeCo・NISA・相続税・法人化の節税")}&type=blog&category=${encodeURIComponent("資産運用・節税")}`} alt="節税完全解説" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約10分</p>

      <div className="bg-gray-50 border-l-4 border-kon p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ iDeCoの節税効果（年収別の節税額早見表）</li>
          <li>✓ NISAとiDeCoの違いと優先順位</li>
          <li>✓ 相続税の基礎控除の計算方法と対策</li>
          <li>✓ 個人事業主・フリーランスの法人化の損益分岐点</li>
          <li>✓ 各節税を無料シミュレーターで計算する方法</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">iDeCo（個人型確定拠出年金）の節税効果は？</h2>
        <p className="text-gray-700 mb-4">
          iDeCoは老後資金を積み立てながら節税できる制度です。最大の特徴は<strong className="text-kon">掛金が全額「所得控除」になること</strong>。つまり今年払う所得税と住民税を直接減らせます。
        </p>

        <div className="bg-white border-2 border-kon rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">職業別のiDeCo掛金上限（月額）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-kon text-white">
                  <th className="p-2 text-left">職業・状況</th>
                  <th className="p-2 text-center">月額上限</th>
                  <th className="p-2 text-center">年間上限</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["自営業・フリーランス（国民年金第1号）", "68,000円", "816,000円"],
                  ["会社員（企業年金なし）", "23,000円", "276,000円"],
                  ["会社員（企業型DC加入）", "20,000円", "240,000円"],
                  ["会社員（確定給付年金のみ）", "12,000円", "144,000円"],
                  ["公務員", "12,000円", "144,000円"],
                  ["専業主婦・夫（国民年金第3号）", "23,000円", "276,000円"],
                ].map(([type, monthly, yearly], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200">{type}</td>
                    <td className="p-2 border border-gray-200 text-center font-bold">{monthly}</td>
                    <td className="p-2 border border-gray-200 text-center text-kon font-bold">{yearly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">年収別の節税効果早見表（会社員・月2.3万円拠出の場合）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="p-2 text-center">年収</th>
                  <th className="p-2 text-center">所得税率</th>
                  <th className="p-2 text-center">年間掛金</th>
                  <th className="p-2 text-center">年間節税額（目安）</th>
                  <th className="p-2 text-center">20年間の節税総額</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["400万円", "10%", "27.6万円", "約5.5万円", "約110万円"],
                  ["600万円", "20%", "27.6万円", "約8.3万円", "約166万円"],
                  ["800万円", "23%", "27.6万円", "約9.1万円", "約182万円"],
                  ["1,000万円", "33%", "27.6万円", "約11.9万円", "約238万円"],
                ].map(([income, rate, kakkin, saving, total], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200 text-center font-bold">{income}</td>
                    <td className="p-2 border border-gray-200 text-center">{rate}</td>
                    <td className="p-2 border border-gray-200 text-center">{kakkin}</td>
                    <td className="p-2 border border-gray-200 text-center text-green-700 font-bold">{saving}</td>
                    <td className="p-2 border border-gray-200 text-center text-kon font-bold">{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">※ 住民税10%を含めた試算。実際の節税額は給与所得控除・各種控除によって異なります。</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="font-bold text-yellow-800 mb-2">⚠️ iDeCoのデメリット：60歳まで引き出せない</p>
          <p className="text-sm text-gray-700">
            iDeCoは原則60歳になるまで資金を引き出せません。生活費の緊急資金（3〜6か月分）は別途確保した上で拠出額を決めましょう。また、受け取り時にも退職所得控除や公的年金等控除が使えますが、他の退職金との調整が必要な場合があります。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">NISAと非課税運用のメリット</h2>
        <p className="text-gray-700 mb-4">
          NISAは運用益・配当が非課税になる制度です。通常、株式や投資信託の利益には20.315%の税金がかかりますが、NISA口座内では0%になります。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-kon mb-2">つみたて投資枠</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>年間上限：<strong>120万円</strong></li>
              <li>対象：長期・積立・分散投資向けの投資信託</li>
              <li>非課税保有期間：無期限</li>
              <li>向いている人：長期コツコツ積立派</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-indigo-700 mb-2">成長投資枠</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>年間上限：<strong>240万円</strong></li>
              <li>対象：上場株式・投資信託など幅広い</li>
              <li>非課税保有期間：無期限</li>
              <li>向いている人：個別株・ETFも活用したい人</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-kon mb-2">20年間運用のシミュレーション例（年率5%想定）</h3>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            {[
              { label: "月3万円積立", amount: "約1,233万円", total: "元本720万円", gain: "運用益+513万円" },
              { label: "月5万円積立", amount: "約2,055万円", total: "元本1,200万円", gain: "運用益+855万円" },
              { label: "月10万円積立", amount: "約4,110万円", total: "元本2,400万円", gain: "運用益+1,710万円" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-bold text-kon mb-1">{item.label}</p>
                <p className="text-xl font-bold text-gray-800 mb-1">{item.amount}</p>
                <p className="text-xs text-gray-500">{item.total}</p>
                <p className="text-xs text-green-600 font-medium">{item.gain}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">※ 年率5%は試算用。実際の運用成績は市場環境によって異なります。</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-bold text-gray-800 mb-2">iDeCoとNISA、どちらを優先するべきか</p>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong className="text-kon">iDeCo優先ケース：</strong>所得税率が高い（年収600万円超）・老後資金を確実に貯めたい・会社員で掛金上限が使いきれていない</p>
            <p><strong className="text-kon">NISA優先ケース：</strong>いつでも引き出せる資金が必要・投資初心者でシンプルに始めたい・専業主婦など所得税がかからない</p>
            <p>余裕があれば<strong>iDeCo＋NISAの両方を活用</strong>するのが最善策です。</p>
          </div>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">相続税はいくらからかかる？基礎控除の計算</h2>
        <p className="text-gray-700 mb-4">
          「うちは財産が少ないから相続税は関係ない」と思っている方も多いですが、土地の相続を含む場合は想定以上の課税になるケースがあります。
        </p>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">相続税の基礎控除の計算式</h3>
          <div className="bg-gray-50 rounded p-4 text-center mb-4">
            <p className="text-xl font-bold text-kon">基礎控除 = 3,000万円 + 600万円 × 法定相続人数</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
            {[
              { people: "相続人1人", amount: "3,600万円" },
              { people: "相続人2人", amount: "4,200万円" },
              { people: "相続人3人", amount: "4,800万円" },
              { people: "相続人4人", amount: "5,400万円" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded p-2">
                <p className="text-gray-600 text-xs mb-1">{item.people}</p>
                <p className="font-bold text-kon">{item.amount}</p>
                <p className="text-xs text-gray-500">まで非課税</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">相続税の税率表（法定相続分に応じた取得金額）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-kon text-white">
                  <th className="p-2 text-left">取得金額</th>
                  <th className="p-2 text-center">税率</th>
                  <th className="p-2 text-center">控除額</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1,000万円以下", "10%", "—"],
                  ["3,000万円以下", "15%", "50万円"],
                  ["5,000万円以下", "20%", "200万円"],
                  ["1億円以下", "30%", "700万円"],
                  ["2億円以下", "40%", "1,700万円"],
                  ["3億円以下", "45%", "2,700万円"],
                  ["6億円以下", "50%", "4,200万円"],
                  ["6億円超", "55%", "7,200万円"],
                ].map(([range, rate, deduct], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200">{range}</td>
                    <td className="p-2 border border-gray-200 text-center font-bold text-kon">{rate}</td>
                    <td className="p-2 border border-gray-200 text-center">{deduct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-800 mb-1">配偶者の税額軽減（最大1.6億円まで非課税）</p>
            <p className="text-sm text-gray-700">配偶者が相続する場合、法定相続分または1億6,000万円のいずれか多い金額まで相続税がかかりません。ただし二次相続（配偶者が亡くなった際）で子どもの税負担が増えることも考慮が必要です。</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-kon mb-1">年間110万円の暦年贈与による生前対策</p>
            <p className="text-sm text-gray-700">贈与税の基礎控除は年間110万円。毎年この範囲内で子ども・孫に贈与することで、長期的に相続財産を圧縮できます。ただし2024年から持ち戻し期間が3年→7年に延長されました。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">個人事業主が法人化すべき年収の目安</h2>
        <p className="text-gray-700 mb-4">
          フリーランス・個人事業主として収入が増えてくると、「そろそろ法人化した方が得では？」と考えるタイミングが来ます。法人化の節税効果の仕組みを理解しましょう。
        </p>

        <div className="bg-white border-2 border-indigo-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">個人 vs 法人の税率比較</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded p-4">
              <p className="font-bold text-danger mb-2">個人（所得税）</p>
              <p className="text-sm text-gray-700">累進課税：195万円超で5%〜、4,000万円超で<strong className="text-danger">45%</strong></p>
              <p className="text-sm text-gray-700 mt-1">＋住民税10%、個人事業税最大5%</p>
              <p className="text-sm font-bold text-danger mt-2">実質最大60%程度</p>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <p className="font-bold text-kon mb-2">法人（法人税等）</p>
              <p className="text-sm text-gray-700">法人税率（中小企業）：800万円以下の部分は<strong className="text-kon">15%</strong></p>
              <p className="text-sm text-gray-700 mt-1">法人実効税率：約33〜34%</p>
              <p className="text-sm font-bold text-kon mt-2">実質約33〜35%</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm">年収が高くなるほど個人と法人の税率差が広がり、法人化による節税効果が大きくなります。一般的な損益分岐点の目安は<strong className="text-indigo-700">年収700万〜1,000万円</strong>です。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-green-700 mb-2">法人化のメリット</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ 配偶者に役員報酬を払って所得分散</li>
              <li>✅ 社宅・出張旅費・福利厚生費が経費に</li>
              <li>✅ 退職金制度（中小企業退職金共済）の活用</li>
              <li>✅ 社会的信用の向上（取引先・金融機関）</li>
              <li>✅ 赤字を10年間繰り越せる（個人は3年）</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-danger mb-2">法人化のデメリット</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>❌ 設立費用（株式会社で約25万円、合同会社で約10万円）</li>
              <li>❌ 毎年の維持費（税理士費用・法人住民税均等割）</li>
              <li>❌ 社会保険への強制加入（役員も含む）</li>
              <li>❌ 会計・税務の複雑化</li>
              <li>❌ 赤字でも法人住民税（最低7万円/年）がかかる</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="font-bold text-indigo-800 mb-2">節税テクニック：配偶者を役員にして所得分散</p>
          <p className="text-sm text-gray-700">
            法人化後に配偶者を役員として役員報酬を支払うと、所得が分散されて世帯全体の税率が下がります。例えば自分の役員報酬700万円より、夫婦で500万円＋200万円に分けた方が所得税の累進課税の影響を抑えられます。ただし役員報酬は「不相当に高額」でないことが条件です。
          </p>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料シミュレーターで今すぐ計算</h2>
        <p className="text-gray-700 mb-6">
          節税の効果は個人の年収・家族構成・資産状況によって大きく異なります。以下の無料ツールで自分の状況を数字で確認しましょう。
        </p>

        <div className="bg-gradient-to-r from-slate-900 to-indigo-600 text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">iDeCo・NISA シミュレーター</p>
          <p className="text-sm opacity-90 mb-4">年収・掛金・運用期間を入力するだけで節税額と将来の資産額を試算。</p>
          <Link href="/finance/ideco-nisa-calculator" className="inline-block bg-white text-kon font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            無料でシミュレーション →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">相続税シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">遺産総額・法定相続人数を入力して相続税の概算を計算。基礎控除との比較も。</p>
            <Link href="/finance/sozokuzei-simulator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">法人化シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">現在の年収から法人化した場合の節税額と損益分岐点を計算。</p>
            <Link href="/finance/hojinka-simulator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">年金受給額シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">繰上げ・繰下げ受給の損益分岐点。iDeCoとの組み合わせ戦略に。</p>
            <Link href="/finance/nenkin-simulator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">家計簿貯蓄シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">毎月の貯蓄可能額と目標達成年を計算。iDeCo・NISAの積立計画に。</p>
            <Link href="/life/kakeibo-simulator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：節税4本柱のポイント</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-kon font-bold">①</span> iDeCoは掛金が全額所得控除。年収600万円なら年間8万円以上の節税効果</li>
            <li className="flex gap-2"><span className="text-kon font-bold">②</span> NISAは運用益・配当が非課税。早く始めるほど複利効果が大きい</li>
            <li className="flex gap-2"><span className="text-kon font-bold">③</span> 相続税は基礎控除（3,000万円＋600万円×相続人数）で大半の家庭は非課税</li>
            <li className="flex gap-2"><span className="text-kon font-bold">④</span> 法人化は年収700万円超が損益分岐の目安。配偶者への所得分散が有効</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑤</span> iDeCoは先に・NISAは追加で・相続は生前対策を早めに始めるほど有利</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/ideco-nisa-sozokuzei-setsuzei" title={title} />
    </article>
  );
}
