export type BlogPostData = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  /** Oxirgi tahrir sanasi (ISO) — sitemap va schema dateModified uchun. */
  updatedAt: string;
  readTime: string;
  tags: string[];
  content: string;
  image: string | null;
  views: number;
  /** Maqolaning to'liq matni mavjud tillar (uz har doim; ru/en — tarjima bo'lsa). */
  locales: string[];
};
