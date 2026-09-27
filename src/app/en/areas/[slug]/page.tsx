import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Clock, MapPin, ArrowRight } from "lucide-react";
import { getAreaBySlug, getServices, getSiteSettings } from "@/lib/content";
import { pageMeta, breadcrumbs, BUSINESS_ID } from "@/lib/seo";
import { enArea, enService, EN_WA } from "@/lib/en";
import { waLink } from "@/lib/whatsapp";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import { SetWaMessage } from "@/components/WaMessage";
import { WaIcon } from "@/components/WhatsAppWidget";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAreaBySlug((await params).slug);
  if (!a || !a.published) return { title: "Area not found" };
  const e = enArea(a);
  return pageMeta({
    title: `Plumber in ${e.title} 24/7 | ${BRAND.nameEn}`,
    absoluteTitle: true,
    description: `${e.description}: drain cleaning, water leak detection, water heaters and water pumps. ${e.content}`.slice(0, 158),
    path: `/en/areas/${a.slug}`,
    siteName: BRAND.nameEn,
    lang: "en",
    alternate: `/areas/${a.slug}`,
  });
}

export default async function EnArea({ params }: Props) {
  const { slug } = await params;
  const [area, services, site] = await Promise.all([getAreaBySlug(slug), getServices(), getSiteSettings()]);
  if (!area || !area.published) notFound();
  const e = enArea(area);
  const msg = EN_WA.area(e.title);

  return (
    <div dir="ltr" className="bg-[#f7f9fc]">
      <SetWaMessage message={msg} />
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Service", name: `Plumber in ${e.title}`, serviceType: "Plumbing", provider: { "@id": BUSINESS_ID }, areaServed: { "@type": "City", name: e.title } },
          breadcrumbs([{ name: "Home", path: "/en" }, { name: e.title, path: `/en/areas/${area.slug}` }]),
        ]}
      />
      <PageHero navLabel="Breadcrumb" title={`Plumber in ${e.title}`} subtitle={e.description} crumbs={[{ href: "/en", label: "Home" }]}>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 bg-white text-brand-900 font-bold px-6 py-3 rounded-2xl"><Phone className="w-4 h-4" /> {site.phone}</a>
          <a href={waLink(site.whatsapp, msg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-[#131f4f] font-bold px-6 py-3 rounded-2xl"><WaIcon className="w-4 h-4" /> WhatsApp</a>
        </div>
      </PageHero>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-sm self-start">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-800 px-4 py-2 rounded-xl text-sm font-semibold mb-6">
              <Clock className="w-4 h-4" /> Typical arrival: {area.responseTime.replace(/د$|دقيقة$/, "min")}
            </div>
            <h2 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-700" /> Neighbourhoods we cover</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{e.content}</p>
            <h2 className="font-bold text-slate-900 text-lg mb-3">Our services in {e.title}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {services.map((s) => (
                <Link key={s.id} href={`/en/services/${s.slug}`} className="flex items-center justify-between bg-slate-50 border border-slate-100 hover:border-brand-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 transition">
                  {enService(s).title} <ArrowRight className="w-4 h-4 text-brand-700" />
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <LeadForm
              lang="en"
              title={`Request a plumber in ${e.title}`}
              areas={[{ title: area.title, label: e.title }]}
              services={services.map((s) => ({ title: s.title, label: enService(s).title }))}
            />
          </div>
        </div>
        <div className="h-20" aria-hidden />
      </div>
    </div>
  );
}
