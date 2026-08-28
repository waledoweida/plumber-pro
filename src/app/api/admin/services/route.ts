import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, sanitizeSlug } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await prisma.service.findMany({ orderBy: { order: "asc" } }));
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  const title = String(body.title || "").trim();
  if (!title || title.length > 120) {
    return NextResponse.json({ error: "عنوان الخدمة مطلوب" }, { status: 400 });
  }
  const features = Array.isArray(body.features)
    ? JSON.stringify(body.features.slice(0, 20).map((f: unknown) => String(f).slice(0, 200)))
    : "[]";

  try {
    const s = await prisma.service.create({
      data: {
        slug: sanitizeSlug(body.slug || title),
        title: title.slice(0, 120),
        short: String(body.short || "").slice(0, 300),
        description: String(body.description || "").slice(0, 5000),
        icon: String(body.icon || "Wrench").slice(0, 40),
        image: String(body.image || "").slice(0, 500),
        features,
        order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
        published: body.published !== false,
      },
    });
    return NextResponse.json(s);
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "الـ slug مستخدم مسبقًا" }, { status: 409 });
    }
    return NextResponse.json({ error: "فشل الإنشاء" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });

  const features = Array.isArray(body.features)
    ? JSON.stringify(body.features.slice(0, 20).map((f: unknown) => String(f).slice(0, 200)))
    : typeof body.features === "string"
      ? body.features
      : undefined;

  try {
    const s = await prisma.service.update({
      where: { id: String(body.id) },
      data: {
        ...(body.title != null && { title: String(body.title).slice(0, 120) }),
        ...(body.short != null && { short: String(body.short).slice(0, 300) }),
        ...(body.description != null && { description: String(body.description).slice(0, 5000) }),
        ...(body.icon != null && { icon: String(body.icon).slice(0, 40) }),
        ...(body.image != null && { image: String(body.image).slice(0, 500) }),
        ...(features != null && { features }),
        ...(body.order != null && { order: Number(body.order) || 0 }),
        ...(body.published != null && { published: Boolean(body.published) }),
        ...(body.slug != null && { slug: sanitizeSlug(body.slug) }),
      },
    });
    return NextResponse.json(s);
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    if (e?.code === "P2002") return NextResponse.json({ error: "slug مكرر" }, { status: 409 });
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });
  try {
    await prisma.service.delete({ where: { id: String(body.id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
