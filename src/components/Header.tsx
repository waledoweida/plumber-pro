"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Clock, Languages, MessageCircle, Wrench } from "lucide-react";
import { ui } from "@/lib/i18n";
import { isEnPath, altPath } from "@/lib/locale-client";
import { BRAND } from "@/lib/brand";
import { waLink } from "@/lib/whatsapp";

type Props = {
  initialData: {
    name: string;
    logoUrl: string;
    phone: string;
    whatsapp?: string;
    tagline: string;
    texts: Record<string, string>;
  };
};

export default function Header({ initialData }: Props) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const pathname = usePathname() || "/";
  const en = isEnPath(pathname);
  const T = ui(en ? "en" : "ar");
  const home = en ? "/en" : "/";
  const isActive = (href: string) => (href === home ? pathname === home : pathname.startsWith(href));
  const name = en ? BRAND.nameEn : data.name;

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => r.json())
      .then((j) => {
        if (j?.name) setData((d) => ({ ...d, ...j }));
      })
      .catch(() => {});
  }, []);

  // القائمة مفتوحة: نوقف سكرول الصفحة ونسكّرها بزر Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const Logo = (
    <Link href={home} className="flex items-center gap-2.5 shrink-0">
      {data.logoUrl ? (
        <img src={data.logoUrl} alt={name} className="h-9 sm:h-11 w-auto object-contain" />
      ) : (
        <>
          <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl icon-tile-solid text-white flex items-center justify-center relative">
            <Wrench className="w-5 h-5" />
            <span className="absolute -bottom-1 -end-1 w-3.5 h-3.5 rounded-full bg-accent-400 ring-2 ring-white" />
          </span>
          <span className="leading-tight">
            <span className="block font-bold text-brand-950 text-base sm:text-lg">{name}</span>
            <span className="block text-[11px] text-accent-600 font-semibold">{T.tagline}</span>
          </span>
        </>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50">
      {/* شريط علوي */}
      <div className="hidden md:block bg-brand-950 text-brand-100 text-xs">
        <div className="max-w-6xl mx-auto px-6 h-9 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent-400" /> {en ? "Open 24 hours · every day" : "مفتوحين 24 ساعة · كل أيام الأسبوع"}
          </span>
          <div className="flex items-center gap-5">
            <a href={`tel:${data.phone}`} className="inline-flex items-center gap-1.5 hover:text-white" dir="ltr">
              <Phone className="w-3.5 h-3.5 text-accent-400" /> {data.phone}
            </a>
            <Link href={altPath(pathname)} hrefLang={en ? "ar" : "en"} aria-label={T.switchAria} className="inline-flex items-center gap-1 font-semibold hover:text-white">
              <Languages className="w-3.5 h-3.5" /> {T.switchLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_8px_30px_rgba(19,31,79,0.06)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-[4.5rem] flex items-center justify-between gap-3">
          {Logo}

          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {T.nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`relative px-3.5 py-2 text-sm font-semibold transition ${
                  isActive(n.href)
                    ? "text-brand-900 after:absolute after:inset-x-3 after:-bottom-[1.05rem] after:h-[3px] after:rounded-full after:bg-accent-500"
                    : "text-slate-600 hover:text-brand-900"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={en ? "/en/contact#lead" : "/#lead"}
              className="hidden md:inline-flex items-center gap-1.5 btn-primary text-brand-950 text-sm font-bold px-5 py-2.5 rounded-xl"
            >
              {T.book}
            </Link>
            <a href={`tel:${data.phone}`} className="md:hidden p-2.5 bg-accent-500 text-brand-950 rounded-xl" aria-label={T.call}>
              <Phone className="w-5 h-5" />
            </a>
            <button type="button" onClick={() => setOpen(true)} className="md:hidden p-2.5 border border-slate-200 rounded-xl" aria-label={T.menu}>
              <Menu className="w-5 h-5 text-brand-900" />
            </button>
          </div>
        </div>
      </div>

      {/* القائمة تنرسم على body مباشرة عشان fixed ما يتقيد بالهيدر */}
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[70] md:hidden" dir={en ? "ltr" : "rtl"} role="dialog" aria-modal="true" aria-label={T.menu}>
          <div className="absolute inset-0 bg-brand-950/70" onClick={() => setOpen(false)} />
          <div className={`absolute top-0 ${en ? "right-0" : "left-0"} h-[100dvh] w-[84%] max-w-xs bg-white shadow-2xl flex flex-col overflow-y-auto`}>
            <div className="flex justify-between items-center p-4 bg-brand-950 text-white">
              <span className="font-bold">{name}</span>
              <button type="button" onClick={() => setOpen(false)} className="p-2" aria-label={T.close}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-3">
              {T.nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={`px-3 py-3.5 text-base font-semibold border-b border-slate-100 ${isActive(n.href) ? "text-accent-600" : "text-slate-800"}`}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href={altPath(pathname)}
                hrefLang={en ? "ar" : "en"}
                onClick={() => setOpen(false)}
                className="px-3 py-3.5 inline-flex items-center gap-2 text-base font-semibold text-slate-800"
              >
                <Languages className="w-4 h-4" /> {T.switchLabel}
              </Link>
            </nav>
            <div className="mt-auto p-4 space-y-2 bg-slate-50">
              <a href={`tel:${data.phone}`} className="flex items-center justify-center gap-2 btn-primary text-brand-950 font-bold py-3.5 rounded-xl">
                <Phone className="w-4 h-4" /> {T.call} {data.phone}
              </a>
              <a
                href={waLink(data.whatsapp || data.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-[#131f4f] font-bold py-3.5 rounded-xl"
              >
                <MessageCircle className="w-4 h-4" /> {T.whatsapp}
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
