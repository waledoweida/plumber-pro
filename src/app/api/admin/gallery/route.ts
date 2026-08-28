import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await prisma.galleryItem.findMany({ orderBy: { order: "asc" } }));
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
  const title = String(b.title || "").trim().slice(0, 120);
  const image = String(b.image || "").trim().slice(0, 500);
  if (!title || !image) {
    return NextResponse.json({ error: "العنوان والصورة مطلوبان" }, { status: 400 });
  }
  try {
    const row = await prisma.galleryItem.create({
      data: {
        title,
        image,
        caption: String(b.caption || "").slice(0, 300),
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
    const row = await prisma.galleryItem.update({
      where: { id: String(b.id) },
      data: {
        title: String(b.title || "").slice(0, 120),
        image: String(b.image || "").slice(0, 500),
        caption: String(b.caption || "").slice(0, 300),
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
    await prisma.galleryItem.delete({ where: { id: String(b.id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
