import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, sanitizeSlug } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await prisma.area.findMany({ orderBy: { order: "asc" } }));
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
  if (!title) return NextResponse.json({ error: "اسم المنطقة مطلوب" }, { status: 400 });

  try {
    const a = await prisma.area.create({
      data: {
        slug: sanitizeSlug(body.slug || title),
        title: title.slice(0, 120),
        description: String(body.description || "").slice(0, 2000),
        excerpt: String(body.excerpt || "").slice(0, 500),
        content: String(body.content || "").slice(0, 10000),
        responseTime: String(body.responseTime || "30–60 دقيقة").slice(0, 80),
        order: Number(body.order) || 0,
        published: body.published !== false,
      },
    });
    return NextResponse.json(a);
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "slug مكرر" }, { status: 409 });
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
  try {
    const a = await prisma.area.update({
      where: { id: String(body.id) },
      data: {
        ...(body.title != null && { title: String(body.title).slice(0, 120) }),
        ...(body.slug != null && { slug: sanitizeSlug(body.slug) }),
        ...(body.description != null && { description: String(body.description).slice(0, 2000) }),
        ...(body.excerpt != null && { excerpt: String(body.excerpt).slice(0, 500) }),
        ...(body.content != null && { content: String(body.content).slice(0, 10000) }),
        ...(body.responseTime != null && { responseTime: String(body.responseTime).slice(0, 80) }),
        ...(body.order != null && { order: Number(body.order) || 0 }),
        ...(body.published != null && { published: Boolean(body.published) }),
      },
    });
    return NextResponse.json(a);
  } catch {
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
    await prisma.area.delete({ where: { id: String(body.id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
