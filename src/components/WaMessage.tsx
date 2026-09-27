"use client";

import { useEffect, useState } from "react";

// كل صفحة تحدد رسالة واتساب الجاهزة المناسبة لها (خدمة / منطقة / مقال)
const EVT = "wa-message";
declare global {
  interface Window { __waMsg?: string }
}

export function SetWaMessage({ message }: { message: string }) {
  useEffect(() => {
    window.__waMsg = message;
    window.dispatchEvent(new Event(EVT));
    return () => {
      if (window.__waMsg === message) {
        window.__waMsg = undefined;
        window.dispatchEvent(new Event(EVT));
      }
    };
  }, [message]);
  return null;
}

export function useWaMessage(fallback: string) {
  const [msg, setMsg] = useState(fallback);
  useEffect(() => {
    const sync = () => setMsg(window.__waMsg || fallback);
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, [fallback]);
  return msg;
}
