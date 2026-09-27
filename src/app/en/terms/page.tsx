import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({ title: `Terms & Conditions | ${BRAND.nameEn}`, absoluteTitle: true, description: `Terms of use for ${BRAND.nameEn} services.`, path: "/en/terms", siteName: BRAND.nameEn, lang: "en", alternate: "/terms" });
}
export default async function EnTermsPage() {
  const site = await getSiteSettings();
  return (
    <div dir="ltr" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Terms &amp; Conditions</h1>
      <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
        <p>By using the <strong>{BRAND.nameEn}</strong> website or requesting a service, you agree to these terms.</p>
        <h2 className="text-lg font-bold text-slate-900">Price and warranty</h2>
        <p>The technician inspects the problem and tells you the price; work starts only once you agree. Any extra work found during the repair is discussed with you first. You receive a written warranty whose length depends on the service and parts; it does not cover misuse or changes made by others.</p>
        <h2 className="text-lg font-bold text-slate-900">Appointments</h2>
        <p>We keep to the agreed time as closely as possible. If traffic or an emergency delays us, we call to let you know.</p>
        <h2 className="text-lg font-bold text-slate-900">Contact</h2>
        <p>{site.phone} — {site.email} — Kuwait</p>
      </div>
      <Link href="/en" className="inline-block mt-8 text-brand-700 font-semibold text-sm">← Home</Link>
      <div className="h-16" aria-hidden />
    </div>
  );
}
