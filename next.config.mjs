import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal self-contained server build (cPanel Node.js App or Docker).
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // WebP only: AVIF encoding is several times more CPU-heavy, which trips
    // shared-hosting (CloudLinux) CPU limits.
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  // Canonical host is www (src/lib/seo.ts). Done in the app so it works the
  // same behind any web server (cPanel/Passenger, Caddy, ...).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "pharmway\\.uz" }],
        destination: "https://www.pharmway.uz/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/:path*.(jpg|jpeg|png|svg|ico|webp|avif)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
