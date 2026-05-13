#!/usr/bin/env python3
"""Extend short description consts in standalone blog page.tsx files."""

import os
import re
import shutil
import glob

SUFFIX = "yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。"
SKIP_PHRASES = ["yamada-tools.jpの", "無料ツールで実際に", "中小企業・個人事業主"]
MIN_LENGTH = 120
MAX_LENGTH = 220


def find_description_const(content):
    """
    Find: const description = "..."  or  const description: string = "..."
    Returns (text, start_pos, end_pos) of the quoted value, or None.
    """
    pattern = re.compile(
        r'const\s+description\s*(?::\s*string\s*)?=\s*"((?:[^"\\]|\\.)*)"',
        re.MULTILINE | re.DOTALL,
    )
    m = pattern.search(content)
    if not m:
        return None
    return m.group(1), m.start(1), m.end(1)


def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    found = find_description_const(content)
    if not found:
        return False, "no description const found"

    desc, start, end = found
    desc_len = len(desc)

    if desc_len >= MIN_LENGTH:
        return False, "[" + str(desc_len) + "] already long enough"

    for phrase in SKIP_PHRASES:
        if phrase in desc:
            return False, "[" + str(desc_len) + "] already has B2B keywords"

    base = desc.rstrip()
    if not base.endswith("。"):
        base = base + "。"
    new_desc = base + SUFFIX

    if len(new_desc) > MAX_LENGTH:
        return False, "[" + str(desc_len) + "->" + str(len(new_desc)) + "] too long"

    backup = filepath + ".bing-blog-extend-backup"
    if not os.path.isfile(backup):
        shutil.copy2(filepath, backup)

    new_content = content[:start] + new_desc + content[end:]
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, "[" + str(desc_len) + "->" + str(len(new_desc)) + "] EXTENDED"


def main():
    # Only standalone blog folders, NOT [slug] or root
    files = sorted(glob.glob("src/app/blog/*/page.tsx"))
    files = [f for f in files if "[slug]" not in f]

    print("=== Extending standalone blog descriptions ===\n")

    extended = 0
    skipped = 0
    not_found = 0

    for f in files:
        try:
            changed, msg = process_file(f)
            short = f.replace("src/app/blog/", "").replace("/page.tsx", "")
            if changed:
                print("OK " + short.ljust(50) + " " + msg)
                extended += 1
            elif "no description" in msg:
                print("   " + short.ljust(50) + " (no const found - probably uses [slug])")
                not_found += 1
            else:
                print("   " + short.ljust(50) + " " + msg)
                skipped += 1
        except Exception as e:
            print("ERR " + f + ": " + str(e))

    print(f"\n=== Summary ===")
    print(f"Extended:  {extended}")
    print(f"Skipped:   {skipped}")
    print(f"Not found: {not_found}")
    print(f"Total:     {len(files)}")


if __name__ == "__main__":
    main()