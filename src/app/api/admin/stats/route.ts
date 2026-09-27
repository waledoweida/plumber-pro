import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { kuwaitDay } from "@/lib/analytics";

// كل التجميع بيتم في Postgres علشان "كل الأوقات" تفضل سريعة مهما كبرت البيانات.
// الأيام والساعات محسوبة بتوقيت الكويت (UTC+3).

const DAY = 864e5;
const KW = 3 * 36e5;
const LOCAL = Prisma.sql`("createdAt" + interval '3 hours')`;

const isDay = (s: string | null) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
const kwMidnight = (day: string) => new Date(new Date(`${day}T00:00:00Z`).getTime() - KW);
const n = (v: unknown) => Number(v) || 0;

function sourceOf(referrer: string, utm: string): string {
  if (utm === "google-ads") return "إعلانات جوجل";
  if (utm) return `حملة: ${utm}`;
  const r = referrer.toLowerCase();
  if (!r) return "مباشر";
  if (/(^|\.)google\./.test(r)) return "بحث جوجل";
  if (/bing\.|duckduckgo|yahoo\.|yandex/.test(r)) return "محركات بحث أخرى";
  if (/facebook|fb\.|messenger/.test(r)) return "فيسبوك";
  if (/instagram/.test(r)) return "إنستجرام";
  if (/tiktok/.test(r)) return "تيك توك";
  if (/snapchat/.test(r)) return "سناب شات";
  if (/^t\.co$|twitter|(^|\.)x\.com/.test(r)) return "X (تويتر)";
  if (/youtube|youtu\.be/.test(r)) return "يوتيوب";
  if (/whatsapp|wa\.me/.test(r)) return "واتساب";
  return r;
}

