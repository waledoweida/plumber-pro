// تحديث قاعدة البيانات أثناء البناء — إضافات بس (جداول/أعمدة/فهارس جديدة)، وما يمسح أي شي أبدًا.
// بديل عن `prisma db push` اللي يحاول يحذف أي جدول مو موجود بالـ schema (مثل جدول Neon التجريبي playing_with_neon).
// أي أمر فيه حذف (DROP TABLE / DROP COLUMN / تغيير نوع عمود) ينطبع بالسجل ويتخطّى، والبناء يكمل عادي.
import { execFileSync } from "child_process";

const log = (...a) => console.log("[db-sync]", ...a);
if (!process.env.DATABASE_URL) {
  log("DATABASE_URL missing — skipped");
  process.exit(0);
}

const prisma = (args, input) =>
  execFileSync("npx", ["prisma", ...args], { input, encoding: "utf8", stdio: [input ? "pipe" : "ignore", "pipe", "inherit"] });

const sql = prisma([
  "migrate", "diff",
  "--from-url", process.env.DATABASE_URL,
  "--to-schema-datamodel", "prisma/schema.prisma",
  "--script",
]);

// نقسم السكربت لأوامر (كل أمر ينتهي بـ ; بآخر السطر)
const statements = sql
  .split(/;\s*\n/)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

const destructive = /\b(DROP\s+(TABLE|COLUMN|SCHEMA|TYPE|INDEX|CONSTRAINT)|ALTER\s+COLUMN\s+"[^"]+"\s+(SET\s+DATA\s+)?TYPE|TRUNCATE|DELETE\s+FROM)\b/i;
const safe = [];
for (const s of statements) {
  if (destructive.test(s)) log("skipped (would remove data):", s.replace(/\s+/g, " ").slice(0, 160));
  else safe.push(s);
}

if (!safe.length) {
  log("database is up to date");
  process.exit(0);
}
log(`applying ${safe.length} statement(s)`);
prisma(["db", "execute", "--stdin", "--schema", "prisma/schema.prisma"], safe.map((s) => s + ";").join("\n"));
log("done");
