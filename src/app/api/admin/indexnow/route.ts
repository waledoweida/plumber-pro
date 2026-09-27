import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { submitIndexNow } from "@/lib/indexnow";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo";

// زر «بلّغ محركات البحث»: يرسل كل روابط خريطة الموقع لـ IndexNow (Bing وغيره)
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await sitemap();
  const paths = entries.map((e) => decodeURIComponent(e.url.replace(SITE_URL, "")) || "/");
  const status = await submitIndexNow(paths);
  const ok = status !== null && status >= 200 && status < 300;
  return NextResponse.json(
    ok
      ? { ok, count: paths.length, message: `تم إبلاغ محركات البحث بـ ${paths.length} صفحة` }
      : { ok, status, message: status === null ? "تعذّر الاتصال بـ IndexNow" : `رد IndexNow: ${status}` },
    { status: ok ? 200 : 502 }
  );
}
