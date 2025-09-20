import {
  HeartIcon,
  ShieldCheckIcon,
  GlobeIcon,
  UsersIcon,
  AwardIcon,
  StarIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Người sáng lập & CEO",
      image: "/professional-woman-ceo-travel-industry.png",
      bio: "Với hơn 15 năm trong ngành du lịch, Sarah sáng lập TravelDom để mang đến những chuyến phiêu lưu nội địa cho tất cả mọi người.",
    },
    {
      name: "Michael Chen",
      role: "Trưởng phòng Điều hành",
      image: "/professional-man-operations-manager-travel.png",
      bio: "Michael đảm bảo mọi chuyến tour diễn ra suôn sẻ với chuyên môn về hậu cần và dịch vụ khách hàng.",
    },
    {
      name: "Emily Rodriguez",
      role: "Nhà thiết kế trải nghiệm du lịch",
      image: "/placeholder-493u9.png",
      bio: "Emily xây dựng hành trình độc đáo, khai thác những viên ngọc ẩn và trải nghiệm chân thực của mỗi điểm đến.",
    },
    {
      name: "David Thompson",
      role: "Giám đốc phát triển bền vững",
      image: "/placeholder-ihg94.png",
      bio: "David dẫn dắt cam kết du lịch có trách nhiệm, đảm bảo tour mang lại lợi ích cho cộng đồng địa phương và bảo vệ môi trường.",
    },
  ];

  const values = [
    {
      icon: HeartIcon,
      title: "Đam mê phiêu lưu",
      description:
        "Chúng tôi tin rằng mỗi hành trình đều phải truyền cảm hứng và thay đổi. Niềm đam mê thúc đẩy chúng tôi tạo nên trải nghiệm khó quên.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Tin cậy & An toàn",
      description:
        "Sự an toàn của bạn là ưu tiên hàng đầu. Chúng tôi duy trì tiêu chuẩn cao nhất và hợp tác cùng các đối tác địa phương được chứng nhận.",
    },
    {
      icon: GlobeIcon,
      title: "Du lịch bền vững",
      description:
        "Chúng tôi cam kết phát triển du lịch bền vững, mang lại lợi ích cho cộng đồng địa phương và gìn giữ thiên nhiên.",
    },
    {
      icon: UsersIcon,
      title: "Cộng đồng là trên hết",
      description:
        "Chúng tôi hỗ trợ doanh nghiệp và cộng đồng địa phương, đảm bảo chi tiêu du lịch của bạn mang lại tác động tích cực.",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Khách hàng hài lòng" },
    { number: "500+", label: "Tour độc đáo" },
    { number: "15", label: "Năm kinh nghiệm" },
    { number: "4.9", label: "Đánh giá trung bình" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                Về TravelDom
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                Khám phá kho báu ẩn giấu của nước Mỹ
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-balance leading-relaxed">
                Chúng tôi đam mê giới thiệu sự đa dạng và vẻ đẹp tuyệt vời của
                du lịch nội địa. Từ bờ Đông đến bờ Tây, chúng tôi mang đến trải
                nghiệm chân thực gắn kết bạn với văn hóa địa phương, cảnh quan
                hùng vĩ và những kỷ niệm khó quên.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#tours" className="inline-flex">
                  <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Khám phá Tour
                  </button>
                </Link>
                <Link href="/contact" className="inline-flex">
                  <button className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                    Liên hệ
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Câu chuyện của chúng tôi
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Thành lập năm 2009, TravelDom ra đời từ một niềm tin đơn
                    giản: nước Mỹ sở hữu những điểm đến tuyệt vời nhất thế giới
                    ngay trong “sân sau”. Khi nhiều người tìm kiếm phiêu lưu ở
                    nước ngoài, chúng tôi nhìn thấy tiềm năng chưa khai phá
                    trong du lịch nội địa.
                  </p>
                  <p>
                    Từ những chuyến dã ngoại cuối tuần đến công viên quốc gia
                    gần đó, chúng tôi đã phát triển thành nền tảng toàn diện với
                    hàng trăm trải nghiệm chọn lọc tại 50 bang. Hơn 50,000 du
                    khách đã đồng hành và khám phá từ bờ biển Maine đến sa mạc
                    Arizona.
                  </p>
                  <p>
                    Ngày nay, chúng tôi tự hào là công ty du lịch nội địa hàng
                    đầu tại Mỹ, cam kết du lịch bền vững, hỗ trợ cộng đồng và
                    tạo nên ký ức suốt đời.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder-0t1a0.png"
                  alt="Đội ngũ TravelDom lên kế hoạch tour"
                  width={600}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Những nguyên tắc này định hướng mọi hoạt động của chúng tôi, từ
                thiết kế tour đến dịch vụ khách hàng.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Đội ngũ của chúng tôi
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Những con người nhiệt huyết đứng sau chuyến phiêu lưu tuyệt vời
                của bạn.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-20 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Giải thưởng & Ghi nhận
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Chúng tôi tự hào được vinh danh nhờ cam kết cho sự xuất sắc.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <AwardIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Nhà điều hành tour nội địa xuất sắc
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Travel Excellence Awards 2023
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <StarIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Dịch vụ khách hàng hàng đầu
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Tourism Industry Awards 2023
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <GlobeIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Lãnh đạo du lịch bền vững
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Green Travel Certification 2023
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bạn đã sẵn sàng cho chuyến đi?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-balance">
              Hãy cùng hàng ngàn du khách đã khám phá vẻ đẹp du lịch nội địa với
              TravelDom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#tours" className="inline-flex">
                <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors">
                  Xem Tour
                </button>
              </Link>
              <Link href="/contact" className="inline-flex">
                <button className="border border-primary-foreground/20 px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
                  Liên hệ
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
