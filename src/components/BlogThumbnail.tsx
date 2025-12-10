export default function BlogThumbnail({ type }: { type: string }) {
  const configs = {
    password: { bg: 'bg-gradient-to-br from-gray-100 to-gray-200', icon: '🔒', text: '安全なパスワード' },
    'pdf-compression': { bg: 'bg-gradient-to-br from-purple-100 to-blue-100', icon: '📄', text: 'PDF圧縮' },
    'image-resize': { bg: 'bg-gradient-to-br from-pink-100 to-yellow-100', icon: '📱', text: '画像リサイズ' },
    invoice: { bg: 'bg-gradient-to-br from-teal-100 to-pink-100', icon: '📊', text: '請求書作成' },
    security: { bg: 'bg-gradient-to-br from-blue-100 to-purple-100', icon: '🛡️', text: '国内サーバー' },
  };

  const config = configs[type as keyof typeof configs] || { bg: 'bg-gray-200', icon: '🛠️', text: 'ツール' };

  return (
    <div className={`w-full h-48 ${config.bg} rounded-t-xl flex flex-col items-center justify-center`}>
      <div className="text-6xl mb-3">{config.icon}</div>
      <div className="text-lg font-bold text-gray-800">{config.text}</div>
    </div>
  );
}
