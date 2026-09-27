import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta, seoDescription } from "@/lib/seo";
import { getServices, getTexts, getSiteSettings } from "@/lib/content";
import PageHero from "@/components/ui/PageHero";
import { Wrench, Search, Bath, Flame, Droplets, Pipette, ArrowLeft, Phone } from "lucide-react";

const icons: Record<string, any> = { Wrench, Search, Bath, Flame, Droplets, Pipette };

export const dynamic = "force-dynamic";

function parseFeatures(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    title: "خدمات السباكة في الكويت",
    description: seoDescription("", `خدمات ${site.name}: تسليك مجاري وبلاليع، كشف تهريب الماي بدون تكسير، تأسيس حمامات، سخانات، ماطورات وتمديد مواسير — 24 ساعة`),
    path: "/services",
    siteName: site.name,
    alternate: "/en/services",
  });
}

export default async function ServicesPage() {
  const [services, texts, site] = await Promise.all([getServices(), getTexts(), getSiteSettings()]);
  const title = "page.servicesTitle" in texts ? texts["page.servicesTitle"] : "خدمات السباكة";

  return (
    <>
      <PageHero
        title={title}
        subtitle="اختار الخدمة وشوف شنو نسوي فيها بالتفصيل — وإذا مو متأكد شنو تحتاج، اتصل ونشخصها لك."
        crumbs={[{ href: "/", label: "الرئيسية" }]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-4">
        {services.map((s, i) => {
          const Icon = icons[s.icon] || Wrench;
          const feats = parseFeatures(s.features);
          return (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className="service-card group bg-white border border-slate-200 rounded-2xl overflow-hidden grid sm:grid-cols-[auto_1fr_auto] items-center gap-5 p-5 sm:p-6"
            >
              {s.image ? (
                <img loading="lazy" decoding="async" src={s.image} alt={s.title} className="w-full sm:w-40 aspect-[16/10] object-cover rounded-xl" />
              ) : (
                <span className="w-14 h-14 icon-tile-solid flex items-center justify-center relative">
                  <Icon className="w-7 h-7" />
                  <span className="absolute -top-2 -start-2 text-[11px] font-bold bg-accent-400 text-brand-950 px-1.5 rounded-md" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              )}
              <div className="min-w-0">
                <h2 className="font-bold text-xl text-brand-950 mb-1.5">{s.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{s.short}</p>
                {feats.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {feats.slice(0, 4).map((f) => (
                      <li key={f} className="text-xs bg-brand-50 text-brand-800 px-2.5 py-1 rounded-full">{f}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="inline-flex items-center gap-1 text-accent-600 font-bold text-sm group-hover:gap-2 transition-all">
                التفاصيل <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>
          );
        })}

        <div className="bg-brand-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="font-bold text-lg text-center sm:text-start">مو لاقي مشكلتك بالقائمة؟ كلمنا ونقولك إذا نقدر نساعدك.</p>
          <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 btn-primary text-brand-950 font-bold px-6 py-3 rounded-xl shrink-0">
            <Phone className="w-4 h-4" /> <span dir="ltr">{site.phone}</span>
          </a>
        </div>
      </div>
    </>
  );
}
