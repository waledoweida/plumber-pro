import Link from "next/link";
import { getSiteSettings, getServices, getAreas } from "@/lib/content";
import { Phone, MessageCircle, Mail, MapPin, Clock, Wrench } from "lucide-react";
import { getLocale } from "@/lib/locale";
import { ui } from "@/lib/i18n";
import { EN_SERVICES, EN_AREAS } from "@/lib/en";
import { BRAND } from "@/lib/brand";
import { waLink } from "@/lib/whatsapp";

export default async function Footer() {
  const [site, services, areas, locale] = await Promise.all([getSiteSettings(), getServices(), getAreas(), getLocale()]);
  const en = locale === "en";
  const T = ui(locale);
  const name = en ? BRAND.nameEn : site.name;
  const pre = en ? "/en" : "";

  return (
    <footer className="bg-brand-950 text-brand-200 border-t-4 border-accent-500">
      {/* شريط الاتصال */}
      <div className="bg-accent-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-start">
            <p className="font-bold text-lg sm:text-xl">{T.footerStrapTitle}</p>
            <p className="text-sm text-white/90">{T.footerStrapSub}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 bg-brand-950 text-white font-bold px-6 py-3 rounded-md">
              <Phone className="w-4 h-4" /> <span dir="ltr">{site.phone}</span>
            </a>
            <a
              href={waLink(site.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-950 font-bold px-6 py-3 rounded-md"
            >
              <MessageCircle className="w-4 h-4 text-[#128C7E]" /> {T.whatsapp}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-9 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {site.logoUrl ? (
                <img loading="lazy" decoding="async" src={site.logoUrl} alt={name} className="h-10 w-auto object-contain bg-white p-1" />
              ) : (
                <span className="w-10 h-10 bg-accent-500 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </span>
              )}
              <span className="font-bold text-white text-lg">{name}</span>
            </div>
            <p className="text-sm leading-relaxed">{T.footerAbout}</p>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wide border-b border-white/10 pb-2">{T.footerServices}</h2>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`${pre}/services/${s.slug}`} className="hover:text-accent-300 transition">
                    {en ? EN_SERVICES[s.slug]?.title || s.title : s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wide border-b border-white/10 pb-2">{en ? "Areas" : "مناطقنا"}</h2>
            <ul className="space-y-2 text-sm">
              {areas.map((a) => (
                <li key={a.id}>
                  <Link href={`${pre}/areas/${a.slug}`} className="hover:text-accent-300 transition">
                    {en ? EN_AREAS[a.slug]?.title || a.title : `سباك ${a.title}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wide border-b border-white/10 pb-2">{T.footerContact}</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent-400 shrink-0" /><a href={`tel:${site.phone}`} className="hover:text-white" dir="ltr">{site.phone}</a></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent-400 shrink-0" /><a href={`mailto:${site.email}`} className="hover:text-white break-all">{site.email}</a></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent-400 shrink-0" />{en ? "Kuwait — all governorates" : site.address}</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent-400 shrink-0" />{en ? "24 hours / 7 days" : site.hours}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-xs text-brand-300 flex flex-col sm:flex-row justify-between gap-3">
          <span>© {new Date().getFullYear()} {name}. {T.rights}</span>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            {T.links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
