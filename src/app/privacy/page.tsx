import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({ title: "سياسة الخصوصية", description: `شلون يتعامل ${site.name} مع بياناتك لما تطلب سباك من الموقع.`, path: "/privacy", siteName: site.name, alternate: "/en/privacy" });
}

export default async function PrivacyPage() {
  const site = await getSiteSettings();
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-bold text-brand-950 pt-2">{children}</h2>;
  return (
    <>
      <PageHero title="سياسة الخصوصية" crumbs={[{ href: "/", label: "الرئيسية" }]} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-700 leading-loose space-y-3">
          <p>خصوصيتك تهمنا في <strong>{site.name}</strong>. هني نشرح شنو البيانات اللي ناخذها لما تطلب سباك من الموقع، وشنو نسوي فيها.</p>
          <H>شنو ناخذ منك؟</H>
          <ul className="list-disc ps-5 space-y-1">
            <li>اسمك ورقم تلفونك عشان نتصل فيك.</li>
            <li>منطقتك ونوع الشغل اللي تحتاجه، وأي وصف تكتبه للمشكلة.</li>
          </ul>
          <H>شنو نسوي فيها؟</H>
          <p>نستخدمها بس عشان نرتب الموعد ونوصلك ونتابع الشغل ويّاك. ما نبيع بياناتك ولا نعطيها لأي جهة ثانية.</p>
          <H>إحصائيات الموقع</H>
          <p>نحسب عدد الزيارات والضغطات على زر الاتصال والواتساب بشكل مجهول عشان نطوّر الموقع. ما نستخدم كوكيز لهالشي، وما نحفظ رقم الـIP ولا أي شي يدل عليك.</p>
          <H>تبي تمسح بياناتك؟</H>
          <p>كلمنا على {site.phone} أو راسلنا على {site.email} ونمسح طلبك من عندنا.</p>
        </div>
      </div>
    </>
  );
}
