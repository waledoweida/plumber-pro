import { jsonLd } from "@/lib/seo";

// بيانات منظّمة (schema.org) — بتساعد جوجل يفهم الصفحة ويعرض نتائج غنية
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
