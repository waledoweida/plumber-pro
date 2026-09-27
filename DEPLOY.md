# نشر الموقع (plumber-pro)

1. Neon Postgres للإنتاج (ليس SQLite على Netlify)
2. متغيرات: DATABASE_URL, ADMIN_PASSWORD, ADMIN_SECRET
3. صور الإنتاج: Cloudinary — `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_UPLOAD_PRESET` (preset من نوع **Unsigned**)
   - مطلوب كمان لرفع **الفيديو** في المقالات (بيترفع مباشرة من المتصفح لـ Cloudinary)
4. اربط الدومين من Netlify → Domain management (رابط الموقع للـ sitemap يتاخذ تلقائيًا، أو حطه بـ `NEXT_PUBLIC_SITE_URL`)

## قاعدة البيانات
أمر البناء على Netlify بيشغّل `prisma db push` تلقائيًا قبل البناء، فأي جدول/عمود جديد
بيتضاف لوحده. لو فيه تغيير هيمسح بيانات، البناء يفشل بدل ما يمسح (لازم تتعامل معاه يدويًا).

```bash
npx prisma db push && npm run db:seed
```

## التأكد إن آخر تحديث اتنشر
في لوحة التحكم جنب العنوان فيه رقم الإصدار `v:xxxxxxx` = أول 7 حروف من آخر commit على GitHub.

## الإحصائيات
الصفحة الرئيسية للوحة التحكم فيها الزوار الحقيقيين وضغطات واتساب والاتصال — بدون كوكيز
وبدون أي خدمة خارجية. البيانات الأقدم من سنة بتتمسح تلقائيًا.

## خريطة الموقع
`/sitemap.xml` بتتولد تلقائيًا وفيها كل الخدمات والمناطق والمقالات المنشورة.

## Google Search Console (مهم علشان الموقع يظهر بسرعة في جوجل)
1. ادخل https://search.google.com/search-console وأضف رابط موقعك (نوع: URL prefix)
2. اختار طريقة التأكيد **HTML tag**، وانسخ قيمة `content` بس (الكود الطويل)
3. في Netlify: Site configuration → Environment variables → أضف `GOOGLE_SITE_VERIFICATION` = الكود، واعمل Redeploy
4. ارجع Search Console واضغط Verify
5. من Sitemaps أضف: `sitemap.xml`
6. من URL Inspection اطلب فهرسة للصفحة الرئيسية وأهم صفحات الخدمات

## المحتوى التلقائي (scripts/sync-content.mjs)
- أي ملف `.md` في `content/articles/` بيتنشر تلقائيًا كمقال عند نشر الإنتاج على Netlify (مرة واحدة بس حسب الـ slug).
- لو المقال موجود وما انعدلش من لوحة التحكم، بيتحدّث للنسخة الجديدة (حسب `replaces:`)؛ ولو عدلته أو حذفته، ما بنلمسه.
- `content/site-content.json` (بيتولّد من `content/site-content.py`): صياغة نصوص الموقع باللهجة الكويتية. أي نص لسا بقيمته الافتراضية القديمة بيتبدّل، وأي نص عدلته من لوحة التحكم بيفضل زي ما هو. الاسم والرقم والإيميل ما يتغيرون أبدًا.
- الصور في `public/images/articles/` (نسخة 1200px + نسخة 800px للموبايل).

## الأرشفة السريعة (IndexNow)
- ملف المفتاح في `public/<key>.txt`. أي مقال بتنشره أو تعدله من لوحة التحكم بيتبلّغ لمحركات البحث تلقائيًا.
- زر «🔔 بلّغ محركات البحث» في تبويب المدونة بيرسل كل صفحات الموقع مرة واحدة (استخدمه بعد أي تحديث كبير).
- IndexNow بيخدم Bing و Yandex وغيرهم. لجوجل: Search Console → URL Inspection → Request indexing.
