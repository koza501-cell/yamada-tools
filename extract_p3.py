import json, re

pattern = re.compile(r'.{0,35}(わけです。|んです。|でしょう。|ということです。)')

for fname in ['src/data/dynamicBlogs.json', 'src/data/aiPosts.json']:
    d = json.load(open(fname, encoding='utf-8'))
    for i, post in enumerate(d):
        c = post.get('content', '')
        matches = pattern.findall(c)
        if not matches:
            continue
        allmatches = pattern.finditer(c)
        print(f'=== {fname} #{i} slug={post.get("slug")} count={len(matches)} ===')
        for m in allmatches:
            snippet = m.group(0).replace('\n', ' / ')
            print('  ', snippet)
