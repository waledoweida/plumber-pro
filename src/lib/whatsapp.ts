// روابط واتساب برسالة جاهزة حسب الصفحة
export const waNumber = (n: string) => {
  const d = String(n || "").replace(/\D/g, "");
  return d.startsWith("965") ? d : `965${d}`;
};

export const waLink = (number: string, text?: string) =>
  `https://wa.me/${waNumber(number)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// «خدمات تسليك المجاري» → «تسليك المجاري»
export const serviceShort = (title: string) => title.replace(/^خدمات\s+/, "").trim();

export const WA_DEFAULT = "هلا، عندي مشكلة سباكة وأبي فني يمرني";
export const waForService = (title: string) => `هلا، أبي أسأل عن ${serviceShort(title)}`;
export const waForArea = (area: string) => `هلا، أنا ب${area} وأبي سباك يمرني`;
export const waForServiceArea = (title: string, area: string) =>
  `هلا، أبي ${serviceShort(title)} ب${area}`;

// صيغة البحث: «السخانات» → «سخانات»، «تسليك المجاري» → «تسليك مجاري»
export const searchForm = (title: string) =>
  serviceShort(title)
    .split(/\s+/)
    .map((w) => w.replace(/^وال/, "و").replace(/^ال(?=\S{2,})/, ""))
    .join(" ");
export const waForArticle = (title: string) => `هلا، شفت موضوع «${title}» بموقعكم وعندي سؤال`;
