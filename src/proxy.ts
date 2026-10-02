import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const locale = path.startsWith("/ar")
    ? "ar"
    : path.startsWith("/admin") &&
        request.cookies.get("admin_locale")?.value === "ar"
      ? "ar"
      : "en";
  const headers = new Headers(request.headers);
  headers.set("x-tawreed-locale", locale);
  return NextResponse.next({ request: { headers } });
}
export const config = {
  matcher: ["/", "/en/:path*", "/ar/:path*", "/admin/:path*"],
};
