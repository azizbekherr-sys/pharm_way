import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Duplicate (thin, untranslated) blog post slug -> original full article slug.
const DUPLICATE_POSTS = {
  "bojxona-rasmiylashtiruvi-xatolar": "customs-mistakes",
  "markaziy-osiyo-farmatsevtika-bozori-2025": "central-asia-pharma-2025",
  "gmp-sertifikati-nima-uchun-muhim": "gmp-certificate-guide",
  "ozbekistonda-dori-vositalarini-royxatdan-otkazish-2024": "ozbekistonda-dori-vositalarini-royxatdan-otkazish",
  "farmatsevtik-mahsulotlarni-import-qilish-hujjatlar": "import-documents",
  "bfq-registratsiyasi-qancha-vaqt-oladi": "bfq-registration-guide",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal self-contained server build (cPanel Node.js App or Docker).
  output: "standalone",
  // IMAP/pochta kutubxonalari webpack bilan to'planmasdan node_modules'dan yuklansin.
  experimental: {
    serverComponentsExternalPackages: ["imapflow", "mailparser", "nodemailer"],
  },
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
        statusCode: 301,
      },
      // Old "Fikrlar" page (no testimonials in the new design) -> About.
      // In next.config (not permanentRedirect() in the page): a statically
      // prerendered page redirect is served as 308 without a Location header.
      { source: "/testimonials", destination: "/uz/about", statusCode: 301 },
      {
        source: "/:locale(uz|ru|en)/testimonials",
        destination: "/:locale/about",
        statusCode: 301,
      },
      // Certification is not a Pharm Way service (removed 2026-11-21).
      {
        source: "/:locale(uz|ru|en)/services/certification",
        destination: "/:locale/services",
        statusCode: 301,
      },
      // Short Uzbek-slug copies of existing articles (unpublished 2026-11-21) —
      // their URLs pass ranking signals to the full, translated originals.
      ...Object.entries(DUPLICATE_POSTS).map(([from, to]) => ({
        source: `/:locale(uz|ru|en)/blog/${from}`,
        destination: `/:locale/blog/${to}`,
        statusCode: 301,
      })),
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
      // API javoblari (murojaatlar, pochta, statistika) hech qayerda keshlanmasin.
      // Cache-Control bo'lmasa, AHOST'dagi nginx (Engintron) javobni bir necha
      // soniya saqlab, login qilmagan so'rovlarga ham berib yuborardi
      // (2026-11-23 da /api/contact bilan tekshirib topilgan).
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
