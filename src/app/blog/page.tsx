import Link from "next/link";
import { getArticles, getTexts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [articles, texts] = await Promise.all([getArticles(), getTexts()]);
  const title = "page.blogTitle" in texts ? texts["page.blogTitle"] : "مدونة السباكة";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-brand-900 mb-8">{title}</h1>
      {articles.length === 0 ? (
        <p className="text-center text-slate-500">لا مقالات بعد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}`}
              className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:border-brand-300 transition"
            >
              {a.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.image} alt={a.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="h-28 bg-brand-50" />
              )}
              <div className="p-5">
                <time className="text-xs text-slate-400">
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
  );
}
