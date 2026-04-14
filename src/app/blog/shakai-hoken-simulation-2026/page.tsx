import { Metadata } from "next";
import Link from "next/link";

const title = "【2026年最新】社会保険料の計算方法｜年収別早見表と手取り額シミュレーション";
const description = "社会保険料の計算方法を徹底解説。健康保険・厚生年金・雇用保険の料率、年収別の保険料早見表、標準報酬月額の決まり方。手取り額シミュレーターで計算。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("社会保険料の計算")}&type=blog&category=${encodeURIComponent("給与・社会保険")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["社会保険料", "計算", "健康保険", "厚生年金", "標準報酬月額", "手取り"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function ShakaiHokenSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】社会保険料の計算方法｜年収別早見表と手取り額シミュレーション",
            "description": "社会保険料の計算方法を徹底解説。健康保険・厚生年金・雇用保険の料率、年収別の保険料早見表、標準報酬月額の決まり方。手取り額シミュレーターで計算。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/shakai-hoken-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"パート・アルバイトも社会保険に入る？","acceptedAnswer":{"@type":"Answer","text":"週20時間以上勤務、月収8.8万円以上、従業員51人以上の会社で働く場合は加入義務があります（2024年10月〜）。それ以外でも週30時間以上なら加入対象です。"}},{"@type":"Question","name":"40歳になったら保険料が上がる？","acceptedAnswer":{"@type":"Answer","text":"はい、上がります。40歳から64歳までは介護保険料（約1.6%、本人負担約0.8%）が追加されるため、年間数万円の負担増となります。"}},{"@type":"Question","name":"転職したら社会保険料は変わる？","acceptedAnswer":{"@type":"Answer","text":"給与が変われば変わります。転職時は実際の給与で標準報酬月額が決定され、その後は定時決定（4〜6月）または随時改定で見直されます。"}},{"@type":"Question","name":"社会保険料は所得控除できる？","acceptedAnswer":{"@type":"Answer","text":"はい、全額が社会保険料控除として所得から差し引けます。年末調整や確定申告で自動的に適用されるため、別途の手続きは不要です。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>社会保険料計算2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=社会保険料の計算&type=blog&category=給与・社会保険" alt="社会保険料計算" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】社会保険料の計算方法｜年収別早見表と手取り額シミュレーション</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-sky-50 border-l-4 border-sky-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 社会保険料の種類と計算方法</li>
          <li>✓ 年収別の社会保険料早見表</li>
          <li>✓ 標準報酬月額の決まり方</li>
          <li>✓ 会社負担と本人負担の割合</li>
          <li>✓ 社会保険料を抑える方法</li>
        </ul>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">社会保険料の種類と料率（2026年度）</h2>
        <p className="text-gray-700 mb-4">
          会社員が支払う社会保険料は主に<strong>4種類</strong>あります。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">保険の種類</th>
              <th className="px-3 py-3 text-center border-b font-semibold">料率（本人負担）</th>
              <th className="px-3 py-3 text-center border-b font-semibold">会社負担</th>
              <th className="px-3 py-3 text-left border-b font-semibold">目的</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">健康保険</td><td className="px-3 py-3 border-b text-center font-bold text-sky-600">約5%</td><td className="px-3 py-3 border-b text-center">約5%</td><td className="px-3 py-3 border-b text-sm">医療費の自己負担軽減</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">介護保険（40歳以上）</td><td className="px-3 py-3 border-b text-center font-bold text-sky-600">約0.8%</td><td className="px-3 py-3 border-b text-center">約0.8%</td><td className="px-3 py-3 border-b text-sm">介護サービスの利用</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">厚生年金</td><td className="px-3 py-3 border-b text-center font-bold text-sky-600">9.15%</td><td className="px-3 py-3 border-b text-center">9.15%</td><td className="px-3 py-3 border-b text-sm">老後の年金</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">雇用保険</td><td className="px-3 py-3 border-b text-center font-bold text-sky-600">0.6%</td><td className="px-3 py-3 border-b text-center">0.95%</td><td className="px-3 py-3 border-b text-sm">失業時の給付</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">合計（40歳以上）</td><td className="px-3 py-3 border-b text-center font-bold text-orange-600">約15.5%</td><td className="px-3 py-3 border-b text-center font-bold">約16%</td><td className="px-3 py-3 border-b"></td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 健康保険料は地域・組合で異なる</p>
          <p className="text-gray-700">
            協会けんぽの場合、都道府県によって<strong>9.33%〜10.51%</strong>と差があります（2026年度）。
            健康保険組合の場合は独自の料率が適用されます。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">社会保険料の計算方法</h2>
        <p className="text-gray-700 mb-4">
          社会保険料は<strong>標準報酬月額</strong>を基準に計算されます。
        </p>
        
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">計算式</h3>
          <div className="bg-sky-50 p-4 rounded-lg text-center mb-4">
            <p className="text-lg font-bold text-sky-700">
              社会保険料 ＝ 標準報酬月額 × 保険料率
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
              <p><strong>標準報酬月額</strong>を決定（4〜6月の給与平均から算出）</p>
            </div>
            <div className="flex items-start">
              <span className="bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
              <p>標準報酬月額に<strong>各保険の料率</strong>をかける</p>
            </div>
            <div className="flex items-start">
              <span className="bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
              <p>会社と本人で<strong>折半</strong>（雇用保険は別比率）</p>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-3">標準報酬月額とは？</h3>
        <p className="text-gray-700 mb-4">
          毎年4〜6月の給与（残業代含む）の平均を「標準報酬月額等級表」に当てはめて決定します。
          9月から翌年8月まで1年間同じ金額が適用されます。
        </p>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 4〜6月の残業に注意</p>
          <p className="text-gray-700">
            4〜6月に残業が多いと標準報酬月額が上がり、<strong>1年間の社会保険料が高くなる</strong>可能性があります。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【年収別】社会保険料の早見表</h2>
        <p className="text-gray-700 mb-4">会社員（協会けんぽ・東京都・40歳以上）の場合の概算</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">年収</th>
              <th className="px-3 py-3 text-right border-b font-semibold">月額報酬</th>
              <th className="px-3 py-3 text-right border-b font-semibold">社会保険料<br/><span className="text-xs font-normal">（月額・本人）</span></th>
              <th className="px-3 py-3 text-right border-b font-semibold">年間合計</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">300万円</td><td className="px-3 py-3 border-b text-right">25万円</td><td className="px-3 py-3 border-b text-right">約3.9万円</td><td className="px-3 py-3 border-b text-right font-bold text-sky-600">約47万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">400万円</td><td className="px-3 py-3 border-b text-right">33万円</td><td className="px-3 py-3 border-b text-right">約5.1万円</td><td className="px-3 py-3 border-b text-right font-bold text-sky-600">約61万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">500万円</td><td className="px-3 py-3 border-b text-right">42万円</td><td className="px-3 py-3 border-b text-right">約6.5万円</td><td className="px-3 py-3 border-b text-right font-bold text-sky-600">約78万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">600万円</td><td className="px-3 py-3 border-b text-right">50万円</td><td className="px-3 py-3 border-b text-right">約7.8万円</td><td className="px-3 py-3 border-b text-right font-bold text-orange-600">約93万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">700万円</td><td className="px-3 py-3 border-b text-right">58万円</td><td className="px-3 py-3 border-b text-right">約9万円</td><td className="px-3 py-3 border-b text-right font-bold text-sky-600">約108万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">800万円</td><td className="px-3 py-3 border-b text-right">65万円</td><td className="px-3 py-3 border-b text-right">約10万円</td><td className="px-3 py-3 border-b text-right font-bold text-sky-600">約120万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">1000万円</td><td className="px-3 py-3 border-b text-right">83万円</td><td className="px-3 py-3 border-b text-right">約11.5万円</td><td className="px-3 py-3 border-b text-right font-bold text-sky-600">約138万円</td></tr>
          </tbody>
        </table>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたの社会保険料を計算！</p>
          <p className="text-gray-700 mb-4">年収と年齢を入力して、正確な社会保険料をシミュレーションしましょう。</p>
          <Link href="/career/social-insurance-calculator" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 社会保険料計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">社会保険料の上限（標準報酬月額の上限）</h2>
        <p className="text-gray-700 mb-4">
          社会保険料には上限があり、一定以上の年収になると保険料は頭打ちになります。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">保険種別</th>
              <th className="px-4 py-3 text-right border-b font-semibold">標準報酬月額の上限</th>
              <th className="px-4 py-3 text-right border-b font-semibold">年収換算（目安）</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">健康保険</td><td className="px-4 py-3 border-b text-right">139万円</td><td className="px-4 py-3 border-b text-right">約1,670万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">厚生年金</td><td className="px-4 py-3 border-b text-right">65万円</td><td className="px-4 py-3 border-b text-right">約780万円</td></tr>
          </tbody>
        </table>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 高年収ほど保険料率は低くなる</p>
          <p className="text-gray-700">
            厚生年金は年収約780万円で上限に達するため、それ以上の年収では<strong>実質的な負担率が下がる</strong>仕組みになっています。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ボーナスにかかる社会保険料</h2>
        <p className="text-gray-700 mb-4">
          ボーナス（賞与）にも社会保険料がかかります。
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
          <h3 className="font-bold text-sky-600 mb-2">標準賞与額とは</h3>
          <p className="text-gray-700 text-sm mb-3">
            賞与の1,000円未満を切り捨てた額が「標準賞与額」となり、保険料計算の基準になります。
          </p>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm"><strong>上限：</strong></p>
            <p className="text-sm">・健康保険：年度累計573万円</p>
            <p className="text-sm">・厚生年金：1回あたり150万円</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 ボーナスの社会保険料率</p>
          <p className="text-gray-700">
            月給と同じ料率（約15%）がかかります。
            <strong>ボーナス100万円なら約15万円</strong>が社会保険料として控除されます。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">社会保険料を抑える方法</h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-sky-600 mb-2">1. 4〜6月の残業を控える</h3>
            <p className="text-gray-700 text-sm">標準報酬月額の決定時期である4〜6月の残業を減らすと、1年間の保険料が下がる可能性があります。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-sky-600 mb-2">2. 通勤手当を見直す</h3>
            <p className="text-gray-700 text-sm">通勤手当も報酬に含まれるため、会社の近くに住むと社会保険料が下がることも。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-sky-600 mb-2">3. 産前産後・育児休業中の免除</h3>
            <p className="text-gray-700 text-sm">産前産後休業・育児休業中は社会保険料が免除されます（申請が必要）。</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-sky-600 mb-2">4. 健康保険組合への加入</h3>
            <p className="text-gray-700 text-sm">IT系など一部の健康保険組合は協会けんぽより料率が低いことがあります。</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. パート・アルバイトも社会保険に入る？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">週20時間以上勤務、月収8.8万円以上、従業員51人以上の会社で働く場合は<strong>加入義務</strong>があります（2024年10月〜）。それ以外でも週30時間以上なら加入対象です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 40歳になったら保険料が上がる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>はい、上がります。</strong>40歳から64歳までは介護保険料（約1.6%、本人負担約0.8%）が追加されるため、年間数万円の負担増となります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 転職したら社会保険料は変わる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">給与が変われば変わります。転職時は実際の給与で標準報酬月額が決定され、その後は定時決定（4〜6月）または随時改定で見直されます。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 社会保険料は所得控除できる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>はい、全額が社会保険料控除</strong>として所得から差し引けます。年末調整や確定申告で自動的に適用されるため、別途の手続きは不要です。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：社会保険料を理解して手取りを把握</h2>
        <p className="text-gray-700 mb-4">
          社会保険料は年収の約15%と大きな支出ですが、将来の年金や医療保障に直結する重要な負担です。
          <strong>標準報酬月額の仕組みを理解</strong>し、手取り額を正確に把握しましょう。
        </p>
        
        <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの社会保険料をシミュレーション</p>
          <Link href="/career/social-insurance-calculator" className="inline-block bg-white text-sky-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 社会保険料計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/career/social-insurance-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">社会保険料計算機</span>
            <p className="text-sm text-gray-600">社会保険料を計算</p>
          </Link>
          <Link href="/tax/income-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">所得税計算機</span>
            <p className="text-sm text-gray-600">所得税を計算</p>
          </Link>
          <Link href="/career/overtime-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">残業代計算機</span>
            <p className="text-sm text-gray-600">残業代を計算</p>
          </Link>
          <Link href="/career/unemployment-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">失業保険計算機</span>
            <p className="text-sm text-gray-600">失業給付を計算</p>
          </Link>
        </div>
      </section>

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の保険料率に基づいています。</p>
    </article>
  );
}
