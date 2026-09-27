import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteSettings, getAreas, getServices } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { enArea, enService, EN_WA } from "@/lib/en";
import { waLink } from "@/lib/whatsapp";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/LeadForm";
import { WaIcon } from "@/components/WhatsAppWidget";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    title: `Contact Us — ${site.phone} | ${BRAND.nameEn}`,
    absoluteTitle: true,
    description: `Ring ${BRAND.nameEn} on ${site.phone}, send a WhatsApp message or request a plumber with the form — open 24 hours across Kuwait.`,
    path: "/en/contact",
    siteName: BRAND.nameEn,
    lang: "en",
    alternate: "/contact",
  });
}

export default async function EnContact() {
  const [site, areas, services] = await Promise.all([getSiteSettings(), getAreas(), getServices()]);
  const rows = [
    { icon: Phone, label: "Phone", value: <a href={`tel:${site.phone}`} className="text-brand-700 text-xl font-bold">{site.phone}</a> },
    { icon: Mail, label: "Email", value: <span className="break-all">{site.email}</span> },
    { icon: MapPin, label: "Address", value: "Kuwait — all governorates" },
    { icon: Clock, label: "Hours", value: "24 hours / 7 days / emergencies" },
  ];
  return (
    <div dir="ltr">
      <PageHero navLabel="Breadcrumb" title="Contact Us" subtitle="Phone, WhatsApp or leave your number in the form — whichever suits you, we'll get back to you." crumbs={[{ href: "/en", label: "Home" }]} />
      <div className="bg-[#f2f5f9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white rounded-xl border border-slate-200/70 p-5 sm:p-7 space-y-5 shadow-sm">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-3 items-center">
                  <span className="w-11 h-11 rounded-lg icon-tile flex items-center justify-center text-brand-700 shrink-0"><r.icon className="w-5 h-5" /></span>
                  <div>
                    <div className="font-bold text-xs text-slate-500 mb-0.5">{r.label}</div>
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative hero-dark text-white rounded-xl p-6 sm:p-8 flex flex-col justify-center text-center gap-3 overflow-hidden">
              <div className="absolute inset-0 dot-grid pointer-events-none" />
              <h2 className="relative text-xl sm:text-2xl font-bold mb-2">Request a technician now</h2>
              <a href={`tel:${site.phone}`} className="relative inline-flex items-center justify-center gap-2 bg-white text-brand-900 font-bold py-4 rounded-lg text-lg"><Phone className="w-5 h-5" /> {site.phone}</a>
              <a href={waLink(site.whatsapp, EN_WA.default)} target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center justify-center gap-2 bg-[#25D366] text-[#0a172c] font-bold py-4 rounded-lg text-lg"><WaIcon className="w-5 h-5" /> WhatsApp</a>
            </div>
          </div>
          <div id="lead" className="mt-10 max-w-lg mx-auto scroll-mt-24">
            <LeadForm
              lang="en"
              areas={areas.map((a) => ({ title: a.title, label: enArea(a).title }))}
              services={services.map((s) => ({ title: s.title, label: enService(s).title }))}
            />
          </div>
          <div className="h-20 sm:h-4" aria-hidden />
        </div>
      </div>
    </div>
  );
}
