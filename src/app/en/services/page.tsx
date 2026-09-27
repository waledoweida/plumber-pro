import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Search, Bath, Flame, Droplets, Pipette, Clock, CheckCircle, Wind, Shield, ArrowRight } from "lucide-react";
import { getServices } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { enService } from "@/lib/en";
import PageHero from "@/components/ui/PageHero";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";
const icons: Record<string, any> = { Wrench, Search, Bath, Flame, Droplets, Pipette, Clock, CheckCircle, Wind, Shield };

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: `Plumbing Services in Kuwait | ${BRAND.nameEn}`,
    absoluteTitle: true,
    description: "Drain unblocking, leak detection without breaking, bathroom rough-ins, water heaters, water pumps and pipework — certified plumbers across Kuwait, 24 hours.",
    path: "/en/services",
    siteName: BRAND.nameEn,
    lang: "en",
    alternate: "/services",
  });
}

export default async function EnServices() {
  const services = await getServices();
  return (
    <div dir="ltr">
      <PageHero
        navLabel="Breadcrumb"
        title="Our Services"
        subtitle="Pick a service to see exactly what we do — or call and we'll diagnose the problem for you."
        crumbs={[{ href: "/en", label: "Home" }]}
      />
      <div className="bg-[#f7f9fc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {services.map((s) => {
            const Icon = icons[s.icon] || Wrench;
            const e = enService(s);
            return (
              <Link key={s.id} href={`/en/services/${s.slug}`} className="service-card bg-white rounded-2xl border border-slate-200/70 p-5 sm:p-6 flex flex-col group">
                <span className="w-12 h-12 rounded-2xl icon-tile flex items-center justify-center text-brand-700 mb-4"><Icon className="w-6 h-6" /></span>
                <h2 className="font-bold text-lg mb-2 text-slate-900">{e.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">{e.short}</p>
                <span className="inline-flex items-center gap-1 text-brand-700 font-bold text-sm mt-4 group-hover:gap-2 transition-all">Details <ArrowRight className="w-4 h-4" /></span>
              </Link>
            );
          })}
        </div>
        <div className="h-20 sm:h-4" aria-hidden />
      </div>
    </div>
  );
}
