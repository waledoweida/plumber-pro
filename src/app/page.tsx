import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone, Wrench, Search, Bath, Flame, Droplets, Pipette, ArrowLeft, ShieldCheck, Clock3,
  ScanSearch, MapPin, MessageCircle, Star, PhoneCall, ClipboardCheck, BadgeCheck, CheckCircle,
} from "lucide-react";
import { pageMeta, seoDescription } from "@/lib/seo";
import { responsive } from "@/lib/markdown";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadForm from "@/components/LeadForm";
import {
  getSiteSettings, getTexts, getVisibility, getServices, getAreas, getWhyPoints,
  getReviews, getArticles, getGallery,
} from "@/lib/content";
import { waLink, WA_DEFAULT } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    title: `سباك الكويت 24 ساعة | ${site.name} | ${site.phone}`,
    absoluteTitle: true,
    description: seoDescription(site.description, "تسليك مجاري، كشف تهريب الماي بدون تكسير، سخانات وماطورات وتأسيس حمامات بكل مناطق الكويت"),
    path: "/",
    siteName: site.name,
    alternate: "/en",
  });
}

const icons: Record<string, any> = { Wrench, Search, Bath, Flame, Droplets, Pipette };

// المشكلة اللي يعرفها الزبون ← الخدمة اللي تحلها
const PROBLEMS: { slug: string; text: string }[] = [
  { slug: "drain-cleaning", text: "البلاعة أو السنك مسدود" },
  { slug: "leak-detection", text: "فاتورة الماي عالية أو في رطوبة" },
  { slug: "heaters", text: "السخان ما يحمّي" },
  { slug: "pumps", text: "ضغط الماي ضعيف فوق" },
  { slug: "bathroom", text: "أبي أجدد الحمام" },
  { slug: "pipes", text: "المواسير قديمة ومصدّية" },
];

