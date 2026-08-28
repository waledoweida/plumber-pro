import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, Clock, ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getServices } from "@/lib/content";
import LeadForm from "@/components/LeadForm";

export const dynamic = "force-dynamic";

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = await prisma.area.findUnique({ where: { slug } });
  if (!area || !area.published) notFound();
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="text-brand-600 text-sm inline-flex items-center gap-1 mb-6">
        <ArrowRight className="w-4 h-4" /> الرئيسية
      </Link>
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="inline-flex items-center gap-2 text-brand-600 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            خدمة محلية
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-brand-900 mb-3">{area.title}</h1>
          <p className="text-slate-600 text-lg mb-4">{area.description}</p>
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-800 px-4 py-2 rounded-xl text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            الاستجابة التقريبية: {area.responseTime}
          </div>
          {area.excerpt && <p className="text-slate-700 mb-4 leading-relaxed">{area.excerpt}</p>}
          {area.content && (
            <div className="text-slate-700 leading-relaxed whitespace-pre-line mb-8">{area.content}</div>
          )}
          <a
            href={`tel:${site.phone}`}
            className="inline-flex items-center gap-2 bg-brand-700 text-white font-bold px-6 py-3.5 rounded-xl"
          >
            <Phone className="w-5 h-5" />
            {site.phone}
          </a>
        </div>
        <div className="lg:col-span-2">
          <LeadForm
            areas={[{ title: area.title }]}
            services={services.map((s) => ({ title: s.title }))}
            title={`طلب سباك ${area.title}`}
          />
        </div>
      </div>
      <div className="h-20" aria-hidden />
    </div>
  );
}
