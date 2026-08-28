import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteSettings, getServices, getTexts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Footer() {
  const [site, services, texts] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getTexts(),
  ]);
  const t = (k: string, fb: string) => (k in texts ? texts[k] : fb);

  return (
    <footer className="bg-brand-900 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-9 h-9 rounded-lg bg-brand-700 text-accent-400 flex items-center justify-center font-bold">د</div>
            <span className="font-bold text-white text-lg">{site.name}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">{site.description}</p>
        </div>
        <div>
          <h3 className="font-bold text-white mb-3 sm:mb-4">{t("footer.servicesTitle", "خدماتنا")}</h3>
          <ul className="space-y-2 text-sm">
            {services.slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.slug}`} className="hover:text-accent-400 transition">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="font-bold text-white mb-3 sm:mb-4">{t("footer.contactTitle", "تواصل")}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent-400 shrink-0" />
              <a href={`tel:${site.phone}`} className="hover:text-white">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-400 shrink-0" />
              <span className="break-all">{site.email}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
              {site.address}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-400 shrink-0" />
              {site.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800 py-4 px-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {site.name}. {t("footer.rights", "جميع الحقوق محفوظة")}.
      </div>
    </footer>
  );
}
