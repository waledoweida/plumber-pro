"use client";
import Link from "next/link";
import { Phone, ClipboardList } from "lucide-react";
import { useWaMessage } from "./WaMessage";
import { WaIcon } from "./WhatsAppWidget";
import { waLink, WA_DEFAULT } from "@/lib/whatsapp";
import { usePathname } from "next/navigation";
import { ui } from "@/lib/i18n";
import { isEnPath } from "@/lib/locale-client";
import { EN_WA } from "@/lib/en";

// شريط سفلي للموبايل: اتصال · واتساب · طلب
export default function MobileCallBar({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const en = isEnPath(usePathname() || "/");
  const T = ui(en ? "en" : "ar");
  const msg = useWaMessage(en ? EN_WA.default : WA_DEFAULT);
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-950 border-t-2 border-accent-500 safe-bottom">
      <div className="grid grid-cols-[1.3fr_1.3fr_1fr] text-white text-xs font-bold">
        <a href={`tel:${phone}`} className="flex flex-col items-center justify-center gap-1 py-2.5 bg-accent-500">
          <Phone className="w-5 h-5" /> {T.callNow}
        </a>
        <a href={waLink(whatsapp, msg)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 py-2.5 border-e border-white/10">
          <WaIcon className="w-5 h-5 text-[#25D366]" /> {T.whatsapp}
        </a>
        <Link href={en ? "/en/contact#lead" : "/#lead"} className="flex flex-col items-center justify-center gap-1 py-2.5">
          <ClipboardList className="w-5 h-5 text-accent-300" /> {en ? "Request" : "اطلب"}
        </Link>
      </div>
    </div>
  );
}