export default async function HomePage() {
  const [site, texts, vis, services, areas, why, reviews, articles, gallery] = await Promise.all([
    getSiteSettings(),
    getTexts(),
    getVisibility(),
    getServices(),
    getAreas(),
    getWhyPoints(),
    getReviews(),
    getArticles(3),
    getGallery(),
  ]);
  const t = (k: string, fallback = "") => (k in texts ? texts[k] : fallback);
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const problems = PROBLEMS.filter((p) => bySlug.has(p.slug));
  const whyItems = why.length
    ? why.map((w) => w.text)
    : ["فنيين معتمدين وخبرة بالشغل", "تعرف السعر من أول مكالمة", "أجهزة تكشف التهريب بدون تكسير", "ضمان مكتوب على التركيب", "نغطي كل محافظات الكويت", "طوارئ 24 ساعة"];
  const wa = waLink(site.whatsapp, WA_DEFAULT);
  const heroLines = t("home.heroDesc", "تسليك مجاري • كشف تهريب الماي بدون تكسير • سخانات وماطورات • تأسيس حمامات\nفنيين معتمدين والسعر تعرفه من أول مكالمة").split("\n");

  return (
    <>
      {/* ===== الهيرو ===== */}
      {vis.showHero !== false && (
        <section className="relative hero-dark clip-slant text-white overflow-hidden">
          <div className="absolute inset-0 dot-grid pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 sm:pt-16 sm:pb-28">
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs sm:text-sm text-accent-200 mb-5">
                  <span className="relative w-2 h-2 rounded-full bg-accent-400 ripple" />
                  {t("home.heroBadge", "شغّالين 24 ساعة، حتى الجمعة والعطل")}
                </div>
                <h1 className="text-[2.1rem] leading-[1.2] sm:text-5xl lg:text-[3.5rem] font-bold mb-4">
                  {t("home.heroTitle", "سباك الكويت المعتمد")}
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-accent-300 mb-5">
                  {t("home.heroSubtitle", "شغل سباكة مرتب وعليه ضمان مكتوب")}
                </p>
                <div className="text-brand-100 text-sm sm:text-base leading-loose mb-8 space-y-1 max-w-xl">
                  {heroLines.map((l, i) => <p key={i}>{l}</p>)}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 btn-primary text-brand-950 font-bold px-7 py-4 rounded-xl text-lg">
                    <Phone className="w-5 h-5" /> {t("home.btnCall", "اتصل علينا")} <span dir="ltr">{site.phone}</span>
                  </a>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-[#25D366] text-white font-bold px-7 py-4 rounded-xl transition">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" /> {t("home.btnWhatsapp", "كلمنا واتساب")}
                  </a>
                </div>
              </div>

              {/* بطاقة: شنو المشكلة؟ */}
              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
                <div className="bg-gradient-to-l from-brand-700 to-brand-900 text-white px-5 py-4 flex items-center gap-3">
                  <Wrench className="w-6 h-6" />
                  <div>
                    <h2 className="font-bold text-lg leading-tight">شنو المشكلة عندك؟</h2>
                    <p className="text-xs text-brand-100">اختار وشوف شلون نحلها</p>
                  </div>
                </div>
                <ul className="divide-y divide-slate-100">
                  {problems.map((p) => {
                    const s = bySlug.get(p.slug)!;
                    const Icon = icons[s.icon] || Wrench;
                    return (
                      <li key={p.slug}>
                        <Link href={`/services/${s.slug}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-accent-50 transition group">
                          <span className="w-9 h-9 rounded-lg icon-tile flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                          <span className="flex-1">
                            <span className="block font-semibold text-sm text-brand-950">{p.text}</span>
                            <span className="block text-xs text-slate-500">{s.title}</span>
                          </span>
                          <ArrowLeft className="w-4 h-4 text-accent-500 group-hover:-translate-x-1 transition" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== ليش تثق فينا (حقائق) ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white shadow-card rounded-2xl overflow-hidden">
          {[
            { icon: Clock3, v: "24/7", l: "مفتوحين ليل ونهار" },
            { icon: ShieldCheck, v: "ضمان", l: "مكتوب على التركيب" },
            { icon: ScanSearch, v: "بدون تكسير", l: "كشف التهريب بالأجهزة" },
            { icon: MapPin, v: `${areas.length || 6} مناطق`, l: "نغطيها بالكويت" },
          ].map((x, i) => (
            <div key={i} className={`flex items-center gap-3 p-4 sm:p-6 ${i % 2 === 0 ? "border-e" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} lg:border-e border-slate-100`}>
              <x.icon className="w-8 h-8 text-accent-500 shrink-0" />
              <div>
                <div className="text-lg sm:text-2xl font-bold text-brand-950 leading-tight">{x.v}</div>
                <div className="text-xs sm:text-sm text-slate-600">{x.l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== الخدمات ===== */}
      {vis.showServices !== false && services.length > 0 && (
        <section id="services" className="py-14 sm:py-20 scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                eyebrow="خدماتنا"
                title={t("home.servicesTitle", "كل شغل السباكة عندنا")}
                subtitle={t("home.servicesSubtitle", "من سدّة البلاعة لين تأسيس الحمام من الصفر")}
              />
              <Link href="/services" className="hidden sm:inline-flex items-center gap-1 text-accent-600 font-bold text-sm mb-12 shrink-0">
                كل الخدمات <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {services.map((s, i) => {
                const Icon = icons[s.icon] || Wrench;
                return (
                  <Link key={s.id} href={`/services/${s.slug}`} className="service-card bg-white border border-slate-200 rounded-2xl p-6 flex flex-col group overflow-hidden">
                    <div className="flex items-start justify-between mb-5">
                      <span className="w-12 h-12 rounded-xl icon-tile-solid flex items-center justify-center"><Icon className="w-6 h-6" /></span>
                      <span className="text-4xl font-bold text-slate-100 group-hover:text-accent-100 transition" dir="ltr">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-brand-950 mb-2">{s.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">{s.short || s.description}</p>
                    <span className="inline-flex items-center gap-1 text-accent-600 font-bold text-sm group-hover:gap-2 transition-all">
                      {t("home.servicesMore", "التفاصيل")} <ArrowLeft className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== شلون نشتغل ===== */}
      {vis.showHowItWorks !== false && (
        <section className="py-14 sm:py-20 bg-white blueprint-light section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading eyebrow="شلون نشتغل" title="من المكالمة لين آخر برغي" center />
            <ol className="relative grid md:grid-cols-3 gap-8">
              <div className="hidden md:block absolute top-7 right-[16%] left-[16%] h-[3px] steps-line" aria-hidden />
              {[
                { icon: PhoneCall, title: "كلمنا وقول المشكلة", desc: "اتصال أو واتساب أو عبّي النموذج، وإذا تقدر صوّر لنا المشكلة" },
                { icon: ClipboardCheck, title: "الفني يعاين ويسعّر", desc: "يوصلك الفني، يشوف الحالة ويقولك السعر قبل لا يمسك أي شي" },
                { icon: BadgeCheck, title: "نصلح ونعطيك ضمان", desc: "نخلص الشغل وننظف المكان، ونعطيك ضمان مكتوب" },
              ].map((step, i) => (
                <li key={i} className="relative text-center bg-white md:bg-transparent">
                  <div className="relative mx-auto w-14 h-14 rounded-2xl icon-tile-solid text-white flex items-center justify-center mb-4 z-10">
                    <step.icon className="w-6 h-6" />
                    <span className="absolute -top-2 -start-2 w-6 h-6 rounded-full bg-accent-400 text-brand-950 text-xs ring-2 ring-white font-bold flex items-center justify-center">{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-brand-950 text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-600 text-sm max-w-xs mx-auto leading-relaxed">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ===== ليش إحنا ===== */}
      {vis.showWhy !== false && (
        <section className="py-14 sm:py-20 section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-10 items-stretch">
            <div className="hero-dark text-white rounded-2xl p-7 sm:p-10 relative overflow-hidden flex flex-col">
              <div className="absolute inset-0 dot-grid pointer-events-none" />
              <span className="relative eyebrow eyebrow-light">ليش إحنا</span>
              <h2 className="relative text-2xl sm:text-3xl font-bold mt-3 mb-4 leading-snug">
                {t("home.whyTitle", `ليش الناس تختار ${site.name}؟`)}
              </h2>
              <p className="relative text-brand-100 leading-relaxed mb-8">
                {t("home.whyDesc", "خبرة بالسباكة وأمانة بالشغل وضمان تقدر ترجع له.")}
              </p>
              <Link href="#lead" className="relative mt-auto self-start inline-flex items-center gap-2 btn-primary text-brand-950 font-bold px-6 py-3 rounded-xl">
                {t("home.whyBtn", "اطلب سباك")} <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {whyItems.map((text, i) => (
                <li key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
                  <span className="w-9 h-9 rounded-xl bg-accent-50 text-accent-700 font-bold flex items-center justify-center shrink-0" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-semibold text-brand-950 leading-relaxed pt-1">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===== صور من شغلنا ===== */}
      {vis.showGallery !== false && gallery.length > 0 && (
        <section className="py-14 sm:py-20 bg-white section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading eyebrow="من الميدان" title={t("home.galleryTitle", "صور من شغلنا")} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.slice(0, 6).map((g) => (
                <figure key={g.id} className="group relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3]">
                  <img loading="lazy" decoding="async" src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/90 to-transparent text-white p-4 pt-10">
                    <span className="block font-bold">{g.title}</span>
                    {g.caption && <span className="block text-xs text-brand-100">{g.caption}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== كلام الزباين ===== */}
      {vis.showReviews !== false && reviews.length > 0 && (
        <section className="py-14 sm:py-20 section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading eyebrow="آراء" title={t("home.reviewsTitle", "كلام زباينا")} />
            <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
              {reviews.slice(0, 6).map((r) => (
                <figure key={r.id} className="bg-white border border-slate-200  rounded-2xl p-6 flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: Math.min(5, Math.max(1, r.rating)) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 leading-relaxed mb-5 flex-1">«{r.text}»</blockquote>
                  <figcaption className="flex items-center gap-3 text-sm">
                    <span className="w-9 h-9 rounded-full bg-brand-100 text-brand-900 font-bold flex items-center justify-center">{r.name.charAt(0)}</span>
                    <span>
                      <span className="block font-bold text-brand-950">{r.name}</span>
                      {r.area && <span className="block text-xs text-slate-500">{r.area}</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== شريط الاتصال ===== */}
      {vis.showCta !== false && (
        <section className="bg-gold-gradient text-brand-950 section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t("home.ctaTitle", "الماي ما ينتظر… كلمنا الحين")}</h2>
              <p className="text-brand-900/80 leading-relaxed">{t("home.ctaDesc", "التهريب الصغير اليوم يصير رطوبة وتكسير باجر. اتصل وخل الفني يشوفها.")}</p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 bg-brand-950 text-white font-bold px-6 py-4 rounded-xl text-lg">
                <Phone className="w-5 h-5" /> <span dir="ltr">{site.phone}</span>
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-brand-950 font-bold px-6 py-3.5 rounded-xl">
                <MessageCircle className="w-5 h-5 text-[#128C7E]" /> {t("home.ctaWhatsapp", "واتساب")}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ===== نموذج الطلب ===== */}
      {vis.showLeadForm !== false && (
        <section id="lead" className="py-14 sm:py-20 bg-white scroll-mt-24 section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-start">
            <div>
              <SectionHeading
                eyebrow="اطلب سباك"
                title={t("home.formTitle", "عطنا رقمك ونتصل فيك")}
                subtitle={`عبّي النموذج ونرجع لك خلال دقايق، أو اتصل مباشرة على ${site.phone}.`}
              />
              <ul className="space-y-3 -mt-4">
                {["نرد على الطلبات 24 ساعة", "السعر ينقال لك قبل الشغل", "ضمان مكتوب على التركيب"].map((x) => (
                  <li key={x} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-accent-500 shrink-0" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <LeadForm areas={areas.map((a) => ({ title: a.title }))} services={services.map((s) => ({ title: s.title }))} />
          </div>
        </section>
      )}

      {/* ===== المناطق ===== */}
      {vis.showAreas !== false && areas.length > 0 && (
        <section className="py-14 sm:py-20 section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeading
              eyebrow={t("home.areasEyebrow", "وين نشتغل")}
              title={t("home.areasTitle", "نوصلك بكل محافظات الكويت")}
              subtitle={t("home.areasSubtitle", "عندنا فنيين موزعين على المناطق عشان نوصلك أسرع")}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {areas.map((a) => (
                <Link key={a.id} href={`/areas/${a.slug}`} className="card-hover bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent-500 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-bold text-brand-950">سباك {a.title}</span>
                    {a.responseTime && <span className="block text-xs text-slate-500">نوصل تقريبًا خلال {a.responseTime}</span>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== من المدونة ===== */}
      {vis.showBlog !== false && vis.showArticles !== false && articles.length > 0 && (
        <section className="py-14 sm:py-20 bg-white section-defer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="نصايح" title={t("home.blogTitle", "نصايح سباكة تفيدك")} />
              <Link href="/blog" className="inline-flex items-center gap-1 text-accent-600 font-bold text-sm mb-12 shrink-0">
                الكل <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {articles.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="card-hover group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                  {a.image && (
                    <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                      <img loading="lazy" decoding="async" src={a.image} {...responsive(a.image)} alt={a.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-brand-950 mb-2 line-clamp-2 leading-snug">{a.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">{a.excerpt}</p>
                    <span className="text-accent-600 text-sm font-bold">اقرأ الموضوع ←</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
