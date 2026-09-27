import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // رقم الإصدار (commit) يظهر في لوحة التحكم — للتأكد إن آخر تحديث اتنشر
  env: {
    NEXT_PUBLIC_COMMIT: (process.env.COMMIT_REF || process.env.GITHUB_SHA || "local").slice(0, 7),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // المتصفحات وجوجل بيطلبوا /favicon.ico مباشرة — نوجّههم للأيقونة
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
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
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
