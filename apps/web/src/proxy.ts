import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const isEmbedPage = url.pathname.startsWith("/embed/");

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://apis.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://images.unsplash.com;
    font-src 'self' data: https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors ${isEmbedPage ? "*" : "'none'"};
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // CSRF Protection: Origin/Referer Check
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const method = request.method;

  const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(method);
  const host = request.headers.get("host") || "";
  const protocol = request.nextUrl.protocol;
  const siteUrl = `${protocol}//${host}`;

  const isValidOrigin = origin ? origin === siteUrl : true;
  const isValidReferer = referer ? referer.startsWith(siteUrl) : true;

  if (!isSafeMethod && !isValidOrigin && !isValidReferer) {
    return new NextResponse("Invalid origin or referer", { status: 403 });
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSRF token cookie if not present
  if (!request.cookies.has("csrf-token")) {
    const csrfToken = crypto.randomUUID();
    response.cookies.set("csrf-token", csrfToken, {
      httpOnly: false, // Accessible by client to send in header
      secure: true,
      sameSite: "lax",
    });
  }

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(), interest-cohort=()",
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
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
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|widget.js).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
