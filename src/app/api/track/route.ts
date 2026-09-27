import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { consumeRateLimit } from "@/lib/rateLimit";
import { EVENT_TYPES, isBot, kuwaitDay, type EventType } from "@/lib/analytics";

export const runtime = "nodejs";

// نفس الزائر على نفس الصفحة خلال المدة دي = زيارة واحدة (تحديث الصفحة ما يتحسبش)
const DEDUPE_MS: Record<EventType, number> = {
  view: 30 * 60 * 1000,
  whatsapp: 60 * 1000,
  phone: 60 * 1000,
};

function osOf(ua: string): string {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac OS X|Macintosh/i.test(ua)) return "mac";
  if (/Linux|CrOS/i.test(ua)) return "linux";
  return "other";
}

// Netlify بيبعت الموقع الجغرافي في x-nf-geo (JSON بـ base64)
function geoFrom(req: NextRequest): { country: string; city: string } {
  let country = req.headers.get("x-country") || "";
  let city = "";
  const raw = req.headers.get("x-nf-geo");
  if (raw) {
    try {
      const g = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
      country = g?.country?.code || country;
      city = g?.city || "";
    } catch {}
  }
  return { country: country.toUpperCase().slice(0, 2), city: String(city).slice(0, 60) };
}

const ok = () => new NextResponse(null, { status: 204 });

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  // المتصفحات الحقيقية دايمًا بتبعت لغة؛ أغلب السكربتات لا
  if (isBot(ua) || !req.headers.get("accept-language")) return ok();

  // لازم الطلب يكون من الموقع نفسه
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return ok();

  // زياراتك إنت كأدمن ما تتحسبش
  if (await isAdminAuthenticated()) return ok();

  let b: any;
  try {
    b = JSON.parse(await req.text());
  } catch {
    return ok();
  }
  const type = String(b?.type) as EventType;
  if (!EVENT_TYPES.includes(type)) return ok();
  const path = String(b?.path || "/").slice(0, 200);
  if (!path.startsWith("/") || path.startsWith("/admin")) return ok();

  let referrer = "";
  try {
    const r = new URL(String(b?.ref || ""));
    if (r.host !== host) referrer = r.host.replace(/^www\./, "").slice(0, 100);
  } catch {}

  const utm = String(b?.utm || "").toLowerCase().replace(/[^a-z0-9_./-]/g, "").slice(0, 60);
  const { country, city } = geoFrom(req);

  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const now = new Date();
  const visitor = createHash("sha256")
    .update(`${process.env.ADMIN_SECRET || ""}|${ip}|${ua}|${kuwaitDay(now)}`)
    .digest("hex")
    .slice(0, 32);

  if (!(await consumeRateLimit(`track:${visitor}`, 120, 60 * 60 * 1000))) return ok();

  try {
    const dup = await prisma.event.findFirst({
      where: { visitor, type, path, createdAt: { gte: new Date(now.getTime() - DEDUPE_MS[type]) } },
      select: { id: true },
    });
    if (!dup) {
      await prisma.event.create({
        data: {
          type,
          path,
          visitor,
          referrer,
          utm,
          device: /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop",
          os: osOf(ua),
          country,
          city,
        },
      });
    }
  } catch (e) {
    console.error("track error", e);
  }
  return ok();
}
