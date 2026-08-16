import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, verifyAdminToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/admin-session";

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

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLoginRoute = pathname === "/admin/login";
  if (isAdminRoute && !isAdminLoginRoute) {
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const validAdmin = adminToken ? verifyAdminToken(adminToken) : false;
    if (!validAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  if (isAdminLoginRoute) {
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (adminToken && verifyAdminToken(adminToken)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
