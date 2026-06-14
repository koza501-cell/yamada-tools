export function td(s: string | undefined | null, max = 150): string {
  if (!s) return '';
  return s.length > max ? s.slice(0, max) + '…' : s;
}
