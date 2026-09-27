import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Clock, ListOrdered } from "lucide-react";
import { pageMeta, ogImage, seoDescription, breadcrumbs, SITE_URL, BUSINESS_ID } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { SetWaMessage } from "@/components/WaMessage";
import { getSiteSettings } from "@/lib/content";
import { getEnArticle, getEnArticles } from "@/lib/en-blog";
import { renderArticle, parseHeadings, readingMinutes, responsive } from "@/lib/markdown";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getEnArticle(decodeURIComponent((await params).slug));
  if (!a) return { title: "Article not found" };
  return pageMeta({
    title: a.title,
    absoluteTitle: true,
    description: seoDescription(a.excerpt, `${BRAND.nameEn} — plumbers in Kuwait, 24/7`),
    path: `/en/blog/${a.slug}`,
    siteName: BRAND.nameEn,
    type: "article",
    publishedTime: new Date(a.publishedAt).toISOString(),
    image: ogImage("articles", a.slug, "en") || a.image,
    lang: "en",
    alternate: `/blog/${a.slug}`,
  });
}

export default async function EnArticlePage({ params }: Props) {
  const a = await getEnArticle(decodeURIComponent((await params).slug));
  if (!a) notFound();
  const [site, all] = await Promise.all([getSiteSettings(), getEnArticles()]);
  const headings = parseHeadings(a.content);
  const minutes = readingMinutes(a.content);
  const related = all.filter((r) => r.slug !== a.slug).slice(0, 3);
  const url = `${SITE_URL}/en/blog/${a.slug}`;

  return (
    <article dir="ltr" className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <SetWaMessage message={`Hi, I saw "${a.title.split(":")[0]}" on your site and have a question`} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: a.title.slice(0, 110),
            description: a.excerpt,
            datePublished: new Date(a.publishedAt).toISOString(),
            dateModified: new Date(a.publishedAt).toISOString(),
            wordCount: a.content.split(/\s+/).filter(Boolean).length,
            inLanguage: "en",
            mainEntityOfPage: url,
            url,
            image: `${SITE_URL}${a.image}`,
            author: { "@type": "Organization", name: BRAND.nameEn, url: `${SITE_URL}/en` },
            publisher: { "@id": BUSINESS_ID },
          },
          breadcrumbs([
            { name: "Home", path: "/en" },
            { name: "Blog", path: "/en/blog" },
            { name: a.title, path: `/en/blog/${a.slug}` },
          ]),
        ]}
      />
      <Link href="/en/blog" className="text-brand-700 text-sm inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Blog
      </Link>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.image} {...responsive(a.image)} alt={a.title} fetchPriority="high" width={1200} height={675} className="w-full h-auto aspect-[16/9] object-cover rounded-2xl mb-6" />
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <time dateTime={new Date(a.publishedAt).toISOString()}>
          {new Date(a.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </time>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {minutes} min read</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-2 mb-4 leading-snug">{a.title}</h1>
      {headings.length >= 3 && (
        <nav aria-label="Contents" className="my-6 bg-white border rounded-2xl p-5">
          <p className="font-bold text-slate-900 mb-3 inline-flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-brand-700" /> Contents
          </p>
          <ol className="space-y-1.5 text-sm ps-5 list-decimal marker:text-brand-700">
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="text-slate-700 hover:text-brand-700 hover:underline">{h.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="max-w-none text-slate-700 leading-loose text-base sm:text-lg">{renderArticle(a.content)}</div>
      <div className="mt-10 bg-brand-50 rounded-2xl p-6 text-center">
        <p className="mb-3 font-semibold text-brand-900">Need a plumber now?</p>
        <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 bg-brand-700 text-white font-bold px-6 py-3 rounded-xl">
          <Phone className="w-5 h-5" />
          {site.phone}
        </a>
      </div>
      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="text-xl font-bold text-brand-900 mb-4">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/en/blog/${r.slug}`} className="bg-white border rounded-2xl overflow-hidden hover:shadow-md hover:border-brand-300 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} {...responsive(r.image)} alt={r.title} loading="lazy" decoding="async" className="w-full aspect-[16/9] object-cover" />
                <p className="p-3 text-sm font-bold text-slate-900 leading-snug line-clamp-2">{r.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="h-20" aria-hidden />
    </article>
  );
}
