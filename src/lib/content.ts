import { cache } from "react";
import { prisma } from "./prisma";
import { normalizeSlug, slugCandidates } from "./slug";
import { BRAND } from "./brand";

const defaultSettings = {
  id: 1,
  name: BRAND.nameAr,
  logoUrl: "",
  faviconUrl: "",
  tagline: BRAND.tagline,
  phone: BRAND.phone,
  whatsapp: BRAND.whatsapp,
  email: BRAND.email,
  address: "الكويت - جميع المحافظات",
  hours: "24 ساعة / 7 أيام",
  description:
    "أفضل سباك صحي في الكويت - صيانة، تسليك مجاري، كشف تسربات بدون تكسير، وتركيب. خدمة 24 ساعة.",
};

/** Request-level cache: نفس الطلب ما يضربش الداتابيز مرتين */
export const getSiteSettings = cache(async () => {
  try {
    let s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!s) s = await prisma.siteSettings.create({ data: { id: 1 } });
    return s;
  } catch {
    return defaultSettings;
  }
});

export const getTexts = cache(async () => {
  try {
    const rows = await prisma.textContent.findMany();
    return Object.fromEntries(rows.map((r) => [r.id, r.value]));
  } catch {
    return {} as Record<string, string>;
  }
});

export const getVisibility = cache(async () => {
  try {
    const rows = await prisma.visibility.findMany();
    return Object.fromEntries(rows.map((r) => [r.id, r.visible]));
  } catch {
    return {} as Record<string, boolean>;
  }
});

export const getServices = cache(async () => {
  try {
    return await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
});

// بحث بالـ slug يتحمّل اختلاف ترميز الروابط العربية (انظر slugCandidates)
async function findBySlug<T extends { slug: string }>(
  raw: string,
  exact: (slugs: string[]) => Promise<T | null>,
  all: () => Promise<T[]>
): Promise<T | null> {
  try {
    const hit = await exact(slugCandidates(raw));
    if (hit) return hit;
    const want = normalizeSlug(raw);
    return (await all()).find((x) => normalizeSlug(x.slug) === want) ?? null;
  } catch {
    return null;
  }
}

export const getServiceBySlug = cache((slug: string) =>
  findBySlug(
    slug,
    (slugs) => prisma.service.findFirst({ where: { slug: { in: slugs } } }),
    () => prisma.service.findMany()
  )
);

export const getArticleBySlug = cache((slug: string) =>
  findBySlug(
    slug,
    (slugs) => prisma.article.findFirst({ where: { slug: { in: slugs } } }),
    () => prisma.article.findMany()
  )
);

export const getAreaBySlug = cache((slug: string) =>
  findBySlug(
    slug,
    (slugs) => prisma.area.findFirst({ where: { slug: { in: slugs } } }),
    () => prisma.area.findMany()
  )
);

export const getAreas = cache(async () => {
  try {
    return await prisma.area.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
});

export const getWhyPoints = cache(async () => {
  try {
    return await prisma.whyPoint.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
});

export const getArticles = cache(async (limit?: number) => {
  try {
    return await prisma.article.findMany({
      // المقالات المجدولة (تاريخ نشرها لسا ما جا) ما تظهر إلا بوقتها
      where: { published: true, publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });
  } catch {
    return [];
  }
});

export const getReviews = cache(async () => {
  try {
    return await prisma.review.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
});

export const getGallery = cache(async () => {
  try {
    return await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
});

/** المقال منشور وتاريخ نشره وصل (مو مجدول للمستقبل) */
export const isLive = (a: { published: boolean; publishedAt: Date | string }) =>
  a.published && new Date(a.publishedAt).getTime() <= Date.now();
