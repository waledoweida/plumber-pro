import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "admin_session";
const DEV_FALLBACK_SECRET = "dev-only-insecure-secret";

/**
 * يرجع السر المستخدم لتوقيع الجلسة.
 * في الإنتاج: لازم ADMIN_SECRET (أو ADMIN_PASSWORD كحد أدنى) يكون مضبوط، وإلا نرمي خطأ
 * بدل ما نرجع لقيمة افتراضية معروفة يقدر أي حد يستغلها لتزوير جلسة أدمن.
 * في التطوير: نسمح بقيمة افتراضية غير حساسة لتسهيل التشغيل المحلي فقط.
 */
function secret(): string {
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SECRET (أو ADMIN_PASSWORD) غير مضبوط في بيئة الإنتاج. أضفه في متغيرات البيئة قبل التشغيل."
    );
  }
  return DEV_FALLBACK_SECRET;
}

export function createSessionToken(): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `admin:${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const expected = createHmac("sha256", secret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch (e) {
    // فشل آمن: أي خطأ (بما فيه غياب السر في الإنتاج) = رفض الدخول، وليس السماح به
    console.error("verifySessionToken error:", e);
    return false;
  }
  const parts = payload.split(":");
  const exp = Number(parts[1]);
  if (!exp || Date.now() > exp) return false;
  return parts[0] === "admin";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const c = await cookies();
  return verifySessionToken(c.get(COOKIE)?.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  };
}

/** simple in-memory rate limit for login (per process) */
const attempts = new Map<string, { count: number; reset: number }>();

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const row = attempts.get(ip);
  if (!row || now > row.reset) {
    attempts.set(ip, { count: 1, reset: now + 15 * 60 * 1000 });
    return true;
  }
  if (row.count >= 10) return false;
  row.count += 1;
  return true;
}

export function sanitizeSlug(input: string): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-_]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || `item-${Date.now()}`;
}

export const SETTINGS_FIELDS = [
  "name",
  "logoUrl",
  "tagline",
  "phone",
  "whatsapp",
  "email",
  "address",
  "hours",
  "description",
] as const;
