import { NextRequest, NextResponse } from "next/server";

const ALLOWED_PREFIXES = [
  "/coming-soon",
  "/admin",
  "/api",
  "/ads.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/logo-diandidigital.png",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérification légère (présence du cookie uniquement) pour l'UX — la
  // vraie vérification de session a lieu côté serveur dans
  // app/admin/(protected)/layout.tsx via firebase-admin.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.cookies.has("__session")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (process.env.MAINTENANCE_MODE !== "true") return NextResponse.next();

  if (ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
