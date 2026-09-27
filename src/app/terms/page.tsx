import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({ title: "الشروط والأحكام", description: `شروط طلب خدمات السباكة من ${site.name}.`, path: "/terms", siteName: site.name, alternate: "/en/terms" });
}

export default async function TermsPage() {
  const site = await getSiteSettings();
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-bold text-brand-950 pt-2">{children}</h2>;
  return (
    <>
      <PageHero title="الشروط والأحكام" crumbs={[{ href: "/", label: "الرئيسية" }]} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 text-slate-700 leading-loose space-y-3">
          <p>لما تستخدم موقع <strong>{site.name}</strong> أو تطلب منا شغل سباكة، معناها إنك موافق على هالشروط.</p>
          <H>السعر</H>
          <p>الفني يفحص المشكلة ويقولك السعر، وما نبدي الشغل إلا بعد موافقتك. إذا طلع شغل زيادة أثناء التصليح نرجع لك قبل لا نسويه.</p>
          <H>الضمان</H>
          <p>نعطيك ضمان مكتوب على الشغل، ومدته تنكتب لك حسب نوع الخدمة والقطع. الضمان ما يشمل الخراب اللي يصير من سوء الاستخدام أو من تعديلات سواها غيرنا.</p>
          <H>المواعيد</H>
          <p>نلتزم بالموعد اللي نتفق عليه قدر الإمكان، وإذا صار تأخير بسبب ظروف مو بإيدنا (زحمة، طوارئ) نتصل ونعلمك.</p>
          <H>التواصل</H>
          <p>{site.phone} — {site.email} — {site.address}</p>
        </div>
      </div>
    </>
  );
}
