import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-700">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mt-4">This page doesn&apos;t exist</h1>
      <p className="text-slate-600 mt-2">It may have moved or been removed. Try one of these:</p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link href="/en" className="bg-brand-700 text-white font-bold px-5 py-3 rounded-xl">Home</Link>
        <Link href="/en/services" className="border border-brand-300 text-brand-800 font-bold px-5 py-3 rounded-xl">Services</Link>
        <Link href="/en/contact" className="border border-brand-300 text-brand-800 font-bold px-5 py-3 rounded-xl">Contact</Link>
      </div>
    </div>
  );
}
