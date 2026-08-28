import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, SETTINGS_FIELDS } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json(s);
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

  const data: Record<string, string> = {};
  for (const key of SETTINGS_FIELDS) {
    if (key in body && typeof body[key] === "string") {
      data[key] = (body[key] as string).slice(0, key === "description" ? 2000 : 300);
    }
  }

  const s = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return NextResponse.json(s);
}
