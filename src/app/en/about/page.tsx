import type { Metadata } from "next";
import { CheckCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { EN_HOME } from "@/lib/en";
import PageHero from "@/components/ui/PageHero";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    title: `About Us | ${BRAND.nameEn} — Plumbers in Kuwait`,
    absoluteTitle: true,
    description: `${BRAND.nameEn} is a team of certified plumbing and home maintenance technicians serving all of Kuwait 24/7, with clear pricing and a written warranty.`,
    path: "/en/about",
    siteName: BRAND.nameEn,
    lang: "en",
    alternate: "/about",
  });
}

export default async function EnAbout() {
  const site = await getSiteSettings();
  return (
    <div dir="ltr">
      <PageHero navLabel="Breadcrumb" title="About Us" subtitle="Certified plumbers on call day and night across Kuwait — and a written warranty on what we fit." crumbs={[{ href: "/en", label: "Home" }]} />
      <div className="bg-[#f2f5f9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-sm mb-6 text-slate-700 leading-loose">
            <p className="mb-3">
              {BRAND.nameEn} does plumbing and nothing else: blocked drains and sewer lines, hidden leaks traced with thermal and acoustic equipment,
              bathroom rough-ins, water heaters, water pumps and pipe replacement.
            </p>
            <p>
              We find the real cause before we replace a part or lift a tile, agree the price with you before we start, protect your floors while we work
              and leave the place clean. Every installation comes with a written warranty.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            {EN_HOME.why.map((w) => (
              <li key={w} className="flex gap-3 items-center bg-white border border-slate-200/70 rounded-lg p-4">
                <span className="w-9 h-9 rounded-xl icon-tile-solid flex items-center justify-center shrink-0"><CheckCircle className="w-4 h-4 text-white" /></span>
                {w}
              </li>
            ))}
          </ul>
          <div className="text-center">
            <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 btn-primary text-white font-bold px-8 py-4 rounded-md w-full sm:w-auto">
              <Phone className="w-5 h-5" /> {site.phone}
            </a>
          </div>
          <div className="h-20 sm:h-4" aria-hidden />
        </div>
      </div>
    </div>
  );
}
