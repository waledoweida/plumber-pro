# سباك الكويت | plumber-pro

موقع سباكة + لوحة تحكم (تعديل فوري من قاعدة البيانات). عربي (لهجة كويتية) + إنجليزي `/en`.

```bash
npm install && npx prisma db push && npm run db:seed && npm run dev
```

- الموقع: http://localhost:3000 — الأدمن: `/admin` (كلمة المرور من `.env`)
- النشر على Netlify + Neon + Cloudinary: راجع `DEPLOY.md`
- المقالات: `content/articles/*.md` (تنضاف تلقائيًا عند النشر، واللي تاريخها بالمستقبل تنزل بوقتها)
