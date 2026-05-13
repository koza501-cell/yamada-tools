#!/usr/bin/env python3
"""Extend short excerpt fields in dynamicBlogs.json. v2: handles missing excerpts."""

import json
import shutil

JSON_PATH = "src/data/dynamicBlogs.json"
SUFFIX = "yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。"
SKIP_PHRASES = ["yamada-tools.jpの", "無料ツールで実際に", "中小企業・個人事業主"]
MIN_LENGTH = 120
MAX_LENGTH = 220


def extend(text):
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
    shutil.copy2(JSON_PATH, JSON_PATH + ".bing-blog-extend-v2-backup")

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        blogs = json.load(f)

    extended = 0
    skipped = 0
    used_description = 0

    for b in blogs:
        # If excerpt missing, use description as starting point
        excerpt_old = b.get("excerpt", "")
        description_old = b.get("description", "")
        
        # Pick the best source field
        if excerpt_old:
            source_text = excerpt_old
            source_field = "excerpt"
        elif description_old:
            source_text = description_old
            source_field = "description"
            used_description += 1
        else:
            print(f"   [no text] {b['slug']} (skipped)")
            skipped += 1
            continue

        # Try to extend
        if len(source_text) >= MIN_LENGTH:
            # Already long enough - just sync excerpt and description
            b["excerpt"] = source_text
            b["description"] = source_text
            print(f"   [{len(source_text)} OK] {b['slug']} (synced)")
            skipped += 1
            continue

        new_text = extend(source_text)
        if not new_text:
            print(f"   [{len(source_text)} skip] {b['slug']}")
            skipped += 1
            continue

        # Set both excerpt and description to extended version
        b["excerpt"] = new_text
        b["description"] = new_text
        print(f"OK [{len(source_text)}->{len(new_text)} from {source_field}] {b['slug']}")
        extended += 1

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(blogs, f, ensure_ascii=False, indent=2)

    print(f"\n=== Summary ===")
    print(f"Extended: {extended}")
    print(f"  (of which using description as source: {used_description})")
    print(f"Skipped:  {skipped}")
    print(f"Total:    {len(blogs)}")


if __name__ == "__main__":
    main()