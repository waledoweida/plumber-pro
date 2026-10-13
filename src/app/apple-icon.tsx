import { customIcon, generatedIcon } from "@/lib/siteIcon";

// أيقونة الشاشة الرئيسية للآيفون (خلفية بيضا لأن iOS ما بيدعمش الشفافية)
// كاش ثابت يتجدد كل ساعة (أو فورًا عند أي تعديل من لوحة التحكم)
export const revalidate = 3600;
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return (await customIcon(size.width, false)) || generatedIcon(size.width, 0);
}
