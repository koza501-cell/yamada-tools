import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const STAGING_CREDENTIALS = 'eWFtYWRhOnN0YWdpbmcyMDI2'; // yamada:staging2026
const BLOG_PER_PAGE = 12;

// Cached per-process — resets on PM2 restart (i.e., every deploy)
let _blogMaxPage: number | null = null;

function getBlogMaxPage(): number {
  if (_blogMaxPage !== null) return _blogMaxPage;
  try {
    const filePath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const blogs: Array<{ publishDate: string }> = JSON.parse(raw);
    if (!Array.isArray(blogs)) { _blogMaxPage = 9999; return _blogMaxPage; }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const count = blogs.filter(b => new Date(b.publishDate) <= today).length;
    _blogMaxPage = Math.max(1, Math.ceil(count / BLOG_PER_PAGE));
  } catch {
    _blogMaxPage = 9999; // fail open — don't accidentally block valid pages
  }
  return _blogMaxPage;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Belt-and-suspenders: auth only when host is EXACTLY staging AND env var is set.
  // Even if STAGING_AUTH_USER leaks into production .env.local, the hostname check
  // prevents the auth challenge from ever firing on yamada-tools.jp.
  const isStaging =
    host === 'staging.yamada-tools.jp' &&
    !!process.env.STAGING_AUTH_USER;

  if (isStaging) {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Basic ') || auth.slice(6) !== STAGING_CREDENTIALS) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Staging - authorized access only"',
        },
      });
    }
  }

  // Blog page-number out-of-range → true HTTP 404
  if (request.nextUrl.pathname === '/blog') {
    const pageParam = request.nextUrl.searchParams.get('page');
    if (pageParam !== null) {
      const p = parseInt(pageParam, 10);
      if (isNaN(p) || p < 1 || p > getBlogMaxPage()) {
        const url = request.nextUrl.clone();
        url.pathname = '/_not-found';
        return NextResponse.rewrite(url);
      }
    }
  }

  const response = NextResponse.next();
  try {
    response.headers.set('x-pathname', encodeURIComponent(request.nextUrl.pathname));
  } catch {
    response.headers.set('x-pathname', '/');
  }

  // Noindex for staging and local dev — production guard ensures yamada-tools.jp is never blocked
  if (!host.includes('yamada-tools.jp') && (host.includes('staging') || host.includes('localhost'))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|logo).*)'],
};
