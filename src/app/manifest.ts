import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pharm Way Group — BFQ va dori vositalari registratsiyasi",
    short_name: "Pharm Way",
    description:
      "O'zbekistonda BFQ, dori vositalari va tibbiy buyumlarni import qilish va ro'yxatdan o'tkazish bo'yicha regulatory xizmatlar.",
    start_url: "/uz",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1B3A6B",
    lang: "uz",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
