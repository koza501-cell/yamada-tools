import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STAGING_CREDENTIALS = 'eWFtYWRhOnN0YWdpbmcyMDI2'; // yamada:staging2026

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const isStaging = host.includes('staging');

  // Staging basic auth
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

  // Staging: noindex + nofollow
  if (isStaging || host.includes('localhost')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|logo).*)'],
};
