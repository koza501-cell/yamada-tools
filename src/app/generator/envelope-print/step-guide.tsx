export function StepGuide() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <p className="text-2xl font-bold text-kon mb-6">使い方ガイド</p>
        <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0">
          <div className="flex-1 bg-gray-50 rounded-xl p-5 text-center">
            <div className="text-4xl font-bold text-gray-200 mb-2 leading-none">01</div>
            <div className="text-3xl mb-2">📐</div>
            <h3 className="font-bold text-gray-800 mb-1">封筒サイズ選択</h3>
            <p className="text-sm text-gray-600">長形・角形・洋形など用途に合わせて選択</p>
          </div>
          <div className="hidden sm:flex items-center justify-center px-3 text-2xl text-gray-300 self-center">→</div>
          <div className="flex-1 bg-gray-50 rounded-xl p-5 text-center">
            <div className="text-4xl font-bold text-gray-200 mb-2 leading-none">02</div>
            <div className="text-3xl mb-2">✍️</div>
            <h3 className="font-bold text-gray-800 mb-1">宛名入力</h3>
            <p className="text-sm text-gray-600">郵便番号を入力すると住所を自動補完</p>
          </div>
          <div className="hidden sm:flex items-center justify-center px-3 text-2xl text-gray-300 self-center">→</div>
          <div className="flex-1 bg-gray-50 rounded-xl p-5 text-center">
            <div className="text-4xl font-bold text-gray-200 mb-2 leading-none">03</div>
            <div className="text-3xl mb-2">👁️</div>
            <h3 className="font-bold text-gray-800 mb-1">プレビュー確認</h3>
            <p className="text-sm text-gray-600">印刷前にリアルタイムでレアウトを確認</p>
          </div>
          <div className="hidden sm:flex items-center justify-center px-3 text-2xl text-gray-300 self-center">→</div>
          <div className="flex-1 bg-gray-50 rounded-xl p-5 text-center">
            <div className="text-4xl font-bold text-gray-200 mb-2 leading-none">04</div>
            <div className="text-3xl mb-2">🖨️</div>
            <h3 className="font-bold text-gray-800 mb-1">印刷・PDF保存</h3>
            <p className="text-sm text-gray-600">直接印刷またはPDF保存でコンビニ印刷も可能</p>
          </div>
        </div>
      </div>
    </section>
  )
}
