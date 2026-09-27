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

// رابط الموقع: NEXT_PUBLIC_SITE_URL أو رابط Netlify الأساسي، وإلا الدومين
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || `https://${BRAND.domain}`).replace(/\/+$/, "");
