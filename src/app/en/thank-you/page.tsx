import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: { absolute: `Thank you | ${BRAND.nameEn}` }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EnThankYou() {
  const site = await getSiteSettings();
  return (
    <div dir="ltr" className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-16 h-16 text-brand-600 mx-auto mb-4" />
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">We&apos;ve received your request</h1>
      <p className="text-slate-600 mb-8">We&apos;ll contact you shortly. For emergencies, call us now:</p>
      <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 icon-tile-solid text-white font-bold px-8 py-4 rounded-lg">
        <Phone className="w-5 h-5" /> {site.phone}
      </a>
      <div className="mt-6"><Link href="/en" className="text-brand-700 font-semibold hover:underline">Back to home</Link></div>
    </div>
  );
}
