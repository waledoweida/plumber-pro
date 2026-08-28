import { getSiteSettings, getWhyPoints, getTexts } from "@/lib/content";
import { CheckCircle, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [site, why, texts] = await Promise.all([
    getSiteSettings(),
    getWhyPoints(),
    getTexts(),
  ]);
  const t = (k: string, fb: string) => (k in texts ? texts[k] : fb);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-6">
        {t("page.aboutTitle", "من نحن")}
      </h1>
      <p className="text-slate-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{site.description}</p>
      <p className="text-slate-700 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
        {t("page.aboutBody", "نعمل على مدار الساعة في جميع مناطق الكويت بفنيين معتمدين وضمان على الأعمال.")}
      </p>
      <ul className="space-y-2 mb-6 sm:mb-8">
        {why.map((w) => (
          <li key={w.id} className="flex gap-2 items-start text-sm sm:text-base">
            <CheckCircle className="w-5 h-5 text-brand-600 shrink-0" />
            {w.text}
          </li>
        ))}
      </ul>
      <div className="text-center">
        <a
          href={`tel:${site.phone}`}
          className="inline-flex items-center justify-center gap-2 bg-brand-700 text-white font-bold px-6 sm:px-8 py-3.5 rounded-xl w-full sm:w-auto touch-target"
        >
          <Phone className="w-5 h-5" />
          {site.phone}
        </a>
      </div>
      <div className="h-20 sm:h-4" aria-hidden />
    </div>
  );
}
