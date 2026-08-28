# دليل النشر — Netlify + Neon (مجاني)

الموقع **Next.js** فيه لوحة تحكم وقاعدة بيانات. على Netlify:
- الكود يشتغل عبر `@netlify/plugin-nextjs`
- **SQLite لا يصلح للإنتاج** على Netlify (القرص مؤقت)
- لازم **Neon Postgres** (مجاني) للتعديل الفوري من الأدمن
- رفع الصور: **Cloudinary** (مجاني) لأن ملفات `public/uploads` لا تثبت

---

## الخطوة 1: قاعدة البيانات Neon

1. ادخل [https://neon.tech](https://neon.tech) وسجّل بحساب GitHub  
2. **Create project** → اسم مثل `plumber-kuwait`  
3. انسخ **Connection string** (يبدأ بـ `postgresql://...`)  
4. في المشروع محليًا:

افتح `prisma/schema.prisma` وغيّر:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

في ملف `.env`:

```env
DATABASE_URL="postgresql://...رابط Neon الكامل..."
ADMIN_PASSWORD="كلمة-قوية"
ADMIN_SECRET="نص-عشوائي-طويل"
```

ثم:

```bash
npm install
npx prisma db push
npm run db:seed
```

---

## الخطوة 2: رفع على GitHub

```bash
cd plumber-pro
git init
git add .
git commit -m "موقع سباكة - Netlify ready"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

> تأكد إن `.env` و`*.db` في `.gitignore` (موجودين أصلًا).

---

## الخطوة 3: ربط Netlify

1. ادخل [https://app.netlify.com](https://app.netlify.com)  
2. **Add new site** → **Import an existing project** → GitHub → اختار المستودع  
3. الإعدادات تتقري من `netlify.toml` تلقائيًا:
   - Build command: `npx prisma generate && next build`
   - Plugin: `@netlify/plugin-nextjs`
4. **Environment variables** → Add (⚠️ إجباري وليس اختياري):

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | رابط Neon (postgresql://...) |
| `ADMIN_PASSWORD` | كلمة مرور الأدمن (قوية وعشوائية، ليست admin123) |
| `ADMIN_SECRET` | نص عشوائي طويل (32+ حرف) |
| `CLOUDINARY_CLOUD_NAME` | (اختياري للصور) |
| `CLOUDINARY_UPLOAD_PRESET` | (اختياري للصور) |

> **مهم:** بدون `ADMIN_PASSWORD` و `ADMIN_SECRET` مضبوطين، لوحة التحكم `/admin`
> **سترفض كل محاولات الدخول تمامًا** (بدل الرجوع لكلمة مرور افتراضية ضعيفة). هذا سلوك
> مقصود لحماية الموقع — تأكد من ضبط القيمتين قبل النشر.

5. **Deploy site**

---

## الخطوة 4: بعد أول نشر ناجح

من جهازك (مع نفس `DATABASE_URL` في `.env`):

```bash
npx prisma db push
npm run db:seed
```

لو الجداول اتعملت قبل الـ deploy، كده كفاية.  
افتح: `https://اسم-موقعك.netlify.app/admin`

---

## رفع الصور على Netlify

القرص على Netlify **مش دائم**. للرفع المباشر من الأدمن:

1. [cloudinary.com](https://cloudinary.com) — حساب مجاني  
2. Dashboard → انسخ **Cloud name**  
3. Settings → Upload → **Add upload preset** → **Unsigned**  
4. في Netlify Environment Variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_UPLOAD_PRESET`
5. **Trigger deploy** من جديد  
6. من الأدمن: **اختر صورة من الجهاز** — تترفع على Cloudinary

---

## الدومين الخاص

Netlify → Site configuration → **Domain management** → Add custom domain  
اتبع تعليمات DNS عند مزود الدومين.

---

## استكشاف أخطاء شائعة

| المشكلة | الحل |
|---------|------|
| Build fails على Prisma | تأكد `binaryTargets` في schema + `prisma generate` في أمر البناء |
| الموقع فاضي / الأدمن لا يحفظ | `DATABASE_URL` لازم Postgres (Neon) مش sqlite |
| خطأ اتصال DB | أضف `?sslmode=require` في نهاية رابط Neon |
| الصور تختفي بعد دقائق | فعّل Cloudinary كما فوق |
| Plugin Next.js | موجود في `package.json` و`netlify.toml` |

---

## أوامر مفيدة

```bash
npm run dev          # تطوير محلي (SQLite)
npx prisma db push   # مزامنة الجداول
npm run db:seed      # بيانات أولية
npm run build        # بناء مثل Netlify
```

---

## بديل: Vercel

نفس المشروع يشتغل على Vercel بنفس `DATABASE_URL` (Neon).  
ملف `netlify.toml` لا يضر على Vercel.
