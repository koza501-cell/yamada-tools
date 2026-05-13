#!/usr/bin/env python3
"""Extend short excerpt fields in dynamicBlogs.json."""

import json
import shutil
import sys

JSON_PATH = "src/data/dynamicBlogs.json"
SUFFIX = "yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。"
SKIP_PHRASES = ["yamada-tools.jpの", "無料ツールで実際に", "中小企業・個人事業主"]
MIN_LENGTH = 120
MAX_LENGTH = 220


def extend(text):
    """Extend a short excerpt by appending the suffix. Returns new text or None if skipped."""
    if not text:
        return None
    if len(text) >= MIN_LENGTH:
        return None
    for phrase in SKIP_PHRASES:
        if phrase in text:
            return None
    base = text.rstrip()
    if not base.endswith("。"):
        base = base + "。"
    new_text = base + SUFFIX
    if len(new_text) > MAX_LENGTH:
        return None
    return new_text


def main():
    # Backup
    shutil.copy2(JSON_PATH, JSON_PATH + ".bing-blog-extend-backup")

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        blogs = json.load(f)

    extended = 0
    skipped = 0

    for b in blogs:
        excerpt_old = b.get("excerpt", "")
        excerpt_new = extend(excerpt_old)
        if excerpt_new:
            b["excerpt"] = excerpt_new
            # Also update description if same as excerpt
            if b.get("description") == excerpt_old:
                b["description"] = excerpt_new
            print(f"OK [{len(excerpt_old)}->{len(excerpt_new)}] {b['slug']}")
            extended += 1
        else:
            print(f"   [{len(excerpt_old)}] {b['slug']} (skipped)")
            skipped += 1

    # Write back with proper formatting
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(blogs, f, ensure_ascii=False, indent=2)

    print(f"\n=== Summary ===")
    print(f"Extended: {extended}")
    print(f"Skipped:  {skipped}")
    print(f"Total:    {len(blogs)}")


if __name__ == "__main__":
    main()