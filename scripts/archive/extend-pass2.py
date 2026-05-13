#!/usr/bin/env python3
"""Pass 2: extend pages still <130 chars by adding a different suffix."""

import os
import re
import shutil
import glob
import json

# Pages that already have FIRST suffix but are still short need a DIFFERENT one
SECOND_SUFFIX = "freee・マネーフォワード等の会計ソフトとも連携可能。"
PRIMARY_MARKER = "中小企業・個人事業主"
TARGET_MIN = 130
MAX_LENGTH = 220

stats = {"extended": 0, "skipped": 0, "no_field": 0}


def extend_text(text):
    """Append SECOND_SUFFIX if text has primary marker but is still short."""
    if not text:
        return None
    if PRIMARY_MARKER not in text:
        return None  # Skip pages that don't already have first extension
    if len(text) >= TARGET_MIN:
        return None
    if SECOND_SUFFIX in text:
        return None  # Already has secondary
    new_text = text.rstrip()
    if not new_text.endswith("。"):
        new_text = new_text + "。"
    new_text = new_text + SECOND_SUFFIX
    if len(new_text) > MAX_LENGTH:
        return None
    return new_text


def process_tsx(filepath):
    """Process TSX files - longDescription or const description."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Try longDescription first
    pattern1 = re.compile(r'longDescription\s*:\s*"((?:[^"\\]|\\.)*)"', re.MULTILINE | re.DOTALL)
    pattern2 = re.compile(r'const\s+description\s*(?::\s*string\s*)?=\s*"((?:[^"\\]|\\.)*)"', re.MULTILINE | re.DOTALL)
    
    for pattern in [pattern1, pattern2]:
        m = pattern.search(content)
        if m:
            old_text = m.group(1)
            new_text = extend_text(old_text)
            if new_text:
                backup = filepath + ".bing-pass2-backup"
                if not os.path.isfile(backup):
                    shutil.copy2(filepath, backup)
                new_content = content[:m.start(1)] + new_text + content[m.end(1):]
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                stats["extended"] += 1
                return f"OK [{len(old_text)}->{len(new_text)}]"
            else:
                stats["skipped"] += 1
                return f"   [{len(old_text)}] skipped"
    
    stats["no_field"] += 1
    return None


def process_json():
    """Process dynamicBlogs.json excerpt and description."""
    json_path = "src/data/dynamicBlogs.json"
    backup = json_path + ".bing-pass2-backup"
    if not os.path.isfile(backup):
        shutil.copy2(json_path, backup)
    
    with open(json_path, "r", encoding="utf-8") as f:
        blogs = json.load(f)
    
    extended = 0
    for b in blogs:
        for field in ["excerpt", "description"]:
            old = b.get(field, "")
            new = extend_text(old)
            if new:
                b[field] = new
                extended += 1
                print(f"OK json:{field} [{len(old)}->{len(new)}] {b['slug']}")
    
    if extended > 0:
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(blogs, f, ensure_ascii=False, indent=2)
    
    return extended


def main():
    print("=== Pass 2: Extending pages 109-129 chars to 130+ ===\n")
    print(f"Target min: {TARGET_MIN} chars")
    print(f"Second suffix: {SECOND_SUFFIX} ({len(SECOND_SUFFIX)} chars)\n")
    
    # Process TSX files
    files = sorted(glob.glob("src/app/**/*.tsx", recursive=True))
    
    for f in files:
        try:
            result = process_tsx(f)
            if result:
                short = f.replace("src/app/", "")
                print(f"{result} {short}")
        except Exception as e:
            print(f"ERR {f}: {e}")
    
    # Process JSON
    print("\n=== Processing dynamicBlogs.json ===")
    json_count = process_json()
    
    print(f"\n=== Summary ===")
    print(f"TSX Extended:    {stats['extended']}")
    print(f"TSX Skipped:     {stats['skipped']}")
    print(f"JSON Extended:   {json_count}")
    print(f"\nNext: npm run build && pm2 restart yamada-staging")


if __name__ == "__main__":
    main()