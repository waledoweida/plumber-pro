// نسخة من دوال اللغة تشتغل بالمتصفح (بدون next/headers)
import { EN_ARTICLE_SLUGS } from "@/lib/en-article-slugs";

export const isEnPath = (p: string) => p === "/en" || p.startsWith("/en/");

const EN_PAGES = [/^\/$/, /^\/services$/, /^\/services\/[^/]+$/, /^\/areas\/[^/]+$/, /^\/contact$/, /^\/about$/, /^\/blog$/, /^\/privacy$/, /^\/terms$/];

export function altPath(pathname: string): string {
  if (isEnPath(pathname)) return pathname.replace(/^\/en/, "") || "/";
  const art = pathname.match(/^\/blog\/([^/]+)$/);
  if (art) return EN_ARTICLE_SLUGS.includes(decodeURIComponent(art[1])) ? `/en${pathname}` : "/en/blog";
  return EN_PAGES.some((r) => r.test(pathname)) ? (pathname === "/" ? "/en" : `/en${pathname}`) : "/en";
}
