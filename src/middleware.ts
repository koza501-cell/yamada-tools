// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bug 7: HTTPS redirect
  if (request.headers.get('x-forwarded-proto') === 'http') {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Admin protection (existing logic)
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !pathname.startsWith("/admin/login/")
  ) {
    const adminToken = request.cookies.get("admin_token")?.value;
    const expectedToken = process.env.ADMIN_SECRET_TOKEN;
    if (!adminToken || adminToken !== expectedToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Inject pathname header so layout.tsx can conditionally render page-specific schemas
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\.ico|.*\.png$|.*\.webp$|.*\.ico$).*)"],
};
