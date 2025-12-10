#!/bin/bash

# Find the line number where getPublishedPosts is called
LINE_NUM=$(grep -n "const staticBlogs = getPublishedPosts();" src/app/page.tsx | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
  echo "Pattern not found, creating complete fix..."
  
  # Backup original
  cp src/app/page.tsx src/app/page.tsx.backup
  
  # Add the getDynamicBlogs function and fix blog loading
  # We need to insert after imports but before the default export
  sed -i '/import.*getPublishedPosts/a\
import fs from '"'"'fs'"'"';\
import path from '"'"'path'"'"';\
\
function getDynamicBlogs() {\
  try {\
    const blogsPath = path.join(process.cwd(), '"'"'src/data/dynamicBlogs.json'"'"');\
    if (fs.existsSync(blogsPath)) {\
      const fileContent = fs.readFileSync(blogsPath, '"'"'utf-8'"'"');\
      return JSON.parse(fileContent);\
    }\
  } catch (error) {\
    console.error('"'"'Error loading dynamic blogs:'"'"', error);\
  }\
  return [];\
}' src/app/page.tsx

  # Fix the blog loading section
  sed -i 's/const staticBlogs = getPublishedPosts();/const staticBlogs = getPublishedPosts();\
  const dynamicBlogsData = getDynamicBlogs();\
  const allBlogs = [...dynamicBlogsData, ...staticBlogs].sort((a, b) => {\
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();\
  });/g' src/app/page.tsx
  
  sed -i 's/const recentBlogs = staticBlogs\.slice(0, 3);/const recentBlogs = allBlogs.slice(0, 3);/g' src/app/page.tsx

else
  echo "Found at line $LINE_NUM, applying targeted fix..."
  sed -i "${LINE_NUM}a\
  const dynamicBlogsData = getDynamicBlogs();\
  const allBlogs = [...dynamicBlogsData, ...staticBlogs].sort((a, b) => {\
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();\
  });" src/app/page.tsx
  
  NEXT_LINE=$((LINE_NUM + 1))
  sed -i "${NEXT_LINE}s/const recentBlogs = staticBlogs\.slice(0, 3);/const recentBlogs = allBlogs.slice(0, 3);/" src/app/page.tsx
fi

echo "✅ Fix applied!"
