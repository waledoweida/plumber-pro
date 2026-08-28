import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const rate = new Map<string, { n: number; t: number }>();

function okRate(ip: string) {
  const now = Date.now();
  const row = rate.get(ip);
  if (!row || now > row.t) {
    rate.set(ip, { n: 1, t: now + 10 * 60 * 1000 });
    return true;
  }
  if (row.n >= 8) return false;
  row.n++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (!okRate(ip)) {
    return NextResponse.json({ error: "محاولات كثيرة، حاول لاحقًا" }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  // honeypot
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const phone = String(body.phone || "").trim().replace(/[^\d+]/g, "").slice(0, 20);
  const area = String(body.area || "").trim().slice(0, 80);
  const service = String(body.service || "").trim().slice(0, 120);
  const message = String(body.message || "").trim().slice(0, 1000);

  if (name.length < 2) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  if (phone.length < 8) {
    return NextResponse.json({ error: "رقم هاتف صحيح مطلوب" }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.create({
      data: { name, phone, area, service, message, status: "new" },
    });
    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "تعذر حفظ الطلب" }, { status: 500 });
  }
}
