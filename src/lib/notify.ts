/**
 * تنبيه فوري عند وصول طلب جديد من العميل (بالإضافة لحفظه في قاعدة البيانات ولوحة الأدمن):
 *  - إيميل عبر Resend: يحتاج RESEND_API_KEY، والإيميل يوصل على NOTIFY_EMAIL (أو إيميل الموقع من الإعدادات)
 *  - تليجرام: يحتاج TELEGRAM_BOT_TOKEN و TELEGRAM_CHAT_ID
 *
 * اختياري: لو متغيرات البيئة مش مضبوطة، بيتم تجاهله بصمت بدون ما يفشل حفظ الطلب.
 */
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { BRAND } from "./brand";

export type LeadNotifyInput = {
  id: string;
  name: string;
  phone: string;
  area?: string;
  service?: string;
  message?: string;
};

export type NotifyResult = { channel: "email" | "telegram"; ok: boolean; error?: string };

function buildMessage(lead: LeadNotifyInput): string {
  const lines = [
    `🔔 طلب جديد - ${BRAND.nameAr}`,
    `الاسم: ${lead.name}`,
    `الهاتف: ${lead.phone}`,
  ];
  if (lead.area) lines.push(`المنطقة: ${lead.area}`);
  if (lead.service) lines.push(`الخدمة: ${lead.service}`);
  if (lead.message) lines.push(`الرسالة: ${lead.message}`);
  return lines.join("\n");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// رقم العميل بصيغة واتساب: 8 أرقام كويتية → 965XXXXXXXX
function waNumberOf(phone: string) {
  const d = phone.replace(/\D/g, "").replace(/^00/, "");
  return d.length === 8 ? "965" + d : d;
}

function buildEmailHtml(lead: LeadNotifyInput): string {
  const row = (k: string, v?: string) =>
    v
      ? `<tr><td style="padding:8px 12px;color:#64748b;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 12px;color:#0f172a;font-weight:600">${esc(v).replace(/\n/g, "<br>")}</td></tr>`
      : "";
  const wa = waNumberOf(lead.phone);
  const btn = (href: string, bg: string, fg: string, label: string) =>
    `<a href="${href}" style="display:inline-block;background:${bg};color:${fg};text-decoration:none;font-weight:700;padding:12px 20px;border-radius:12px;margin:4px">${label}</a>`;
  return `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#f2f5f9;font-family:Tahoma,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
  <div style="background:#0a172c;color:#fff;border-radius:16px 16px 0 0;padding:18px 20px;font-size:18px;font-weight:700">🔔 طلب جديد من الموقع</div>
  <div style="background:#fff;border-radius:0 0 16px 16px;padding:8px 8px 20px">
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      ${row("الاسم", lead.name)}${row("الهاتف", lead.phone)}${row("المنطقة", lead.area)}${row("الخدمة", lead.service)}${row("الرسالة", lead.message)}
    </table>
    <div style="text-align:center;padding-top:12px">
      ${btn(`tel:${esc(lead.phone)}`, "#15803d", "#fff", "📞 اتصل بالعميل")}
      ${btn(`https://wa.me/${wa}`, "#25D366", "#0a172c", "💬 واتساب العميل")}
    </div>
    <p style="text-align:center;margin:16px 0 0;font-size:13px"><a href="${SITE_URL}/admin" style="color:#15803d">افتح لوحة التحكم</a></p>
  </div>
</div></body></html>`;
}

/** إيميل عبر Resend (https://resend.com): يحتاج RESEND_API_KEY */
async function notifyEmail(lead: LeadNotifyInput): Promise<NotifyResult | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  let to = (process.env.NOTIFY_EMAIL || "").trim();
  if (!to) {
    const s = await prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null);
    to = s?.email || "";
  }
  if (!to) return { channel: "email", ok: false, error: "no NOTIFY_EMAIL" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || `${BRAND.nameEn} <onboarding@resend.dev>`,
        to: to.split(",").map((x) => x.trim()).filter(Boolean),
        subject: `طلب جديد: ${lead.name}${lead.service ? " — " + lead.service : ""}${lead.area ? " — " + lead.area : ""}`,
        html: buildEmailHtml(lead),
        text: buildMessage(lead),
      }),
    });
    if (!res.ok) {
      const error = `${res.status} ${(await res.text()).slice(0, 300)}`;
      console.error("email notify failed:", error);
      return { channel: "email", ok: false, error };
    }
    return { channel: "email", ok: true };
  } catch (e: any) {
    console.error("email notify error:", e);
    return { channel: "email", ok: false, error: String(e?.message || e) };
  }
}

/** تليجرام: يحتاج TELEGRAM_BOT_TOKEN (من BotFather) و TELEGRAM_CHAT_ID */
async function notifyTelegram(lead: LeadNotifyInput): Promise<NotifyResult | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(lead),
      }),
    });
    if (!res.ok) {
      const error = `${res.status} ${(await res.text()).slice(0, 300)}`;
      console.error("telegram notify failed:", error);
      return { channel: "telegram", ok: false, error };
    }
    return { channel: "telegram", ok: true };
  } catch (e: any) {
    console.error("telegram notify error:", e);
    return { channel: "telegram", ok: false, error: String(e?.message || e) };
  }
}

/** يرجّع نتيجة كل قناة مضبوطة (فاضي = ولا قناة مضبوطة). ما يرمي أخطاء أبدًا. */
export async function notifyNewLead(lead: LeadNotifyInput): Promise<NotifyResult[]> {
  const all = await Promise.allSettled([notifyEmail(lead), notifyTelegram(lead)]);
  return all.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []));
}
