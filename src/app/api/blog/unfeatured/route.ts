import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { afterBlogChange } from "@/lib/indexnow";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin.from("blog_posts").update({ featured: false }).eq("featured", true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await afterBlogChange(null);
  return NextResponse.json({ success: true });
}
