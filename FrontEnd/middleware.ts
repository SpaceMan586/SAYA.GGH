import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  isJwtExpired,
} from "@/lib/adminSessionCookies";

const LOGIN_PATH = "/admin/login";
const DASHBOARD_PATH = "/admin/dashboard";

const hasServerSession = (req: NextRequest) => {
  const accessToken = req.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value || "";
  const refreshToken = req.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value || "";

  if (accessToken && !isJwtExpired(accessToken)) {
    return true;
  }

  return Boolean(refreshToken);
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === LOGIN_PATH;
  const authenticated = hasServerSession(req);

  if (isLoginRoute && authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!isLoginRoute && !authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    url.searchParams.set("next", pathname);

    const response = NextResponse.redirect(url);
    response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
    response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, "", {
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
