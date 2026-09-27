// مزامنة المحتوى أثناء بناء الإنتاج على Netlify:
//  1) مقالات content/articles/*.md — تنضاف مرة وحدة بس (واللي تاريخها بالمستقبل تنضاف مجدولة). ولو المقال لسا بنسخته القديمة
//     (ما انعدل من لوحة التحكم) يتحدّث للنسخة الجديدة.
//  2) نصوص الموقع باللهجة الكويتية content/site-content.json — أي نص افتراضي قديم يتبدّل بالصياغة الكويتية،
//     وأي نص انعدل من لوحة التحكم ما نلمسه أبدًا. إعدادات الموقع (الاسم والرقم) ما تنلمس.
// أي خطأ هنا ما يوقف البناء. التشغيل المحلي: SEED_ARTICLES=1 node scripts/sync-content.mjs
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const ROOT = process.cwd();
const log = (...a) => console.log("[sync-content]", ...a);
const norm = (s) => String(s ?? "").replace(/\r\n/g, "\n").trim();
const sha = (s) => crypto.createHash("sha256").update(norm(s)).digest("hex");

function parseMd(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`frontmatter missing: ${file}`);
  const meta = Object.fromEntries(
    m[1].split("\n").filter(Boolean).map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()])
  );
  return { ...meta, content: m[2].trim() };
}

// يرجّع true إذا العلامة موجودة من قبل، وإلا يسجّلها ويرجّع false
async function seen(prisma, id) {
  const hit = await prisma.syncMarker.findUnique({ where: { id } });
  if (hit) return true;
  await prisma.syncMarker.create({ data: { id } });
  return false;
}

async function syncArticles(prisma) {
  const dir = path.join(ROOT, "content", "articles");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  const now = Date.now();
  for (const [i, f] of files.entries()) {
    const a = parseMd(path.join(dir, f));
    if (!a.slug || !a.title) continue;
    const data = {
      title: a.title.slice(0, 160),
      excerpt: (a.excerpt || "").slice(0, 400),
      content: a.content.slice(0, 20000),
      image: a.image || "",
    };
    const existing = await prisma.article.findUnique({ where: { slug: a.slug } });
    if (existing) {
      // نحدّث بس إذا المحتوى الحالي نسخة قديمة معروفة من نفس الملف (يعني ما انعدل يدويًا)
      const replaces = (a.replaces || "").split(",").map((x) => x.trim()).filter(Boolean);
      const cur = sha(existing.content);
      if (replaces.includes(cur) && cur !== sha(data.content)) {
        await prisma.article.update({ where: { slug: a.slug }, data });
        log("article updated:", a.slug);
      }
      await seen(prisma, `article:${a.slug}`);
      continue;
    }
    // انضاف قبل وانحذف من لوحة التحكم؟ ما نرجّعه
    if (await seen(prisma, `article:${a.slug}`)) continue;
    // تاريخ مستقبلي بالملف = مقال مجدول: يظهر بالموقع تلقائيًا الساعة 8 الصبح (بتوقيت الكويت) بهاليوم
    const at = /^\d{4}-\d{2}-\d{2}$/.test(a.date || "") ? new Date(`${a.date}T08:00:00+03:00`) : null;
    const publishedAt = at && at.getTime() > now ? at : new Date(now - i * 60_000);
    await prisma.article.create({
      data: { ...data, slug: a.slug, published: true, publishedAt },
    });
    log(at && at.getTime() > now ? `article scheduled for ${a.date}:` : "article added:", a.slug);
  }
}

async function syncTexts(prisma) {
  const file = path.join(ROOT, "content", "site-content.json");
  if (!fs.existsSync(file)) return;
  const K = JSON.parse(fs.readFileSync(file, "utf8"));
  let n = 0;
  const isOld = (cur, spec) => spec.old.map(norm).includes(norm(cur)) && norm(cur) !== norm(spec.new);

  // إعدادات الموقع (الاسم والرقم والإيميل) ما نلمسها أبدًا — تنعدل من لوحة التحكم بس

  // النصوص
  for (const [id, spec] of Object.entries(K.texts)) {
    const row = await prisma.textContent.findUnique({ where: { id } });
    if (row && isOld(row.value, spec)) {
      await prisma.textContent.update({ where: { id }, data: { value: spec.new } });
      n++;
    }
  }

  // الخدمات
  for (const [slug, fields] of Object.entries(K.services || {})) {
    const row = await prisma.service.findUnique({ where: { slug } });
    if (!row) continue;
    const data = {};
    for (const f of ["title", "short", "description"]) if (fields[f] && isOld(row[f], fields[f])) data[f] = fields[f].new;
    if (fields.features) {
      let cur = [];
      try { cur = JSON.parse(row.features || "[]"); } catch {}
      const same = (x) => JSON.stringify(x) === JSON.stringify(cur);
      if (!same(fields.features.new) && fields.features.old.some(same)) {
        data.features = JSON.stringify(fields.features.new);
      }
    }
    if (Object.keys(data).length) {
      await prisma.service.update({ where: { slug }, data });
      n += Object.keys(data).length;
    }
  }

  // المناطق
  for (const [slug, fields] of Object.entries(K.areas || {})) {
    const row = await prisma.area.findUnique({ where: { slug } });
    if (!row) continue;
    const data = {};
    for (const [f, spec] of Object.entries(fields)) if (isOld(row[f], spec)) data[f] = spec.new;
    if (Object.keys(data).length) {
      await prisma.area.update({ where: { slug }, data });
      n += Object.keys(data).length;
    }
  }

  // «ليش إحنا» — نستبدل القائمة بس إذا هي نفس القائمة الافتراضية بالضبط
  const why = await prisma.whyPoint.findMany({ orderBy: { order: "asc" } });
  if (K.why && why.length && JSON.stringify(why.map((w) => norm(w.text))) === JSON.stringify(K.why.old.map(norm))) {
    for (const [i, w] of why.entries()) await prisma.whyPoint.update({ where: { id: w.id }, data: { text: K.why.new[i] } });
    n += why.length;
  }

  // الآراء (النص الافتراضي فقط)
  for (const spec of K.reviews || []) {
    const r = await prisma.review.updateMany({ where: { text: { in: spec.old } }, data: { text: spec.new } });
    n += r.count;
  }

  // مقالات القالب القديمة
  for (const [slug, spec] of Object.entries(K.legacyArticles || {})) {
    const row = await prisma.article.findUnique({ where: { slug } });
    if (row && norm(row.content) === norm(spec.old.content)) {
      await prisma.article.update({ where: { slug }, data: spec.new });
      n++;
    }
  }
  log(n ? `site texts: ${n} field(s) updated` : "site texts: up to date");
}

async function main() {
  if (process.env.CONTEXT !== "production" && process.env.SEED_ARTICLES !== "1") {
    log("skipped (not a production deploy)");
    return;
  }
  const prisma = new PrismaClient();
  try {
    await syncArticles(prisma);
    await syncTexts(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => log("error (ignored):", e.message));
