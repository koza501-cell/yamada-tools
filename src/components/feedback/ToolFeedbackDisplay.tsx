// Server Component — no "use client"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

const ROLE_EN: Record<string, string> = {
  個人事業主: "Self-employed",
  中小企業経営者: "SMB owner",
  会社員: "Employee",
  士業: "Professional",
  学生: "Student",
  その他: "Other",
};

interface FeedbackData {
  tool_slug: string;
  total_count: number;
  positive_count: number;
  neutral_count: number;
  satisfaction_rate: number | null;
  satisfaction_percent: number | null;
  top_use_cases: { tag: string; count: number }[];
  recent_comments: {
    comment: string;
    user_role: string | null;
    user_age_band: string | null;
    created_at: string;
  }[];
  updated_at: string;
}

async function fetchFeedback(toolSlug: string): Promise<FeedbackData | null> {
  try {
    const res = await fetch(`${API_BASE}/feedback/tool/${toolSlug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function translateAgeBandEN(band: string): string {
  return band.replace("代以上", "+").replace("代", "s");
}

function formatUpdatedAt(updatedAt: string): string {
  return updatedAt.split(" ")[0] || updatedAt;
}

interface ToolFeedbackDisplayProps {
  toolSlug: string;
  lang?: "ja" | "en";
  minVotesToDisplay?: number;
  showComments?: boolean;
  className?: string;
}

export default async function ToolFeedbackDisplay({
  toolSlug,
  lang = "ja",
  minVotesToDisplay = 5,
  showComments = true,
  className,
}: ToolFeedbackDisplayProps) {
  const data = await fetchFeedback(toolSlug);
  if (!data || data.total_count < minVotesToDisplay) return null;
  if (data.satisfaction_percent === null) return null;

  const isJa = lang === "ja";
  const pct = data.satisfaction_percent;
  const total = data.total_count;

  // Use case percentages
  const totalTagCount = data.top_use_cases.reduce((s, t) => s + t.count, 0);
  const useCasesWithPct =
    totalTagCount > 0
      ? data.top_use_cases.slice(0, 5).map((t) => ({
          tag: t.tag,
          percent: Math.round((t.count / totalTagCount) * 100),
          count: t.count,
        }))
      : [];

  const heading = isJa ? "利用者の声" : "What users say";
  const subLine = isJa
    ? `の利用者が「役に立った」と回答（直近の${total}件）`
    : `of users found this helpful (based on ${total} responses)`;
  const useCasesHeading = isJa ? "よく使われる場面" : "Most common use cases";
  const updatedLabel = isJa ? "最終更新:" : "Last updated:";

  return (
    <section
      className={`mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${className ?? ""}`}
      aria-labelledby="feedback-display-heading"
    >
      <h2
        id="feedback-display-heading"
        className="font-bold text-kon dark:text-gray-300 mb-6 text-lg"
      >
        {heading}
      </h2>

      {/* Satisfaction headline */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-5xl font-bold text-kon dark:text-gray-100">
          {pct}%
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {isJa ? subLine : subLine}
      </p>

      {/* Use cases */}
      {useCasesWithPct.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            {useCasesHeading}
          </h3>
          <ul className="space-y-2">
            {useCasesWithPct.map(({ tag, percent }) => (
              <li key={tag} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300 w-32 shrink-0 truncate">
                  {tag}
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-kon dark:bg-ai h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right shrink-0">
                  {percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent comments */}
      {showComments && data.recent_comments.length > 0 && (
        <div className="space-y-3 mb-6">
          {data.recent_comments.map((c, i) => {
            const rolePart = isJa
              ? c.user_role ?? null
              : c.user_role
              ? (ROLE_EN[c.user_role] ?? c.user_role)
              : null;
            const agePart = isJa
              ? c.user_age_band ?? null
              : c.user_age_band
              ? translateAgeBandEN(c.user_age_band)
              : null;
            const attribution = [rolePart, agePart]
              .filter(Boolean)
              .join(" / ");

            return (
              <blockquote
                key={i}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600"
              >
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  &ldquo;{c.comment}&rdquo;
                </p>
                {attribution && (
                  <footer className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    — {attribution}
                  </footer>
                )}
              </blockquote>
            );
          })}
        </div>
      )}

      {/* Last updated */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
        {updatedLabel} {formatUpdatedAt(data.updated_at)}
      </p>
    </section>
  );
}
