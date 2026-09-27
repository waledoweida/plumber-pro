import type { Metadata } from "next";
import Link from "next/link";
import { responsive } from "@/lib/markdown";
import { getArticles, getTexts, getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    title: "نصايح السباكة",
    description: "نصايح ومقالات عن السباكة وتسليك المجاري وكشف تهريب الماي والسخانات والماطورات بالكويت، من فنيين " + site.name + ".",
    path: "/blog",
    siteName: site.name,
    alternate: "/en/blog",
  });
}

export default async function BlogPage() {
  const [articles, texts] = await Promise.all([getArticles(), getTexts()]);
  const title = "page.blogTitle" in texts ? texts["page.blogTitle"] : "نصايح السباكة";

  return (
    <>
    <PageHero
      title={title}
      subtitle="مواضيع يكتبها فنيينا من الشغل اليومي: شلون تكتشف المشكلة بدري، شنو تقدر تسوي بروحك، ومتى تحتاج سباك"
      crumbs={[{ href: "/", label: "الرئيسية" }]}
    />
    <div className="bg-[#f2f5f9]">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {articles.length === 0 ? (
        <p className="text-center text-slate-500">بنضيف مواضيع قريب.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}`}
              className="service-card bg-white rounded-lg border border-slate-200/70 overflow-hidden"
            >
              {a.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img loading="lazy" decoding="async" src={a.image} {...responsive(a.image)} alt={a.title} className="w-full aspect-[16/9] object-cover" />
              ) : (
                <div className="aspect-[16/9] bg-brand-50" />
              )}
              <div className="p-5">
                <time className="text-xs text-slate-600">
                  {new Date(a.publishedAt).toLocaleDateString("ar-KW")}
                </time>
                <h2 className="font-bold text-lg mt-1 mb-2 text-slate-900">{a.title}</h2>
                <p className="text-sm text-slate-600 line-clamp-2">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="h-20" aria-hidden />
    </div>
    </div>
    </>
  );
}
