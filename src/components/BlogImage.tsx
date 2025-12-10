export default function BlogImage({ type }: { type: string }) {
  if (type === 'password') {
    return (
      <div className="w-full h-auto min-h-[250px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col md:flex-row items-center justify-around p-4 md:p-8 gap-4 md:gap-0">
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-red-500 shadow-xl w-full md:w-auto">
          <div className="text-lg md:text-2xl font-bold text-red-500 mb-2 md:mb-4 text-center">🔓 危険</div>
          <div className="text-base md:text-xl mb-1 md:mb-2 text-gray-700 text-center">password</div>
          <div className="text-base md:text-xl mb-1 md:mb-2 text-gray-700 text-center">123456</div>
          <div className="text-base md:text-xl text-gray-700 text-center">誕生日</div>
        </div>
        <div className="text-4xl md:text-6xl text-gray-600">→</div>
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-green-500 shadow-xl w-full md:w-auto">
          <div className="text-lg md:text-2xl font-bold text-green-500 mb-2 md:mb-4 text-center">🔒 安全</div>
          <div className="text-base md:text-xl font-mono text-gray-700 mb-2 md:mb-4 text-center">d8F#k9L$p2@x</div>
          <div className="text-xs md:text-sm text-gray-500 text-center">英数字・記号</div>
        </div>
      </div>
    );
  }

  if (type === 'pdf-compression') {
    return (
      <div className="w-full h-auto min-h-[250px] md:h-[400px] bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex flex-col md:flex-row items-center justify-around p-4 md:p-8 gap-4 md:gap-0">
        <div className="bg-white rounded-xl p-6 md:p-8 border-4 border-orange-500 shadow-xl text-center w-full md:w-auto">
          <div className="text-4xl md:text-6xl mb-2 md:mb-4">📄</div>
          <div className="text-2xl md:text-4xl font-bold text-red-500 mb-1 md:mb-2">10 MB</div>
          <div className="text-sm md:text-lg text-gray-600">❌ 送信不可</div>
        </div>
        <div className="text-3xl md:text-5xl font-bold text-blue-600">圧縮</div>
        <div className="bg-white rounded-xl p-6 md:p-8 border-4 border-green-500 shadow-xl text-center w-full md:w-auto">
          <div className="text-4xl md:text-6xl mb-2 md:mb-4">📄</div>
          <div className="text-2xl md:text-4xl font-bold text-green-500 mb-1 md:mb-2">1 MB</div>
          <div className="text-sm md:text-lg text-gray-600">✅ 送信OK</div>
        </div>
      </div>
    );
  }

  if (type === 'image-resize') {
    return (
      <div className="w-full h-auto min-h-[250px] md:h-[400px] bg-gradient-to-br from-pink-100 to-yellow-100 rounded-2xl flex flex-col md:flex-row items-center justify-around p-4 md:p-8 gap-4 md:gap-0">
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-red-500 shadow-xl text-center w-full md:w-auto">
          <div className="text-4xl md:text-5xl mb-2 md:mb-4">📱</div>
          <div className="text-base md:text-xl font-bold text-red-500">サイズエラー</div>
        </div>
        <div className="bg-blue-500 text-white rounded-xl px-4 md:px-6 py-2 md:py-3 text-lg md:text-xl font-bold">リサイズ</div>
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-green-500 shadow-xl text-center w-full md:w-auto">
          <div className="text-4xl md:text-5xl mb-2 md:mb-4">📱</div>
          <div className="text-base md:text-xl font-bold text-green-500">完了 ✅</div>
        </div>
      </div>
    );
  }

  if (type === 'invoice') {
    return (
      <div className="w-full h-auto min-h-[250px] md:h-[400px] bg-gradient-to-br from-teal-100 to-pink-100 rounded-2xl flex flex-col md:flex-row items-center justify-around p-4 md:p-8 gap-4 md:gap-0">
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-red-500 shadow-xl text-center w-full md:w-auto">
          <div className="text-4xl md:text-5xl mb-2 md:mb-4">📊</div>
          <div className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Excel</div>
          <div className="text-xs md:text-sm text-red-500">❌ 計算式エラー</div>
          <div className="text-xs md:text-sm text-red-500">❌ 面倒</div>
        </div>
        <div className="text-3xl md:text-5xl font-bold text-gray-600">VS</div>
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-green-500 shadow-xl text-center w-full md:w-auto">
          <div className="text-4xl md:text-5xl mb-2 md:mb-4">📄</div>
          <div className="text-xl md:text-2xl font-bold mb-2 md:mb-4">ツール</div>
          <div className="text-xs md:text-sm text-green-500">✅ 自動計算</div>
          <div className="text-xs md:text-sm text-green-500">✅ 簡単</div>
        </div>
      </div>
    );
  }

  if (type === 'security') {
    return (
      <div className="w-full h-auto min-h-[250px] md:h-[400px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex flex-col md:flex-row items-center justify-around p-4 md:p-8 gap-4 md:gap-0">
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-red-500 shadow-xl text-center w-full md:w-80">
          <div className="text-4xl md:text-5xl mb-2 md:mb-4">🌍</div>
          <div className="text-lg md:text-xl font-bold text-red-500 mb-2 md:mb-4">海外サーバー</div>
          <div className="text-xs md:text-sm text-gray-600">❓ データ不明</div>
          <div className="text-xs md:text-sm text-gray-600">⚠️ 危険性あり</div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 border-4 border-green-500 shadow-xl text-center w-full md:w-80">
          <div className="text-4xl md:text-5xl mb-2 md:mb-4">🇯🇵</div>
          <div className="text-lg md:text-xl font-bold text-green-500 mb-2 md:mb-4">国内サーバー</div>
          <div className="text-xs md:text-sm text-gray-600">🗑️ 60分で削除</div>
          <div className="text-xs md:text-sm text-gray-600">🔒 安全</div>
        </div>
      </div>
    );
  }

  return <div className="w-full h-[250px] md:h-[400px] bg-gray-200 rounded-2xl"></div>;
}
