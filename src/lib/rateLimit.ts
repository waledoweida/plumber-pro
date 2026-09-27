import { prisma } from "./prisma";

/**
 * يستهلك "حصة" من حد معدل الطلبات لمفتاح معيّن (مثلاً IP + نوع العملية).
 * مخزّن في قاعدة البيانات بدل الذاكرة، حتى يبقى فعّال حتى لو السيرفر
 * أعاد التشغيل أو كان يشتغل على بيئة serverless (Vercel/Netlify) بتعمل
 * cold start لكل instance جديد.
 *
 * يرجع true لو مسموح بالطلب، وfalse لو تجاوز الحد.
 */
export async function consumeRateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<boolean> {
  const now = new Date();
  try {
    const row = await prisma.rateLimit.findUnique({ where: { id: key } });

    if (!row || row.resetAt < now) {
      // نافذة جديدة: أنشئ/صفّر العداد
      await prisma.rateLimit.upsert({
        where: { id: key },
        update: { count: 1, resetAt: new Date(now.getTime() + windowMs) },
        create: { id: key, count: 1, resetAt: new Date(now.getTime() + windowMs) },
      });
      return true;
    }

    if (row.count >= max) return false;

    await prisma.rateLimit.update({
      where: { id: key },
      data: { count: { increment: 1 } },
    });
    return true;
  } catch (e) {
    // فشل آمن: لو قاعدة البيانات غير متاحة مؤقتًا، ما نمنعش الطلب بالكامل
    // (غالبًا لو قاعدة البيانات نازلة، عمليات ثانية زي حفظ الطلب هتفشل أصلاً)
    console.error("rateLimit error:", e);
    return true;
  }
}
