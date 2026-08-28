import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // مقصورة على مزوّدي التخزين المستخدمين فعليًا في المشروع (Vercel Blob / Cloudinary)
    // بدل السماح بأي دومين "**" اللي ممكن يُستغل كـ open image proxy / SSRF بسيط.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
