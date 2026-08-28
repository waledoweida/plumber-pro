import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, CheckCircle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getTexts } from "@/lib/content";

export const dynamic = "force-dynamic";

function parseFeatures(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug.length > 80) notFound();

  const s = await prisma.service.findUnique({ where: { slug } });
  if (!s || !s.published) notFound();

  const [site, texts] = await Promise.all([getSiteSettings(), getTexts()]);
  const back = "page.backToServices" in texts ? texts["page.backToServices"] : "الخدمات";
  const features = parseFeatures(s.features);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/services" className="inline-flex items-center gap-1 text-brand-600 mb-5 sm:mb-6 text-sm">
        <ArrowRight className="w-4 h-4" /> {back}
      </Link>
      {s.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={s.image}
          alt={s.title}
          className="w-full max-h-52 sm:max-h-72 object-cover rounded-2xl mb-5 sm:mb-6"
        />
      ) : null}
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-3 sm:mb-4">{s.title}</h1>
      <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 whitespace-pre-line">
        {s.description}
      </p>
      {features.length > 0 && (
        <ul className="space-y-2 mb-8 sm:mb-10">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
              <CheckCircle className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      )}
      <div className="bg-brand-50 rounded-2xl p-5 sm:p-6 text-center">
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