async function totals(start: Date, end: Date) {
  const [e] = await prisma.$queryRaw<any[]>`
    SELECT
      count(*) FILTER (WHERE type = 'view') AS views,
      count(DISTINCT visitor) FILTER (WHERE type = 'view') AS visitors,
      count(*) FILTER (WHERE type = 'whatsapp') AS whatsapp,
      count(*) FILTER (WHERE type = 'phone') AS phone,
      count(DISTINCT visitor) FILTER (WHERE type <> 'view') AS contacters
    FROM "Event" WHERE "createdAt" >= ${start} AND "createdAt" < ${end}`;
  const leads = await prisma.lead.count({ where: { createdAt: { gte: start, lt: end } } });
  const t = {
    views: n(e.views),
    visitors: n(e.visitors),
    whatsapp: n(e.whatsapp),
    phone: n(e.phone),
    leads,
    contacters: n(e.contacters),
  };
  return { ...t, contacts: t.whatsapp + t.phone + t.leads };
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const q = req.nextUrl.searchParams;
  const today = kuwaitDay(new Date());

  // الفترة: ?all=1 أو ?from=YYYY-MM-DD&to=YYYY-MM-DD (شاملة)
  let from = isDay(q.get("from")) ? q.get("from")! : today;
  let to = isDay(q.get("to")) ? q.get("to")! : today;
  const all = q.get("all") === "1";
  if (all) {
    const [m] = await prisma.$queryRaw<any[]>`
      SELECT least((SELECT min("createdAt") FROM "Event"), (SELECT min("createdAt") FROM "Lead")) AS m`;
    from = m?.m ? kuwaitDay(new Date(m.m)) : today;
    to = today;
  }
  if (from > to) [from, to] = [to, from];

  const start = kwMidnight(from);
  const end = new Date(kwMidnight(to).getTime() + DAY);
  const days = Math.round((end.getTime() - start.getTime()) / DAY);
  const unit = days <= 62 ? "day" : days <= 400 ? "week" : "month";
  const range = Prisma.sql`"createdAt" >= ${start} AND "createdAt" < ${end}`;

  // تنظيف البيانات الأقدم من سنتين (أحيانًا فقط)
  if (Math.random() < 0.02) {
    prisma.event.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 730 * DAY) } } }).catch(() => {});
  }

  const [
    cur,
    prev,
    series,
    leadSeries,
    pages,
    entry,
    sources,
    tech,
    geo,
    hours,
    weekdays,
    [eng],
    leadsByService,
    leadsByArea,
  ] = await Promise.all([
    totals(start, end),
    all ? null : totals(new Date(start.getTime() - days * DAY), start),
    prisma.$queryRaw<any[]>`
      SELECT to_char(date_trunc(${unit}, ${LOCAL}), 'YYYY-MM-DD') AS b,
        count(DISTINCT visitor) FILTER (WHERE type = 'view') AS visitors,
        count(*) FILTER (WHERE type = 'view') AS views,
        count(*) FILTER (WHERE type = 'whatsapp') AS whatsapp,
        count(*) FILTER (WHERE type = 'phone') AS phone
      FROM "Event" WHERE ${range} GROUP BY 1 ORDER BY 1`,
    prisma.$queryRaw<any[]>`
      SELECT to_char(date_trunc(${unit}, ${LOCAL}), 'YYYY-MM-DD') AS b, count(*) AS leads
      FROM "Lead" WHERE ${range} GROUP BY 1`,
    prisma.$queryRaw<any[]>`
      SELECT path,
        count(DISTINCT visitor) FILTER (WHERE type = 'view') AS visitors,
        count(*) FILTER (WHERE type = 'view') AS views,
        count(*) FILTER (WHERE type = 'whatsapp') AS whatsapp,
        count(*) FILTER (WHERE type = 'phone') AS phone
      FROM "Event" WHERE ${range} GROUP BY path
      ORDER BY 2 DESC, count(*) FILTER (WHERE type <> 'view') DESC LIMIT 20`,
    prisma.$queryRaw<any[]>`
      SELECT path, count(*) AS v FROM (
        SELECT DISTINCT ON (visitor) path FROM "Event"
        WHERE type = 'view' AND ${range} ORDER BY visitor, "createdAt"
      ) t GROUP BY path ORDER BY 2 DESC LIMIT 10`,
    // أول مصدر للزائر + هل تواصل
    prisma.$queryRaw<any[]>`
      WITH f AS (
        SELECT DISTINCT ON (visitor) visitor, referrer, utm FROM "Event"
        WHERE type = 'view' AND ${range} ORDER BY visitor, "createdAt"
      ), c AS (
        SELECT DISTINCT visitor FROM "Event" WHERE type <> 'view' AND ${range}
      )
      SELECT f.referrer, f.utm, count(*) AS visitors, count(c.visitor) AS contacters
      FROM f LEFT JOIN c USING (visitor) GROUP BY 1, 2`,
    prisma.$queryRaw<any[]>`
      SELECT device, os, count(*) AS v FROM (
        SELECT DISTINCT ON (visitor) device, os FROM "Event"
        WHERE type = 'view' AND ${range} ORDER BY visitor, "createdAt"
      ) t GROUP BY 1, 2`,
    prisma.$queryRaw<any[]>`
      SELECT country, city, count(*) AS v FROM (
        SELECT DISTINCT ON (visitor) country, city FROM "Event"
        WHERE type = 'view' AND ${range} ORDER BY visitor, "createdAt"
      ) t GROUP BY 1, 2`,
    prisma.$queryRaw<any[]>`
      SELECT extract(hour FROM ${LOCAL})::int AS h,
        count(*) FILTER (WHERE type = 'view') AS views,
        count(*) FILTER (WHERE type <> 'view') AS contacts
      FROM "Event" WHERE ${range} GROUP BY 1`,
    prisma.$queryRaw<any[]>`
      SELECT extract(dow FROM ${LOCAL})::int AS d,
        count(*) FILTER (WHERE type = 'view') AS views,
        count(*) FILTER (WHERE type <> 'view') AS contacts
      FROM "Event" WHERE ${range} GROUP BY 1`,
    prisma.$queryRaw<any[]>`
      SELECT count(*) AS visitors, coalesce(avg(p), 0)::float AS avg_pages,
        count(*) FILTER (WHERE p = 1) AS single
      FROM (SELECT visitor, count(DISTINCT path) AS p FROM "Event"
            WHERE type = 'view' AND ${range} GROUP BY visitor) t`,
    prisma.lead.groupBy({
      by: ["service"], where: { createdAt: { gte: start, lt: end } }, _count: { _all: true },
    }),
    prisma.lead.groupBy({
      by: ["area"], where: { createdAt: { gte: start, lt: end } }, _count: { _all: true },
    }),
  ]);

  // سلسلة زمنية كاملة (بما فيها الفترات الفاضية)
  const buckets: string[] = [];
  {
    const d = new Date(`${from}T00:00:00Z`);
    if (unit === "week") d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); // Postgres: الأسبوع يبدأ الاثنين
    if (unit === "month") d.setUTCDate(1);
    while (d.toISOString().slice(0, 10) <= to) {
      buckets.push(d.toISOString().slice(0, 10));
      if (unit === "day") d.setUTCDate(d.getUTCDate() + 1);
      else if (unit === "week") d.setUTCDate(d.getUTCDate() + 7);
      else d.setUTCMonth(d.getUTCMonth() + 1);
    }
  }
  const sMap = new Map(series.map((r) => [r.b, r]));
  const lMap = new Map(leadSeries.map((r) => [r.b, n(r.leads)]));
  const timeline = buckets.map((b) => {
    const r = sMap.get(b);
    const whatsapp = n(r?.whatsapp), phone = n(r?.phone), leads = lMap.get(b) || 0;
    return { b, visitors: n(r?.visitors), views: n(r?.views), whatsapp, phone, leads, contacts: whatsapp + phone + leads };
  });

  const srcMap = new Map<string, { visitors: number; contacters: number }>();
  for (const r of sources) {
    const k = sourceOf(r.referrer || "", r.utm || "");
    const o = srcMap.get(k) || { visitors: 0, contacters: 0 };
    o.visitors += n(r.visitors);
    o.contacters += n(r.contacters);
    srcMap.set(k, o);
  }

  const group = (rows: any[], key: (r: any) => string) => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(key(r), (m.get(key(r)) || 0) + n(r.v));
    return [...m.entries()].map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v);
  };

  const hourArr = Array.from({ length: 24 }, (_, h) => ({ h, views: 0, contacts: 0 }));
  for (const r of hours) hourArr[r.h] = { h: r.h, views: n(r.views), contacts: n(r.contacts) };
  const dowArr = Array.from({ length: 7 }, (_, d) => ({ d, views: 0, contacts: 0 }));
  for (const r of weekdays) dowArr[r.d] = { d: r.d, views: n(r.views), contacts: n(r.contacts) };

  return NextResponse.json({
    range: { from, to, days, unit, all },
    totals: cur,
    prev,
    engagement: {
      avgPages: Number(eng?.avg_pages) || 0,
      singlePageRate: n(eng?.visitors) ? n(eng?.single) / n(eng?.visitors) : 0,
    },
    timeline,
    pages: pages.map((r) => ({
      path: r.path, visitors: n(r.visitors), views: n(r.views), whatsapp: n(r.whatsapp), phone: n(r.phone),
    })),
    entry: entry.map((r) => ({ k: r.path, v: n(r.v) })),
    sources: [...srcMap.entries()]
      .map(([k, o]) => ({ k, ...o }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 12),
    devices: group(tech, (r) => r.device || "desktop"),
    os: group(tech, (r) => r.os || "other"),
    countries: group(geo, (r) => r.country || ""),
    cities: group(geo.filter((r) => r.city), (r) => r.city).slice(0, 10),
    hours: hourArr,
    weekdays: dowArr,
    leadsByService: leadsByService
      .map((r) => ({ k: r.service || "غير محدد", v: r._count._all }))
      .sort((a, b) => b.v - a.v),
    leadsByArea: leadsByArea
      .map((r) => ({ k: r.area || "غير محدد", v: r._count._all }))
      .sort((a, b) => b.v - a.v),
  });
}
