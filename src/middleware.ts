import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, API_CONFIG } from "./lib/config/api";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get token from cookies
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // If no token and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists, verify it with the server
  if (token) {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh validation
      });

      // Invalid token, server rejected it
      if (!response.ok) {
        const redirectResponse = NextResponse.redirect(
          new URL("/login", request.url)
        );
        redirectResponse.cookies.delete(AUTH_COOKIE_NAME);
        return redirectResponse;
      }

      const user = await response.json();

      // Check if user is admin
      if (user.type !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      // If authenticated and trying to access login page, redirect to dashboard
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Create response and ensure cookies are preserved
      const response2 = NextResponse.next();
      response2.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });
      return response2;
    } catch (error) {
      console.error("Middleware auth error:", error);
      // Network error or invalid response, clear token and redirect to login
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      redirectResponse.cookies.delete(AUTH_COOKIE_NAME);
      return redirectResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
