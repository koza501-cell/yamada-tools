import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API ドキュメント",
  description: "山田ツールAPIの使い方。PDF変換、画像処理などをプログラムから利用できます。",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-kon mb-4">API ドキュメント</h1>
          <p className="text-gray-600">山田ツールのAPIを使用して、PDF変換や画像処理を自動化できます。</p>
        </header>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4">概要</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className="mb-4">ベースURL:</p>
            <code className="bg-gray-100 px-3 py-2 rounded block mb-4">https://api.yamada-tools.jp</code>
            <p className="text-sm text-gray-600">全てのAPIはRESTful形式で、multipart/form-dataでファイルを送信します。</p>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4">認証</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className="mb-2">現在、APIは認証不要で利用できます。</p>
            <p className="text-sm text-gray-500">※ 将来的にAPIキー認証を導入予定です</p>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4">レート制限</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <ul className="space-y-2 text-gray-700">
              <li>• 1分あたり: 10リクエスト</li>
              <li>• 1時間あたり: 100リクエスト</li>
              <li>• ファイルサイズ上限: 50MB</li>
            </ul>
          </div>
        </section>

        {/* PDF APIs */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4">PDF API</h2>
          
          {/* Merge */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">POST</span>
              <code className="text-gray-800">/api/pdf/merge</code>
            </div>
            <p className="text-gray-600 mb-4">複数のPDFを1つに結合します</p>
            <h4 className="font-medium mb-2">リクエスト</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-4">
{`curl -X POST https://api.yamada-tools.jp/api/pdf/merge \\
  -F "files=@file1.pdf" \\
  -F "files=@file2.pdf"`}
            </pre>
            <h4 className="font-medium mb-2">レスポンス</h4>
            <p className="text-sm text-gray-600">結合されたPDFファイル (application/pdf)</p>
          </div>

          {/* Compress */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">POST</span>
              <code className="text-gray-800">/api/pdf/compress</code>
            </div>
            <p className="text-gray-600 mb-4">PDFファイルを圧縮します</p>
            <h4 className="font-medium mb-2">リクエスト</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-4">
{`curl -X POST https://api.yamada-tools.jp/api/pdf/compress \\
  -F "files=@document.pdf" \\
  -F "quality=medium"`}
            </pre>
            <h4 className="font-medium mb-2">パラメータ</h4>
            <ul className="text-sm text-gray-600 mb-4">
              <li>• quality: low / medium / high (デフォルト: medium)</li>
            </ul>
          </div>

          {/* Split */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">POST</span>
              <code className="text-gray-800">/api/pdf/split</code>
            </div>
            <p className="text-gray-600 mb-4">PDFを複数ファイルに分割します</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST https://api.yamada-tools.jp/api/pdf/split \\
  -F "files=@document.pdf" \\
  -F "pages=1-3,5,7-10"`}
            </pre>
          </div>

          {/* PDF to Image */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">POST</span>
              <code className="text-gray-800">/api/pdf/pdf-to-image</code>
            </div>
            <p className="text-gray-600 mb-4">PDFを画像に変換します</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST https://api.yamada-tools.jp/api/pdf/pdf-to-image \\
  -F "files=@document.pdf" \\
  -F "format=png" \\
  -F "dpi=150"`}
            </pre>
          </div>
        </section>

        {/* Image APIs */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4">画像 API</h2>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">POST</span>
              <code className="text-gray-800">/api/image/resize</code>
            </div>
            <p className="text-gray-600 mb-4">画像をリサイズします</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST https://api.yamada-tools.jp/api/image/resize \\
  -F "files=@photo.jpg" \\
  -F "width=800" \\
  -F "height=600"`}
            </pre>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">POST</span>
              <code className="text-gray-800">/api/image/compress</code>
            </div>
            <p className="text-gray-600 mb-4">画像を圧縮します</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST https://api.yamada-tools.jp/api/image/compress \\
  -F "files=@photo.jpg" \\
  -F "quality=80"`}
            </pre>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4">エラーコード</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">コード</th>
                  <th className="text-left py-2">説明</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b"><td className="py-2">400</td><td>不正なリクエスト</td></tr>
                <tr className="border-b"><td className="py-2">413</td><td>ファイルサイズ超過</td></tr>
                <tr className="border-b"><td className="py-2">415</td><td>非対応ファイル形式</td></tr>
                <tr className="border-b"><td className="py-2">429</td><td>レート制限超過</td></tr>
                <tr><td className="py-2">500</td><td>サーバーエラー</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-kon mb-4">お問い合わせ</h2>
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <p className="text-gray-700">APIに関するご質問・ご要望は以下までお問い合わせください。</p>
            <p className="mt-2"><a href="mailto:support@yamada-tools.jp" className="text-kon hover:underline">support@yamada-tools.jp</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
