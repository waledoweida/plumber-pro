import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, sanitizeSlug } from "@/lib/auth";
import { parseMedia } from "@/lib/media";
import { submitIndexNow } from "@/lib/indexnow";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    await prisma.article.findMany({ orderBy: { publishedAt: "desc" } })
  );
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
  const title = String(b.title || "").trim().slice(0, 160);
  if (!title) return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  try {
    const row = await prisma.article.create({
      data: {
        title,
        slug: sanitizeSlug(b.slug || title),
        excerpt: String(b.excerpt || "").slice(0, 400),
        content: String(b.content || "").slice(0, 20000),
        image: String(b.image || "").slice(0, 500),
        media: JSON.stringify(parseMedia(b.media)),
        published: b.published !== false,
      },
    });
    if (row.published) await submitIndexNow([`/blog/${row.slug}`, "/blog"]);
    return NextResponse.json(row);
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "slug مكرر" }, { status: 409 });
    return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
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
    const row = await prisma.article.update({
      where: { id: String(b.id) },
      data: {
        title: String(b.title || "").slice(0, 160),
        slug: b.slug ? sanitizeSlug(b.slug) : undefined,
        excerpt: String(b.excerpt || "").slice(0, 400),
        content: String(b.content || "").slice(0, 20000),
        image: String(b.image || "").slice(0, 500),
        media: JSON.stringify(parseMedia(b.media)),
        published: Boolean(b.published),
      },
    });
    if (row.published) await submitIndexNow([`/blog/${row.slug}`]);
    return NextResponse.json(row);
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    if (e?.code === "P2002") return NextResponse.json({ error: "slug مكرر" }, { status: 409 });
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

// زر «ظاهر/مخفي» في قائمة المقالات: يغيّر حالة العرض بس بدون ما يلمس باقي المقال
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let b: any;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  if (!b.id || typeof b.published !== "boolean") return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  try {
    const row = await prisma.article.update({ where: { id: String(b.id) }, data: { published: b.published } });
    if (row.published && row.publishedAt <= new Date()) await submitIndexNow([`/blog/${row.slug}`, "/blog"]);
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
    await prisma.article.delete({ where: { id: String(b.id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
