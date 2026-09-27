import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/faq";

// أسئلة شائعة بشكل أكورديون (بدون جافاسكربت)
export default function FaqList({ items, title = "أسئلة شائعة" }: { items: Faq[]; title?: string }) {
  return (
    <section className="mb-8" aria-labelledby="faq-title">
      <h2 id="faq-title" className="font-bold text-brand-950 text-xl mb-4">{title}</h2>
      <div className="space-y-2.5">
        {items.map((f, i) => (
          <details key={i} className="group bg-white border border-slate-200 rounded-md open:border-s-4 open:border-s-accent-500">
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
              <span>{f.q}</span>
              <ChevronDown className="w-5 h-5 text-accent-600 shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 -mt-1 text-slate-700 leading-relaxed text-sm sm:text-base">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
