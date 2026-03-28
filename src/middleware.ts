// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow access to login page
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  // Check for admin_token cookie
  const adminToken = request.cookies.get("admin_token")?.value;
  const expectedToken = process.env.ADMIN_SECRET_TOKEN;

  if (!adminToken || adminToken !== expectedToken) {
    // Redirect to login page
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
