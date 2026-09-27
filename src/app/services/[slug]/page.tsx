import { pageMeta, seoDescription, breadcrumbs, SITE_URL, BUSINESS_ID, canonicalPath } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, CheckCircle, ArrowLeft } from "lucide-react";
import { getServiceBySlug, getServices, getArticles, getSiteSettings } from "@/lib/content";
import LeadForm from "@/components/LeadForm";
import PageHero from "@/components/ui/PageHero";
import FaqList from "@/components/FaqList";
import { SetWaMessage } from "@/components/WaMessage";
import { WaIcon } from "@/components/WhatsAppWidget";
import { serviceFaqs, faqJsonLd } from "@/lib/faq";
import { isComboService } from "@/lib/combos";
import { waLink, waForService, serviceShort } from "@/lib/whatsapp";
import { getAreas } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function parseFeatures(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) return { title: "خدمة غير موجودة" };
  const site = await getSiteSettings();
  return pageMeta({
    title: `${s.title} في الكويت`,
    description: seoDescription(s.short || s.description, `${s.title} بكل مناطق الكويت 24 ساعة — اتصل ${site.phone}`),
    path: `/services/${s.slug}`,
    siteName: site.name,
    alternate: `/en/services/${s.slug}`,
    image: s.image || undefined,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [s, all, articles, site, areas] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getArticles(6),
    getSiteSettings(),
    getAreas(),
  ]);
  if (!s) notFound();

  const features = parseFeatures(s.features);
  const related = all.filter((x) => x.slug !== s.slug).slice(0, 4);
  const relatedArticles = articles.slice(0, 3);
  const faqs = serviceFaqs(s.slug, s.title);
  const waMsg = waForService(s.title);
  const combo = isComboService(s.slug);

  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <SetWaMessage message={waMsg} />
      <JsonLd
        data={[
          faqJsonLd(faqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            serviceType: s.title,
            description: s.short || s.description,
            url: SITE_URL + canonicalPath(`/services/${s.slug}`),
            ...(s.image ? { image: s.image } : {}),
            provider: { "@id": BUSINESS_ID },
            areaServed: { "@type": "Country", name: "Kuwait" },
          },
          breadcrumbs([
            { name: "الرئيسية", path: "/" },
            { name: "الخدمات", path: "/services" },
            { name: s.title, path: `/services/${s.slug}` },
          ]),
        ]}
      />
      <PageHero
        title={`${s.title} في الكويت`}
        subtitle={s.short || undefined}
        crumbs={[{ href: "/", label: "الرئيسية" }, { href: "/services", label: "الخدمات" }]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main article content */}
          <article className="lg:col-span-2">
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">
              {s.description}
            </p>

            {s.image && (
              <div className="rounded-2xl overflow-hidden mb-6 border border-slate-100">
                <img src={s.image} alt={s.title} fetchPriority="high" className="w-full aspect-[16/9] object-cover" />
              </div>
            )}

            {features.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-soft sm:p-6 mb-6">
                <h2 className="font-bold text-brand-950 text-lg mb-3">وش يدخل بالخدمة؟</h2>
                <ul className="space-y-2.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                      <CheckCircle className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-soft sm:p-6 mb-6 prose prose-stone max-w-none">
              <h2 className="font-bold text-brand-950 text-lg mb-3">شلون نشتغل على {serviceShort(s.title)}؟</h2>
              <ol className="space-y-2 text-slate-600 text-sm leading-relaxed mb-4 list-decimal ps-5">
                <li>تكلمنا وتوصف المشكلة، وإذا تقدر ترسل صورة واتساب.</li>
                <li>الفني يوصلك، يفحص ويقولك السبب والسعر قبل لا يبدي.</li>
                <li>نخلّص الشغل ونجرّبه قدامك ونعطيك ضمان مكتوب.</li>
              </ol>
              <p className="text-slate-600 text-sm leading-relaxed">
                تبي تحجز أو عندك سؤال؟ اتصل أو أرسل واتساب على{" "}
                <a href={`tel:${site.phone}`} className="text-accent-600 font-bold" dir="ltr">{site.phone}</a>
                {" "}— نرد 24 ساعة.
              </p>
            </div>

            <FaqList items={faqs} title={`أسئلة شائعة عن ${serviceShort(s.title)}`} />

            {areas.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-brand-950 text-lg mb-3">{serviceShort(s.title)} بمنطقتك</h2>
                <div className="flex flex-wrap gap-2">
                  {areas.map((a) => (
                    <Link
                      key={a.id}
                      href={combo ? `/services/${s.slug}/${a.slug}` : `/areas/${a.slug}`}
                      className="bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-800 text-sm font-semibold px-4 py-2 rounded-xl transition"
                    >
                      {combo ? `${serviceShort(s.title)} ${a.title}` : a.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-brand-950 text-lg mb-4">مواضيع ممكن تفيدك</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedArticles.map((a) => (
                    <Link
                      key={a.id}
                      href={`/blog/${a.slug}`}
                      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition group"
                    >
                      {a.image && (
                        <img loading="lazy" decoding="async" src={a.image} alt={a.title} className="w-full aspect-[16/10] object-cover" />
                      )}
                      <div className="p-3">
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-brand-700">{a.title}</h3>
                        <span className="text-accent-600 text-xs font-semibold mt-2 inline-block">اقرأ ←</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related services */}
            {related.length > 0 && (
              <div>
                <h2 className="font-bold text-brand-950 text-lg mb-4">خدمات ثانية عندنا</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/services/${r.slug}`}
                      className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-4 py-3 hover:border-brand-200 transition"
                    >
                      <span className="font-semibold text-slate-800 text-sm">{r.title}</span>
                      <ArrowLeft className="w-4 h-4 text-brand-700" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-soft sticky top-20">
              <h3 className="font-bold text-brand-950 mb-3">اطلب {serviceShort(s.title)}</h3>
              <a
                href={`tel:${site.phone}`}
                className="flex items-center justify-center gap-2 w-full btn-primary text-brand-950 font-bold py-3 rounded-xl mb-2"
              >
                <Phone className="w-4 h-4" /> {site.phone}
              </a>
              <a
                href={waLink(site.whatsapp, waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:brightness-105 text-[#131f4f] font-bold py-3 rounded-xl mb-4 transition"
              >
                <WaIcon className="w-4 h-4" /> واتساب
              </a>
              <LeadForm
                compact
                services={[{ title: s.title }]}
                areas={areas.map((a) => ({ title: a.title }))}
                title="أو اترك رقمك"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
