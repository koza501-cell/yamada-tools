const DEPT_SUFFIX_RE = /[部課係室科局組]$/;
const STRIP_HONORIFIC_RE = /[様殿]$|御中$/g;

export function detectHonorific(name: string, companyName: string): string {
  const cleanName = name.replace(STRIP_HONORIFIC_RE, "").trim();
  const hasCompany = companyName.trim().length > 0;
  if (DEPT_SUFFIX_RE.test(cleanName)) return "御中";
  if (!cleanName && hasCompany) return "御中";
  return "様";
}
