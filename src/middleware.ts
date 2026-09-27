import { NextResponse, type NextRequest } from "next/server";

// الصفحات العامة تنحفظ على CDN حق Netlify دقيقة وحدة (وتنخدم من الكاش وهي تتحدّث بالخلفية)،
// فالموقع يفتح فورًا بدل ما السيرفر يبني الصفحة كل مرة. أي تعديل من لوحة التحكم يظهر خلال دقيقة تقريبًا.
const CDN_CACHE = "public, durable, s-maxage=60, stale-while-revalidate=604800";
const NO_CACHE = /^\/(admin|thank-you|en\/thank-you)(\/|$)/;

// يحدد لغة الصفحة (عربي / إنجليزي) عشان الـ layout يضبط lang و dir
export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const headers = new Headers(req.headers);
  headers.set("x-locale", p === "/en" || p.startsWith("/en/") ? "en" : "ar");
  const res = NextResponse.next({ request: { headers } });
  if (req.method === "GET" && !NO_CACHE.test(p) && !req.nextUrl.search) {
    res.headers.set("Netlify-CDN-Cache-Control", CDN_CACHE);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
