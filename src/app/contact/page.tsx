import type { Metadata } from "next";
import { pageMeta, seoDescription } from "@/lib/seo";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { getSiteSettings, getAreas, getTexts, getServices } from "@/lib/content";
import LeadForm from "@/components/LeadForm";
import { waLink, WA_DEFAULT } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    title: `كلّمنا — ${site.phone}`,
    description: seoDescription("", `اتصل على ${site.name} ${site.phone} أو أرسل واتساب، أو عبّي نموذج الطلب ونتصل فيك. سباك 24 ساعة بكل مناطق الكويت`),
    path: "/contact",
    siteName: site.name,
    alternate: "/en/contact",
  });
}

export default async function ContactPage() {
  const [site, areas, texts, services] = await Promise.all([getSiteSettings(), getAreas(), getTexts(), getServices()]);
  const t = (k: string, fb: string) => (k in texts ? texts[k] : fb);
  const rows = [
    { icon: Phone, label: t("label.phone", "التلفون"), value: <a href={`tel:${site.phone}`} className="text-brand-900 text-xl font-bold" dir="ltr">{site.phone}</a> },
    { icon: Mail, label: t("label.email", "الإيميل"), value: <a href={`mailto:${site.email}`} className="break-all hover:text-accent-600">{site.email}</a> },
    { icon: MapPin, label: t("label.address", "العنوان"), value: site.address },
    { icon: Clock, label: t("label.hours", "الدوام"), value: site.hours },
  ];

  return (
    <>
      <PageHero
        title={t("page.contactTitle", "كلّمنا")}
        subtitle="اتصال، واتساب، أو اترك رقمك بالنموذج — اللي يريحك، وإحنا نرد عليك."
        crumbs={[{ href: "/", label: "الرئيسية" }]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${site.phone}`} className="btn-primary text-white rounded-md p-5 flex flex-col items-center gap-2 font-bold text-center">
              <Phone className="w-6 h-6" /> {t("page.contactCta", "اتصل الحين")}
            </a>
            <a href={waLink(site.whatsapp, WA_DEFAULT)} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-[#0a172c] rounded-md p-5 flex flex-col items-center gap-2 font-bold text-center">
              <MessageCircle className="w-6 h-6" /> {t("home.ctaWhatsapp", "واتساب")}
            </a>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-4 items-center p-5">
                <span className="w-11 h-11 icon-tile flex items-center justify-center shrink-0"><r.icon className="w-5 h-5" /></span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-500 mb-0.5">{r.label}</div>
                  <div className="text-slate-800">{r.value}</div>
                </div>
              </div>
            ))}
          </div>
          {areas.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h2 className="font-bold text-brand-950 mb-3">المناطق اللي نغطيها</h2>
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <span key={a.id} className="text-sm bg-brand-50 text-brand-800 px-3 py-1.5">{a.title}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <LeadForm areas={areas.map((a) => ({ title: a.title }))} services={services.map((s) => ({ title: s.title }))} />
      </div>
    </>
  );
}
