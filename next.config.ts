import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Resolve workspace root warning from nested lockfiles
  outputFileTracingRoot: __dirname,

  images: {
    // Serve AVIF first (smaller), fall back to WebP. Both are supported by all
    // modern browsers. This applies to images processed by next/image (remote
    // images from Vercel Blob and Supabase storage, and any local images).
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        // Vercel Blob storage
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        // Supabase storage (if used)
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // Silence the Prisma edge runtime warning in Next.js 15
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "bcryptjs"],
};

export default nextConfig;
