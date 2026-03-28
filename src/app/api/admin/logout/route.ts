// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  
  // Clear the admin_token cookie
  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
