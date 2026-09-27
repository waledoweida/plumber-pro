import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({ title: `Privacy Policy | ${BRAND.nameEn}`, absoluteTitle: true, description: `Privacy policy for the ${BRAND.nameEn} website.`, path: "/en/privacy", siteName: BRAND.nameEn, lang: "en", alternate: "/privacy" });
}
export default async function EnPrivacyPage() {
  const site = await getSiteSettings();
  return (
    <div dir="ltr" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
        <p>At <strong>{BRAND.nameEn}</strong> your privacy matters. Here is what we collect when you request a plumber through this site and what we do with it.</p>
        <h2 className="text-lg font-bold text-slate-900">Information we collect</h2>
        <ul className="list-disc ps-5 space-y-1"><li>Your name and phone number, so we can call you</li><li>Your area, the job you need and any description you add</li></ul>
        <h2 className="text-lg font-bold text-slate-900">How we use it</h2>
        <p>Only to arrange the visit, reach you and follow up on the job. We never sell your data or pass it to anyone else.</p>
        <h2 className="text-lg font-bold text-slate-900">Visit statistics</h2>
        <p>We count visits and clicks on the call and WhatsApp buttons anonymously to improve the site. No cookies are used for this and no IP address or identifying data is stored.</p>
        <h2 className="text-lg font-bold text-slate-900">Want your data deleted?</h2>
        <p>Call {site.phone} or email us and we will remove your request — — {site.email} — Kuwait</p>
      </div>
      <Link href="/en" className="inline-block mt-8 text-brand-700 font-semibold text-sm">← Home</Link>
      <div className="h-16" aria-hidden />
    </div>
  );
}
