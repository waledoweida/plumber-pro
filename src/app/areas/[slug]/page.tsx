import { pageMeta, seoDescription, breadcrumbs, BUSINESS_ID } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone, Clock, MapPin } from "lucide-react";
import { getAreaBySlug, getSiteSettings, getServices } from "@/lib/content";
import LeadForm from "@/components/LeadForm";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { SetWaMessage } from "@/components/WaMessage";
import { isComboService } from "@/lib/combos";
import { waForArea, serviceShort } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const area = await getAreaBySlug((await params).slug);
  if (!area || !area.published) return { title: "منطقة غير موجودة" };
  const site = await getSiteSettings();
  return pageMeta({
    title: `سباك ${area.title} 24 ساعة — تسليك وكشف تسربات`,
    description: seoDescription(area.excerpt || area.description, `سباك معتمد ب${area.title}: تسليك مجاري وبواليع، كشف تسربات بدون تكسير، سخانات ومضخات وتأسيس حمامات. اتصل ${site.phone}`),
    path: `/areas/${area.slug}`,
    siteName: site.name,
    alternate: `/en/areas/${area.slug}`,
  });
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);
  if (!area || !area.published) notFound();
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <>
    <PageHero
      title={`سباك ${area.title}`}
      subtitle={area.description}
      crumbs={[{ href: "/", label: "الرئيسية" }]}
    >
      <div className="inline-flex items-center gap-2 mt-5 bg-white/10 border border-white/15 px-4 py-1.5 text-sm text-brand-100">
        <MapPin className="w-4 h-4 text-accent-400" /> فنيين قريبين منك ب{area.title}
      </div>
    </PageHero>
    <div className="bg-[#f2f5f9]">
    <SetWaMessage message={waForArea(area.title)} />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `سباك ${area.title}`,
            serviceType: "Plumbing",
            provider: { "@id": BUSINESS_ID },
            areaServed: { "@type": "City", name: area.title },
          },
          breadcrumbs([
            { name: "الرئيسية", path: "/" },
            { name: area.title, path: `/areas/${area.slug}` },
          ]),
        ]}
      />
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-sm self-start">
          <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-700 px-4 py-2 text-sm font-semibold mb-6">
            <Clock className="w-4 h-4" />
            نوصلك تقريبًا خلال: {area.responseTime}
          </div>
          {area.excerpt && <p className="text-slate-700 mb-4 leading-relaxed">{area.excerpt}</p>}
          {area.content && (
            <div className="text-slate-700 leading-relaxed whitespace-pre-line mb-8">{area.content}</div>
          )}
          <a
            href={`tel:${site.phone}`}
            className="inline-flex items-center gap-2 btn-primary text-white font-bold px-7 py-4 rounded-md"
          >
            <Phone className="w-5 h-5" />
            {site.phone}
          </a>
        </div>
        <div className="lg:col-span-2">
          <LeadForm
            areas={[{ title: area.title }]}
            services={services.map((s) => ({ title: s.title }))}
            title={`اطلب سباك ${area.title}`}
          />
        </div>
      </div>
      {services.some((x) => isComboService(x.slug)) && (
        <div className="mt-10">
          <h2 className="font-bold text-brand-950 text-xl mb-4">شنو نسوي ب{area.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.filter((x) => isComboService(x.slug)).map((x) => (
              <Link
                key={x.id}
                href={`/services/${x.slug}/${area.slug}`}
                className="service-card bg-white border border-slate-200/70 rounded-lg px-5 py-4 font-bold text-slate-800"
              >
                {serviceShort(x.title)} ب{area.title}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="h-20" aria-hidden />
    </div>
    </div>
    </>
  );
}
