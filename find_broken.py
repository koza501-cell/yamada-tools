import json, re

# candidates for broken conjugation: でく (should be でき), or X+す directly before わけです/んです/でしょう/ということです
# where X+す should have been X+する
broken_markers = ['でくわけです', 'でくんです', 'でくでしょう', 'でくということです',
                   'すわけです', 'すんです', 'すでしょう', 'すということです',
                   'なんです', 'そうでしょう']

pattern = re.compile(r'.{0,20}(' + '|'.join(re.escape(m) for m in broken_markers) + r').{0,10}')

for fname in ['src/data/dynamicBlogs.json', 'src/data/aiPosts.json']:
    d = json.load(open(fname, encoding='utf-8'))
    for i, post in enumerate(d):
        c = post.get('content', '')
        for m in pattern.finditer(c):
            snippet = m.group(0).replace('\n', ' / ')
            print(f'{fname}#{i} {post.get("slug")}: {snippet}')
