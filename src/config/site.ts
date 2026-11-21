export const siteConfig = {
  name: "Pharm Way Group",
  phone: "+998 93 062 41 49",
  phoneHref: "tel:+998930624149",
  telegram: "https://t.me/+998930624149",
  whatsapp: "https://wa.me/998930624149",
  email: "info@pharmway.uz",
  address: {
    uz: "Toshkent sh., Shayxontohur tumani, Jangoh dahasi, 10-uy, 1-kirish",
    ru: "г. Ташкент, Шайхантахурский район, массив Джангох, дом 10, подъезд 1",
    en: "10 Jangoh (C-15) Block, Entrance 1, Shaykhontohur District, Tashkent",
  },
  postalCode: "100128",
  // Ofis joylashuvi (Yandex xaritadagi nuqta: Jangoh dahasi, 10, 1-kirish).
  geo: { lat: 41.327467, lng: 69.251887 },
  maps: {
    yandex: "https://yandex.uz/maps/-/CXW1Q2NL",
    google: "https://www.google.com/maps/search/?api=1&query=41.327467%2C69.251887",
    twoGis: "https://2gis.uz/tashkent/geo/69.251887%2C41.327467",
  },
  mapEmbedUrl:
    "https://yandex.uz/map-widget/v1/?ll=69.251887%2C41.327467&z=17&pt=69.251887%2C41.327467%2Cpm2rdm",
};

export const services = [
  { slug: "bfq-registration", icon: "Leaf" },
  { slug: "certification", icon: "Award" },
  { slug: "import-logistics", icon: "Truck" },
  { slug: "customs", icon: "FileText" },
  { slug: "regulatory-consulting", icon: "BarChart" },
  { slug: "distributor-search", icon: "Search" },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];

export const blogCategories = ["all", "registration", "import", "baa", "medicalDevices", "regulatory", "news"] as const;
export type BlogCategory = Exclude<(typeof blogCategories)[number], "all">;

export const BLOG_CATEGORY_STYLES: Record<BlogCategory, string> = {
  registration: "bg-primary-50 text-primary-700",
  import: "bg-secondary-50 text-secondary-700",
  baa: "bg-amber-50 text-amber-700",
  medicalDevices: "bg-sky-50 text-sky-700",
  regulatory: "bg-violet-50 text-violet-700",
  news: "bg-rose-50 text-rose-700",
};

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&h=506&fit=crop&q=80`;

export const blogPosts = [
  {
    slug: "ozbekistonda-dori-vositalarini-royxatdan-otkazish",
    category: "registration",
    image: UNSPLASH("1576091160550-2173dba999ef"),
    views: 3240,
  },
  {
    slug: "bfq-registration-guide",
    category: "baa",
    image: UNSPLASH("1471864190281-a93a3070b6de"),
    views: 1850,
  },
  {
    slug: "import-documents",
    category: "import",
    image: UNSPLASH("1631549916768-4119b2e5f926"),
    views: 2120,
  },
  {
    slug: "central-asia-pharma-2025",
    category: "news",
    image: UNSPLASH("1576602976047-174e57a47881"),
    views: 980,
  },
  {
    slug: "gmp-certificate-guide",
    category: "regulatory",
    image: UNSPLASH("1576671081837-49000212a370"),
    views: 1540,
  },
  {
    slug: "medical-devices-registration",
    category: "registration",
    image: UNSPLASH("1538108149393-fbbd81895907"),
    views: 2670,
  },
  {
    slug: "customs-mistakes",
    category: "import",
    image: UNSPLASH("1587854692152-cbe660dbde88"),
    views: 1320,
  },
] as const satisfies readonly { slug: string; category: BlogCategory; image: string; views: number }[];

export type BlogSlug = (typeof blogPosts)[number]["slug"];

export const testimonialCategories = ["all", "manufacturers", "distributors", "international", "local"] as const;
export type TestimonialCategory = Exclude<(typeof testimonialCategories)[number], "all">;

export const certificateCategories = ["all", "registration", "gmp", "iso", "license"] as const;
export type CertificateCategory = Exclude<(typeof certificateCategories)[number], "all">;

export const CERTIFICATE_CATEGORY_STYLES: Record<CertificateCategory, string> = {
  registration: "bg-primary-50 text-primary-700",
  gmp: "bg-secondary-50 text-secondary-700",
  iso: "bg-violet-50 text-violet-700",
  license: "bg-amber-50 text-amber-700",
};

export const TESTIMONIAL_AVATAR_GRADIENTS = [
  "from-primary-500 to-primary-700",
  "from-secondary-500 to-secondary-700",
  "from-amber-400 to-amber-600",
  "from-violet-500 to-violet-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
];
