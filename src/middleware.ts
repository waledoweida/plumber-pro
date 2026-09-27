import { NextResponse, type NextRequest } from "next/server";

// يحدد لغة الصفحة (عربي / إنجليزي) عشان الـ layout يضبط lang و dir
export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const headers = new Headers(req.headers);
  headers.set("x-locale", p === "/en" || p.startsWith("/en/") ? "en" : "ar");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
