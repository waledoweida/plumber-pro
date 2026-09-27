import { customIcon, generatedIcon } from "@/lib/siteIcon";

// أيقونة الشاشة الرئيسية للآيفون (خلفية بيضا لأن iOS ما بيدعمش الشفافية)
export const dynamic = "force-dynamic";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return (await customIcon(size.width, false)) || generatedIcon(size.width, 0);
}
