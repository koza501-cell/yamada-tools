import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STAGING_CREDENTIALS = 'eWFtYWRhOnN0YWdpbmcyMDI2'; // yamada:staging2026

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

  const response = NextResponse.next();
  response.headers.set('x-pathname', encodeURIComponent(request.nextUrl.pathname));

  // Noindex for staging and local dev — production guard ensures yamada-tools.jp is never blocked
  if (!host.includes('yamada-tools.jp') && (host.includes('staging') || host.includes('localhost'))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|logo).*)'],
};
