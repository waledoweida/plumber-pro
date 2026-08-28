import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

const MAX_KEY = 80;
const MAX_VALUE = 5000;
const MAX_KEYS = 80;

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await prisma.textContent.findMany();
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.id, r.value])));
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const entries = Object.entries(body).slice(0, MAX_KEYS);
  for (const [id, raw] of entries) {
    if (typeof id !== "string" || id.length > MAX_KEY || !/^[\w.\-]+$/.test(id)) continue;
    if (typeof raw !== "string") continue;
    const value = raw.slice(0, MAX_VALUE);
    await prisma.textContent.upsert({
      where: { id },
      update: { value },
      create: { id, value },
    });
  }
  return NextResponse.json({ ok: true });
}
