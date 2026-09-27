import { getArticles } from "@/lib/content";
import { EN_ARTICLES, enArticle } from "@/lib/en-articles";

// English articles whose Arabic article is live (published and its date has arrived), newest first
export async function getEnArticles() {
  const live = await getArticles();
  return live.flatMap((a) => {
    const t = enArticle(a.slug);
    return t ? [{ ...t, publishedAt: a.publishedAt }] : [];
  });
}

export async function getEnArticle(slug: string) {
  const all = await getEnArticles();
  return all.find((a) => a.slug === slug) || null;
}

export { EN_ARTICLES };
