import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { notifyNewLead } from "@/lib/notify";

// زر «جرّب التنبيه» في لوحة التحكم: يبعت طلب تجريبي على كل القنوات المضبوطة
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const results = await notifyNewLead({
    id: "test",
    name: "طلب تجريبي",
    phone: "50000000",
    area: "حولي",
    service: "تسليك مجاري",
    message: "هذا طلب تجريبي من زر «جرّب التنبيه» في لوحة التحكم.",
  });
  if (!results.length) {
    return NextResponse.json({
      ok: false,
      message: "ولا قناة تنبيه مضبوطة. أضف RESEND_API_KEY (للإيميل) في إعدادات Netlify ثم أعد النشر.",
    });
  }
  const label = { email: "الإيميل", telegram: "تليجرام" } as const;
  const message = results
    .map((r) => (r.ok ? `✅ ${label[r.channel]}: تم الإرسال` : `❌ ${label[r.channel]}: فشل (${r.error || "خطأ"})`))
    .join(" · ");
  return NextResponse.json({ ok: results.every((r) => r.ok), results, message });
}
