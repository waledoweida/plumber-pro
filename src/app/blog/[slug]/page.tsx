import { pageMeta, ogImage, seoDescription, stripSiteName, breadcrumbs, SITE_URL, BUSINESS_ID, canonicalPath } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { SetWaMessage } from "@/components/WaMessage";
import { waForArticle } from "@/lib/whatsapp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone, Clock, ListOrdered } from "lucide-react";
import { getArticleBySlug, getArticles, getSiteSettings, isLive } from "@/lib/content";
import { renderArticle, parseHeadings, readingMinutes, responsive } from "@/lib/markdown";
import { parseMedia, youtubeId } from "@/lib/media";
import { enArticle } from "@/lib/en-articles";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticleBySlug((await params).slug);
  if (!a || !isLive(a)) return { title: "مقال غير موجود" };
  const site = await getSiteSettings();
  return pageMeta({
    // اسم الشركة بيتضاف من القالب، فنشيله من العنوان لو موجود علشان ما يتكررش
    title: stripSiteName(a.title, site.name),
    description: seoDescription(a.excerpt || a.content, `${site.name} — سباكة وخدمات منزلية في الكويت 24 ساعة`),
    path: `/blog/${a.slug}`,
    siteName: site.name,
    type: "article",
    publishedTime: new Date(a.publishedAt).toISOString(),
    // الغلاف الافتراضي (webp) نستبدله بنسخة JPG للمشاركة؛ الصورة المرفوعة من لوحة التحكم تبقى زي ما هي
    image: (!a.image || a.image.startsWith("/images/articles/") ? ogImage("articles", a.slug) : undefined) || a.image || undefined,
    alternate: enArticle(a.slug) ? `/en/blog/${a.slug}` : undefined,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a || !isLive(a)) notFound();
  const site = await getSiteSettings();
  const media = parseMedia(a.media);
  const headings = parseHeadings(a.content);
  const minutes = readingMinutes(a.content);
  const related = (await getArticles(4)).filter((r) => r.id !== a.id).slice(0, 3);

  const url = SITE_URL + canonicalPath(`/blog/${a.slug}`);
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <SetWaMessage message={waForArticle(a.title)} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: a.title.slice(0, 110),
            description: a.excerpt || a.content.slice(0, 160),
            datePublished: new Date(a.publishedAt).toISOString(),
            dateModified: new Date(a.publishedAt).toISOString(),
            wordCount: a.content.split(/\s+/).filter(Boolean).length,
            inLanguage: "ar",
            mainEntityOfPage: url,
            url,
            image: a.image || `${SITE_URL}/og/default.jpg`,
            author: { "@type": "Organization", name: site.name, url: SITE_URL },
            publisher: { "@id": BUSINESS_ID },
          },
          breadcrumbs([
            { name: "الرئيسية", path: "/" },
            { name: "نصايح السباكة", path: "/blog" },
            { name: a.title, path: `/blog/${a.slug}` },
          ]),
        ]}
      />
      <Link href="/blog" className="text-brand-700 text-sm inline-flex items-center gap-1 mb-6">
        <ArrowRight className="w-4 h-4" /> نصايح السباكة
      </Link>
      {a.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.image} {...responsive(a.image)} alt={a.title} fetchPriority="high" width={1200} height={675} className="w-full h-auto aspect-[16/9] object-cover rounded-2xl mb-6" />
      ) : null}
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <time dateTime={new Date(a.publishedAt).toISOString()}>
          {new Date(a.publishedAt).toLocaleDateString("ar-KW", { day: "numeric", month: "long", year: "numeric" })}
        </time>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {minutes} دقائق قراءة</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-2 mb-4 leading-snug">{a.title}</h1>
      {headings.length >= 3 && (
        <nav aria-label="محتويات المقال" className="my-6 bg-white border rounded-2xl p-5">
          <p className="font-bold text-slate-900 mb-3 inline-flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-brand-700" /> محتويات المقال
          </p>
          <ol className="space-y-1.5 text-sm pr-5 list-decimal marker:text-brand-700">
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="text-slate-700 hover:text-brand-700 hover:underline">{h.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="max-w-none text-slate-700 leading-loose text-base sm:text-lg">
        {renderArticle(a.content)}
      </div>
      {media.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {media.map((m, i) => {
            if (m.type === "image") {
              return (
                <a key={i} href={m.url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={a.title} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl" />
                </a>
              );
            }
            if (m.type === "video") {
              return (
                <video key={i} src={m.url} controls preload="metadata" playsInline className="w-full aspect-video rounded-2xl bg-black" />
              );
            }
            const id = youtubeId(m.url);
            return id ? (
              <iframe
                key={i}
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={a.title}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video rounded-2xl"
              />
            ) : null;
          })}
        </div>
      )}
      <div className="mt-10 bg-brand-50 rounded-2xl p-6 text-center">
        <p className="mb-3 font-semibold text-brand-900">المشكلة عندك الحين؟ كلمنا ونمرّك</p>
        <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 bg-brand-700 text-white font-bold px-6 py-3 rounded-xl">
          <Phone className="w-5 h-5" />
          {site.phone}
        </a>
      </div>
      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="text-xl font-bold text-brand-900 mb-4">مواضيع ثانية</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="bg-white border rounded-2xl overflow-hidden hover:shadow-md hover:border-brand-300 transition">
                {r.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.image} {...responsive(r.image)} alt={r.title} loading="lazy" decoding="async" className="w-full aspect-[16/9] object-cover" />
                ) : (
                  <div className="aspect-[16/9] bg-brand-50" />
                )}
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
