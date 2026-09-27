import { chromium } from "playwright"; // npm i -g playwright (أو من /opt/pw-browsers)
import fs from "fs";
import { ART } from "./art.mjs";
import { ITEMS } from "./data.mjs";
const OUT = "/home/user/plumber-pro/public/images/articles";
const FONT = `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@500;700&display=swap" rel="stylesheet">`;
const base = (w, h, body, dir = "rtl") => `<!doctype html><html dir="${dir}"><head><meta charset="utf-8">${FONT}<style>
*{margin:0;box-sizing:border-box} body{width:${w}px;height:${h}px;font-family:'IBM Plex Sans Arabic',sans-serif;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:40px 40px}
</style></head><body>${body}</body></html>`;
const br = (t) => t.split("\n").join("<br>");
const cover = (it, en) => base(1200, 675, `
<div style="position:relative;width:1200px;height:675px;background:radial-gradient(ellipse 60% 70% at 90% -10%,rgba(251,191,36,.25),transparent 60%),linear-gradient(135deg,#1d44d8,#1e338a 55%,#131f4f);color:#fff">
 <div class="grid"></div>
 <div style="position:absolute;${en ? "left" : "right"}:80px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center">
  <div style="display:inline-flex;align-self:flex-start;background:#fbbf24;color:#131f4f;border-radius:999px;padding:8px 22px;font-size:26px;font-weight:700;margin-bottom:28px">${en ? it.enK : it.kicker}</div>
  <div style="font-size:${en ? 64 : 62}px;font-weight:700;line-height:1.3">${br(en ? it.en : it.title)}</div>
  <div style="width:90px;height:6px;background:#fbbf24;border-radius:6px;margin-top:34px"></div>
 </div>
 <svg viewBox="0 0 400 400" width="430" height="430" style="position:absolute;${en ? "right" : "left"}:70px;top:110px;background:#eff5ff;padding:14px;border-radius:28px;box-shadow:0 30px 60px rgba(0,0,0,.25)">${ART[it.art]}</svg>
</div>`, en ? "ltr" : "rtl");
const info = (it) => base(1200, 800, `
<div style="position:relative;width:1200px;height:800px;background:linear-gradient(180deg,#f7f9fc,#eff5ff);padding:70px 80px">
 <div style="display:flex;align-items:center;gap:18px;margin-bottom:46px">
  <div style="width:14px;height:64px;border-radius:8px;background:#f5a70b"></div>
  <div style="font-size:54px;font-weight:700;color:#131f4f">${it.info.title}</div>
 </div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
  ${it.info.items.map((x, i) => `<div style="background:#fff;border:1px solid #dbe8fe;border-radius:22px;box-shadow:0 10px 30px rgba(29,68,216,.08);${i === 4 ? "grid-column:span 2;" : ""}display:flex;align-items:center;gap:22px;padding:28px 30px">
    <div style="width:74px;height:74px;flex:none;background:linear-gradient(145deg,#2552eb,#1e338a);border-radius:18px;color:#fff;font-size:38px;font-weight:700;display:flex;align-items:center;justify-content:center;position:relative">${i + 1}<span style="position:absolute;bottom:-6px;left:-6px;width:20px;height:20px;border-radius:99px;background:#fbbf24"></span></div>
    <div style="font-size:34px;font-weight:700;color:#1e338a;line-height:1.35">${x}</div></div>`).join("")}
 </div>
 <svg viewBox="0 0 400 400" width="150" height="150" style="position:absolute;left:70px;bottom:40px;opacity:.9">${ART[it.art]}</svg>
</div>`);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage();
async function shot(html, w, h, name) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = (await page.screenshot({ type: "png" })).toString("base64");
  const out = await page.evaluate(async ({ png, w, h }) => {
    const img = new Image(); img.src = "data:image/png;base64," + png; await img.decode();
    const enc = (tw) => { const c = document.createElement("canvas"); c.width = tw; c.height = Math.round(h * tw / w); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c.toDataURL("image/webp", 0.82).split(",")[1]; };
    return [enc(w), enc(800)];
  }, { png, w, h });
  fs.writeFileSync(`${OUT}/${name}.webp`, Buffer.from(out[0], "base64"));
  fs.writeFileSync(`${OUT}/${name}-800.webp`, Buffer.from(out[1], "base64"));
}
for (const it of ITEMS) {
  await shot(cover(it, false), 1200, 675, `${it.slug}-cover`);
  await shot(cover(it, true), 1200, 675, `en-${it.slug}-cover`);
  await shot(info(it), 1200, 800, it.info.file);
  console.log("done", it.slug);
}
await browser.close();
