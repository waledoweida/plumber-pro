import { prisma } from "./prisma";

const defaultSettings = {
  id: 1,
  name: "دار السباكة",
  tagline: "سباك الكويت المعتمد",
  phone: "94021192",
  whatsapp: "96594021192",
  email: "info@plumberkuw.com",
  address: "الكويت - جميع المحافظات",
  hours: "24 ساعة / 7 أيام",
  description:
    "أفضل سباك صحي في الكويت - صيانة، تسليك مجاري، كشف تسربات بدون تكسير، وتركيب. خدمة 24 ساعة.",
};

export async function getSiteSettings() {
  try {
    let s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!s) s = await prisma.siteSettings.create({ data: { id: 1 } });
    return s;
  } catch {
    return defaultSettings;
  }
}

export async function getTexts() {
  try {
    const rows = await prisma.textContent.findMany();
    return Object.fromEntries(rows.map((r) => [r.id, r.value]));
  } catch {
    return {} as Record<string, string>;
  }
}

export async function getVisibility() {
  try {
    const rows = await prisma.visibility.findMany();
    return Object.fromEntries(rows.map((r) => [r.id, r.visible]));
  } catch {
    return {} as Record<string, boolean>;
  }
}

export async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getAreas() {
  try {
    return await prisma.area.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getWhyPoints() {
  try {
    return await prisma.whyPoint.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export async function getArticles(limit?: number) {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });
  } catch {
    return [];
  }
}

export async function getReviews() {
  try {
    return await prisma.review.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getGallery() {
  try {
    return await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}
