import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getSiteSettings, getTexts } from "@/lib/content";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0e3b39",
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: {
      default: `${site.name} | ${site.phone} | سباكة 24 ساعة`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      locale: "ar_KW",
      type: "website",
      title: site.name,
      description: site.description,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: site.name,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, texts] = await Promise.all([getSiteSettings(), getTexts()]);
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: site.name,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KW",
      addressLocality: "الكويت",
    },
    openingHours: "Mo-Su 00:00-23:59",
    areaServed: "Kuwait",
  })
    // منع كسر وسم <script> لو احتوت بيانات الأدمن (الاسم/الهاتف/الإيميل) على "</script>"
    // أو تسلسلات HTML أخرى قابلة للاستغلال داخل سياق <script>.
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Header
          initialData={{
            name: site.name,
            logoUrl: site.logoUrl,
            phone: site.phone,
            tagline: site.tagline,
            texts,
          }}
        />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
