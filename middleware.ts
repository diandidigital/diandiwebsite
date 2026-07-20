import { NextRequest, NextResponse } from "next/server";

const ALLOWED_PREFIXES = [
  "/coming-soon",
  "/admin",
  "/api",
  "/ads.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/LOGO-DIANDIDIGITAL",
];

export function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "true") return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
