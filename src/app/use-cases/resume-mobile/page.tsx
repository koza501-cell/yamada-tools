import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "スマホで履歴書を作成する方法【無料・PDF保存】",
  description: "スマホだけで履歴書を作成してPDF保存。アプリ不要・登録不要で今すぐ使えます。コンビニ印刷にも対応。",
  keywords: ["履歴書 スマホ 作成", "履歴書 作成 無料 スマホ", "履歴書 PDF スマホ", "履歴書 コンビニ印刷"],
  alternates: {
    canonical: 'https://yamada-tools.jp/use-cases/resume-mobile',
  },
};

export default function ResumeMobilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-10">
          <p className="text-kon text-sm mb-2">📱 ユースケース</p>
          <h1 className="text-3xl font-bold text-kon mb-4">スマホで履歴書を作成</h1>
          <p className="text-gray-600">アプリ不要・登録不要で今すぐ作れます</p>
        </header>

        <div className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">📝 3ステップで完成</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="bg-kon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
              <div><h3 className="font-bold">情報を入力</h3><p className="text-sm text-gray-500">氏名・住所・学歴・職歴を入力</p></div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-kon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
              <div><h3 className="font-bold">プレビュー確認</h3><p className="text-sm text-gray-500">入力内容をリアルタイムで確認</p></div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-kon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
              <div><h3 className="font-bold">PDFダウンロード</h3><p className="text-sm text-gray-500">保存してコンビニで印刷も可能</p></div>
            </div>
          </div>
        </div>

        <div className="bg-kon text-white rounded-2xl p-8 text-center mb-8">
          <h2 className="text-xl font-bold mb-4">今すぐ履歴書を作成する</h2>
          <p className="mb-6 text-white/80">JIS規格準拠・A4サイズPDF出力</p>
          <Link href="/document/resume" className="inline-block bg-white text-kon px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
            履歴書作成ツールを使う →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">🖨️ コンビニ印刷の方法</h2>
          <ul className="space-y-2 text-sm">
            <li>1. PDFをダウンロード</li>
            <li>2. ネットプリント登録（セブン）またはPrintSmash（ローソン/ファミマ）</li>
            <li>3. コンビニのマルチコピー機で印刷</li>
            <li className="text-gray-500">※ A4白黒で約20円/枚</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="font-bold text-kon mb-4">関連ツール</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/document/cover-letter" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">職務経歴書作成</h3>
              <p className="text-sm text-gray-500">転職用の職務経歴書</p>
            </Link>
            <Link href="/pdf/combini-print" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">コンビニ印刷用PDF</h3>
              <p className="text-sm text-gray-500">印刷に最適なPDF変換</p>
            </Link>
            <Link href="/pdf/text-input" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">PDFに文字入力</h3>
              <p className="text-sm text-gray-500">既存PDF履歴書への直接入力・電子ハンコ追加</p>
            </Link>
          </div>
        </div>
        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-6 border mt-8">
          <h2 className="font-bold text-kon mb-4">❓ よくある質問</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold">Q: スマホで作った履歴書は企業に提出できますか？</h3>
              <p className="text-gray-600">A: はい、JIS規格に準拠したPDF形式で出力されるため、正式な書類として提出可能です。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 写真は必要ですか？</h3>
              <p className="text-gray-600">A: 写真なしでも作成可能です。写真が必要な場合は、スマホで撮影した画像をアップロードできます。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 入力した内容は保存されますか？</h3>
              <p className="text-gray-600">A: ブラウザを閉じると入力内容は消えます。PDFをダウンロードして保存してください。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
