import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

const ALLOWED = new Set([
  "showHero",
  "showServices",
  "showWhy",
  "showAreas",
  "showCta",
  "showFloating",
]);

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await prisma.visibility.findMany();
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.id, r.visible])));
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

  for (const [id, visible] of Object.entries(body)) {
    if (!ALLOWED.has(id)) continue;
    if (typeof visible !== "boolean") continue;
    await prisma.visibility.upsert({
      where: { id },
      update: { visible },
      create: { id, visible },
    });
  }
  return NextResponse.json({ ok: true });
}
