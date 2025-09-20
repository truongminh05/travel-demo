import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const featuredPost = {
    slug: "ultimate-guide-national-parks-2024",
    title: "Hướng dẫn toàn diện về các Công viên Quốc gia Mỹ năm 2024",
    excerpt:
      "Khám phá thời điểm tốt nhất để ghé thăm, những điểm đến ít người biết và mẹo từ chuyên gia để trải nghiệm công viên quốc gia tuyệt vời nhất.",
    image: "/blog-national-parks-guide-mountains-landscape.png",
    author: "Sarah Johnson",
    authorImage: "/professional-woman-ceo-travel-industry.png",
    date: "15 Tháng 1, 2024",
    readTime: "12 phút đọc",
    category: "Cẩm nang du lịch",
    featured: true,
  };

  const blogPosts = [
    {
      slug: "spring-travel-destinations-2024",
      title: "10 điểm đến lý tưởng vào mùa xuân tại Mỹ",
      excerpt:
        "Từ hoa anh đào ở Washington DC đến cánh đồng hoa dại ở Texas, khám phá những điểm đến tuyệt đẹp mùa xuân.",
      image: "/blog-spring-destinations-cherry-blossoms-flowers.png",
      author: "Emily Rodriguez",
      authorImage: "/placeholder-493u9.png",
      date: "12 Tháng 1, 2024",
      readTime: "8 phút đọc",
      category: "Cẩm nang theo mùa",
    },
    {
      slug: "budget-travel-tips-domestic",
      title: "Du lịch Mỹ tiết kiệm: 15 mẹo giúp bạn giảm chi phí",
      excerpt:
        "Chiến lược từ chuyên gia để khám phá nước Mỹ mà không tốn kém: mẹo lưu trú, ăn uống và nhiều hơn nữa.",
      image: "/blog-budget-travel-tips-money-saving-backpack.png",
      author: "Michael Chen",
      authorImage: "/professional-man-operations-manager-travel.png",
      date: "10 Tháng 1, 2024",
      readTime: "10 phút đọc",
      category: "Mẹo du lịch",
    },
    {
      slug: "hidden-gems-colorado-rockies",
      title: "Những viên ngọc ẩn ở dãy núi Rocky, Colorado",
      excerpt:
        "Khám phá những con thác bí mật, hồ nước nguyên sơ và vùng hoang dã chưa được chạm tới ngoài các tuyến đường phổ biến.",
      image: "/blog-colorado-hidden-gems-mountain-lake-wilderness.png",
      author: "David Thompson",
      authorImage: "/placeholder-ihg94.png",
      date: "8 Tháng 1, 2024",
      readTime: "7 phút đọc",
      category: "Điểm đến nổi bật",
    },
    {
      slug: "sustainable-travel-practices",
      title: "Du lịch bền vững: Làm sao để khám phá có trách nhiệm",
      excerpt:
        "Tìm hiểu cách giảm tác động môi trường trong khi vẫn tận hưởng trọn vẹn chuyến đi.",
      image: "/blog-sustainable-travel-eco-friendly-nature.png",
      author: "David Thompson",
      authorImage: "/placeholder-ihg94.png",
      date: "5 Tháng 1, 2024",
      readTime: "9 phút đọc",
      category: "Du lịch bền vững",
    },
    {
      slug: "family-friendly-destinations-summer",
      title: "Điểm đến mùa hè thân thiện với gia đình",
      excerpt:
        "Những nơi trẻ em yêu thích và bố mẹ cũng sẽ hài lòng, với hoạt động cho mọi lứa tuổi.",
      image: "/blog-family-travel-summer-beach-kids-fun.png",
      author: "Emily Rodriguez",
      authorImage: "/placeholder-493u9.png",
      date: "3 Tháng 1, 2024",
      readTime: "6 phút đọc",
      category: "Du lịch gia đình",
    },
    {
      slug: "photography-tips-landscape",
      title: "Mẹo chụp ảnh phong cảnh cho người yêu du lịch",
      excerpt:
        "Chụp những bức ảnh tuyệt đẹp với kỹ thuật chuyên nghiệp và gợi ý thiết bị phù hợp.",
      image: "/blog-photography-tips-camera-landscape-sunset.png",
      author: "Sarah Johnson",
      authorImage: "/professional-woman-ceo-travel-industry.png",
      date: "28 Tháng 12, 2023",
      readTime: "11 phút đọc",
      category: "Nhiếp ảnh",
    },
  ];

  const categories = [
    { name: "Tất cả bài viết", count: 24, active: true },
    { name: "Mẹo du lịch", count: 8 },
    { name: "Điểm đến nổi bật", count: 6 },
    { name: "Cẩm nang theo mùa", count: 4 },
    { name: "Du lịch gia đình", count: 3 },
    { name: "Du lịch bền vững", count: 2 },
    { name: "Nhiếp ảnh", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
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

        {/* Featured Post */}
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
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-4 text-balance">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Image
                        src={featuredPost.authorImage || "/placeholder.svg"}
                        alt={featuredPost.author}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">
                        {featuredPost.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-fit">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Đọc bài viết
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Danh mục</h3>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            category.active
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{category.name}</span>
                            <span className="text-xs">{category.count}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
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

              {/* Posts Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
                  <p className="text-muted-foreground">
                    {blogPosts.length} bài viết
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {blogPosts.map((post, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant="secondary"
                            className="bg-background/90 text-foreground"
                          >
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 text-balance line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3 mb-4">
                          <Image
                            src={post.authorImage || "/placeholder.svg"}
                            alt={post.author}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-xs font-medium">
                            {post.author}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.slug}`}>
                              Đọc tiếp
                              <ArrowRightIcon className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
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

        {/* CTA Section */}
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
