import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Clock, CheckCircle, MapPin, ArrowLeft } from "lucide-react";
import { getServiceBySlug, getAreaBySlug, getAreas, getServices, getSiteSettings } from "@/lib/content";
import { pageMeta, seoDescription, breadcrumbs, SITE_URL, BUSINESS_ID, canonicalPath } from "@/lib/seo";
import { isComboService, comboIntro } from "@/lib/combos";
import { serviceFaqs, faqJsonLd } from "@/lib/faq";
import { serviceShort, searchForm, waLink, waForServiceArea } from "@/lib/whatsapp";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/FaqList";
import { SetWaMessage } from "@/components/WaMessage";
import { WaIcon } from "@/components/WhatsAppWidget";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; area: string }> };

async function load(params: Props["params"]) {
  const p = await params;
  const [s, area] = await Promise.all([getServiceBySlug(p.slug), getAreaBySlug(p.area)]);
  if (!s || !area || !area.published || !isComboService(s.slug)) return null;
  return { s, area };
}

function parseFeatures(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await load(params);
  if (!d) return { title: "الصفحة غير موجودة" };
  const site = await getSiteSettings();
  const name = serviceShort(d.s.title);
  return pageMeta({
    title: `${searchForm(d.s.title)} ${d.area.title} — سباك 24 ساعة`,
    description: seoDescription(comboIntro(d.s.slug, d.area.title), `اتصل ${site.phone}`),
    path: `/services/${d.s.slug}/${d.area.slug}`,
    siteName: site.name,
  });
}

export default async function ServiceAreaPage({ params }: Props) {
  const d = await load(params);
  if (!d) notFound();
  const { s, area } = d;
  const [site, areas, services] = await Promise.all([getSiteSettings(), getAreas(), getServices()]);
  const name = serviceShort(s.title);
  const features = parseFeatures(s.features);
  const faqs = serviceFaqs(s.slug, s.title, area.title);
  const wa = waForServiceArea(s.title, area.title);
  const otherAreas = areas.filter((a) => a.slug !== area.slug);
  const otherServices = services.filter((x) => x.slug !== s.slug && isComboService(x.slug));
  const path = `/services/${s.slug}/${area.slug}`;

  return (
    <div className="bg-[#f2f5f9] min-h-screen">
      <SetWaMessage message={wa} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${name} ${area.title}`,
            serviceType: s.title,
            url: SITE_URL + canonicalPath(path),
            provider: { "@id": BUSINESS_ID },
            areaServed: { "@type": "City", name: area.title },
          },
          breadcrumbs([
            { name: "الرئيسية", path: "/" },
            { name: "الخدمات", path: "/services" },
            { name: s.title, path: `/services/${s.slug}` },
            { name: area.title, path },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <PageHero
        title={`${name} ب${area.title}`}
        subtitle={`${name} ب${area.title} — فنيين معتمدين، شغّالين 24 ساعة، والسعر تعرفه قبل لا نبدي.`}
        crumbs={[{ href: "/", label: "الرئيسية" }, { href: "/services", label: "الخدمات" }, { href: `/services/${s.slug}`, label: s.title }]}
      >
        <div className="flex flex-wrap gap-2 mt-6">
          <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 btn-primary text-white font-bold px-6 py-3 rounded-md">
            <Phone className="w-4 h-4" /> {site.phone}
          </a>
          <a href={waLink(site.whatsapp, wa)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-[#0a172c] font-bold px-6 py-3 rounded-md">
            <WaIcon className="w-4 h-4" /> واتساب
          </a>
        </div>
      </PageHero>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-sm mb-6">
              <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-800 px-4 py-2 rounded-xl text-sm font-semibold mb-5">
                <Clock className="w-4 h-4" /> وقت الوصول التقريبي: {area.responseTime}
              </div>
              <p className="text-slate-700 text-base sm:text-lg leading-loose mb-5">{comboIntro(s.slug, area.title)}</p>
              {area.content && (
                <>
                  <h2 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent-500" /> عن شغلنا ب{area.title}
                  </h2>
                  <p className="text-slate-700 leading-loose">{area.content}</p>
                </>
              )}
            </div>

            {features.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-sm mb-6">
                <h2 className="font-bold text-brand-950 text-lg mb-4">وش يدخل بـ{name}؟</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-slate-800">
                      <CheckCircle className="w-5 h-5 text-brand-700 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <FaqList items={faqs} title={`أسئلة شائعة عن ${name} ب${area.title}`} />

            <div className="mb-8">
              <h2 className="font-bold text-brand-950 text-lg mb-3">{name} بباقي المناطق</h2>
              <div className="flex flex-wrap gap-2">
                {otherAreas.map((a) => (
                  <Link key={a.id} href={`/services/${s.slug}/${a.slug}`} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-800 text-sm font-semibold px-4 py-2 rounded-md transition">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" /> {name} {a.title}
                  </Link>
                ))}
              </div>
            </div>
            {otherServices.length > 0 && (
              <div>
                <h2 className="font-bold text-brand-950 text-lg mb-3">خدمات ثانية ب{area.title}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {otherServices.map((x) => (
                    <Link key={x.id} href={`/services/${x.slug}/${area.slug}`} className="flex items-center justify-between bg-white border border-slate-200/70 rounded-lg px-4 py-3 hover:border-brand-300 transition">
                      <span className="font-semibold text-slate-800 text-sm">{serviceShort(x.title)} ب{area.title}</span>
                      <ArrowLeft className="w-4 h-4 text-brand-700" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside>
            <div className="lg:sticky lg:top-20">
              <LeadForm
                title={`اطلب ${name} ب${area.title}`}
                areas={[{ title: area.title }, ...otherAreas.map((a) => ({ title: a.title }))]}
                services={[{ title: s.title }]}
              />
            </div>
          </aside>
        </div>
        <div className="h-20 sm:h-4" aria-hidden />
      </div>
    </div>
  );
}

