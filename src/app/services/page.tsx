import Link from "next/link";
import { getServices, getTexts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, texts] = await Promise.all([getServices(), getTexts()]);
  const title = "page.servicesTitle" in texts ? texts["page.servicesTitle"] : "خدمات السباكة";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-6 sm:mb-8 text-center">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:border-brand-300 transition"
          >
            {s.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image} alt={s.title} className="w-full h-36 sm:h-40 object-cover" />
            ) : null}
            <div className="p-4 sm:p-6">
              <h2 className="font-bold text-lg sm:text-xl mb-1.5 sm:mb-2">{s.title}</h2>
              <p className="text-slate-600 text-sm">{s.short}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="h-20 sm:h-4" aria-hidden />
    </div>
  );
}
