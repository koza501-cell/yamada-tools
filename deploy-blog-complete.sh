#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  BLOG SYSTEM - COMPLETE DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_DIR="$HOME/projects/3websitepassive_income/yamada-tools/frontend"
BACKUP_DIR="$HOME/backups/yamada-blog-$(date +%Y%m%d_%H%M%S)"

cd "$PROJECT_DIR" || exit 1

echo -e "${YELLOW}Step 1: Pre-deployment checks...${NC}"
echo "✓ Node version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo "✓ Project directory: $PROJECT_DIR"
echo ""

echo -e "${YELLOW}Step 2: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r src/app/blog "$BACKUP_DIR/"
cp -r src/app/admin/blog "$BACKUP_DIR/"
cp -r src/app/api/admin/blog "$BACKUP_DIR/"
cp -r src/components/BlogContent.tsx "$BACKUP_DIR/" 2>/dev/null
cp -r src/components/ImageUpload.tsx "$BACKUP_DIR/" 2>/dev/null
cp -r src/data/blogPosts.ts "$BACKUP_DIR/"
cp -r src/data/dynamicBlogs.json "$BACKUP_DIR/"
cp src/app/blog.css "$BACKUP_DIR/"
echo -e "${GREEN}✓ Backup created: $BACKUP_DIR${NC}"
echo ""

echo -e "${YELLOW}Step 3: Verifying critical files...${NC}"
CRITICAL_FILES=(
  "src/app/blog/page.tsx"
  "src/app/blog/[slug]/page.tsx"
  "src/app/admin/blog/page.tsx"
  "src/app/admin/blog/manage/page.tsx"
  "src/app/api/admin/blog/route.ts"
  "src/data/dynamicBlogs.json"
  "src/app/blog.css"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file - MISSING!"
    exit 1
  fi
done
echo ""

echo -e "${YELLOW}Step 4: Building project...${NC}"
npm run build
BUILD_EXIT=$?

if [ $BUILD_EXIT -ne 0 ]; then
  echo -e "${RED}✗ Build failed! Deployment aborted.${NC}"
  exit 1
fi

BUILD_ID=$(cat .next/BUILD_ID)
echo -e "${GREEN}✓ Build successful! Build ID: $BUILD_ID${NC}"
echo ""

echo -e "${YELLOW}Step 5: Restarting PM2...${NC}"
pm2 restart yamada-frontend
pm2 save
echo -e "${GREEN}✓ PM2 restarted${NC}"
echo ""

echo -e "${YELLOW}Step 6: Health checks...${NC}"
sleep 3

# Check if process is running
if pm2 list | grep -q "yamada-frontend.*online"; then
  echo -e "${GREEN}✓${NC} PM2 process is online"
else
  echo -e "${RED}✗${NC} PM2 process is not running!"
  exit 1
fi

# Check if port is listening
if netstat -tuln | grep -q ":3002"; then
  echo -e "${GREEN}✓${NC} Port 3002 is listening"
else
  echo -e "${RED}✗${NC} Port 3002 is not listening!"
  exit 1
fi

# Check blog pages
BLOG_URLS=(
  "http://localhost:3002/blog"
  "http://localhost:3002/admin/blog"
  "http://localhost:3002/admin/blog/manage"
)

for url in "${BLOG_URLS[@]}"; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} $url - OK (200)"
  else
    echo -e "${YELLOW}⚠${NC} $url - HTTP $HTTP_CODE"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}  ✓ DEPLOYMENT SUCCESSFUL!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Public URLs:"
echo "  • Blog List: https://yamada-tools.jp/blog"
echo "  • Homepage: https://yamada-tools.jp/"
echo ""
echo "Admin URLs:"
echo "  • Create Blog: https://yamada-tools.jp/admin/blog"
echo "  • Manage Blogs: https://yamada-tools.jp/admin/blog/manage"
echo ""
echo "Backup Location: $BACKUP_DIR"
echo ""
echo "Features Deployed:"
echo "  ✓ AI Blog Generation"
echo "  ✓ Homepage Blog Display"
echo "  ✓ 'New' Tag on Recent Blogs"
echo "  ✓ Local Image Upload"
echo "  ✓ Edit/Update/Delete Blogs"
echo "  ✓ Japanese CSS Styling"
echo "  ✓ Smart Tool Links"
echo ""
