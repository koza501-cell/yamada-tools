const HOST = "yamada-tools.jp";
const BASE_URL = `https://${HOST}`;

// Default key matches the verification file at public/<key>.txt (proves
// domain ownership to IndexNow per https://www.indexnow.org/documentation).
// Override via INDEXNOW_KEY if the key is ever rotated -- the key file in
// public/ must be renamed to match whenever that happens.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "75f86165dd7c3cb4d2025f3a2c65e0a8";

// Submits one or more absolute or path-only URLs to IndexNow (Bing, and
// anyone else subscribed to the shared endpoint) so new/updated pages get
// crawled without waiting for the next scheduled sitemap crawl. Fire-and-
// forget: never throws, since this must not block a publish action.
export async function submitToIndexNow(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const urlList = paths.map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`));

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch (err) {
    console.error("[indexnow] submit failed:", err instanceof Error ? err.message : String(err));
  }
}
