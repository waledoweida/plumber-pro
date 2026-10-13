import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL } from "@/lib/seo";
import NotFound from "./(ar)/not-found";

// أي رابط مش موجود خالص (مع وجود layout للعربي وlayout للإنجليزي ما فيش layout عام يلفّه)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "الصفحة غير موجودة",
};

export default function GlobalNotFound() {
  return (
    <RootShell locale="ar">
      <NotFound />
    </RootShell>
  );
}
