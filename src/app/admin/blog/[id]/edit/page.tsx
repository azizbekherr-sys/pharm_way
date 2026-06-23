import { supabaseAdmin } from "@/lib/supabase-admin";
import BlogForm from "@/components/admin/BlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const { data: post } = await supabaseAdmin.from("blog_posts").select("*").eq("id", params.id).single();
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Maqolani tahrirlash</h1>
      <BlogForm
        initial={{
          id: post.id,
          title: post.title,
          titleRu: post.title_ru ?? "",
          titleEn: post.title_en ?? "",
          slug: post.slug,
          category: post.category,
          readTime: post.read_time ?? 5,
          excerpt: post.excerpt ?? "",
          excerptRu: post.excerpt_ru ?? "",
          excerptEn: post.excerpt_en ?? "",
          content: post.content,
          contentRu: post.content_ru ?? "",
          contentEn: post.content_en ?? "",
          published: post.published,
          featured: post.featured ?? false,
          coverImage: post.cover_image ?? "",
          tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
        }}
      />
    </div>
  );
}
