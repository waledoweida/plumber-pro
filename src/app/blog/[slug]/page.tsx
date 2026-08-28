import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await prisma.article.findUnique({ where: { slug } });
  if (!a || !a.published) notFound();
  const site = await getSiteSettings();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-brand-600 text-sm inline-flex items-center gap-1 mb-6">
        <ArrowRight className="w-4 h-4" /> المدونة
      </Link>
      {a.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.image} alt={a.title} className="w-full max-h-72 object-cover rounded-2xl mb-6" />
      ) : null}
      <time className="text-xs text-slate-400">{new Date(a.publishedAt).toLocaleDateString("ar-KW")}</time>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-2 mb-4">{a.title}</h1>
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
        {a.content}
      </div>
      <div className="mt-10 bg-brand-50 rounded-2xl p-6 text-center">
        <p className="mb-3 font-medium text-brand-900">محتاج سباك الآن؟</p>
        <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 bg-brand-700 text-white font-bold px-6 py-3 rounded-xl">
          <Phone className="w-5 h-5" />
          {site.phone}
        </a>
      </div>
      <div className="h-20" aria-hidden />
    </article>
  );
}
