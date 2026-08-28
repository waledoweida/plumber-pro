"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

type Props = {
  areas?: { title: string }[];
  services?: { title: string }[];
  title?: string;
  compact?: boolean;
};

export default function LeadForm({ areas = [], services = [], title = "اطلب خدمة الآن", compact }: Props) {
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
        setErr(data.error || "حدث خطأ");
        return;
      }
      router.push("/thank-you");
    } catch {
      setErr("تعذر الإرسال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-base outline-none focus:border-brand-500 bg-white";

  return (
    <form
      onSubmit={submit}
      className={`bg-white rounded-2xl border border-slate-200 shadow-lg ${compact ? "p-4" : "p-5 sm:p-6"} space-y-3`}
    >
      <h3 className="font-bold text-brand-900 text-lg">{title}</h3>
      <p className="text-xs text-slate-500 -mt-1">نرد عليك في أقرب وقت — أو اتصل مباشرة</p>

      <input
        className={field}
        placeholder="الاسم *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        autoComplete="name"
      />
      <input
        className={field}
        placeholder="رقم الهاتف *"
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
          onChange={(e) => setForm({ ...form, area: e.target.value })}
        >
          <option value="">المنطقة</option>
          {areas.map((a) => (
            <option key={a.title} value={a.title}>
              {a.title}
            </option>
          ))}
        </select>
        <select
          className={field}
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          <option value="">نوع الخدمة</option>
          {services.map((s) => (
            <option key={s.title} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className={field}
        placeholder="وصف المشكلة (اختياري)"
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
        className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl disabled:opacity-60 min-h-[48px]"
      >
        <Send className="w-4 h-4" />
        {loading ? "جاري الإرسال..." : "أرسل الطلب"}
      </button>
    </form>
  );
}
