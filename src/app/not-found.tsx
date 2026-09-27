import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
};

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl font-bold text-brand-700">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mt-4">ما لقينا هالصفحة</h1>
      <p className="text-slate-600 mt-2">يمكن الرابط تغيّر. هذي صفحات ممكن تفيدك:</p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link href="/" className="btn-primary text-white font-bold px-5 py-3 rounded-md">الرئيسية</Link>
        <Link href="/services" className="border border-brand-300 text-brand-800 font-bold px-5 py-3 rounded-md">الخدمات</Link>
        <Link href="/contact" className="border border-brand-300 text-brand-800 font-bold px-5 py-3 rounded-md">كلّمنا</Link>
      </div>
    </div>
  );
}
