#!/bin/bash
# Patch Next.js edge runtime to truncate instead of throw on non-Latin header values
PATCH_FILE="node_modules/next/dist/compiled/@edge-runtime/primitives/fetch.js"
python3 << 'PYEOF'
import sys
path = 'node_modules/next/dist/compiled/@edge-runtime/primitives/fetch.js'
with open(path) as f: content = f.read()
old = "          throw new TypeError(\n            `Cannot convert argument to a ByteString because the character at index ${index} has a value of ${x.charCodeAt(index)} which is greater than 255.`\n          );"
new = "          return x.slice(0, index > 0 ? index - 1 : 0);"
if old in content:
    with open(path, 'w') as f: f.write(content.replace(old, new))
    print("Patched OK")
else:
    print("Already patched or not found")
PYEOF
