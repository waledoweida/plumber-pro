"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users, Eye, Phone, MessageCircle, Inbox, Target, Download, TrendingUp, TrendingDown, Calendar,
} from "lucide-react";

/* ---------- types ---------- */
type KV = { k: string; v: number };
type Totals = { views: number; visitors: number; whatsapp: number; phone: number; leads: number; contacters: number; contacts: number };
type Point = { b: string; visitors: number; views: number; whatsapp: number; phone: number; leads: number; contacts: number };
type Data = {
  range: { from: string; to: string; days: number; unit: "day" | "week" | "month"; all: boolean };
  totals: Totals;
  prev: Totals | null;
  engagement: { avgPages: number; singlePageRate: number };
  timeline: Point[];
  pages: { path: string; visitors: number; views: number; whatsapp: number; phone: number }[];
  entry: KV[];
  sources: { k: string; visitors: number; contacters: number }[];
  devices: KV[];
  os: KV[];
  countries: KV[];
  cities: KV[];
  hours: { h: number; views: number; contacts: number }[];
  weekdays: { d: number; views: number; contacts: number }[];
  leadsByService: KV[];
  leadsByArea: KV[];
};

/* ---------- helpers ---------- */
// ألوان السلسلتين (متحقق منها لعمى الألوان): زوار = أخضر الهوية، تواصل = بنفسجي
const C_VISITORS = "#16a34a";
const C_CONTACTS = "#4a3aa7";

const KW = 3 * 36e5;
const kwToday = () => new Date(Date.now() + KW).toISOString().slice(0, 10);
const addDays = (day: string, d: number) => {
  const x = new Date(`${day}T00:00:00Z`);
  x.setUTCDate(x.getUTCDate() + d);
  return x.toISOString().slice(0, 10);
};
const nf = new Intl.NumberFormat("ar-KW");
const num = (v: number) => nf.format(v);
const pct = (v: number) => `${nf.format(Math.round(v * 1000) / 10)}٪`;
const fmtDate = (day: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("ar-KW", opts);
const bucketLabel = (b: string, unit: string) =>
  unit === "month"
    ? fmtDate(b, { month: "long", year: "numeric" })
    : unit === "week"
      ? `أسبوع ${fmtDate(b)}`
      : fmtDate(b, { weekday: "short", day: "numeric", month: "short" });

const pageName = (p: string) => {
  let d = p;
  try { d = decodeURIComponent(p); } catch {}
  if (d === "/") return "الرئيسية";
  const map: Record<string, string> = { "/services": "كل الخدمات", "/blog": "المدونة", "/contact": "اتصل بنا", "/about": "من نحن" };
  if (map[d]) return map[d];
  const [, sec, slug] = d.split("/");
  const tag = sec === "services" ? "خدمة" : sec === "blog" ? "مقال" : sec === "areas" ? "منطقة" : "";
  return tag && slug ? `${tag}: ${slug.replace(/-/g, " ")}` : d;
};

const OS: Record<string, string> = { ios: "آيفون / آيباد", android: "أندرويد", windows: "ويندوز", mac: "ماك", linux: "لينكس", other: "أخرى" };
const DOW = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const regionNames = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["ar"], { type: "region" }) : null;
const countryName = (c: string) => {
  if (!c) return "غير معروف";
  try { return regionNames?.of(c) || c; } catch { return c; }
};

const PRESETS = [
  { id: "today", l: "اليوم" },
  { id: "yesterday", l: "أمس" },
  { id: "7", l: "7 أيام" },
  { id: "30", l: "30 يوم" },
  { id: "90", l: "90 يوم" },
  { id: "all", l: "كل الأوقات" },
  { id: "custom", l: "فترة مخصصة" },
] as const;
type Preset = (typeof PRESETS)[number]["id"];

function queryFor(p: Preset, from: string, to: string) {
  const t = kwToday();
  switch (p) {
    case "today": return `from=${t}&to=${t}`;
    case "yesterday": { const y = addDays(t, -1); return `from=${y}&to=${y}`; }
    case "7": case "30": case "90": return `from=${addDays(t, -(Number(p) - 1))}&to=${t}`;
    case "all": return "all=1";
    default: return `from=${from}&to=${to}`;
  }
}

