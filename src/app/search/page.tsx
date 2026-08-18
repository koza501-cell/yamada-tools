import Link from "next/link";
import { Metadata } from "next";
import { allTools } from "@/config/tools";
import { searchTools } from "@/lib/searchUtils";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = "" } = await searchParams;
  return {
    title: q ? `「${q}」の検索結果 | 山田ツール` : "ツール検索 | 山田ツール",
    description: ((`山田ツールで「${q}」に関するツールを検索した結果です。`)||"").length>150?((`山田ツールで「${q}」に関するツールを検索した結果です。`)||"").slice(0,150)+"…":((`山田ツールで「${q}」に関するツールを検索した結果です。`)||""),
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const available = allTools.filter((t) => t.available);
  const results = q.trim().length >= 2 ? searchTools(q, available) : [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">
        {q ? `「${q}」の検索結果` : "ツール検索"}
      </h1>
      {q && (
        <p className="text-gray-500 mb-6 text-sm">
          {results.length} 件のツールが見つかりました
        </p>
      )}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="flex flex-col items-center p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition group"
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-kon text-center">
                {tool.nameJa}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        q && (
          <p className="text-gray-400">
            該当するツールが見つかりませんでした。別のキーワードをお試しください。
          </p>
        )
      )}
    </main>
  );
}
