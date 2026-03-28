import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "メール添付用にPDFを圧縮する方法【無料・簡単】｜山田ツール",
  description: "メール添付できないサイズのPDFを圧縮。10MB→2MB以下に縮小。登録不要・無料で今すぐ使えます。",
  keywords: ["PDF圧縮 メール", "PDF 添付 サイズ", "PDF 軽くする", "メール 添付 容量オーバー"],
  alternates: {
    canonical: 'https://yamada-tools.jp/use-cases/pdf-compress-email',
  },
};

export default function PdfCompressEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-10">
          <p className="text-kon text-sm mb-2">📧 ユースケース</p>
          <h1 className="text-3xl font-bold text-kon mb-4">メール添付用にPDFを圧縮</h1>
          <p className="text-gray-600">容量オーバーで送れないPDFを、今すぐ軽くできます</p>
        </header>

        <div className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-3">📊 よくある圧縮結果</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">圧縮前</th>
                <th className="px-3 py-2 text-left">圧縮後</th>
                <th className="px-3 py-2 text-left">削減率</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="px-3 py-2">10MB</td><td className="px-3 py-2 text-green-600 font-bold">2MB</td><td className="px-3 py-2">80%</td></tr>
              <tr><td className="px-3 py-2">5MB</td><td className="px-3 py-2 text-green-600 font-bold">1MB</td><td className="px-3 py-2">80%</td></tr>
              <tr><td className="px-3 py-2">3MB</td><td className="px-3 py-2 text-green-600 font-bold">600KB</td><td className="px-3 py-2">80%</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">※ 圧縮率はファイル内容により異なります</p>
        </div>

        <div className="bg-kon text-white rounded-2xl p-8 text-center mb-8">
          <h2 className="text-xl font-bold mb-4">今すぐPDFを圧縮する</h2>
          <p className="mb-6 text-white/80">登録不要・無料・日本国内サーバーで安全処理</p>
          <Link href="/pdf/compress" className="inline-block bg-white text-kon px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
            PDF圧縮ツールを使う →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">💡 メール添付の容量制限</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><span>📧</span><span><strong>Gmail:</strong> 25MBまで</span></li>
            <li className="flex items-start gap-2"><span>📧</span><span><strong>Outlook:</strong> 20MBまで</span></li>
            <li className="flex items-start gap-2"><span>📧</span><span><strong>Yahoo!メール:</strong> 25MBまで</span></li>
            <li className="flex items-start gap-2"><span>🏢</span><span><strong>企業メール:</strong> 3〜10MBが多い</span></li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="font-bold text-kon mb-4">関連ツール</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/pdf/merge" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">PDF結合</h3>
              <p className="text-sm text-gray-500">複数のPDFを1つにまとめる</p>
            </Link>
            <Link href="/pdf/split" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">PDF分割</h3>
              <p className="text-sm text-gray-500">大きなPDFをページごとに分割</p>
            </Link>
          </div>
        </div>
        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-6 border mt-8">
          <h2 className="font-bold text-kon mb-4">❓ よくある質問</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold">Q: PDF圧縮で画質は劣化しますか？</h3>
              <p className="text-gray-600">A: 多少の劣化はありますが、ビジネス文書やメール添付には十分な品質を維持します。写真が多いPDFは圧縮率が高くなります。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 圧縮後のPDFは編集できますか？</h3>
              <p className="text-gray-600">A: はい、通常のPDFと同様に編集可能です。テキスト選択やコピーも問題なく行えます。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 何MBまで圧縮できますか？</h3>
              <p className="text-gray-600">A: 元のファイルサイズの20〜30%程度まで圧縮できることが多いです。画像が多いPDFほど圧縮効果が高くなります。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: アップロードしたファイルは安全ですか？</h3>
              <p className="text-gray-600">A: 日本国内サーバーで処理され、60分後に自動削除されます。第三者がアクセスすることはありません。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