/* ---------- small pieces ---------- */
function Delta({ cur, prev, invert = false }: { cur: number; prev?: number; invert?: boolean }) {
  if (prev === undefined) return null;
  if (prev === 0) return cur > 0 ? <span className="text-[11px] text-slate-500">جديد</span> : null;
  const d = (cur - prev) / prev;
  if (Math.abs(d) < 0.005) return <span className="text-[11px] text-slate-500">بدون تغيير</span>;
  const good = invert ? d < 0 : d > 0;
  const Icon = d > 0 ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${good ? "text-green-700" : "text-red-600"}`}>
      <Icon className="w-3 h-3" />
      {pct(Math.abs(d))}
    </span>
  );
}

function Card({ title, sub, children, className = "" }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border p-4 ${className}`}>
      <h3 className="font-bold text-sm text-slate-800">{title}</h3>
      {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Bars({ rows, fmt = (k: string) => k, total }: { rows: KV[]; fmt?: (k: string) => string; total?: number }) {
  if (!rows.length) return <p className="text-xs text-slate-400">لا بيانات في الفترة دي</p>;
  const max = Math.max(1, ...rows.map((r) => r.v));
  const sum = total ?? rows.reduce((a, r) => a + r.v, 0);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.k} className="text-sm">
          <div className="flex justify-between gap-2 mb-1">
            <span className="truncate text-slate-700" dir="auto" title={fmt(r.k)}>{fmt(r.k)}</span>
            <span className="shrink-0 tabular-nums text-slate-900 font-semibold">
              {num(r.v)} <span className="text-slate-400 font-normal text-xs">({pct(sum ? r.v / sum : 0)})</span>
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full" style={{ width: `${(r.v / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- trend chart (SVG, one axis, two series, crosshair tooltip) ---------- */
function Trend({ points, unit }: { points: Point[]; unit: string }) {
  const [hi, setHi] = useState<number | null>(null);
  const W = 720, H = 220, PL = 8, PR = 36, PT = 10, PB = 24;
  const max = Math.max(4, ...points.map((p) => Math.max(p.visitors, p.contacts)));
  const step = Math.pow(10, Math.floor(Math.log10(max / 4)));
  const tick = [1, 2, 5, 10].map((m) => m * step).find((s) => max / s <= 5) || step * 10;
  const top = Math.ceil(max / tick) * tick;
  const ticks = Array.from({ length: Math.round(top / tick) + 1 }, (_, i) => i * tick);
  const x = (i: number) => PL + (points.length === 1 ? (W - PL - PR) / 2 : (i * (W - PL - PR)) / (points.length - 1));
  const y = (v: number) => PT + (1 - v / top) * (H - PT - PB);
  const path = (k: "visitors" | "contacts") =>
    points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
  const p = hi !== null ? points[hi] : null;
  const labelIdx = points.length <= 1 ? [0] : [0, Math.floor((points.length - 1) / 2), points.length - 1];

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - PL) / (W - PL - PR)) * (points.length - 1));
    setHi(Math.min(points.length - 1, Math.max(0, i)));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-2 min-h-[1.25rem]">
        <span className="inline-flex items-center gap-1.5 text-slate-700">
          <span className="w-3 h-0.5 rounded" style={{ background: C_VISITORS }} /> زوار
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-700">
          <span className="w-3 h-0.5 rounded" style={{ background: C_CONTACTS }} /> تواصل (واتساب + اتصال + نموذج)
        </span>
        <span className="ms-auto text-slate-600 tabular-nums">
          {p
            ? `${bucketLabel(p.b, unit)} — ${num(p.visitors)} زائر · ${num(p.whatsapp)} واتساب · ${num(p.phone)} اتصال · ${num(p.leads)} نموذج`
            : "مرّر على الرسم لعرض التفاصيل"}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto touch-none select-none"
        style={{ direction: "ltr" }}
        role="img"
        aria-label="الزوار والتواصل عبر الوقت"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHi(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={W - PR + 6} y={y(t) + 4} fontSize={11} fill="#64748b">{num(t)}</text>
          </g>
        ))}
        {labelIdx.map((i) => (
          <text key={i} x={x(i)} y={H - 6} fontSize={11} fill="#64748b" textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}>
            {unit === "month" ? fmtDate(points[i].b, { month: "short", year: "2-digit" }) : fmtDate(points[i].b)}
          </text>
        ))}
        {p && <line x1={x(hi!)} x2={x(hi!)} y1={PT} y2={H - PB} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />}
        <path d={path("visitors")} fill="none" stroke={C_VISITORS} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={path("contacts")} fill="none" stroke={C_CONTACTS} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {(points.length <= 1 || p) &&
          (p ? [hi!] : [0]).map((i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(points[i].visitors)} r={4} fill={C_VISITORS} stroke="#fff" strokeWidth={2} />
              <circle cx={x(i)} cy={y(points[i].contacts)} r={4} fill={C_CONTACTS} stroke="#fff" strokeWidth={2} />
            </g>
          ))}
      </svg>
    </div>
  );
}

