# دار السباكة Pro

موقع سباكة + لوحة تحكم (تعديل فوري من قاعدة البيانات).

## تشغيل محلي

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

- الموقع: http://localhost:3000  
- الأدمن: http://localhost:3000/admin  
- كلمة المرور الافتراضية: `admin123` (من `.env`)

## النشر على Netlify

1. أنشئ قاعدة **Neon Postgres** مجانًا  
2. في `prisma/schema.prisma` غيّر `provider` إلى `postgresql`  
3. ارفع على GitHub  
4. اربط المستودع في [Netlify](https://app.netlify.com)  
5. أضف متغيرات البيئة: `DATABASE_URL` + `ADMIN_PASSWORD` + `ADMIN_SECRET`  
6. Deploy ثم `npx prisma db push` و `npm run db:seed`

**التفاصيل الكاملة:** ملف **DEPLOY.md**

## الصور على Netlify

استخدم **Cloudinary** (متغيرات `CLOUDINARY_*`) — شوف DEPLOY.md

## المميزات

- نموذج طلب خدمة → يظهر في الأدمن  
- آراء عملاء + معرض أعمال  
- مدونة + صفحات مناطق  
- نصوص وإظهار/إخفاء من اللوحة  
- واجهة أدمن للموبايل والكمبيوتر  
