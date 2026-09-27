import Link from "next/link";

// رأس الصفحات الداخلية: كحلي بخطوط مخطط وقص مائل من تحت
export default function PageHero({
  title,
  subtitle,
  crumbs = [],
  children,
  navLabel = "مسار التصفح",
}: {
  title: string;
  subtitle?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
  navLabel?: string;
}) {
  return (
    <section className="relative hero-dark clip-slant text-white overflow-hidden">
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-24">
        {crumbs.length > 0 && (
          <nav aria-label={navLabel} className="text-xs text-brand-200 mb-5 flex flex-wrap items-center gap-1.5">
            {crumbs.map((c) => (
              <span key={c.href} className="inline-flex items-center gap-1.5">
                <Link href={c.href} className="hover:text-white">{c.label}</Link>
                <span aria-hidden className="text-accent-400">›</span>
              </span>
            ))}
            <span className="text-white/90">{title}</span>
          </nav>
        )}
        <div className="border-s-4 border-accent-500 ps-4 sm:ps-5 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="text-brand-100 text-sm sm:text-lg mt-3 leading-relaxed">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
