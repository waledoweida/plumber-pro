"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";

type Pub = {
  name: string;
  phone: string;
  tagline?: string;
  texts?: Record<string, string>;
};

export default function Header({ initialData }: { initialData?: Pub }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Pub>(
    initialData || {
      name: "شلال بيروت",
      phone: "94021192",
      texts: {},
    }
  );

  useEffect(() => {
    if (initialData) return;
    fetch("/api/public/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [initialData]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const tx = data.texts || {};
  const t = (k: string, fb: string) => (k in tx ? tx[k] : fb);

  const links = [
    { href: "/", label: t("nav.home", "الرئيسية") },
    { href: "/services", label: t("nav.services", "الخدمات") },
    { href: "/about", label: t("nav.about", "من نحن") },
    { href: "/blog", label: t("nav.blog", "المدونة") },
    { href: "/contact", label: t("nav.contact", "اتصل بنا") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-brand-800 text-accent-400 flex items-center justify-center font-bold text-base sm:text-lg shadow-sm">
            د
          </div>
          <div className="min-w-0">
            <div className="font-bold text-brand-900 leading-tight text-sm sm:text-base truncate max-w-[140px] sm:max-w-none">
              {data.name}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block truncate">
              {t("nav.tagline", data.tagline || "سباك الكويت 24 ساعة")}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 hover:text-brand-700 transition whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${data.phone}`}
            className="hidden sm:inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold px-3 lg:px-4 py-2.5 rounded-xl transition shadow-sm touch-target"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden lg:inline">{data.phone}</span>
            <span className="lg:hidden">{t("nav.call", "اتصل")}</span>
          </a>
          <button
            className="md:hidden p-2.5 rounded-lg hover:bg-slate-100 touch-target"
            onClick={() => setOpen(!open)}
            aria-label={open ? "إغلاق" : "قائمة"}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-14 z-30">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="relative bg-white border-t shadow-xl px-4 py-4 space-y-1 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3.5 px-3 font-medium text-slate-800 rounded-xl hover:bg-slate-50 text-base"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${data.phone}`}
              className="flex items-center justify-center gap-2 bg-brand-700 text-white font-bold py-3.5 rounded-xl mt-3 text-base"
            >
              <Phone className="w-5 h-5" />
              {data.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
