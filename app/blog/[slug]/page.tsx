import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import BlogHero from "./blog-hero"; // Import component vừa tạo

export const dynamic = "force-dynamic";

// Giữ lại các Type và function lấy dữ liệu ở đây
type BlogRow = {
  PostID: number;
  PostSlug: string;
  Title: string;
  Excerpt: string | null;
  Content: string | null;
  Image: string | null;
  AuthorName: string | null;
  Category: string | null;
  PublishedDate: string | null;
  Status: string | null;
};

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

async function getPost(slug: string): Promise<BlogRow | null> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select("*")
    .eq("PostSlug", slug)
    .eq("Status", "Published")
    .single();
  if (error || !data) return null;
  return data as BlogRow;
}

async function getRelated(category: string | null, excludeId: number) {
  if (!category) return [];
  const { data } = await supabase
    .from("BlogPosts")
    .select("PostID, PostSlug, Title, Excerpt, Image, PublishedDate, Category")
    .eq("Status", "Published")
    .eq("Category", category)
    .neq("PostID", excludeId)
    .order("PublishedDate", { ascending: false })
    .limit(3);
  return data ?? [];
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // <— await params
  const post = await getPost(slug);
  if (!post) return notFound();

  const related = await getRelated(post.Category, post.PostID);

  return (
    <div className="min-h-screen bg-background">
      {/* Sử dụng BlogHero component và truyền dữ liệu post vào */}
      <BlogHero post={post} />

      {/* NỘI DUNG */}
      <main className="container mx-auto px-4 max-w-3xl py-8 md:py-10">
        {post.Excerpt && (
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {post.Excerpt}
          </p>
        )}
        {post.Content ? (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.Content }}
          />
        ) : (
          <p className="text-muted-foreground">Bài viết chưa có nội dung.</p>
        )}
      </main>

      {/* BÀI LIÊN QUAN */}
      {related.length > 0 && (
        <aside className="container mx-auto px-4 max-w-5xl pb-14">
          <h2 className="text-2xl font-bold mb-6">Bài liên quan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Card
                key={r.PostID}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={r.Image || "/placeholder.svg"}
                    alt={r.Title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  {r.Category && (
                    <Badge variant="secondary" className="mb-2">
                      {r.Category}
                    </Badge>
                  )}
                  <h3 className="font-semibold line-clamp-2">{r.Title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fmtDate(r.PublishedDate)}
                  </p>
                  <Button variant="link" size="sm" asChild className="p-0 mt-2">
                    <Link href={`/blog/${r.PostSlug}`}>Đọc tiếp →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

