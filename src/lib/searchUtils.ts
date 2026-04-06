// Shared search utility for all search components

export const SEARCH_SYNONYMS: Record<string, string[]> = {
  'pdf編集': ['pdf', '圧縮', '結合', '分割', '文字入力', '回転', '透かし'],
  '編集': ['圧縮', '結合', '分割', '文字入力', '回転'],
  'へんかん': ['変換'],
  '請求': ['請求書'],
  '見積': ['見積書'],
  '領収': ['領収書'],
  '印鑑': ['はんこ', '電子印鑑', 'hanko'],
  '住所': ['封筒', '宛名'],
  '給与': ['給料', '給与計算', '年収'],
  '税金': ['消費税', 'インボイス', '源泉'],
  '画像': ['写真', 'image', 'jpg', 'png', 'webp'],
  '圧縮': ['compress', '軽量化', '縮小'],
  '変換': ['convert', '形式変換'],
};

export function expandQuery(query: string): string[] {
  const lower = query.toLowerCase();
  let terms = [lower];
  for (const [key, vals] of Object.entries(SEARCH_SYNONYMS)) {
    if (lower.includes(key)) {
      terms = [...terms, ...vals];
    }
  }
  return terms;
}

export interface SearchableTool {
  id: string;
  nameJa: string;
  nameEn: string;
  description: string;
  path: string;
  icon: string;
  available: boolean;
}

export function searchTools(query: string, tools: SearchableTool[]): SearchableTool[] {
  if (query.trim().length < 2) return [];
  const terms = expandQuery(query);
  const filtered = tools.filter(tool =>
    terms.some(term =>
      tool.nameJa.toLowerCase().includes(term) ||
      tool.nameEn.toLowerCase().includes(term) ||
      tool.description.toLowerCase().includes(term)
    )
  );
  return filtered.slice(0, 8);
}
