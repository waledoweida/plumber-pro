import Link from "next/link";
import { CheckCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ThankYouPage() {
  const site = await getSiteSettings();
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center mb-4">
        <CheckCircle className="w-9 h-9" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-3">تم استلام طلبك</h1>
      <p className="text-slate-600 mb-8">هنتواصل معك في أقرب وقت. للطوارئ اتصل الآن:</p>
      <a
        href={`tel:${site.phone}`}
        className="inline-flex items-center gap-2 bg-brand-700 text-white font-bold px-8 py-3.5 rounded-2xl"
      >
        <Phone className="w-5 h-5" />
        {site.phone}
      </a>
      <div className="mt-6">
        <Link href="/" className="text-brand-600 text-sm hover:underline">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
