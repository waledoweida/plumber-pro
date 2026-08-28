import Link from "next/link";
import {
  Phone, Clock, CheckCircle, Wrench, Search, Bath, Flame, Droplets, Pipette, ArrowLeft, MapPin, Star,
} from "lucide-react";
import {
  getSiteSettings, getTexts, getVisibility, getServices, getAreas, getWhyPoints,
  getReviews, getGallery, getArticles,
} from "@/lib/content";
import LeadForm from "@/components/LeadForm";

export const dynamic = "force-dynamic";

const icons: Record<string, any> = {
  Wrench, Search, Bath, Flame, Droplets, Pipette, Clock, CheckCircle,
};

export default async function HomePage() {
  const [site, texts, vis, services, areas, why, reviews, gallery, articles] = await Promise.all([
    getSiteSettings(),
    getTexts(),
    getVisibility(),
    getServices(),
    getAreas(),
    getWhyPoints(),
    getReviews(),
    getGallery(),
    getArticles(3),
  ]);
  const t = (k: string, fallback = "") => (k in texts ? texts[k] : fallback);

  return (
    <>
      {vis.showHero !== false && (
        <section className="relative bg-gradient-to-bl from-brand-900 via-brand-800 to-brand-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#c97c3d,transparent_50%)]" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                {t("home.heroBadge") && (
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm mb-4 sm:mb-6 border border-white/10">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-400 shrink-0" />
                    <span>{t("home.heroBadge")}</span>
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-2 sm:mb-3">
                  {t("home.heroTitle", site.name)}
                </h1>
                {t("home.heroSubtitle") && (
                  <p className="text-base sm:text-xl text-accent-400 font-semibold mb-3 sm:mb-5">
                    {t("home.heroSubtitle")}
                  </p>
                )}
                <p className="text-brand-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed whitespace-pre-line">
                  {t("home.heroDesc", site.description)}
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <a
                    href={`tel:${site.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold text-base sm:text-lg px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg transition touch-target"
                  >
                    <Phone className="w-5 h-5 shrink-0" />
                    <span className="truncate">
                      {t("home.btnCall", "اتصل الآن")}: {site.phone}
                    </span>
                  </a>
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-brand-800 hover:bg-brand-50 font-bold text-base sm:text-lg px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg transition touch-target"
                  >
                    {t("home.btnWhatsapp", "واتساب")}
                  </a>
                </div>
              </div>
              {vis.showLeadForm !== false && (
                <div className="text-slate-900">
                  <LeadForm
                    areas={areas.map((a) => ({ title: a.title }))}
                    services={services.map((s) => ({ title: s.title }))}
                    title={t("home.formTitle", "اطلب خدمة الآن")}
                    compact
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {vis.showServices !== false && (
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-900 mb-2 sm:mb-3">
                {t("home.servicesTitle", "خدماتنا")}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto px-2">
                {t("home.servicesSubtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {services.map((s) => {
                const Icon = icons[s.icon] || Wrench;
                return (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-brand-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {s.image ? (
                      <div className="h-36 sm:h-40 bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                    ) : (
                      <div className="h-24 sm:h-28 bg-gradient-to-bl from-brand-50 to-brand-100 flex items-center justify-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white text-brand-700 flex items-center justify-center shadow-sm group-hover:bg-brand-700 group-hover:text-white transition">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                      </div>
                    )}
                    <div className="p-4 sm:p-6">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1.5 group-hover:text-brand-700 transition">
                        {s.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-2 line-clamp-2">{s.short}</p>
                      <span className="inline-flex items-center gap-1 text-brand-600 text-sm font-semibold">
                        {t("home.servicesMore", "التفاصيل")} <ArrowLeft className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {vis.showReviews !== false && reviews.length > 0 && (
        <section className="py-12 sm:py-16 bg-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 text-center mb-8">
              {t("home.reviewsTitle", "آراء عملائنا")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border p-5 shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">«{r.text}»</p>
                  <div className="text-sm font-bold text-slate-900">{r.name}</div>
                  {r.area && <div className="text-xs text-slate-500">{r.area}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {vis.showGallery !== false && gallery.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 text-center mb-8">
              {t("home.galleryTitle", "من أعمالنا")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="relative group rounded-2xl overflow-hidden border bg-slate-100 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                    <div className="text-white text-sm font-bold">{g.title}</div>
                    {g.caption && <div className="text-white/80 text-xs">{g.caption}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {vis.showWhy !== false && (
        <section className="py-12 sm:py-16 bg-brand-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                {t("home.whyTitle", "لماذا تختارنا؟")}
              </h2>
              <p className="text-brand-100 text-base sm:text-lg mb-5 sm:mb-6">{t("home.whyDesc")}</p>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 font-bold px-5 sm:px-6 py-3 rounded-xl transition touch-target"
              >
                <Phone className="w-5 h-5" /> {t("home.whyBtn", "اطلب خدمة")}
              </a>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {why.map((w) => (
                <li key={w.id} className="flex items-start gap-3 bg-white/5 rounded-xl px-3.5 sm:px-4 py-3 border border-white/10">
                  <CheckCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">{w.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {vis.showAreas !== false && (
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 text-brand-600 mb-2 sm:mb-3">
              <MapPin className="w-5 h-5" />
              <span className="font-medium text-sm">{t("home.areasEyebrow", "تغطية شاملة")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-2 sm:mb-3">
              {t("home.areasTitle", "المناطق")}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-6 sm:mb-8">{t("home.areasSubtitle")}</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {areas.map((a) => (
                <Link
                  key={a.id}
                  href={`/areas/${a.slug}`}
                  className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 hover:shadow-md transition"
                >
                  <div className="font-bold text-slate-800 text-sm sm:text-base">{a.title}</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{a.responseTime}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {vis.showBlog !== false && articles.length > 0 && (
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">
                {t("home.blogTitle", "من المدونة")}
              </h2>
              <Link href="/blog" className="text-brand-600 text-sm font-semibold hover:underline shrink-0">
                كل المقالات
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {articles.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="bg-white rounded-2xl border p-5 hover:shadow-md transition">
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {vis.showCta !== false && (
        <section className="py-10 sm:py-14 bg-gradient-to-l from-brand-700 to-brand-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">{t("home.ctaTitle")}</h2>
            <p className="text-brand-100 text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto">{t("home.ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-800 font-bold text-lg sm:text-xl px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl shadow-lg hover:bg-brand-50 transition touch-target"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                {site.phone}
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 font-bold text-lg sm:text-xl px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl shadow-lg transition touch-target"
              >
                {t("home.ctaWhatsapp", "واتساب")}
              </a>
            </div>
          </div>
        </section>
      )}

      <div className="h-24 sm:h-8" aria-hidden />
    </>
  );
}
