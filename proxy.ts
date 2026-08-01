import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_PREFIXES = ["/dashboard", "/licenses"];
const AUTH_ONLY_ROUTES = ["/login", "/signup"];
const COOKIE_NAME = "licensetrack_session";

async function hasValidSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthOnly = AUTH_ONLY_ROUTES.includes(pathname);

  if (!isProtected && !isAuthOnly) {
    return NextResponse.next();
  }

  const authed = await hasValidSession(req);

  if (isProtected && !authed) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthOnly && authed) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/licenses/:path*", "/login", "/signup"],
};
