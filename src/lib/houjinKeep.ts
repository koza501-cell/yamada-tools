import fs from "fs";
import path from "path";

let _keepSet: Set<string> | null = null;

// Explicit allowlist of corporate numbers that stay indexable at
// /business/houjin/<number>. Everything else is noindex,follow -- see
// src/data/houjin-keep.txt for the list and format.
export function getHoujinKeepSet(): Set<string> {
  if (_keepSet) return _keepSet;
  try {
    const p = path.join(process.cwd(), "src/data/houjin-keep.txt");
    const raw = fs.readFileSync(p, "utf-8");
    _keepSet = new Set(
      raw
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"))
    );
  } catch {
    _keepSet = new Set();
  }
  return _keepSet;
}
