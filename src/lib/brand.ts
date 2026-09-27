// بيانات الموقع الافتراضية (نفس اللي بقاعدة البيانات — تنعدل من لوحة التحكم ← الإعدادات)
export const BRAND = {
  nameAr: "شلال بيروت",
  nameEn: "Shalal Beirut",
  tagline: "سباك الكويت المعتمد",
  phone: "55824247",
  whatsapp: "96565006904",
  email: "info@plumberkuw.com",
  domain: "plumberkuw.com",
  // مجلد الصور على Cloudinary
  uploadFolder: "plumber-pro",
};

// رابط الموقع: NEXT_PUBLIC_SITE_URL (يتثبّت وقت البناء من رابط Netlify الأساسي — شوف next.config.ts)، وإلا الدومين
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `https://${BRAND.domain}`).replace(/\/+$/, "");
