import type { Metadata } from "next";
import Link from "next/link";
import { responsive } from "@/lib/markdown";
import { pageMeta } from "@/lib/seo";
import { getEnArticles } from "@/lib/en-blog";
import PageHero from "@/components/ui/PageHero";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: `Plumbing Tips for Kuwait Homes | ${BRAND.nameEn}`,
    absoluteTitle: true,
    description: "Plumbing tips written by our technicians in Kuwait: spotting problems early, what you can safely do yourself, and when to call a plumber.",
    path: "/en/blog",
    siteName: BRAND.nameEn,
    lang: "en",
    alternate: "/blog",
  });
}

export default async function EnBlogPage() {
  const articles = await getEnArticles();
  return (
    <div dir="ltr">
      <PageHero
        navLabel="Breadcrumb"
        title="Plumbing Blog"
        subtitle="Written by our technicians from everyday jobs: spot problems early, fix what's safe yourself, know when to call"
        crumbs={[{ href: "/en", label: "Home" }]}
      />
      <div className="bg-[#f7f9fc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {articles.length === 0 ? (
            <p className="text-center text-slate-500">No articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((a) => (
                <Link key={a.slug} href={`/en/blog/${a.slug}`} className="service-card bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img loading="lazy" decoding="async" src={a.image} {...responsive(a.image)} alt={a.title} className="w-full aspect-[16/9] object-cover" />
                  <div className="p-5">
                    <time className="text-xs text-slate-600">
                      {new Date(a.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
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
    </div>
  );
}
