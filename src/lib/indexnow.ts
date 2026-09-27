import { SITE_URL } from "./seo";

// IndexNow: يبلّغ Bing و Yandex و Seznam وغيرهم فورًا بأي صفحة جديدة أو محدّثة.
// المفتاح عام بطبيعته ولازم يكون موجود كملف على الموقع: public/<KEY>.txt
export const INDEXNOW_KEY = "308786040e4d0aae8fe1d280159da8aa";

export async function submitIndexNow(paths: string[]): Promise<number | null> {
  if (process.env.NODE_ENV !== "production" || !paths.length) return null;
  const host = new URL(SITE_URL).host;
  try {
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map((p) => SITE_URL + p.split("/").map(encodeURIComponent).join("/")),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return r.status;
  } catch (e) {
    console.error("indexnow", e);
    return null;
  }
}
