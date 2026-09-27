"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// الزيارة تتحسب بس لو الصفحة فضلت ظاهرة 3 ثواني — يستبعد السكربتات والفتحات العابرة
const MIN_VISIBLE_MS = 3000;

function send(type: string, path: string) {
  const q = new URLSearchParams(location.search);
  const utm = q.get("gclid")
    ? "google-ads"
    : [q.get("utm_source"), q.get("utm_campaign")].filter(Boolean).join("/");
  const body = JSON.stringify({ type, path, ref: document.referrer, utm });
  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "text/plain" }))) return;
  } catch {}
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
}

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || navigator.webdriver) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visibleFor = 0;
    let since = 0;
    const done = { v: false };

    const start = () => {
      if (done.v || document.visibilityState !== "visible") return;
      since = Date.now();
      timer = setTimeout(() => {
        done.v = true;
        send("view", pathname);
      }, MIN_VISIBLE_MS - visibleFor);
    };
    const pause = () => {
      if (timer) clearTimeout(timer);
      if (since) visibleFor += Date.now() - since;
      since = 0;
    };
    const onVis = () => (document.visibilityState === "visible" ? start() : pause());

    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navigator.webdriver || location.pathname.startsWith("/admin")) return;
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href") || "";
      if (href.startsWith("tel:")) send("phone", location.pathname);
      else if (/wa\.me|whatsapp\.com/i.test(href)) send("whatsapp", location.pathname);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
