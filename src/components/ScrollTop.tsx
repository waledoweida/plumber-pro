"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { isEnPath } from "@/lib/locale-client";

export default function ScrollTop() {
  const [show, setShow] = useState(false);
  const en = isEnPath(usePathname() || "/");
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed z-40 bottom-[7.5rem] sm:bottom-6 right-3 sm:right-5 w-11 h-11 rounded-md bg-brand-900 text-white shadow-lift flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      aria-label={en ? "Back to top" : "العودة للأعلى"}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
