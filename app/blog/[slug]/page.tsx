import { notFound } from "next/navigation";
import {
  CalendarIcon,
  ClockIcon,
  ShareIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  TagIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import Link from "next/link";

// Dữ liệu blog mẫu - trong ứng dụng thật sẽ lấy từ CMS hoặc cơ sở dữ liệu
const blogPosts = {
  "ultimate-guide-national-parks-2024": {
    slug: "ultimate-guide-national-parks-2024",
    title: "Hướng dẫn đầy đủ về các Công viên Quốc gia Mỹ năm 2024",
    excerpt:
      "Khám phá thời điểm tốt nhất để ghé thăm, những điểm ít người biết và các mẹo nội bộ để khám phá công viên quốc gia tuyệt đẹp của Mỹ trong năm nay.",
    content: `
      <p>Công viên quốc gia Mỹ là những báu vật thể hiện sự đa dạng đáng kinh ngạc của thiên nhiên. Từ những đỉnh núi hùng vĩ của Dãy Rocky đến những hình thù kỳ lạ của miền Tây Nam, mỗi công viên đều mang lại trải nghiệm độc đáo.</p>

      <h2 id="planning">Lập kế hoạch chuyến đi công viên quốc gia</h2>
      <p>Chìa khóa cho một chuyến đi thành công là chuẩn bị kỹ lưỡng. Mùa cao điểm thay đổi tùy từng nơi, nhưng nhìn chung mùa hè có đông khách nhất. Nếu muốn yên tĩnh, hãy đến vào mùa xuân hoặc mùa thu khi thời tiết vẫn đẹp và ít người hơn.</p>

      <h3 id="timing">Thời điểm tốt nhất để ghé thăm</h3>
      <ul>
        <li><strong>Yellowstone:</strong> Tháng 5–9 để tham quan toàn bộ, mùa xuân và thu thì lý tưởng để ngắm động vật hoang dã</li>
        <li><strong>Grand Canyon:</strong> Tháng 3–5 và 9–11 với thời tiết dễ chịu</li>
        <li><strong>Yosemite:</strong> Tháng 4–10, thác nước đẹp nhất vào cuối mùa xuân</li>
        <li><strong>Great Smoky Mountains:</strong> Tháng 4–5 có hoa dại, tháng 10 lá vàng đẹp</li>
      </ul>

      <h2 id="hidden-gems">Điểm ẩn ít người biết</h2>
      <p>Ngoài những điểm nổi tiếng, bạn hãy thử khám phá các cung đường ít người đi theo gợi ý của kiểm lâm hoặc dân địa phương.</p>

      <h3>Mẹo nội bộ theo từng khu vực</h3>
      <p><strong>Khu vực miền Tây:</strong> Đi sớm để tránh đông và nắng gắt buổi chiều. Nhớ mang theo áo khoác vì thời tiết vùng núi thay đổi nhanh.</p>
      <p><strong>Khu vực miền Đông:</strong> Tập trung vào các điểm nổi bật theo mùa như lá vàng hay hoa dại. Nhiều công viên phía Đông cũng có hoạt động mùa đông tuyệt vời.</p>

      <h2 id="sustainable">Du lịch bền vững</h2>
      <p>Hãy tuân thủ nguyên tắc “Không để lại dấu vết”: đi đúng lối mòn, mang rác ra ngoài, và giữ khoảng cách an toàn với động vật hoang dã.</p>

      <p>Công viên quốc gia không chỉ là điểm đến mà còn là lớp học ngoài trời về bảo tồn, lịch sử và thiên nhiên. Hãy tham gia chương trình của kiểm lâm để hiểu thêm.</p>
    `,
    image: "/blog-national-parks-guide-mountains-landscape.png",
    author: "Sarah Johnson",
    authorImage: "/professional-woman-ceo-travel-industry.png",
    authorBio:
      "Sarah là người sáng lập TravelDom, đã đặt chân đến cả 63 công viên quốc gia Mỹ. Cô đam mê du lịch bền vững và muốn chia sẻ vẻ đẹp thiên nhiên nước Mỹ.",
    date: "15 Tháng 1, 2024",
    readTime: "12 phút đọc",
    category: "Hướng dẫn du lịch",
    tags: ["Công viên quốc gia", "Lên kế hoạch", "Thiên nhiên", "Phiêu lưu"],
    featured: true,
  },
};

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  const relatedPosts = [
    {
      slug: "spring-travel-destinations-2024",
      title: "10 điểm du lịch lý tưởng vào mùa xuân tại Mỹ",
      image: "/blog-spring-destinations-cherry-blossoms-flowers.png",
      category: "Hướng dẫn theo mùa",
    },
    {
      slug: "hidden-gems-colorado-rockies",
      title: "Những viên ngọc ẩn tại dãy núi Rockies Colorado",
      image: "/blog-colorado-hidden-gems-mountain-lake-wilderness.png",
      category: "Điểm đến nổi bật",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Back Navigation */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Quay lại Blog
              </Link>
            </Button>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge variant="outline" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Image
                    src={post.authorImage || "/placeholder.svg"}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    Lưu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Tags */}
                  <div className="mt-12 pt-8 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <TagIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Thẻ:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(post.tags) &&
                        post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {/* Author Bio */}
                  <Card className="mt-12">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={post.authorImage || "/placeholder.svg"}
                          alt={post.author}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            Về {post.author}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {post.authorBio}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    {/* Table of Contents */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Trong bài viết</h3>
                        <nav className="space-y-2 text-sm">
                          <a
                            href="#planning"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Lập kế hoạch chuyến đi
                          </a>
                          <a
                            href="#timing"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Thời điểm tốt nhất
                          </a>
                          <a
                            href="#hidden-gems"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Điểm ẩn
                          </a>
                          <a
                            href="#sustainable"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Du lịch bền vững
                          </a>
                        </nav>
                      </CardContent>
                    </Card>

                    {/* Newsletter */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">
                          Nhận thông tin mới
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Nhận mẹo du lịch và hướng dẫn điểm đến mỗi tuần.
                        </p>
                        <Button className="w-full" size="sm">
                          Đăng ký
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="secondary"
                          className="bg-background/90 text-foreground"
                        >
                          {relatedPost.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4 text-balance">
                        {relatedPost.title}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-transparent"
                      >
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Đọc bài viết
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
