"use client";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const share = (u: string) => window.open(u, "_blank", "noopener,width=600,height=400");
  const copyLink = async () => { await navigator.clipboard.writeText(url); alert("URLをコピーしました！"); };

  return (
    <div className="my-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
      <p className="text-sm font-semibold text-gray-600 mb-3 text-center">📢 この記事をシェアする</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => share(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition">
          X でシェア
        </button>
        <button onClick={() => share(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`)}
          className="flex items-center gap-2 px-4 py-2 bg-kon text-white text-sm font-bold rounded-lg hover:bg-ai transition">
          Facebook
        </button>
        <button onClick={() => share(`https://social-plugins.line.me/lineit/share?url=${encoded}`)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition">
          LINE
        </button>
        <button onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition">
          URLコピー
        </button>
      </div>
    </div>
  );
}
