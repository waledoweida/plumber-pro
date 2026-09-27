// الـ slug العربي ممكن يوصل للصفحة بأكثر من شكل حسب السيرفر (Netlify / محلي):
// مُرمّز مرة أو مرتين (%D8%...)، أو حروف مشوّهة (Ø£Ù...)، أو بصيغة Unicode مختلفة.
// نرجّع كل الأشكال المحتملة علشان نلاقي المقال مهما كان شكل الرابط.
export function slugCandidates(raw: string): string[] {
  const out = new Set<string>();
  const add = (v: string) => {
    const t = v.trim();
    if (!t) return;
    out.add(t);
    out.add(t.normalize("NFC"));
  };
  let cur = String(raw || "");
  add(cur);
  for (let i = 0; i < 3; i++) {
    let next: string;
    try {
      next = decodeURIComponent(cur);
    } catch {
      break;
    }
    if (next === cur) break;
    cur = next;
    add(cur);
  }
  // UTF-8 اتقرأ كـ latin1 (مثال: "Ø£Ù")
  if (/[\u00C0-\u00FF]/.test(cur) && !/[\u0600-\u06FF]/.test(cur)) {
    add(Buffer.from(cur, "latin1").toString("utf8"));
  }
  return [...out];
}

// شكل موحّد للمقارنة
export function normalizeSlug(raw: string): string {
  const c = slugCandidates(raw);
  return (c[c.length - 1] || "").normalize("NFC").toLowerCase().replace(/\s+/g, "-");
}
