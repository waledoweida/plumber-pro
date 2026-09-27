import type { MetadataRoute } from "next";
import { getArticles, getAreas, getServices } from "@/lib/content";
import { isComboService } from "@/lib/combos";
import { enArticle } from "@/lib/en-articles";
import { SITE_URL } from "@/lib/brand";

// خريطة موقع ديناميكية: أي مقال/خدمة/منطقة جديدة تظهر لجوجل تلقائيًا
export const dynamic = "force-dynamic";

const BASE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, areas, articles] = await Promise.all([getServices(), getAreas(), getArticles()]);
  const url = (p: string) => BASE + p.split("/").map(encodeURIComponent).join("/");

  return [
    { url: BASE + "/", priority: 1 },
    { url: BASE + "/services", priority: 0.9 },
    { url: BASE + "/contact", priority: 0.8 },
    { url: BASE + "/about", priority: 0.7 },
    { url: BASE + "/blog", priority: 0.7 },
    { url: BASE + "/privacy", priority: 0.3 },
    { url: BASE + "/terms", priority: 0.3 },
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), priority: 0.8 })),
    ...areas.map((a) => ({ url: url(`/areas/${a.slug}`), priority: 0.7 })),
    ...services
      .filter((s) => isComboService(s.slug))
      .flatMap((s) => areas.map((a) => ({ url: url(`/services/${s.slug}/${a.slug}`), priority: 0.6 }))),
    // النسخة الإنجليزية
    { url: BASE + "/en", priority: 0.8 },
    { url: BASE + "/en/services", priority: 0.7 },
    { url: BASE + "/en/contact", priority: 0.6 },
    { url: BASE + "/en/about", priority: 0.5 },
    { url: BASE + "/en/blog", priority: 0.5 },
    { url: BASE + "/en/privacy", priority: 0.2 },
    { url: BASE + "/en/terms", priority: 0.2 },
    ...services.map((s) => ({ url: url(`/en/services/${s.slug}`), priority: 0.6 })),
    ...areas.map((a) => ({ url: url(`/en/areas/${a.slug}`), priority: 0.6 })),
    ...articles.map((a) => ({
      url: url(`/blog/${a.slug}`),
      lastModified: a.publishedAt,
      priority: 0.6,
      ...(a.image ? { images: [a.image.startsWith("/") ? BASE + a.image : a.image] } : {}),
    })),
    ...articles.flatMap((a) => {
      const t = enArticle(a.slug);
      return t ? [{ url: url(`/en/blog/${a.slug}`), lastModified: a.publishedAt, priority: 0.5, images: [BASE + t.image] }] : [];
    }),
  ];
}
