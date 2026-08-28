import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await prisma.whyPoint.findMany({ orderBy: { order: "asc" } }));
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let points: unknown;
  try {
    points = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  if (!Array.isArray(points)) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  const cleaned = points
    .map((p) => String(p ?? "").trim().slice(0, 300))
    .filter(Boolean)
    .slice(0, 30);

  try {
    // نستخدم transaction بدل حذف ثم إعادة إنشاء منفصلين، حتى لا نفقد البيانات
    // بالكامل لو حصل خطأ في منتصف العملية.
    await prisma.$transaction([
      prisma.whyPoint.deleteMany(),
      ...cleaned.map((text, i) => prisma.whyPoint.create({ data: { text, order: i } })),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("why update error:", e);
    return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
  }
}
