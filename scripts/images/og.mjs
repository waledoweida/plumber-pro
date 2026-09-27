import { chromium } from "playwright"; // npm i -g playwright (أو من /opt/pw-browsers)
import fs from "fs";
import { ART } from "./art.mjs";
import { ITEMS } from "./data.mjs";
const ROOT = "/home/user/plumber-pro";
const OUT = ROOT + "/public/og";
const NAME = { ar: "شلال بيروت", en: "Shalal Beirut" };
const SERVICES = [
  ["drain-cleaning", "manhole", "تسليك مجاري وبواليع", "نسلّك بأحدث المكاين وبدون تكسير على الفاضي", "Drain & Sewer Unblocking", "Camera inspection and high-pressure jetting"],
  ["leak-detection", "meter", "كشف تسربات بدون تكسير", "أجهزة حرارية وصوتية تحدد مكان التهريب بالضبط", "Leak Detection Without Breaking", "Thermal and acoustic equipment"],
  ["bathroom", "bath", "تجديد وتأسيس الحمامات", "نأسس سباكة الحمام ونركّب الأدوات الصحية", "Bathroom Renovation & Rough-in", "Pressure-tested pipework, neat fitting"],
  ["heaters", "heater", "سخانات المياه", "نركّب ونصلّح السخانات الفورية والمركزية", "Water Heaters", "Instant and central, always with a safety valve"],
  ["pumps", "pump", "مضخات المياه", "الماي ضعيف بالأدوار العالية؟ عندنا الحل", "Water Pumps", "The right pump for strong pressure upstairs"],
  ["pipes", "pipes", "تمديد مواسير", "مواسير PPR ونحاس ما تصدّي", "Pipe Installation & Replacement", "PPR and copper pipework"],
];
const AREAS = [["kuwait-city","العاصمة","Kuwait City"],["hawally","حولي","Hawally"],["salmiya","السالمية","Salmiya"],["farwaniya","الفروانية","Farwaniya"],["ahmadi","الأحمدي","Ahmadi"],["jahra","الجهراء","Jahra"]];
const LEGACY = [["5-signs-need-plumber", "toilet", "5 إشارات بالبيت\nمعناها تحتاج سباك"], ["leak-without-breaking", "meter", "شلون نلقى التهريب\nبدون تكسير؟"]];

const FONT = `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@500;700&display=swap" rel="stylesheet">`;
const br = (t) => t.split("\n").join("<br>");
const tpl = ({ lang, kicker, title, sub, art }) => {
  const en = lang === "en";
  return `<!doctype html><html dir="${en ? "ltr" : "rtl"}"><head><meta charset="utf-8">${FONT}<style>*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;font-family:'IBM Plex Sans Arabic',sans-serif;overflow:hidden}</style></head><body>
<div style="position:relative;width:1200px;height:630px;color:#fff;background:radial-gradient(ellipse 60% 70% at ${en ? "100%" : "0%"} -10%,rgba(251,191,36,.28),transparent 60%),linear-gradient(135deg,#1d44d8,#1e338a 55%,#131f4f)">
 <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.09) 1px,transparent 1px);background-size:26px 26px"></div>
 <div style="position:absolute;${en ? "left" : "right"}:70px;top:70px;display:flex;align-items:center;gap:14px">
  <div style="width:58px;height:58px;border-radius:16px;background:linear-gradient(145deg,#2552eb,#1e338a);box-shadow:0 0 0 2px rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
  <div><div style="font-size:30px;font-weight:700;line-height:1.1">${NAME[lang]}</div><div style="font-size:20px;color:#fde68a">${en ? "Certified plumber in Kuwait · 24/7" : "سباك الكويت المعتمد · 24 ساعة"}</div></div>
 </div>
 <div style="position:absolute;${en ? "left" : "right"}:70px;top:190px;width:640px">
  ${kicker ? `<div style="display:inline-block;background:#fbbf24;color:#131f4f;border-radius:999px;padding:6px 20px;font-size:24px;font-weight:700;margin-bottom:22px">${kicker}</div>` : ""}
  <div style="font-size:${title.length > 34 ? 50 : 60}px;font-weight:700;line-height:1.28">${br(title)}</div>
  ${sub ? `<div style="font-size:28px;color:#dbe8fe;margin-top:18px;line-height:1.45">${sub}</div>` : ""}
 </div>
 <svg viewBox="0 0 400 400" width="330" height="330" style="position:absolute;${en ? "right" : "left"}:80px;top:150px;background:#eff5ff;padding:12px;border-radius:30px;box-shadow:0 30px 60px rgba(0,0,0,.28)">${ART[art]}</svg>
 <div style="position:absolute;bottom:0;left:0;right:0;height:10px;background:linear-gradient(90deg,#fcd34d,#f5a70b)"></div>
</div></body></html>`;
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const done = { services: [], articles: [], areas: [] };
async function shot(file, o) {
  fs.mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await page.setContent(tpl(o), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, type: "jpeg", quality: 82 });
}
await shot(`${OUT}/default.jpg`, { lang: "ar", title: "سباك الكويت المعتمد", sub: "تسليك مجاري • كشف تهريب بدون تكسير • سخانات وماطورات • تأسيس حمامات", art: "pipes" });
await shot(`${OUT}/default-en.jpg`, { lang: "en", title: "Certified plumber in Kuwait", sub: "Drains • Leak detection • Heaters • Pumps • Bathrooms", art: "pipes" });
for (const [slug, art, t, s, te, se] of SERVICES) {
  await shot(`${OUT}/services/${slug}.jpg`, { lang: "ar", kicker: "خدماتنا", title: t, sub: s, art });
  await shot(`${OUT}/services/en-${slug}.jpg`, { lang: "en", kicker: "Our services", title: te, sub: se, art });
  done.services.push(slug);
}
for (const [slug, ar, en] of AREAS) {
  await shot(`${OUT}/areas/${slug}.jpg`, { lang: "ar", kicker: "نوصلك بسرعة", title: `سباك ${ar}`, sub: "تسليك • كشف تهريب • سخانات • ماطورات — 24 ساعة", art: "tap" });
  await shot(`${OUT}/areas/en-${slug}.jpg`, { lang: "en", kicker: "Fast response", title: `Plumber in ${en}`, sub: "Drains • Leaks • Heaters • Pumps — 24/7", art: "tap" });
  done.areas.push(slug);
}
for (const it of ITEMS) {
  await shot(`${OUT}/articles/${it.slug}.jpg`, { lang: "ar", kicker: it.kicker, title: it.title, art: it.art });
  await shot(`${OUT}/articles/en-${it.slug}.jpg`, { lang: "en", kicker: it.enK, title: it.en, art: it.art });
  done.articles.push(it.slug);
}
for (const [slug, art, title] of LEGACY) {
  await shot(`${OUT}/articles/${slug}.jpg`, { lang: "ar", kicker: "نصايح السباكة", title, art });
  done.articles.push(slug);
}
await browser.close();
fs.writeFileSync(`${ROOT}/src/lib/og-images.ts`, `// صور المشاركة الجاهزة (public/og) — تتولد بسكربت خارجي بالخط العربي الصحيح.
// الصفحات اللي مو بالقائمة (خدمة أو مقال جديد من لوحة التحكم) تاخذ صورتها المرفوعة أو الصورة العامة.
export const OG_SLUGS = ${JSON.stringify(done, null, 2)} as const;
`);
console.log("ok", done.services.length, done.areas.length, done.articles.length);
