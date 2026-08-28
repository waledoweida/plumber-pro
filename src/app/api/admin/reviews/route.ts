import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await prisma.review.findMany({ orderBy: { order: "asc" } }));
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let b: any;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  const name = String(b.name || "").trim().slice(0, 80);
  if (!name) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  try {
    const row = await prisma.review.create({
      data: {
        name,
        area: String(b.area || "").slice(0, 80),
        rating: Math.min(5, Math.max(1, Number(b.rating) || 5)),
        text: String(b.text || "").slice(0, 1000),
        published: b.published !== false,
        order: Number(b.order) || 0,
      },
    });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "فشل الإنشاء" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let b: any;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  if (!b.id) return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });
  try {
    const row = await prisma.review.update({
      where: { id: String(b.id) },
      data: {
        name: String(b.name || "").slice(0, 80),
        area: String(b.area || "").slice(0, 80),
        rating: Math.min(5, Math.max(1, Number(b.rating) || 5)),
        text: String(b.text || "").slice(0, 1000),
        published: Boolean(b.published),
        order: Number(b.order) || 0,
      },
    });
    return NextResponse.json(row);
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let b: any;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  if (!b.id) return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });
  try {
    await prisma.review.delete({ where: { id: String(b.id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
