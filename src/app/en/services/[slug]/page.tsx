import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, CheckCircle, ArrowRight } from "lucide-react";
import { getServiceBySlug, getServices, getAreas, getSiteSettings } from "@/lib/content";
import { pageMeta, breadcrumbs, SITE_URL, BUSINESS_ID, canonicalPath } from "@/lib/seo";
import { enService, enArea, enServiceFaqs, EN_WA } from "@/lib/en";
import { faqJsonLd } from "@/lib/faq";
import { waLink } from "@/lib/whatsapp";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/FaqList";
import { SetWaMessage } from "@/components/WaMessage";
import { WaIcon } from "@/components/WhatsAppWidget";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getServiceBySlug((await params).slug);
  if (!s) return { title: "Service not found" };
  const e = enService(s);
  return pageMeta({
    title: `${e.title} in Kuwait | ${BRAND.nameEn}`,
    absoluteTitle: true,
    description: `${e.short} Available 24/7 in every area of Kuwait.`.slice(0, 160),
    path: `/en/services/${s.slug}`,
    siteName: BRAND.nameEn,
    lang: "en",
    alternate: `/services/${s.slug}`,
  });
}

export default async function EnService({ params }: Props) {
  const { slug } = await params;
  const [s, all, areas, site] = await Promise.all([getServiceBySlug(slug), getServices(), getAreas(), getSiteSettings()]);
  if (!s) notFound();
  const e = enService(s);
  const faqs = enServiceFaqs(s.slug, e.title);
  const msg = EN_WA.service(e.title);
  const related = all.filter((x) => x.slug !== s.slug).slice(0, 6);

  return (
    <div dir="ltr" className="bg-[#f7f9fc] min-h-screen">
      <SetWaMessage message={msg} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: e.title,
            serviceType: e.title,
            description: e.short,
            url: SITE_URL + canonicalPath(`/en/services/${s.slug}`),
            provider: { "@id": BUSINESS_ID },
            areaServed: { "@type": "Country", name: "Kuwait" },
            inLanguage: "en",
          },
          breadcrumbs([
            { name: "Home", path: "/en" },
            { name: "Services", path: "/en/services" },
            { name: e.title, path: `/en/services/${s.slug}` },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <PageHero navLabel="Breadcrumb" title={`${e.title} in Kuwait`} subtitle={e.short} crumbs={[{ href: "/en", label: "Home" }, { href: "/en/services", label: "Services" }]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-sm mb-6">
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">{e.description}</p>
              <h2 className="font-bold text-slate-900 text-lg mb-4">What&apos;s included</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {e.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-5 h-5 text-brand-700 shrink-0" /> {f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-sm mb-8">
              <h2 className="font-bold text-brand-950 text-lg mb-3">How the job goes</h2>
              <ol className="list-decimal ps-5 space-y-1.5 text-slate-700 leading-relaxed">
                <li>You call or WhatsApp us and describe the problem — a photo helps.</li>
                <li>The technician arrives, inspects and tells you the cause and the price before starting.</li>
                <li>We fix it, test it in front of you and give you a written warranty.</li>
              </ol>
            </div>
            <FaqList items={faqs} title="Frequently asked questions" />
            <div className="mb-8">
              <h2 className="font-bold text-brand-950 text-lg mb-3">Areas we cover</h2>
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <Link key={a.id} href={`/en/areas/${a.slug}`} className="bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-800 text-sm font-semibold px-4 py-2 rounded-xl transition">
                    {enArea(a).title}
                  </Link>
                ))}
              </div>
            </div>
            <h2 className="font-bold text-slate-900 text-lg mb-3">Other services</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link key={r.id} href={`/en/services/${r.slug}`} className="flex items-center justify-between bg-white border border-slate-200/70 rounded-2xl px-4 py-3 hover:border-brand-300 transition">
                  <span className="font-semibold text-slate-800 text-sm">{enService(r).title}</span>
                  <ArrowRight className="w-4 h-4 text-brand-700" />
                </Link>
              ))}
            </div>
          </article>
          <aside>
            <div className="lg:sticky lg:top-20 space-y-3">
              <a href={`tel:${site.phone}`} className="flex items-center justify-center gap-2 btn-primary text-brand-950 font-bold py-3.5 rounded-xl">
                <Phone className="w-4 h-4" /> {site.phone}
              </a>
              <a href={waLink(site.whatsapp, msg)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-[#131f4f] font-bold py-3.5 rounded-2xl">
                <WaIcon className="w-4 h-4" /> WhatsApp
              </a>
              <LeadForm
                lang="en"
                compact
                title="Or leave your number"
                services={[{ title: s.title, label: e.title }]}
                areas={areas.map((a) => ({ title: a.title, label: enArea(a).title }))}
              />
            </div>
          </aside>
        </div>
        <div className="h-20 sm:h-4" aria-hidden />
      </div>
    </div>
  );
}
