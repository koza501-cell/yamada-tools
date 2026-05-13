#!/usr/bin/env python3
import urllib.request
import re
import concurrent.futures

SITEMAP = "https://staging.yamada-tools.jp/sitemap.xml"

def fetch(url):
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            return r.read().decode("utf-8", errors="ignore")
    except Exception:
        return None

def extract_locs(xml):
    if not xml: return []
    return [m.replace("https://yamada-tools.jp", "https://staging.yamada-tools.jp")
            for m in re.findall(r"<loc>([^<]+)</loc>", xml)]

def get_desc(html):
    if not html: return None
    m = re.search(r'<meta name="description" content="([^"]*)"', html)
    return m.group(1) if m else None

def check(url):
    html = fetch(url)
    if html is None:
        return (url, -1)
    d = get_desc(html)
    return (url, len(d) if d else 0)

def main():
    print("Fetching sitemaps...")
    idx = fetch(SITEMAP)
    sitemaps = extract_locs(idx)
    urls = []
    for sm in sitemaps:
        urls.extend(extract_locs(fetch(sm)))
    urls = list(set(urls))
    print(f"Total URLs: {len(urls)}")

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
        for i, r in enumerate(ex.map(check, urls)):
            results.append(r)
            if (i+1) % 50 == 0:
                print(f"  Scanned {i+1}/{len(urls)}")

    good = sum(1 for _, l in results if 120 <= l <= 160)
    too_long = sum(1 for _, l in results if l > 160)
    too_short = sum(1 for _, l in results if 0 < l < 120)
    missing = sum(1 for _, l in results if l == 0)
    errors = sum(1 for _, l in results if l == -1)

    print(f"\n=== Results ===")
    print(f"Good (120-160):    {good}")
    print(f"Too long (>160):   {too_long}")
    print(f"Too short (<120):  {too_short}")
    print(f"Missing:           {missing}")
    print(f"Errors:            {errors}")

if __name__ == "__main__":
    main()
