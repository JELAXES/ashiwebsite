import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/auth/session";

// Optimistic auth gate only — reads the session cookie, never touches the
// database (see Next.js Proxy docs: DB checks belong in the DAL, not here).
const APP_ROUTE_PREFIXES = [
  "/dashboard",
  "/tutor",
  "/acts",
  "/bookmarks",
  "/cases",
  "/history",
  "/profile",
  "/settings",
  "/study-tools",
  "/subjects",
];
const AUTH_ONLY_ROUTES = ["/login", "/signup"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;

  const isProtectedRoute =
    pathname === "/onboarding" ||
    APP_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);

  if (isProtectedRoute && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthOnlyRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
