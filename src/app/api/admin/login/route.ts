import { NextRequest, NextResponse } from "next/server";
import {
  checkLoginRateLimit,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { timingSafeEqual } from "crypto";

function safeEqual(a: string, b: string) {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkLoginRateLimit(ip)) {
    return NextResponse.json(
      { error: "محاولات كثيرة. حاول بعد 15 دقيقة." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password || "");
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      // فشل آمن: بدون ADMIN_PASSWORD مضبوط في الإنتاج، نرفض كل محاولات الدخول
      // بدل الرجوع لكلمة مرور افتراضية معروفة (admin123) يقدر أي حد يخمّنها.
      console.error("ADMIN_PASSWORD غير مضبوط في بيئة الإنتاج — تم رفض محاولة الدخول.");
      return NextResponse.json(
        { error: "الإعداد غير مكتمل على الخادم. تواصل مع المسؤول." },
        { status: 503 }
      );
    }
  }
  const devFallback = process.env.NODE_ENV === "production" ? "" : "admin123";
  if (!safeEqual(password, expected || devFallback)) {
    return NextResponse.json({ error: "كلمة المرور خاطئة" }, { status: 401 });
  }

  let token: string;
  try {
    token = createSessionToken();
  } catch (e) {
    console.error("createSessionToken error:", e);
    return NextResponse.json(
      { error: "الإعداد غير مكتمل على الخادم. تواصل مع المسؤول." },
      { status: 503 }
    );
  }
  const res = NextResponse.json({ ok: true });
  const opts = sessionCookieOptions(token);
  res.cookies.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: opts.sameSite,
    secure: opts.secure,
    maxAge: opts.maxAge,
  });
  return res;
}
