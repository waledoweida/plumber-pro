import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteSettings, getAreas, getTexts, getServices } from "@/lib/content";
import LeadForm from "@/components/LeadForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [site, areas, texts, services] = await Promise.all([
    getSiteSettings(),
    getAreas(),
    getTexts(),
    getServices(),
  ]);
  const t = (k: string, fb: string) => (k in texts ? texts[k] : fb);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
        {t("page.contactTitle", "اتصل بنا")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="bg-white rounded-2xl border p-5 sm:p-6 space-y-5">
          <div className="flex gap-3">
            <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-500">{t("label.phone", "الهاتف")}</div>
              <a href={`tel:${site.phone}`} className="text-brand-700 text-xl font-bold">{site.phone}</a>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-500">{t("label.email", "البريد")}</div>
              <span className="break-all">{site.email}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-500">{t("label.address", "العنوان")}</div>
              {site.address}
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-500">{t("label.hours", "الوقت")}</div>
              {site.hours}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {areas.map((a) => (
              <span key={a.id} className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg">{a.title}</span>
            ))}
          </div>
        </div>
        <div className="bg-brand-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-center text-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold mb-1">{t("page.contactCta", "طلب خدمة فورية")}</h2>
          <a href={`tel:${site.phone}`} className="bg-white text-brand-800 font-bold py-3.5 rounded-xl text-lg touch-target">
            {site.phone}
          </a>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 font-bold py-3.5 rounded-xl text-lg touch-target"
          >
            {t("home.ctaWhatsapp", "واتساب")}
          </a>
        </div>
      </div>
      <div className="mt-10 max-w-lg mx-auto">
        <LeadForm
          areas={areas.map((a) => ({ title: a.title }))}
          services={services.map((s) => ({ title: s.title }))}
        />
      </div>
      <div className="h-20 sm:h-4" aria-hidden />
    </div>
  );
}
