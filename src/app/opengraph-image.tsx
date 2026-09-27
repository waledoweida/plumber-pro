import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/content";
import { BRAND, SITE_URL } from "@/lib/brand";

// صورة المشاركة الافتراضية (واتساب / فيسبوك / X).
// مكتبة توليد الصور ما بتدعمش تشكيل الحروف العربية صح، فالصورة فيها أيقونة + رقم + دومين بس،
// والعنوان العربي بيظهر من og:title جنب الصورة.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BRAND.nameAr} — سباك الكويت المعتمد 24 ساعة`;

export default async function OgImage() {
  const site = await getSiteSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", background: "linear-gradient(160deg,#0a172c,#17315a)", borderBottom: "18px solid #ea6a1c", color: "#fff",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#f7843b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <div style={{ fontSize: 110, fontWeight: 800, marginTop: 24, letterSpacing: 4 }}>{site.phone}</div>
        <div style={{ fontSize: 40, marginTop: 8, color: "#fca66b" }}>{`${new URL(SITE_URL).host} · 24/7`}</div>
      </div>
    ),
    size
  );
}
