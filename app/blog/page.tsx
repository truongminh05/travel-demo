// app/blog/page.tsx
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

export const dynamic = "force-dynamic";

type BlogRow = {
  PostID: number;
  PostSlug: string;
  Title: string;
  Excerpt: string | null;
  Image: string | null;
  AuthorName: string | null;
  Category: string | null;
  PublishedDate: string | null;
  IsFeatured: boolean | null;
  ReadTimeMinutes?: number | null;
};

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

async function getAllPublished(): Promise<BlogRow[]> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select(
      "PostID, PostSlug, Title, Excerpt, Image, AuthorName, Category, PublishedDate, IsFeatured, ReadTimeMinutes, Status"
    )
    .eq("Status", "Published")
    .order("PublishedDate", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BlogRow[];
}

export default async function BlogPage({
  searchParams,
}: {
  // searchParams là Promise
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ⬇️ await rồi rút ra category (xử lý cả trường hợp mảng)
  const sp = await searchParams;
  const selected =
    typeof sp?.category === "string"
      ? sp.category
      : Array.isArray(sp?.category)
      ? sp.category[0]
      : undefined;

  const all = await getAllPublished();

  const filtered = selected ? all.filter((p) => p.Category === selected) : all;

  const featured =
    !selected && (all.find((p) => p.IsFeatured) || all[0] || null);

  const rest =
    featured && !selected
      ? filtered.filter((p) => p.PostID !== featured.PostID)
      : filtered;

  const counts = BLOG_CATEGORIES.map((name) => ({
    name,
    count: all.filter((p) => p.Category === name).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4">
              Blog Du lịch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Câu chuyện & Mẹo từ chuyên gia
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Khám phá bí quyết, cẩm nang theo mùa và điểm đến nổi bật từ các
              chuyên gia du lịch. Truyền cảm hứng cho hành trình Mỹ tiếp theo
              của bạn.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input placeholder="Tìm kiếm bài viết..." className="flex-1" />
                <Button>Tìm kiếm</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured (ẩn nếu đang lọc) */}
        {!selected && featured && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <Badge className="mb-4">Bài viết nổi bật</Badge>
                <h2 className="text-3xl font-bold text-foreground">
                  Biên tập viên chọn
                </h2>
              </div>

              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] lg:aspect-auto">
                    <Image
                      src={featured.Image || "/placeholder.svg"}
                      alt={featured.Title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    {featured.Category && (
                      <Badge variant="outline" className="w-fit mb-4">
                        {featured.Category}
                      </Badge>
                    )}
                    <h3 className="text-2xl font-bold text-foreground mb-4 text-balance">
                      {featured.Title}
                    </h3>
                    {featured.Excerpt && (
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {featured.Excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Image
                          src={"/placeholder.svg"}
                          alt={featured.AuthorName || "Author"}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-sm font-medium">
                          {featured.AuthorName || "Tác giả"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{fmtDate(featured.PublishedDate)}</span>
                        </div>
                        {featured.ReadTimeMinutes ? (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{featured.ReadTimeMinutes} phút đọc</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <Button asChild className="w-fit">
                      <Link href={`/blog/${featured.PostSlug}`}>
                        Đọc bài viết
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Grid + Sidebar */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar danh mục */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Danh mục</h3>
                    <div className="space-y-2">
                      <Link
                        href="/blog"
                        className={`w-full block text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          !selected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Tất cả bài viết</span>
                          <span className="text-xs">{all.length}</span>
                        </div>
                      </Link>

                      {counts.map(({ name, count }) => {
                        const isActive = selected === name;
                        return (
                          <Link
                            key={name}
                            href={{
                              pathname: "/blog",
                              query: { category: name },
                            }}
                            className={`w-full block text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{name}</span>
                              <span className="text-xs">{count}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter giữ nguyên */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Nhận tin mới</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nhận mẹo du lịch và cẩm nang điểm đến mới nhất qua email.
                    </p>
                    <div className="space-y-2">
                      <Input placeholder="Địa chỉ email của bạn" type="email" />
                      <Button className="w-full" size="sm">
                        Đăng ký
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lưới bài viết */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">
                    {selected ? `Bài viết: ${selected}` : "Bài viết mới nhất"}
                  </h2>
                  <p className="text-muted-foreground">
                    {rest.length} bài viết
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {rest.map((post) => (
                    <Card
                      key={post.PostID}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={post.Image || "/placeholder.svg"}
                          alt={post.Title}
                          fill
                          className="object-cover"
                        />
                        {post.Category && (
                          <div className="absolute top-4 left-4">
                            <Badge
                              variant="secondary"
                              className="bg-background/90 text-foreground"
                            >
                              {post.Category}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 text-balance line-clamp-2">
                          {post.Title}
                        </h3>
                        {post.Excerpt && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                            {post.Excerpt}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <Image
                            src={"/placeholder.svg"}
                            alt={post.AuthorName || "Author"}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-xs font-medium">
                            {post.AuthorName || "Tác giả"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{fmtDate(post.PublishedDate)}</span>
                            </div>
                            {post.ReadTimeMinutes ? (
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                <span>{post.ReadTimeMinutes} phút đọc</span>
                              </div>
                            ) : null}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.PostSlug}`}>
                              Đọc tiếp
                              <ArrowRightIcon className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent"
                  >
                    Xem thêm bài viết
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA giữ nguyên */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sẵn sàng biến cảm hứng thành chuyến đi?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-balance">
              Khám phá các tour chọn lọc của chúng tôi và bắt đầu lên kế hoạch
              cho hành trình Mỹ đáng nhớ tiếp theo.
            </p>
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
              asChild
            >
              <Link href="/#tours">Khám phá Tour</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
