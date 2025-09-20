"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionWrapper } from "@/components/motion-wrapper";
import {
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <MotionWrapper direction="up" duration={800}>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Khám phá những hành trình
              <span className="text-primary block">Nội địa tuyệt vời</span>
            </h1>
          </MotionWrapper>

          <MotionWrapper delay={200} direction="up" duration={800}>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
              Trải nghiệm những điểm đến ngoạn mục trên khắp đất nước với các
              chuyến đi được chọn lọc. Từ núi non hùng vĩ đến biển cả thơ mộng,
              hãy tìm cho mình một hành trình hoàn hảo.
            </p>
          </MotionWrapper>

          <MotionWrapper delay={400} direction="up" duration={800}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 py-4 text-lg">
                <Link href="/tours">Khám phá Tour</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg bg-transparent"
              >
                <Link href="/about">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </MotionWrapper>

          {/* Quick Stats */}
          <MotionWrapper delay={600} direction="up" duration={800}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
              {[
                { value: "500+", label: "Điểm đến" },
                { value: "50K+", label: "Khách hàng hài lòng" },
                { value: "4.9", label: "Đánh giá trung bình" },
                { value: "24/7", label: "Hỗ trợ" },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" duration={600}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vì sao chọn TravelDom?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi giúp hành trình du lịch nội địa trở nên đơn giản, tiết
                kiệm và khó quên với nền tảng toàn diện
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPinIcon,
                title: "Điểm đến chọn lọc",
                description:
                  "Những địa điểm được chọn kỹ càng, từ nơi bí ẩn đến điểm đến nổi tiếng",
              },
              {
                icon: StarIcon,
                title: "Trải nghiệm cao cấp",
                description:
                  "Tour và dịch vụ lưu trú chất lượng cao với đánh giá xác thực",
              },
              {
                icon: ShieldCheckIcon,
                title: "Đặt chỗ an toàn",
                description: "Thanh toán bảo mật với chính sách hủy linh hoạt",
              },
              {
                icon: HeartIcon,
                title: "Dịch vụ tận tâm",
                description:
                  "Gợi ý cá nhân hóa và hỗ trợ khách hàng 24/7 để bạn yên tâm",
              },
              {
                icon: TrendingUpIcon,
                title: "Giá tốt nhất",
                description:
                  "Giá cả cạnh tranh, nhiều ưu đãi độc quyền và minh bạch chi phí",
              },
              {
                icon: UsersIcon,
                title: "Cộng đồng du lịch",
                description:
                  "Đánh giá thực tế từ du khách để bạn đưa ra lựa chọn đúng đắn",
              },
            ].map((feature, index) => (
              <MotionWrapper
                key={index}
                delay={index * 100}
                direction="up"
                duration={600}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" duration={600}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Danh mục du lịch phổ biến
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Khám phá loại hình du lịch phù hợp với bạn
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Phiêu lưu núi non",
                description:
                  "Đỉnh núi hùng vĩ, đường mòn trekking và nơi nghỉ dưỡng ấm cúng",
                image: "/mountain-retreat-colorado-aspen-snow-peaks.png",
                link: "/tours?category=adventure-tours",
              },
              {
                title: "Nghỉ dưỡng biển",
                description:
                  "Kỳ nghỉ ven biển với nắng vàng, cát trắng và sóng biển",
                image: "/beach-resort-myrtle-beach-ocean-waves-palm-trees.png",
                link: "/tours?category=family-trips",
              },
              {
                title: "Trải nghiệm thành phố",
                description: "Khám phá đô thị, văn hóa và di tích lịch sử",
                image:
                  "/charleston-historic-district-cobblestone-streets-s.png",
                link: "/tours?category=experiences",
              },
              {
                title: "Vùng rượu vang",
                description:
                  "Tham quan vườn nho, nếm rượu và thưởng thức ẩm thực",
                image:
                  "/napa-valley-vineyard-wine-tasting-rolling-hills-gr.png",
                link: "/tours?category=combo-packages",
              },
              {
                title: "Công viên quốc gia",
                description:
                  "Thiên nhiên hoang dã, cắm trại và kỳ quan tự nhiên",
                image:
                  "/yellowstone-national-park-geysers-wildlife-camping.png",
                link: "/tours?category=adventure-tours",
              },
              {
                title: "Cảnh quan sa mạc",
                description: "Địa hình độc đáo, ngắm sao và phiêu lưu sa mạc",
                image: "/sedona-arizona-red-rocks-desert-landscape-sunset.png",
                link: "/tours?category=adventure-tours",
              },
            ].map((category, index) => (
              <MotionWrapper
                key={index}
                delay={index * 100}
                direction="up"
                duration={600}
              >
                <Link href={category.link}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </MotionWrapper>
            ))}
          </div>

          <MotionWrapper delay={600} direction="up" duration={600}>
            <div className="text-center mt-12">
              <Button asChild size="lg" className="px-8">
                <Link href="/tours">Xem tất cả Tour</Link>
              </Button>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <MotionWrapper direction="up" duration={800}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Sẵn sàng cho chuyến đi của bạn?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hãy cùng hàng ngàn du khách đã khám phá những điểm đến nội địa
              tuyệt vời với TravelDom
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/tours">Xem Tour</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 bg-transparent"
              >
                <Link href="/contact">Liên hệ</Link>
              </Button>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
