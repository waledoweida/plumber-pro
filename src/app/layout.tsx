import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import MobileCallBar from "@/components/MobileCallBar";
import ScrollTop from "@/components/ScrollTop";
import Tracker from "@/components/Tracker";
import { getSiteSettings, getTexts, getAreas } from "@/lib/content";
import { getLocale } from "@/lib/locale";
import { SITE_URL, BUSINESS_ID, intlPhone, jsonLd as toJsonLd } from "@/lib/seo";

// subsets = اللي ينحمّل مسبقًا بس (العربي)؛ الحروف اللاتينية تنحمّل وقت الحاجة. 3 أوزان بس عشان سرعة الموبايل
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex",
  display: "swap",
  weight: ["400", "600", "700"],
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e338a",
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} | ${site.phone} | سباكة 24 ساعة`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [
      "سباك الكويت","سباك معتمد الكويت","فني صحي الكويت","تسليك مجاري الكويت","تسليك بلاليع",
      "كشف تسربات بدون تكسير","كشف تهريب الماي","تأسيس حمامات الكويت","تجديد حمامات",
      "تركيب سخانات الكويت","تصليح سخان","ماطور ماي الكويت","مضخات مياه","تمديد مواسير PPR",
      "سباك حولي","سباك السالمية","سباك الفروانية","سباك الأحمدي","سباك الجهراء","سباك العاصمة",
    ],
    openGraph: {
      locale: "ar_KW",
      type: "website",
      title: site.name,
      description: site.description,
    
    },
    // تأكيد ملكية الموقع في Google Search Console: ضع الكود في متغير GOOGLE_SITE_VERIFICATION على Netlify
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: site.name,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, texts, areas, locale] = await Promise.all([getSiteSettings(), getTexts(), getAreas(), getLocale()]);
  // بيانات الشركة لجوجل (Local Business) — toJsonLd بيمنع كسر وسم <script> لو البيانات فيها "</script>"
  const jsonLd = toJsonLd([
    {
      "@context": "https://schema.org",
      "@type": "Plumber",
      "@id": BUSINESS_ID,
      name: site.name,
      description: site.description,
      url: SITE_URL,
      telephone: intlPhone(site.phone),
      email: site.email,
      image: `${SITE_URL}/og/default.jpg`,
      logo: site.logoUrl || `${SITE_URL}/icon`,
      address: { "@type": "PostalAddress", addressCountry: "KW", addressLocality: "الكويت" },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      areaServed: [
        { "@type": "Country", name: "Kuwait" },
        ...areas.map((a) => ({ "@type": "City", name: a.title })),
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: intlPhone(site.whatsapp || site.phone),
        contactType: "customer service",
        availableLanguage: ["Arabic", "English"],
        areaServed: "KW",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: SITE_URL,
      name: site.name,
      inLanguage: "ar",
      publisher: { "@id": BUSINESS_ID },
    },
  ]);

  return (
    <html lang={locale === "en" ? "en-KW" : "ar-KW"} dir={locale === "en" ? "ltr" : "rtl"} className={plex.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f7f9fc] text-slate-900 antialiased pb-[4.5rem] sm:pb-0">
        <Header
          initialData={{
            name: site.name,
            logoUrl: site.logoUrl,
            phone: site.phone,
            whatsapp: site.whatsapp,
            tagline: site.tagline,
            texts,
          }}
        />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingButtons />
        <ScrollTop />
        <Tracker />
        <MobileCallBar phone={site.phone} whatsapp={site.whatsapp} />
      </body>
    </html>
  );
}
