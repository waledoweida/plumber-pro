// صور المشاركة الجاهزة (public/og) — تتولد بسكربت خارجي بالخط العربي الصحيح.
// الصفحات اللي مو بالقائمة (خدمة أو مقال جديد من لوحة التحكم) تاخذ صورتها المرفوعة أو الصورة العامة.
export const OG_SLUGS = {
  "services": [
    "drain-cleaning",
    "leak-detection",
    "bathroom",
    "heaters",
    "pumps",
    "pipes"
  ],
  "articles": [
    "water-meter-leak-test",
    "ppr-vs-copper-pipes",
    "bathroom-rough-in-mistakes",
    "toilet-cistern-running",
    "manhole-overflow",
    "water-heater-types-guide",
    "choose-water-pump",
    "dripping-tap-mixer",
    "kuwait-summer-plumbing",
    "5-signs-need-plumber",
    "leak-without-breaking"
  ],
  "areas": [
    "kuwait-city",
    "hawally",
    "salmiya",
    "farwaniya",
    "ahmadi",
    "jahra"
  ]
} as const;
