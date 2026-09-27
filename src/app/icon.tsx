import { customIcon, generatedIcon } from "@/lib/siteIcon";

// أيقونة الموقع (فافيكون) — تظهر في تبويب المتصفح وجنب اسم الموقع في نتائج جوجل.
// لو الأدمن رفع أيقونة من لوحة التحكم بنعرضها، وإلا بنولّد أيقونة بلون الموقع.
export const dynamic = "force-dynamic";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default async function Icon() {
  return (await customIcon(size.width, true)) || generatedIcon(size.width, 40);
}
