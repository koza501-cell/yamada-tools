import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "年収の壁・配偶者控除・扶養控除を完全解説【2025年・2026年改正対応】";
const description = "103万円→123万円→136万円の壁の変化を図解。配偶者控除・扶養控除の節税額を無料計算。パートの損しない働き方を徹底解説。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("年収の壁・配偶者控除・扶養控除を完全解説")}&type=blog&category=${encodeURIComponent("税金・節税")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["年収の壁", "2025", "123万円", "103万円", "配偶者控除", "扶養控除", "パート", "106万円", "130万円"],
  alternates: { canonical: "https://yamada-tools.jp/blog/nennshu-kabe-haigusha-fuyou" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-07", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function NennshuKabeHaigushaFuyouBlog() {
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
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/nennshu-kabe-haigusha-fuyou" }
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
              { "@type": "Question", "name": "2025年に103万円の壁はどう変わった？", "acceptedAnswer": { "@type": "Answer", "text": "2025年から所得税の基礎控除が48万円→58万円に、給与所得控除の最低額が55万円→65万円に引き上げられ、合計123万円まで所得税がかからなくなりました。さらに2026年には136万円（案）になる予定です。" } },
              { "@type": "Question", "name": "配偶者控除と配偶者特別控除の違いは？", "acceptedAnswer": { "@type": "Answer", "text": "配偶者の年収が123万円（2025年）以下なら配偶者控除（最大38万円）が適用されます。123万円を超えると配偶者特別控除に移行し、年収160万円未満まで段階的に控除額が減少します。" } },
              { "@type": "Question", "name": "106万円の壁と130万円の壁の違いは？", "acceptedAnswer": { "@type": "Answer", "text": "106万円の壁は大企業（101人以上）勤務で週20時間以上の場合の社会保険加入基準。130万円の壁はすべての勤め先に適用される一般的な社会保険の扶養から外れる基準です。どちらを超えても自分で社会保険に加入する必要があります。" } },
              { "@type": "Question", "name": "年収130万円を少し超えた場合、損になる？", "acceptedAnswer": { "@type": "Answer", "text": "社会保険料（約14万円〜）が急に発生するため、130万円〜150万円程度の収入帯は手取りが減る可能性があります。損益分岐点（手取りが逆転する年収）を計算し、それを超えて働くかどうか判断しましょう。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>年収の壁・配偶者控除・扶養控除解説</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("年収の壁・配偶者控除・扶養控除")}&type=blog&category=${encodeURIComponent("税金・節税")}`} alt="年収の壁完全解説" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約9分</p>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 2025年の103万円→123万円の変化と2026年の改正予定</li>
          <li>✓ 5種類の「年収の壁」を一覧整理</li>
          <li>✓ 配偶者控除・特別控除で世帯の節税額がいくら変わるか</li>
          <li>✓ 扶養控除の種類（2026年の大学生バイト特例含む）</li>
          <li>✓ 損しない働き方のシミュレーション</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">2025年「年収の壁」が大きく変わった！何が変わったのか</h2>
        <p className="text-gray-700 mb-4">
          2025年（令和7年）1月から、所得税の計算に使われる控除額が引き上げられました。その結果、<strong className="text-green-700">パートやアルバイトで働く方が所得税を払わずに働ける年収の上限が103万円から123万円に引き上げられました。</strong>
        </p>
        <div className="bg-white border-2 border-green-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">2025年の変更内容</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 text-left">控除の種類</th>
                  <th className="p-2 text-center">2024年まで</th>
                  <th className="p-2 text-center">2025年から</th>
                  <th className="p-2 text-center">増加額</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["基礎控除", "48万円", "58万円", "+10万円"],
                  ["給与所得控除（最低額）", "55万円", "65万円", "+10万円"],
                  ["合計（所得税の壁）", "103万円", "123万円", "+20万円"],
                ].map(([name, before, after, diff], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200 font-medium">{name}</td>
                    <td className="p-2 border border-gray-200 text-center text-red-600">{before}</td>
                    <td className="p-2 border border-gray-200 text-center text-green-700 font-bold">{after}</td>
                    <td className="p-2 border border-gray-200 text-center text-blue-600 font-bold">{diff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
          <p className="font-bold text-yellow-800 mb-1">2026年はさらに変更予定</p>
          <p className="text-sm text-gray-700">
            現在、基礎控除を78万円（+30万円）、給与所得控除最低額を58万円とする改正案が検討されています。実現すれば所得税の壁が<strong>136万円</strong>になる可能性があります。さらに将来的には178万円案も議論されています。
          </p>
        </div>
        <p className="text-gray-600 text-sm">
          ※ 住民税の「非課税限度額」は自治体ごとに異なりますが、多くは収入98万〜110万円前後です。住民税の壁は2025年時点では変更されていません。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">年収の壁の種類を整理（全5種類）</h2>
        <p className="text-gray-700 mb-4">
          「年収の壁」と一口に言っても、税金の壁と社会保険の壁では性質が異なります。それぞれの影響を理解して、損のない働き方を選びましょう。
        </p>

        <div className="space-y-3 mb-6">
          {[
            { wall: "98〜110万円の壁", type: "住民税", color: "bg-gray-100 border-gray-300", desc: "住民税の非課税限度額を超えると住民税がかかり始める。自治体によって基準が異なる（東京都は100万円超）。" },
            { wall: "106万円の壁", type: "社会保険（大企業限定）", color: "bg-orange-50 border-orange-300", desc: "従業員101人以上の企業で週20時間以上勤務する場合の社会保険加入義務が発生する基準（2024年10月から51人以上に拡大）。年間14〜15万円の保険料負担が発生。" },
            { wall: "123万円の壁（2025年〜）", type: "所得税", color: "bg-green-50 border-green-300", desc: "この金額を超えると所得税がかかり始める。2024年まで103万円だったが2025年から引き上げ。配偶者控除の対象になるかどうかにも影響。" },
            { wall: "130万円の壁", type: "社会保険（全員）", color: "bg-red-50 border-red-300", desc: "年収130万円（月収約10.8万円）を超えると配偶者の扶養から外れ、自分で社会保険に加入。年収140〜150万円程度まで手取りが減るケースも。" },
            { wall: "160万円の壁", type: "配偶者特別控除", color: "bg-blue-50 border-blue-300", desc: "配偶者特別控除は年収160万円未満まで段階的に受けられる。160万円を超えると控除がゼロになり、世帯全体の税負担が急増する。" },
          ].map((item, i) => (
            <div key={i} className={`border rounded-lg p-4 ${item.color}`}>
              <div className="flex flex-wrap items-start gap-2 mb-2">
                <span className="font-bold text-gray-800 text-lg">{item.wall}</span>
                <span className="text-xs bg-white border rounded-full px-2 py-1 text-gray-600">{item.type}</span>
              </div>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">配偶者控除・配偶者特別控除とは？節税額の計算方法</h2>
        <p className="text-gray-700 mb-4">
          配偶者控除は、配偶者の年収が一定以下の場合に世帯主（夫または妻）の所得税・住民税を減らせる制度です。最大で所得税38万円・住民税33万円の控除が受けられます。
        </p>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">世帯主年収600万円の場合の控除額（2025年）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 text-left">配偶者の年収</th>
                  <th className="p-2 text-center">所得税控除</th>
                  <th className="p-2 text-center">住民税控除</th>
                  <th className="p-2 text-center">年間節税効果（目安）</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["123万円以下", "38万円（配偶者控除）", "33万円", "約7.6万円"],
                  ["123〜130万円", "36万円（特別控除）", "33万円", "約7.2万円"],
                  ["130〜140万円", "26万円（特別控除）", "22万円", "約5.2万円"],
                  ["140〜150万円", "16万円（特別控除）", "11万円", "約3.2万円"],
                  ["150〜155万円", "8万円（特別控除）", "6万円", "約1.6万円"],
                  ["155〜160万円", "3万円（特別控除）", "3万円", "約0.6万円"],
                  ["160万円超", "0円（控除なし）", "0円", "0円"],
                ].map(([income, tax, local, saving], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border border-gray-200 font-medium">{income}</td>
                    <td className="p-2 border border-gray-200 text-center">{tax}</td>
                    <td className="p-2 border border-gray-200 text-center">{local}</td>
                    <td className="p-2 border border-gray-200 text-center font-bold text-green-700">{saving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">※ 節税効果は世帯主の税率20%（所得税）＋10%（住民税）で試算した目安です。</p>
        </div>
        <p className="text-gray-700 mb-4">
          なお、世帯主の年収が1,000万円を超えると配偶者控除・特別控除の適用自体が受けられなくなります。また、配偶者自身の税金は別途かかります。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">扶養控除の種類と2026年改正「特定親族特別控除」</h2>
        <p className="text-gray-700 mb-4">
          扶養控除は、16歳以上の子ども・親などを扶養している場合に受けられる控除です。配偶者控除とは別の制度です。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-2 text-left">区分</th>
                <th className="p-2 text-left">対象</th>
                <th className="p-2 text-center">所得税控除</th>
                <th className="p-2 text-center">住民税控除</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["一般扶養", "16〜18歳、23〜69歳の扶養家族", "38万円", "33万円"],
                ["特定扶養（大学生世代）", "19〜22歳の扶養家族", "63万円", "45万円"],
                ["老人扶養（同居）", "70歳以上・同居の親族", "58万円", "45万円"],
                ["老人扶養（別居）", "70歳以上・別居の親族", "48万円", "38万円"],
              ].map(([type, target, tax, local], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-2 border border-gray-200 font-medium">{type}</td>
                  <td className="p-2 border border-gray-200">{target}</td>
                  <td className="p-2 border border-gray-200 text-center font-bold">{tax}</td>
                  <td className="p-2 border border-gray-200 text-center">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <p className="font-bold text-purple-800 mb-2">📌 2026年新設予定「特定親族特別控除」（大学生バイト向け）</p>
          <p className="text-sm text-gray-700">
            現行の制度では、19〜22歳の子どもがアルバイトで年収123万円を超えると、親の扶養控除（63万円）が消えて世帯の税負担が急増します（「特定扶養の壁」）。これを緩和するため、2026年から「特定親族特別控除」の新設が検討されています。子どもの年収が123〜188万円の範囲で段階的に控除額が減少する仕組みとなる予定です。
          </p>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">パートはいくらまで働くのが得？損益分岐点を計算</h2>
        <p className="text-gray-700 mb-4">
          社会保険料が発生する「壁」を超えた場合、どのくらい稼げば手取りが元に戻るかを確認しましょう。
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">106万円の壁を超えた場合の試算</h3>
            <div className="bg-orange-50 rounded p-3 text-sm mb-3">
              <p>社会保険料の負担：<strong className="text-orange-700">約13〜15万円/年（勤務先によって異なる）</strong></p>
            </div>
            <p className="text-sm text-gray-700">手取りが超える前と同水準に戻るには、年収<strong>約120〜125万円</strong>以上が目安。ただし社会保険に加入すると将来の年金が増える点も考慮が必要です。</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">130万円の壁を超えた場合の試算</h3>
            <div className="bg-red-50 rounded p-3 text-sm mb-3">
              <p>社会保険料の負担：<strong className="text-red-700">約18〜22万円/年（年収130万円の場合）</strong></p>
            </div>
            <p className="text-sm text-gray-700">手取りが超える前と同水準に戻るには、年収<strong>約150〜160万円</strong>以上が目安。配偶者特別控除もこの年収帯で段階的に減少します。</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="font-bold text-green-800 mb-2">💡 世帯手取りを最大化する働き方のポイント</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>・106万円・130万円の壁の少し上の年収帯は「損益分岐点」に注意</li>
            <li>・損益分岐点（150〜160万円）を超えて働けるなら、積極的に増やす方が有利</li>
            <li>・社会保険加入は将来の年金増につながるため、長期的には必ずしも損ではない</li>
            <li>・配偶者の控除と自分の社会保険料を合わせて「世帯全体の手取り」で判断する</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料計算ツールで今すぐシミュレーション</h2>
        <p className="text-gray-700 mb-6">
          自分の状況に合わせた正確な数字を計算したい場合は、以下の無料ツールをご活用ください。
        </p>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">配偶者控除・配偶者特別控除 計算機</p>
          <p className="text-sm opacity-90 mb-4">世帯主の年収・配偶者の年収を入力するだけで、控除額と節税効果を即計算。</p>
          <Link href="/finance/haigusha-kojo-calculator" className="inline-block bg-white text-green-700 font-bold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
            無料で計算する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">年収の壁シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">パートの年収から手取り額・世帯収入を計算。最適な働き方の壁を確認。</p>
            <Link href="/finance/nennshu-kabe-simulator" className="text-green-600 text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">扶養控除チェッカー</p>
            <p className="text-sm text-gray-600 mb-3">子ども・親の年収と年齢から適用される扶養控除と節税額を確認。</p>
            <Link href="/finance/fuyou-koujo-checker" className="text-green-600 text-sm font-medium hover:underline">試してみる →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：2025年年収の壁の変更点</h2>
        <div className="bg-green-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-green-600 font-bold">①</span> 所得税の壁は2025年に103万円→123万円へ引き上げられた</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">②</span> 住民税の壁（98〜110万円）は2025年時点では変更なし</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">③</span> 社会保険の壁（106万円・130万円）は引き続き要注意</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">④</span> 配偶者控除は年収123万円以下で最大38万円（世帯主の税率で節税額が変わる）</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">⑤</span> 2026年には136万円への引き上げと大学生扶養の特例新設が予定</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">⑥</span> 損益分岐点を超えて働けるなら積極的に年収を伸ばす方が世帯手取りが増える</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/nennshu-kabe-haigusha-fuyou" title={title} />
    </article>
  );
}
