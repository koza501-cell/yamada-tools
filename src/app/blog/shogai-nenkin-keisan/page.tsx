import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "障害年金はいくらもらえる？2026年度版・等級別受給額と計算方法を完全解説";
const description = "障害基礎年金・障害厚生年金の2026年度受給額を等級別に解説。子の加算・配偶者加給年金も含めた合計額を無料計算ツールで今すぐ確認。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("障害年金はいくらもらえる？2026年度版")}&type=blog&category=${encodeURIComponent("年金・社会保障")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["障害年金 いくらもらえる", "障害年金 受給額 2026", "障害基礎年金 1級 2級 金額", "障害厚生年金 計算方法", "障害年金 子の加算", "障害年金 配偶者加給年金", "障害年金 申請 条件", "障害年金 非課税"],
  alternates: { canonical: "https://yamada-tools.jp/blog/shogai-nenkin-keisan" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-08", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function ShogaiNenkinKeisanBlog() {
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
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/shogai-nenkin-keisan" }
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
              { "@type": "Question", "name": "障害年金は月いくらもらえますか？", "acceptedAnswer": { "@type": "Answer", "text": "2026年度の障害基礎年金は1級が月額約88,260円（年額1,059,120円）、2級が月額約70,608円（年額847,296円）です。障害厚生年金は報酬比例部分が加算されるため、加入期間や収入によって異なります。" } },
              { "@type": "Question", "name": "障害年金の申請はいつからできますか？", "acceptedAnswer": { "@type": "Answer", "text": "初診日から1年6ヶ月後の「障害認定日」から申請できます。認定日から5年以上経過している場合でも遡及請求が可能です（最大5年分）。" } },
              { "@type": "Question", "name": "うつ病で障害年金はもらえますか？", "acceptedAnswer": { "@type": "Answer", "text": "うつ病・統合失調症などの精神疾患でも障害年金を受給できます。多くの場合は障害等級2級（障害基礎年金2級）に認定されます。1級は日常生活が著しく制限される状態が対象です。" } },
              { "@type": "Question", "name": "障害年金は非課税ですか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。障害年金は所得税・住民税ともに非課税です。所得に含まれないため、扶養の判定や医療費控除の計算にも影響しません。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ai">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-ai">ブログ</Link>
        <span className="mx-2">/</span>
        <span>障害年金 受給額・計算方法ガイド</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("障害年金はいくらもらえる？2026年度版")}&type=blog&category=${encodeURIComponent("年金・社会保障")}`} alt="障害年金受給額・計算方法完全ガイド2026年度版" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約9分</p>

      <div className="bg-gray-50 border-l-4 border-kon p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 2026年度の障害基礎年金・障害厚生年金の等級別受給額</li>
          <li>✓ 子の加算・配偶者加給年金を含めた合計受給額の計算方法</li>
          <li>✓ 障害厚生年金の報酬比例部分の計算式と具体例</li>
          <li>✓ 受給するための3つの条件（初診日・納付・障害状態）</li>
          <li>✓ 非課税のため手取りはそのまま受け取れること</li>
          <li>✓ うつ病・透析・視力障害など傷病別の受給目安</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">障害年金とは？2種類の仕組みを解説</h2>
        <p className="text-gray-700 mb-4">
          障害年金は、病気やケガで働くことが難しくなった場合に受給できる公的年金です。
          <strong className="text-kon">障害基礎年金</strong>と<strong className="text-kon">障害厚生年金</strong>の2種類があり、加入していた年金の種類によって受給できる内容が異なります。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-kon mb-3">1階：障害基礎年金（国民年金）</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>・国民年金加入者（自営業・学生・専業主婦等）が対象</li>
              <li>・障害等級1級・2級のみ支給</li>
              <li>・受給額は定額（等級によって固定）</li>
              <li>・子の加算あり</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">2階：障害厚生年金</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>・厚生年金加入者（会社員・公務員等）が対象</li>
              <li>・1・2級は障害基礎年金に加算、3級・手当金は単独</li>
              <li>・報酬比例部分（収入・加入期間に比例）</li>
              <li>・配偶者加給年金あり（1・2級のみ）</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
          <p className="font-bold text-yellow-800 mb-2">📌 2階建て構造のポイント</p>
          <p className="text-gray-700 text-sm">
            会社員として厚生年金に加入していた場合、障害1級・2級に認定されると<strong>障害基礎年金＋障害厚生年金</strong>の両方を受給できます。自営業・専業主婦の方は障害基礎年金のみです。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">2026年度（令和8年度）障害年金の受給額一覧</h2>
        <p className="text-gray-700 mb-4">
          2026年度の障害年金額は前年比<strong className="text-kon">1.9%増</strong>となっています（物価・賃金上昇に伴うマクロ経済スライド適用）。等級別の受給額は以下の通りです。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">種別・等級</th>
                <th className="p-3 text-center">月額（目安）</th>
                <th className="p-3 text-center">年額</th>
                <th className="p-3 text-left">備考</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["障害基礎年金 1級", "約88,260円", "1,059,120円", "障害2級の1.25倍"],
                ["障害基礎年金 2級", "約70,608円", "847,296円", "満額（40年納付ベース）"],
                ["障害厚生年金 1級", "基礎1級＋報酬比例×1.25", "個別計算", "1,059,120円＋報酬比例×1.25"],
                ["障害厚生年金 2級", "基礎2級＋報酬比例", "個別計算", "847,296円＋報酬比例"],
                ["障害厚生年金 3級", "報酬比例のみ", "最低612,000円", "最低保障あり（基礎年金なし）"],
                ["障害手当金（一時金）", "報酬比例×2", "一時金", "最低1,224,000円（3級より軽度）"],
              ].map(([type, monthly, annual, note], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{type}</td>
                  <td className="p-3 border border-gray-200 text-center text-kon font-bold">{monthly}</td>
                  <td className="p-3 border border-gray-200 text-center font-bold">{annual}</td>
                  <td className="p-3 border border-gray-200 text-gray-600 text-xs">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs mb-6">※ 2026年度の金額は概算です。実際の受給額は日本年金機構の通知書でご確認ください。</p>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">具体例：障害厚生年金2級（月収30万円・30年加入）の場合</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">障害基礎年金 2級</span>
              <span className="font-bold text-kon">847,296円/年</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">障害厚生年金（報酬比例）300,000 × 5.481/1,000 × 360月</span>
              <span className="font-bold text-green-600">591,948円/年</span>
            </div>
            <div className="flex justify-between bg-gray-50 rounded p-2 mt-2">
              <span className="font-bold text-gray-800">合計受給額</span>
              <span className="text-xl font-bold text-kon">約1,439,244円/年（月額 約119,937円）</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-3">※ 加入月数300月未満の場合は300月とみなして計算します。</p>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">子の加算・配偶者加給年金はいくら？</h2>
        <p className="text-gray-700 mb-4">
          障害年金には、子どもや配偶者がいる場合に<strong className="text-kon">加算額</strong>が上乗せされます。家族構成によって受給額が大きく変わるため、必ず確認しましょう。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-kon mb-3">子の加算（障害基礎年金受給者）</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>第1子・第2子（各）</span>
                <span className="font-bold">239,300円/年</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>第3子以降（各）</span>
                <span className="font-bold">79,800円/年</span>
              </div>
              <p className="text-gray-600 text-xs mt-2">対象：18歳到達年度末まで（障害のある子は20歳未満）</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">配偶者加給年金（障害厚生年金1・2級のみ）</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-green-100 pb-2">
                <span>配偶者加給年金額</span>
                <span className="font-bold">239,300円/年</span>
              </div>
              <p className="text-gray-600 text-xs mt-2">条件：65歳未満の配偶者（生計維持関係あり）</p>
              <p className="text-gray-600 text-xs">対象：障害厚生年金1級・2級受給者のみ（3級は対象外）</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">具体例：障害基礎年金2級＋子2人の場合</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">障害基礎年金 2級</span>
              <span className="font-bold">847,296円/年</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">子の加算（第1子・第2子）</span>
              <span className="font-bold">239,300円 × 2 = 478,600円/年</span>
            </div>
            <div className="flex justify-between bg-green-50 rounded p-2 mt-2">
              <span className="font-bold text-gray-800">合計受給額</span>
              <span className="text-xl font-bold text-green-700">1,325,896円/年（月額 約110,491円）</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">障害厚生年金の計算方法（報酬比例部分）</h2>
        <p className="text-gray-700 mb-4">
          障害厚生年金の<strong className="text-kon">報酬比例部分</strong>は、老齢厚生年金と同じ計算式で算出されます。収入が高く加入期間が長いほど受給額が多くなります。
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-kon mb-3">計算式</h3>
          <div className="bg-white rounded-lg p-4 text-sm">
            <p className="font-bold text-lg text-kon mb-2">報酬比例部分 = 平均標準報酬月額 × 5.481 ÷ 1,000 × 加入月数</p>
            <p className="text-gray-600">※ 加入月数が300月（25年）未満の場合は300月とみなして計算</p>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">平均月収</th>
                <th className="p-3 text-center">加入10年（300月みなし）</th>
                <th className="p-3 text-center">加入20年（300月みなし）</th>
                <th className="p-3 text-center">加入30年（360月）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["20万円", "約329,000円/年", "約329,000円/年", "約394,000円/年"],
                ["30万円", "約494,000円/年", "約494,000円/年", "約592,000円/年"],
                ["40万円", "約658,000円/年", "約658,000円/年", "約789,000円/年"],
                ["50万円", "約823,000円/年", "約823,000円/年", "約987,000円/年"],
              ].map(([income, y10, y20, y30], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{income}</td>
                  <td className="p-3 border border-gray-200 text-center">{y10}</td>
                  <td className="p-3 border border-gray-200 text-center">{y20}</td>
                  <td className="p-3 border border-gray-200 text-center text-kon font-semibold">{y30}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs">※ 加入月数が300月未満の場合は300月とみなすため、10年・20年加入でも同額になります。</p>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">障害年金をもらうための3つの条件</h2>
        <p className="text-gray-700 mb-4">
          障害年金を受給するには、以下の3つの条件をすべて満たす必要があります。申請前に必ず確認しましょう。
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              num: "1",
              title: "初診日に年金加入中であること",
              content: "障害の原因となった傷病で最初に受診した日（初診日）に、国民年金または厚生年金に加入していることが必要です。初診日が重要なため、初診の医療機関をできるだけ特定しておきましょう。"
            },
            {
              num: "2",
              title: "保険料納付要件",
              content: "初診日の前々月までの被保険者期間のうち、「3分の2以上」の期間について保険料を納付（または免除）していることが必要です。特例として、初診日が2026年3月31日以前の場合、初診日の前々月までの直近1年間に滞納がなければ要件を満たします。"
            },
            {
              num: "3",
              title: "障害認定日に障害の状態にあること",
              content: "初診日から1年6ヶ月後の「障害認定日」に、障害年金の等級（1〜3級）に該当する状態であることが必要です。認定日時点で状態が軽快していた場合でも、後に悪化した際に「事後重症」として請求できます。"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-kon text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{item.num}</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-sm">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="font-bold text-yellow-800 mb-2">📅 申請可能時期</p>
          <p className="text-gray-700 text-sm">初診日から<strong>1年6ヶ月後（障害認定日）</strong>から請求できます。認定日時点で申請しなかった場合でも、後から遡及請求が可能（最大5年分を一括受給）。認定日から5年以上経過している場合は「事後重症請求」になります。</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">障害年金は非課税！税金はかかる？</h2>
        <p className="text-gray-700 mb-4">
          障害年金の大きなメリットは<strong className="text-kon">非課税</strong>であることです。老齢年金とは異なり、所得税・住民税はいっさいかかりません。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="font-bold text-green-700 mb-2">所得税</p>
            <p className="text-2xl font-bold text-green-600">非課税</p>
            <p className="text-sm text-gray-600 mt-2">源泉徴収なし、確定申告不要</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="font-bold text-green-700 mb-2">住民税</p>
            <p className="text-2xl font-bold text-green-600">非課税</p>
            <p className="text-sm text-gray-600 mt-2">所得に算入されない</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="font-bold text-kon mb-2">扶養判定</p>
            <p className="text-2xl font-bold text-kon">影響なし</p>
            <p className="text-sm text-gray-600 mt-2">配偶者・親族の扶養に影響しない</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">注意が必要な点</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><span className="text-kon font-bold">▲</span><div><strong>健康保険・介護保険</strong>の保険料は、世帯の所得に応じて計算されるため、家族の収入によっては影響を受ける場合があります。</div></li>
            <li className="flex gap-2"><span className="text-kon font-bold">▲</span><div><strong>生活保護との併給</strong>：障害年金を受給すると、その分だけ生活保護費から差し引かれます（合計額は変わらない）。</div></li>
            <li className="flex gap-2"><span className="text-green-500 font-bold">✅</span><div><strong>働きながら受給</strong>：就労中でも受給できます（等級によっては審査が厳しくなる場合あり）。</div></li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">病気・傷病別の受給目安</h2>
        <p className="text-gray-700 mb-4">
          障害年金の等級は、傷病の種類ではなく<strong className="text-kon">日常生活・労働能力への影響度</strong>で判定されます。ただし、傷病別に認定されやすい等級の目安があります。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">傷病・障害</th>
                <th className="p-3 text-center">認定されやすい等級</th>
                <th className="p-3 text-left">ポイント</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["うつ病・双極性障害", "2級（重症例は1級）", "日常生活の制限度で判断。就労困難なら2級対象"],
                ["統合失調症", "2級が多い（重症は1級）", "服薬・通院継続中でも申請可"],
                ["人工透析（腎不全）", "2級（原則確定）", "週3回以上の透析で2級が確定的"],
                ["糖尿病性合併症", "等級は合併症による", "網膜症・腎症・神経障害の程度で判断"],
                ["視力障害", "1〜2級（視力・視野による）", "両眼視力の和が0.04以下で1級"],
                ["がん（悪性腫瘍）", "状況・治療段階による", "抗がん剤治療中・転移有は申請可能性あり"],
                ["人工関節・股関節", "3級が多い（症状次第）", "障害厚生年金3級対象となるケースが多い"],
                ["聴力障害", "等級は聴力損失による", "両耳の聴力損失が100デシベル以上で1級"],
              ].map(([disease, grade, point], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{disease}</td>
                  <td className="p-3 border border-gray-200 text-center text-kon font-semibold">{grade}</td>
                  <td className="p-3 border border-gray-200 text-gray-600 text-xs">{point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs">※ 上記はあくまでも目安です。実際の等級認定は日本年金機構の審査によります。社会保険労務士への相談を推奨します。</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料計算ツールで今すぐ受給額を確認</h2>
        <p className="text-gray-700 mb-6">
          自分の等級・加入状況・家族構成を入力するだけで、障害年金の概算受給額を計算できます。申請前の目安確認にご活用ください。
        </p>

        <div className="bg-gradient-to-r from-slate-900 to-kon text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">障害年金 受給額 簡易計算機</p>
          <p className="text-sm opacity-90 mb-4">障害等級・年金種別・子の人数・配偶者の有無を入力するだけで概算受給額を即計算。</p>
          <Link href="/health/shogai-nenkin-calculator" className="inline-block bg-white text-kon font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            今すぐ受給額を試算する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">老齢年金シミュレーター</p>
            <p className="text-sm text-gray-600 mb-3">将来の老齢年金（基礎＋厚生）の見込み額を計算。繰上げ・繰下げの損益分岐点も確認できます。</p>
            <Link href="/finance/nenkin-simulator" className="text-kon text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">健康・年金ツール一覧</p>
            <p className="text-sm text-gray-600 mb-3">遺族年金・国民健康保険料など、健康・社会保険に関する無料計算ツールをまとめています。</p>
            <Link href="/health" className="text-kon text-sm font-medium hover:underline">一覧を見る →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：障害年金の重要ポイント</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-kon font-bold">①</span> 2026年度の障害基礎年金は1級：約106万円/年、2級：約85万円/年（前年比1.9%増）</li>
            <li className="flex gap-2"><span className="text-kon font-bold">②</span> 会社員は障害厚生年金が加算。月収30万円・30年加入で計約144万円/年</li>
            <li className="flex gap-2"><span className="text-kon font-bold">③</span> 子の加算（239,300円/年×子の数）・配偶者加給年金（239,300円/年）で受給額が大幅増</li>
            <li className="flex gap-2"><span className="text-kon font-bold">④</span> 初診日・納付要件・障害状態の3条件を満たすと申請可能（初診日から1年6ヶ月後〜）</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑤</span> 障害年金は所得税・住民税ともに非課税。手取りがそのまま受け取れる</li>
            <li className="flex gap-2"><span className="text-kon font-bold">⑥</span> 上記の無料ツールで等級・家族構成を入力すると概算受給額を即座に確認できる</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/shogai-nenkin-keisan" title={title} />
    </article>
  );
}
