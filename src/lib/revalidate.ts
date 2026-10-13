import { revalidatePath } from "next/cache";

// الصفحات العامة متخزّنة كاش (revalidate = ساعة). أي تعديل ناجح من لوحة التحكم
// بيمسح الكاش عشان التغيير يظهر فورًا بدل ما يستنى لحد ما الساعة تخلص.
export function revalidating<A extends unknown[]>(handler: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    const res = await handler(...args);
    if (res.ok) {
      revalidatePath("/", "layout");
      revalidatePath("/en", "layout");
      revalidatePath("/sitemap.xml");
      revalidatePath("/icon");
      revalidatePath("/apple-icon");
    }
    return res;
  };
}
