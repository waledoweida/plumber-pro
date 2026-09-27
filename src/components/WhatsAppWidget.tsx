"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, X, Wrench } from "lucide-react";
import { useWaMessage } from "./WaMessage";
import { waLink, WA_DEFAULT } from "@/lib/whatsapp";
import { ui } from "@/lib/i18n";
import { isEnPath } from "@/lib/locale-client";
import { EN_WA } from "@/lib/en";
import { BRAND } from "@/lib/brand";

const KEY = "wa-bubble-closed";
const DELAY_MS = 7000;

export const WaIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WhatsAppWidget({ phone, whatsapp, name }: { phone: string; whatsapp: string; name: string }) {
  const pathname = usePathname() || "/";
  const en = isEnPath(pathname);
  const T = ui(en ? "en" : "ar");
  const msg = useWaMessage(en ? EN_WA.default : WA_DEFAULT);
  const title = en ? BRAND.nameEn : name;
  const href = waLink(whatsapp, msg);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(true);
  const [unread, setUnread] = useState(false);
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/thank-you");

  useEffect(() => {
    if (hidden) return;
    let closed = false;
    try { closed = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (closed) return;
    const t = setTimeout(() => { setOpen(true); setUnread(true); }, DELAY_MS);
    return () => clearTimeout(t);
  }, [hidden]);

  useEffect(() => {
    if (!open) return;
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 1300);
    return () => clearTimeout(t);
  }, [open]);

  const close = () => {
    setOpen(false);
    setUnread(false);
    try { sessionStorage.setItem(KEY, "1"); } catch {}
  };

  if (hidden) return null;

  return (
    <div className="floating-stack fixed z-40 flex flex-col items-start gap-2.5">
      {open && (
        <div
          role="dialog"
          aria-label={T.waDialog(title)}
          className="wa-pop mb-1 w-[min(20rem,calc(100vw-1.5rem))] bg-white rounded-xl shadow-2xl shadow-black/15 border border-slate-100 overflow-hidden"
        >
          <div className="relative hero-dark text-white px-4 py-3.5 flex items-center gap-3">
            <span className="relative w-11 h-11 rounded-xl bg-accent-500 text-brand-950 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
              <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-brand-950" />
            </span>
            <div className="min-w-0">
              <p className="font-bold leading-tight truncate">{title}</p>
              <p className="text-xs text-brand-100">{T.waOnline}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={T.close}
              className="ms-auto w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#efeae2] px-4 py-4 min-h-[6.5rem]">
            {typing ? (
              <div className="inline-flex items-center gap-1 bg-white rounded-2xl rounded-ts-sm px-4 py-3 shadow-sm" aria-label={T.waTyping}>
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            ) : (
              <div className="wa-msg relative bg-white rounded-2xl rounded-ts-sm px-4 py-3 shadow-sm text-sm text-slate-800 leading-relaxed max-w-[90%]">
                <p className="font-bold mb-1">{T.waHello}</p>
                <p>{T.waBody}</p>
                <span className="block text-[10px] text-slate-500 text-left mt-1" dir="ltr">✓✓ {T.waNow}</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-white">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:brightness-105 text-[#131f4f] font-bold py-3 rounded-2xl transition"
            >
              <WaIcon className="w-5 h-5" /> {T.waCta}
            </a>
            <p className="text-[11px] text-slate-500 text-center mt-2">{T.waNote}</p>
          </div>
        </div>
      )}

      <a
        href={`tel:${phone}`}
        className="hidden sm:flex w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-900 border-2 border-white shadow-lift text-white items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label={T.call}
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={close}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white bg-[#25D366] text-white shadow-lift flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label={T.whatsapp}
      >
        <span className="absolute inset-0 rounded-full ripple" aria-hidden />
        <WaIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        {unread && !open && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">1</span>
        )}
      </a>
    </div>
  );
}
