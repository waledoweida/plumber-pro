import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone, Wrench, Search, Bath, Flame, Droplets, Pipette, ArrowRight, ShieldCheck, Clock3,
  ScanSearch, MapPin, PhoneCall, ClipboardCheck, BadgeCheck,
} from "lucide-react";
import { getSiteSettings, getServices, getAreas } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { EN_HOME, EN_WA, enService, enArea } from "@/lib/en";
import { waLink } from "@/lib/whatsapp";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadForm from "@/components/LeadForm";
import { WaIcon } from "@/components/WhatsAppWidget";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

const icons: Record<string, any> = { Wrench, Search, Bath, Flame, Droplets, Pipette };

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    title: `Certified Plumber in Kuwait 24/7 | ${BRAND.nameEn} | ${site.phone}`,
    absoluteTitle: true,
    description: `Drain unblocking, leak detection without breaking, water heaters, pumps, pipework and bathroom rough-ins across Kuwait. Written warranty — call ${site.phone}.`,
    path: "/en",
    siteName: BRAND.nameEn,
    lang: "en",
    alternate: "/",
  });
}

export default async function EnHome() {
  const [site, services, areas] = await Promise.all([getSiteSettings(), getServices(), getAreas()]);
  const steps = [PhoneCall, ClipboardCheck, BadgeCheck];

  return (
    <div dir="ltr">
      <section className="relative hero-dark clip-slant text-white overflow-hidden">
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 sm:pt-16 sm:pb-28 grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs sm:text-sm text-accent-200 mb-5">
              <span className="relative w-2 h-2 rounded-full bg-accent-400 ripple" /> {EN_HOME.badge}
            </div>
            <h1 className="text-[2.1rem] leading-[1.15] sm:text-5xl lg:text-[3.4rem] font-bold mb-4">{EN_HOME.title}</h1>
            <p className="text-xl sm:text-2xl font-semibold text-accent-300 mb-5">{EN_HOME.subtitle}</p>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">{EN_HOME.desc}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 btn-primary text-brand-950 font-bold px-7 py-4 rounded-xl text-lg">
                <Phone className="w-5 h-5" /> Call {site.phone}
              </a>
              <a href={waLink(site.whatsapp, EN_WA.default)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-[#25D366] text-white font-bold px-7 py-4 rounded-xl transition">
                <WaIcon className="w-5 h-5 text-[#25D366]" /> WhatsApp us
              </a>
            </div>
          </div>
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
            <div className="bg-gradient-to-l from-brand-700 to-brand-900 text-white px-5 py-4 font-bold text-lg flex items-center gap-2"><Wrench className="w-5 h-5" /> What do you need?</div>
            <ul className="divide-y divide-slate-100">
              {services.map((s) => {
                const e = enService(s);
                const Icon = icons[s.icon] || Wrench;
                return (
                  <li key={s.id}>
                    <Link href={`/en/services/${s.slug}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-accent-50 transition group">
                      <span className="w-9 h-9 rounded-lg icon-tile flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                      <span className="flex-1 font-semibold text-sm text-brand-950">{e.title}</span>
                      <ArrowRight className="w-4 h-4 text-accent-500 group-hover:translate-x-1 transition" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white shadow-card rounded-2xl overflow-hidden">
          {[
            { icon: Clock3, v: "24/7", l: "Open day and night" },
            { icon: ShieldCheck, v: "Warranty", l: "Written, on installations" },
            { icon: ScanSearch, v: "No breaking", l: "Leaks found by equipment" },
            { icon: MapPin, v: `${areas.length || 6} areas`, l: "Covered across Kuwait" },
          ].map((x, i) => (
            <div key={i} className="flex items-center gap-3 p-4 sm:p-6 border-slate-100 border-e border-b lg:border-b-0">
              <x.icon className="w-8 h-8 text-accent-500 shrink-0" />
              <div>
                <div className="text-lg sm:text-2xl font-bold text-brand-950 leading-tight">{x.v}</div>
                <div className="text-xs sm:text-sm text-slate-600">{x.l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading eyebrow="Services" title={EN_HOME.servicesTitle} subtitle={EN_HOME.servicesSub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((s, i) => {
              const e = enService(s);
              const Icon = icons[s.icon] || Wrench;
              return (
                <Link key={s.id} href={`/en/services/${s.slug}`} className="service-card bg-white border border-slate-200 rounded-2xl p-6 flex flex-col group overflow-hidden">
                  <div className="flex items-start justify-between mb-5">
                    <span className="w-12 h-12 rounded-xl icon-tile-solid flex items-center justify-center"><Icon className="w-6 h-6" /></span>
                    <span className="text-4xl font-bold text-slate-100 group-hover:text-accent-100 transition">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-bold text-lg text-brand-950 mb-2">{e.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">{e.short}</p>
                  <span className="inline-flex items-center gap-1 text-accent-600 font-bold text-sm">Details <ArrowRight className="w-4 h-4" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white blueprint-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading eyebrow="Process" title={EN_HOME.howTitle} center />
          <ol className="relative grid md:grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-[3px] steps-line" aria-hidden />
            {EN_HOME.how.map((step, i) => {
              const Icon = steps[i];
              return (
                <li key={i} className="relative text-center">
                  <div className="relative mx-auto w-14 h-14 rounded-2xl icon-tile-solid text-white flex items-center justify-center mb-4 z-10">
                    <Icon className="w-6 h-6" />
                    <span className="absolute -top-2 -start-2 w-6 h-6 rounded-full bg-accent-400 text-brand-950 text-xs ring-2 ring-white font-bold flex items-center justify-center">{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-brand-950 text-lg mb-1">{step.t}</h3>
                  <p className="text-slate-600 text-sm max-w-xs mx-auto leading-relaxed">{step.d}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-10 items-stretch">
          <div className="hero-dark text-white rounded-2xl p-7 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 dot-grid pointer-events-none" />
            <span className="relative eyebrow eyebrow-light">Why us</span>
            <h2 className="relative text-2xl sm:text-3xl font-bold mt-3 mb-4">{EN_HOME.whyTitle}</h2>
            <p className="relative text-brand-100 leading-relaxed">Plumbing is all we do — so our technicians know Kuwaiti homes, from older houses to new villas and apartment towers.</p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {EN_HOME.why.map((text, i) => (
              <li key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
                <span className="w-9 h-9 rounded-xl bg-accent-50 text-accent-700 font-bold flex items-center justify-center shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-semibold text-brand-950 leading-relaxed pt-1">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gold-gradient text-brand-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{EN_HOME.ctaTitle}</h2>
            <p className="text-brand-900/80">{EN_HOME.ctaDesc}</p>
          </div>
          <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 bg-brand-950 text-white font-bold px-6 py-4 rounded-xl text-lg">
            <Phone className="w-5 h-5" /> {site.phone}
          </a>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
          <div>
            <SectionHeading eyebrow="Areas" title="We cover Kuwait's governorates" />
            <div className="grid grid-cols-2 gap-3 -mt-4">
              {areas.map((a) => (
                <Link key={a.id} href={`/en/areas/${a.slug}`} className="card-hover bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-2 font-semibold text-brand-950">
                  <MapPin className="w-4 h-4 text-accent-500 shrink-0" /> {enArea(a).title}
                </Link>
              ))}
            </div>
          </div>
          <LeadForm
            lang="en"
            areas={areas.map((a) => ({ title: a.title, label: enArea(a).title }))}
            services={services.map((s) => ({ title: s.title, label: enService(s).title }))}
          />
        </div>
      </section>
    </div>
  );
}
