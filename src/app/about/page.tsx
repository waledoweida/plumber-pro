import type { Metadata } from "next";
import { pageMeta, seoDescription } from "@/lib/seo";
import { getSiteSettings, getWhyPoints, getTexts, getAreas } from "@/lib/content";
import { Phone, ClipboardCheck, ShieldCheck, Sparkles, Clock3, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    title: "من نحن",
    description: seoDescription("", `${site.name}: سباكين معتمدين بالكويت، شغلنا تسليك وكشف تهريب وسخانات وماطورات وتأسيس حمامات، بضمان مكتوب وخدمة 24 ساعة`),
    path: "/about",
    siteName: site.name,
    alternate: "/en/about",
  });
}

const VALUES = [
  { icon: ClipboardCheck, title: "نشخّص قبل لا نصلّح", text: "ما نبدّل قطعة ولا نكسر بلاطة إلا بعد ما نعرف السبب الحقيقي للمشكلة." },
  { icon: ShieldCheck, title: "السعر قبل الشغل", text: "تعرف كم بتدفع قبل لا نبدي، والفاتورة ما يطلع فيها شي ما اتفقنا عليه." },
  { icon: Sparkles, title: "نخلّي المكان نظيف", text: "نفرش قبل الشغل ونشيل المخلفات بعده، وتستلم حمامك أو مطبخك مرتب." },
  { icon: Clock3, title: "نلتزم بالموعد", text: "إذا قلنا ساعة معينة نكون عندك فيها، وإذا صار أي تأخير نتصل ونعلمك." },
];

export default async function AboutPage() {
  const [site, why, texts, areas] = await Promise.all([getSiteSettings(), getWhyPoints(), getTexts(), getAreas()]);
  const t = (k: string, fb: string) => (k in texts ? texts[k] : fb);

  return (
    <>
      <PageHero
        title={t("page.aboutTitle", "من نحن")}
        subtitle={t("page.aboutBody", "نشتغل ليل ونهار بكل مناطق الكويت، وفنيينا معتمدين وشغلنا عليه ضمان.")}
        crumbs={[{ href: "/", label: "الرئيسية" }]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mb-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <span className="eyebrow">قصتنا</span>
            <h2 className="text-2xl font-bold text-brand-950 mt-2 mb-4">{site.name} — {site.tagline}</h2>
            <p className="text-slate-700 leading-loose mb-4">{site.description}</p>
            <p className="text-slate-700 leading-loose">
              شغلنا سباكة وبس: من البلاعة المسدودة والتهريب المخفي لين تأسيس حمام كامل وتركيب السخانات والماطورات.
              عشان جذي فنيينا يعرفون شبكات البيوت الكويتية زين، سواء بيت قديم أو شقة بعمارة أو فيلا جديدة.
            </p>
          </div>
          <div className="hero-dark text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 dot-grid pointer-events-none" />
            <h2 className="relative font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-accent-400" /> وين نشتغل</h2>
            <ul className="relative grid grid-cols-2 gap-2 text-sm mb-6">
              {areas.map((a) => (
                <li key={a.id} className="bg-white/10 px-3 py-2">{a.title}</li>
              ))}
            </ul>
            <a href={`tel:${site.phone}`} className="relative inline-flex items-center justify-center gap-2 btn-primary text-brand-950 font-bold px-6 py-3 rounded-xl w-full">
              <Phone className="w-4 h-4" /> <span dir="ltr">{site.phone}</span>
            </a>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-brand-950 mb-6">شلون نشتغل</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white border border-slate-200 border-t-4 border-t-accent-500 rounded-2xl p-5">
              <v.icon className="w-7 h-7 text-brand-800 mb-3" />
              <h3 className="font-bold text-brand-950 mb-1.5">{v.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        {why.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-brand-950 mb-6">ليش تختارنا</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {why.map((w, i) => (
                <li key={w.id} className="flex gap-3 items-center bg-white border border-slate-200 rounded-2xl p-4">
                  <span className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 text-sm font-bold flex items-center justify-center shrink-0" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-semibold text-brand-950">{w.text}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
