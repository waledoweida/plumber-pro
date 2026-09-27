// أدوات مشتركة لإحصائيات الزيارات
export const EVENT_TYPES = ["view", "whatsapp", "phone"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

// توقيت الكويت UTC+3 (بدون توقيت صيفي)
const KW_OFFSET_MS = 3 * 60 * 60 * 1000;

export function kuwaitDay(d: Date): string {
  return new Date(d.getTime() + KW_OFFSET_MS).toISOString().slice(0, 10);
}

// بداية يوم الكويت قبل (days - 1) يوم
export function kuwaitRangeStart(days: number, now = new Date()): Date {
  const day = kuwaitDay(now);
  const midnight = new Date(`${day}T00:00:00.000Z`).getTime() - KW_OFFSET_MS;
  return new Date(midnight - (days - 1) * 24 * 60 * 60 * 1000);
}

// زواحف ومحركات بحث وأدوات آلية — ما نعدّهاش زيارة
const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|facebookcatalog|meta-externalagent|whatsapp|telegram|preview|scan|monitor|lighthouse|pagespeed|gtmetrix|pingdom|uptime|headless|phantom|puppeteer|playwright|selenium|curl|wget|python|java\/|go-http|node-fetch|axios|okhttp|httpclient|libwww|semrush|ahrefs|mj12|dotbot|petalbot|yandex|baidu|bytespider|gptbot|chatgpt|claude|anthropic|perplexity|ccbot|applebot|duckduck/i;

export function isBot(ua: string): boolean {
  return !ua || ua.length < 20 || BOT_RE.test(ua);
}