/* ---------- column chart for hours / weekdays ---------- */
function Columns({ items, labels, every = 1 }: { items: { key: number; v: number }[]; labels: (k: number) => string; every?: number }) {
  const [hi, setHi] = useState<number | null>(null);
  const max = Math.max(1, ...items.map((i) => i.v));
  const best = items.reduce((a, b) => (b.v > a.v ? b : a), items[0]);
  const cur = hi !== null ? items[hi] : null;
  return (
    <div>
      <p className="text-xs text-slate-600 mb-2 min-h-[1rem] tabular-nums">
        {cur ? `${labels(cur.key)}: ${num(cur.v)}` : best?.v ? `الأعلى: ${labels(best.key)} (${num(best.v)})` : "لا بيانات"}
      </p>
      <div className="flex items-end gap-[2px] h-28" onPointerLeave={() => setHi(null)}>
        {items.map((it, i) => (
          <div key={it.key} className="flex-1 h-full flex items-end" onPointerEnter={() => setHi(i)} onPointerDown={() => setHi(i)}>
            <div
              className={`w-full rounded-t ${hi === i ? "bg-brand-800" : "bg-brand-600"}`}
              style={{ height: `${Math.max((it.v / max) * 100, it.v ? 3 : 0)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-[2px] mt-1">
        {items.map((it, i) => (
          <span key={it.key} className="flex-1 text-center text-[10px] text-slate-500 truncate">
            {i % every === 0 ? labels(it.key) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- main ---------- */
export default function Stats() {
  const [preset, setPreset] = useState<Preset>("7");
  const [from, setFrom] = useState(addDays(kwToday(), -29));
  const [to, setTo] = useState(kwToday());
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [timeMetric, setTimeMetric] = useState<"contacts" | "views">("contacts");

  const query = useMemo(() => queryFor(preset, from, to), [preset, from, to]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    fetch(`/api/admin/stats?${query}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setData(d))
      .catch(() => alive && setErr("تعذّر تحميل الإحصائيات"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [query]);

  const t = data?.totals;
  const pv = data?.prev ?? undefined;
  const conv = t && t.visitors ? t.contacters / t.visitors : 0;
  const prevConv = pv && pv.visitors ? pv.contacters / pv.visitors : pv ? 0 : undefined;

  const exportCsv = () => {
    if (!data) return;
    const rows: (string | number)[][] = [
      ["الفترة", data.range.from, data.range.to],
      [],
      ["التاريخ", "زوار", "مشاهدات", "واتساب", "اتصال", "نموذج", "إجمالي التواصل"],
      ...data.timeline.map((p) => [p.b, p.visitors, p.views, p.whatsapp, p.phone, p.leads, p.contacts]),
      [],
      ["الصفحة", "زوار", "مشاهدات", "واتساب", "اتصال"],
      ...data.pages.map((p) => [pageName(p.path), p.visitors, p.views, p.whatsapp, p.phone]),
      [],
      ["المصدر", "زوار", "زوار تواصلوا"],
      ...data.sources.map((s) => [s.k, s.visitors, s.contacters]),
    ];
    const csv = "﻿" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `stats-${data.range.from}_${data.range.to}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const tiles = t && [
    { n: num(t.visitors), cur: t.visitors, prev: pv?.visitors, l: "زائر حقيقي", icon: Users },
    { n: num(t.views), cur: t.views, prev: pv?.views, l: "مشاهدة صفحة", icon: Eye },
    { n: num(t.whatsapp), cur: t.whatsapp, prev: pv?.whatsapp, l: "ضغطة واتساب", icon: MessageCircle },
    { n: num(t.phone), cur: t.phone, prev: pv?.phone, l: "ضغطة اتصال", icon: Phone },
    { n: num(t.leads), cur: t.leads, prev: pv?.leads, l: "طلب من النموذج", icon: Inbox },
    { n: pct(conv), cur: conv, prev: prevConv, l: "نسبة التحويل", icon: Target },
  ];

  const contactMix: KV[] = t
    ? [
        { k: "واتساب", v: t.whatsapp },
        { k: "اتصال", v: t.phone },
        { k: "نموذج الحجز", v: t.leads },
      ].filter((r) => r.v > 0)
    : [];

  return (
    <div className="space-y-4">
      {/* header + range picker */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-bold text-slate-800">الإحصائيات</h2>
          {data && (
            <p className="text-xs text-slate-500 mt-0.5">
              {data.range.from === data.range.to
                ? fmtDate(data.range.from, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                : `${fmtDate(data.range.from, { day: "numeric", month: "long", year: "numeric" })} — ${fmtDate(data.range.to, { day: "numeric", month: "long", year: "numeric" })}`}
              {data.prev && " · مقارنة بالفترة السابقة بنفس الطول"}
              {loading && " · جاري التحديث…"}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!data}
          className="inline-flex items-center gap-1.5 border bg-white text-slate-700 text-sm px-3 py-2 rounded-xl disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> تنزيل Excel
        </button>
      </div>

      <div className="flex flex-wrap gap-1 bg-white border rounded-xl p-1 text-sm w-fit max-w-full">
        {PRESETS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setPreset(r.id)}
            className={`px-3 py-1.5 rounded-lg inline-flex items-center gap-1 ${preset === r.id ? "bg-brand-700 text-white font-bold" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {r.id === "custom" && <Calendar className="w-3.5 h-3.5" />}
            {r.l}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex flex-wrap items-end gap-3 bg-white border rounded-xl p-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">من</span>
            <input type="date" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className="border rounded-lg px-2 py-1.5" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">إلى</span>
            <input type="date" value={to} min={from} max={kwToday()} onChange={(e) => e.target.value && setTo(e.target.value)} className="border rounded-lg px-2 py-1.5" />
          </label>
        </div>
      )}

      {err && <p className="text-sm text-red-600">{err}</p>}

      {/* KPI tiles */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
        {(tiles || Array.from({ length: 6 }, () => null)).map((x, i) => (
          <div key={i} className="bg-white rounded-2xl border p-4">
            {x ? (
              <>
                <div className="flex items-center justify-between">
                  <x.icon className="w-4 h-4 text-slate-400" />
                  <Delta cur={x.cur} prev={x.prev} />
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums mt-2">{x.n}</div>
                <div className="text-xs text-slate-500">{x.l}</div>
              </>
            ) : (
              <div className="h-[72px] animate-pulse bg-slate-50 rounded-lg" />
            )}
          </div>
        ))}
      </div>

      {data && (
        <div className={`space-y-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
          <Card
            title="الزوار والتواصل عبر الوقت"
            sub={
              (data.range.unit === "day" ? "يوميًا" : data.range.unit === "week" ? "أسبوعيًا" : "شهريًا") +
              (data.range.to === kwToday() && data.timeline.length > 1 ? " · آخر نقطة لسه ما اكتملتش (الفترة الحالية)" : "")
            }
          >
            <Trend points={data.timeline} unit={data.range.unit} />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Card title="طرق التواصل" sub="العملاء بيتواصلوا إزاي">
              <Bars rows={contactMix} />
            </Card>
            <Card title="تفاعل الزوار">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">صفحات لكل زائر</dt>
                  <dd className="text-xl font-bold tabular-nums">{nf.format(Math.round(data.engagement.avgPages * 10) / 10)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">زاروا صفحة واحدة بس</dt>
                  <dd className="text-xl font-bold tabular-nums">{pct(data.engagement.singlePageRate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">زوار تواصلوا</dt>
                  <dd className="text-xl font-bold tabular-nums">{num(data.totals.contacters)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">إجمالي التواصل</dt>
                  <dd className="text-xl font-bold tabular-nums">{num(data.totals.contacts)}</dd>
                </div>
              </dl>
            </Card>
            <Card title="نوع الجهاز">
              <Bars rows={data.devices} fmt={(k) => (k === "mobile" ? "موبايل" : "كمبيوتر")} />
              <div className="mt-4 pt-3 border-t">
                <Bars rows={data.os} fmt={(k) => OS[k] || k} />
              </div>
            </Card>
          </div>

          <Card title="أداء الصفحات" sub="أي صفحة بتجيب زوار، وأي صفحة بتجيب عملاء">
            {data.pages.length === 0 ? (
              <p className="text-xs text-slate-400">لا بيانات في الفترة دي</p>
            ) : (
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b">
                      <th className="text-right font-medium py-2">الصفحة</th>
                      <th className="font-medium py-2 px-2">زوار</th>
                      <th className="font-medium py-2 px-2">مشاهدات</th>
                      <th className="font-medium py-2 px-2">واتساب</th>
                      <th className="font-medium py-2 px-2">اتصال</th>
                      <th className="font-medium py-2 px-2">تحويل</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {data.pages.map((p) => {
                      const c = p.whatsapp + p.phone;
                      return (
                        <tr key={p.path} className="border-b last:border-0">
                          <td className="py-2 max-w-[260px] truncate text-slate-800" dir="auto" title={pageName(p.path)}>
                            <a href={p.path} target="_blank" rel="noopener noreferrer" className="hover:underline">{pageName(p.path)}</a>
                          </td>
                          <td className="text-center px-2">{num(p.visitors)}</td>
                          <td className="text-center px-2 text-slate-500">{num(p.views)}</td>
                          <td className="text-center px-2">{num(p.whatsapp)}</td>
                          <td className="text-center px-2">{num(p.phone)}</td>
                          <td className={`text-center px-2 font-semibold ${c ? "text-brand-700" : "text-slate-400"}`}>
                            {p.visitors ? pct(Math.min(1, c / p.visitors)) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card title="مصادر الزيارات" sub="الزائر جه منين، وكام واحد منهم تواصل">
              {data.sources.length === 0 ? (
                <p className="text-xs text-slate-400">لا بيانات في الفترة دي</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b">
                      <th className="text-right font-medium py-2">المصدر</th>
                      <th className="font-medium py-2">زوار</th>
                      <th className="font-medium py-2">تواصلوا</th>
                      <th className="font-medium py-2">تحويل</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {data.sources.map((s) => (
                      <tr key={s.k} className="border-b last:border-0">
                        <td className="py-2 truncate max-w-[160px]" dir="auto">{s.k}</td>
                        <td className="text-center">{num(s.visitors)}</td>
                        <td className="text-center">{num(s.contacters)}</td>
                        <td className="text-center text-slate-600">{pct(s.visitors ? s.contacters / s.visitors : 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
            <Card title="صفحات الدخول" sub="أول صفحة الزائر بيفتحها (غالبًا من جوجل)">
              <Bars rows={data.entry} fmt={pageName} />
            </Card>
          </div>

          <Card title="أفضل الأوقات" sub="بتوقيت الكويت — استعملها لتحديد أوقات تواجد الفنيين والرد السريع">
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1 text-xs w-fit mb-3">
              {(["contacts", "views"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTimeMetric(m)}
                  className={`px-3 py-1 rounded-md ${timeMetric === m ? "bg-white shadow-sm font-bold text-slate-900" : "text-slate-600"}`}
                >
                  {m === "contacts" ? "التواصل" : "الزيارات"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="ltr">
              <div className="lg:col-span-2" dir="rtl">
                <p className="text-xs font-semibold text-slate-600 mb-1">حسب الساعة</p>
                <div dir="ltr">
                  <Columns
                    items={data.hours.map((h) => ({ key: h.h, v: h[timeMetric] }))}
                    labels={(h) => `${h % 12 || 12}${h < 12 ? "ص" : "م"}`}
                    every={3}
                  />
                </div>
              </div>
              <div dir="rtl">
                <p className="text-xs font-semibold text-slate-600 mb-1">حسب اليوم</p>
                <Columns items={data.weekdays.map((d) => ({ key: d.d, v: d[timeMetric] }))} labels={(d) => DOW[d]} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card title="المدن" sub="حسب موقع الزائر">
              <Bars rows={data.cities} />
            </Card>
            <Card title="الدول">
              <Bars rows={data.countries} fmt={countryName} />
            </Card>
            <Card title="طلبات النموذج حسب الخدمة">
              <Bars rows={data.leadsByService} />
            </Card>
            <Card title="طلبات النموذج حسب المنطقة">
              <Bars rows={data.leadsByArea} />
            </Card>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 leading-relaxed">
        الأرقام حقيقية: محركات البحث والبرامج الآلية مستبعدة، وزياراتك وإنت داخل لوحة التحكم ما بتتحسبش، والزيارة ما
        تتحسبش إلا لو الصفحة فضلت مفتوحة 3 ثواني على الأقل. تحديث نفس الصفحة خلال نص ساعة = زيارة واحدة. الزائر يتحسب
        مرة واحدة في اليوم (بدون كوكيز). نسبة التحويل = الزوار اللي ضغطوا واتساب أو اتصال ÷ كل الزوار.
      </p>
    </div>
  );
}
