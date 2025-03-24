/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.microcms-assets.io"], // MicroCMSの画像ホストを許可
      },
      env: {
        NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
        NEXT_PUBLIC_MICROCMS_API_KEY: process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
      },
      trailingSlash: false,
};

export default nextConfig;
