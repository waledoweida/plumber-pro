"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { ui } from "@/lib/i18n";

type Props = {
  // title = القيمة اللي توصل للوحة التحكم، label = اللي يشوفه الزائر (مثلًا بالإنجليزي)
  areas?: { title: string; label?: string }[];
  services?: { title: string; label?: string }[];
  title?: string;
  compact?: boolean;
  lang?: "ar" | "en";
};

export default function LeadForm({ areas = [], services = [], title, compact, lang = "ar" }: Props) {
  const T = ui(lang);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    service: "",
    message: "",
    website: "", // honeypot
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(lang === "en" ? T.fError : data.error || T.fError);
        return;
      }
      router.push(T.thankYou);
    } catch {
      setErr(T.fNetError);
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full border border-slate-300 rounded-md px-3.5 py-3 text-base outline-none bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15 transition";

  return (
    <form
      onSubmit={submit}
      className={`bg-white rounded-2xl border-t-4 border-accent-500 shadow-card ${compact ? "p-4" : "p-5 sm:p-7"} space-y-3`}
    >
      <h2 className="font-bold text-brand-950 text-lg">{title || T.formTitle}</h2>
      <p className="text-xs text-slate-600 -mt-1 pb-1">{T.formSub}</p>

      <input
        className={field}
        placeholder={T.fName}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        autoComplete="name"
      />
      <input
        className={field}
        placeholder={T.fPhone}
        type="tel"
        inputMode="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
        autoComplete="tel"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          className={field}
          value={form.area}
          aria-label={T.fArea}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
        >
          <option value="">{T.fArea}</option>
          {areas.map((a) => (
            <option key={a.title} value={a.title}>
              {a.label || a.title}
            </option>
          ))}
        </select>
        <select
          className={field}
          value={form.service}
          aria-label={T.fService}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          <option value="">{T.fService}</option>
          {services.map((s) => (
            <option key={s.title} value={s.title}>
              {s.label || s.title}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className={field}
        placeholder={T.fMsg}
        rows={compact ? 2 : 3}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {/* honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />
      {err && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 btn-primary text-brand-950 font-bold py-3.5 rounded-xl disabled:opacity-60 min-h-[52px]"
      >
        <Send className="w-4 h-4" />
        {loading ? T.fSending : T.fSend}
      </button>
    </form>
  );
}
