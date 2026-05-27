// Server Component — no "use client"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

interface ToolFeedbackSchemaProps {
  toolSlug: string;
  toolName: string;
  toolUrl: string;
  minVotesToDisplay?: number;
}

async function fetchFeedback(toolSlug: string) {
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

export default async function ToolFeedbackSchema({
  toolSlug,
  toolName,
  toolUrl,
  minVotesToDisplay = 5,
}: ToolFeedbackSchemaProps) {
  const data = await fetchFeedback(toolSlug);
  if (!data || data.total_count < minVotesToDisplay) return null;
  if (data.satisfaction_rate === null) return null;

  // Convert 0–1 satisfaction rate to 1–5 rating scale
  // satisfaction_rate=1.0 → 5.0, satisfaction_rate=0.5 → 3.0
  // Floor to 1 to satisfy schema.org worstRating constraint
  const ratingValue = Math.max(
    1,
    Math.round(data.satisfaction_rate * 5 * 10) / 10
  ).toFixed(1);

  // Separate JSON-LD with same @id as the SoftwareApplication in seo.ts
  // so schema processors can merge the AggregateRating into the main entity.
  const schema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${toolUrl}#software`,
    name: toolName,
    url: toolUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      bestRating: "5",
      worstRating: "1",
      ratingCount: data.total_count,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
