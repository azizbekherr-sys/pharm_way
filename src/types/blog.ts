export type BlogPostData = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: string;
  image: string | null;
  views: number;
};
