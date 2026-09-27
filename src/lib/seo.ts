import type { Metadata } from "next";

import { SITE_URL } from "./brand";
import { OG_SLUGS } from "./og-images";
export { SITE_URL };

// وصف مناسب لجوجل (70–160 حرف): لو الوصف قصير نكمّله بجملة عامة عن الخدمة
export function seoDescription(text: string, extra: string): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  const full = clean.length >= 70 ? clean : [clean, extra].filter(Boolean).join(" — ");
  return full.length > 160 ? full.slice(0, 157).replace(/\s+\S*$/, "") + "…" : full;
}

// رابط canonical مُرمّز صح للروابط العربية
export function canonicalPath(path: string): string {
  return path.split("/").map((s) => encodeURIComponent(decodeURIComponent(s))).join("/") || "/";
}

// metadata موحّدة لكل صفحة: عنوان + وصف + canonical + Open Graph
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  siteName: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  absoluteTitle?: boolean;
  lang?: "ar" | "en";
  // مسار نفس الصفحة باللغة الثانية (hreflang)
  alternate?: string;
}): Metadata {
  const url = canonicalPath(opts.path);
  const en = opts.lang === "en";
  const languages = opts.alternate
    ? en
      ? { "ar-KW": canonicalPath(opts.alternate), "en-KW": url, "x-default": canonicalPath(opts.alternate) }
      : { "ar-KW": url, "en-KW": canonicalPath(opts.alternate), "x-default": url }
    : undefined;
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      type: opts.type || "website",
      locale: en ? "en_US" : "ar_KW",
      siteName: opts.siteName,
      url,
      title: opts.title,
      description: opts.description,
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      images: [{ url: opts.image || defaultOg(en ? "en" : "ar"), width: 1200, height: 630, alt: opts.title }],
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [opts.image || defaultOg(en ? "en" : "ar")] },
  };
}

// صور المشاركة (واتساب/فيسبوك/X): صورة خاصة لكل خدمة ومنطقة ومقال إذا موجودة بـ public/og
export const defaultOg = (lang: "ar" | "en" = "ar") => (lang === "en" ? "/og/default-en.jpg" : "/og/default.jpg");
export function ogImage(kind: keyof typeof OG_SLUGS, slug: string, lang: "ar" | "en" = "ar"): string | undefined {
  if (!(OG_SLUGS[kind] as readonly string[]).includes(slug)) return undefined;
  const hasEn = kind !== "articles" || !["5-signs-need-plumber", "leak-without-breaking"].includes(slug);
  return `/og/${kind}/${lang === "en" && hasEn ? "en-" : ""}${slug}.jpg`;
}

// عنوان بدون تكرار اسم الموقع (القالب في layout بيضيفه)
export function stripSiteName(title: string, siteName: string): string {
  return title.replace(new RegExp(`\\s*[|\\-–—]\\s*${siteName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`), "").trim();
}

// JSON-LD آمن داخل <script>
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export const BUSINESS_ID = `${SITE_URL}/#business`;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE_URL + canonicalPath(it.path),
    })),
  };
}

export const intlPhone = (p: string) => "+965" + p.replace(/\D/g, "").replace(/^965/, "");
