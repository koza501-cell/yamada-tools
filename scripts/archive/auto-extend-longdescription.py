#!/usr/bin/env python3
"""
Smart auto-extend script for longDescription fields.
Run from frontend or frontend-staging directory.
"""

import os
import sys
import shutil
import re
import glob

SUFFIX = "中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。"

SKIP_PHRASES = [
    "中小企業",
    "個人事業主",
    "登録不要・完全無料",
    "60分自動削除",
    "60分で自動削除",
]

MIN_LENGTH = 120
MAX_AFTER_APPEND = 220


def find_longdescription(content):
    pattern = re.compile(
        r'longDescription\s*:\s*"((?:[^"\\]|\\.)*)"',
        re.MULTILINE | re.DOTALL,
    )
    m = pattern.search(content)
    if not m:
        return None
    return m.group(1), m.start(1), m.end(1)


def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    found = find_longdescription(content)
    if not found:
        return False, "no longDescription field found"

    desc, start, end = found
    desc_len = len(desc)

    if desc_len >= MIN_LENGTH:
        return False, "[" + str(desc_len) + " chars] already long enough"

    for phrase in SKIP_PHRASES:
        if phrase in desc:
            return False, "[" + str(desc_len) + " chars] already has B2B/trust keywords"

    base = desc.rstrip()
    if not base.endswith("。"):
        base = base + "。"
    new_desc = base + SUFFIX

    if len(new_desc) > MAX_AFTER_APPEND:
        return False, "[" + str(desc_len) + "->" + str(len(new_desc)) + "] too long after append"

    backup_path = filepath + ".bing-autoextend-backup"
    if not os.path.isfile(backup_path):
        shutil.copy2(filepath, backup_path)

    new_content = content[:start] + new_desc + content[end:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, "[" + str(desc_len) + "->" + str(len(new_desc)) + " chars] EXTENDED"


def main():
    files = sorted(glob.glob("src/app/**/*.tsx", recursive=True) +
                   glob.glob("src/app/**/*.ts", recursive=True))

    print("=== Auto-extending short longDescription fields ===\n")
    print("Min length target: " + str(MIN_LENGTH) + " chars")
    print("Suffix length: " + str(len(SUFFIX)) + " chars\n")

    extended = 0
    skipped = 0
    no_field = 0

    for filepath in files:
        try:
            changed, msg = process_file(filepath)
            short_path = filepath.replace("src/app/", "")
            if changed:
                print("OK " + short_path.ljust(60) + " " + msg)
                extended += 1
            elif "no longDescription" in msg:
                no_field += 1
            else:
                print("   " + short_path.ljust(60) + " " + msg)
                skipped += 1
        except Exception as e:
            print("ERR " + filepath + ": " + str(e))

    print("\n=== Summary ===")
    print("Files with longDescription: " + str(extended + skipped))
    print("Extended:                   " + str(extended))
    print("Skipped (already OK):       " + str(skipped))
    print("Files without field:        " + str(no_field))
    print("\nNext: npm run build && pm2 restart yamada-staging")
    return 0


if __name__ == "__main__":
    sys.exit(main())