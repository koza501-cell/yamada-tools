interface BlogEntry {
  slug: string;
  title: string;
  category?: string;
  tags?: string[];
  publishDate?: string;
  featuredImage?: string;
  eyecatch?: { src: string; alt: string };
  excerpt?: string;
  [key: string]: unknown;
}

export function getRelatedPosts(
  current: BlogEntry,
  all: BlogEntry[],
  max = 6,
  min = 3
): BlogEntry[] {
  const currentTags = current.tags ?? [];
  const others = all.filter(b => b.slug !== current.slug);

  const scored = others.map(b => {
    let score = 0;
    if (b.category === current.category) score += 10;
    const shared = (b.tags ?? []).filter(t => currentTags.includes(t));
    score += shared.length * 2;
    return { blog: b, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.blog.publishDate ?? '').localeCompare(a.blog.publishDate ?? '');
  });

  const results = scored.filter(s => s.score > 0).slice(0, max).map(s => s.blog);

  // Fallback: pad with newest in same category
  if (results.length < min) {
    const extra = others
      .filter(b => b.category === current.category && !results.find(r => r.slug === b.slug))
      .sort((a, b) => (b.publishDate ?? '').localeCompare(a.publishDate ?? ''));
    results.push(...extra.slice(0, min - results.length));
  }

  // Final fallback: newest overall
  if (results.length < min) {
    const extra = others
      .filter(b => !results.find(r => r.slug === b.slug))
      .sort((a, b) => (b.publishDate ?? '').localeCompare(a.publishDate ?? ''));
    results.push(...extra.slice(0, min - results.length));
  }

  return results.slice(0, max);
}
