"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  SendIcon,
  MessageSquareIcon,
  HeadphonesIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";

export default function ContactPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Điện thoại",
      details: ["1-800-TRAVEL", "(1-800-872-8351)"],
      description: "Thứ 2 - Thứ 6: 8h-20h, Thứ 7 - CN: 9h-18h (giờ EST)",
    },
    {
      icon: MailIcon,
      title: "Email",
      details: ["info@traveldom.com", "bookings@traveldom.com"],
      description: "Chúng tôi phản hồi trong vòng 24 giờ",
    },
    {
      icon: MapPinIcon,
      title: "Văn phòng",
      details: ["123 Adventure Lane", "Denver, CO 80202"],
      description: "Vui lòng đặt lịch hẹn trước khi đến",
    },
    {
      icon: ClockIcon,
      title: "Giờ làm việc",
      details: ["Thứ 2 - Thứ 6: 8h-20h EST", "Cuối tuần: 9h-18h EST"],
      description: "Hỗ trợ khẩn cấp 24/7",
    },
  ];

  const faqs = [
    {
      question: "Tôi nên đặt tour trước bao lâu?",
      answer:
        "Chúng tôi khuyên bạn nên đặt trước 2-4 tuần cho các tour phổ biến, đặc biệt trong mùa cao điểm.",
    },
    {
      question: "Chính sách hủy tour như thế nào?",
      answer:
        "Miễn phí hủy trước 24 giờ khởi hành. Hoàn 50% nếu hủy trong vòng 24-48 giờ trước khởi hành.",
    },
    {
      question: "Có giảm giá cho nhóm không?",
      answer:
        "Có! Nhóm từ 8 người trở lên được giảm 10%. Vui lòng liên hệ để có gói tùy chỉnh cho nhóm.",
    },
    {
      question: "Tour có phù hợp cho mọi lứa tuổi không?",
      answer:
        "Hầu hết các tour chào đón mọi lứa tuổi, nhưng một số có yêu cầu độ tuổi tối thiểu. Vui lòng xem chi tiết tour.",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SendIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Tin nhắn đã được gửi!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Gửi thêm tin nhắn khác
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Bạn có thắc mắc về tour? Cần hỗ trợ lên kế hoạch cho chuyến đi
              tiếp theo? Chúng tôi luôn sẵn sàng để biến giấc mơ du lịch của bạn
              thành hiện thực.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquareIcon className="w-5 h-5" />
                      Gửi tin nhắn cho chúng tôi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isAuthenticated ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Họ và tên *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inquiryType">Loại yêu cầu</Label>
                            <Select
                              onValueChange={(value) =>
                                handleInputChange("inquiryType", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại yêu cầu" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">
                                  Câu hỏi chung
                                </SelectItem>
                                <SelectItem value="booking">
                                  Yêu cầu đặt tour
                                </SelectItem>
                                <SelectItem value="support">
                                  Hỗ trợ khách hàng
                                </SelectItem>
                                <SelectItem value="group">
                                  Đặt tour nhóm
                                </SelectItem>
                                <SelectItem value="partnership">
                                  Hợp tác
                                </SelectItem>
                                <SelectItem value="feedback">Góp ý</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Tiêu đề *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) =>
                              handleInputChange("subject", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Nội dung *</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            rows={6}
                            placeholder="Hãy cho chúng tôi biết bạn cần hỗ trợ gì..."
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center p-8 space-y-4">
                        <h3 className="font-semibold text-lg">
                          Vui lòng đăng nhập để gửi tin nhắn
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Để nhận được hỗ trợ tốt nhất, vui lòng đăng nhập vào
                          tài khoản của bạn.
                        </p>
                        <Button asChild>
                          <Link href="/login?redirect=/contact">
                            Đi đến trang đăng nhập
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Map & Additional Info */}
              <div className="space-y-8">
                {/* Map Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Đến văn phòng của chúng tôi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <MapPinIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Bản đồ tương tác
                        </p>
                        <p className="text-sm text-muted-foreground">
                          123 Adventure Lane, Denver, CO 80202
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Bãi đỗ xe:</strong> Miễn phí trong tòa nhà
                      </p>
                      <p>
                        <strong>Giao thông công cộng:</strong> Gần ga Union
                        Station
                      </p>
                      <p>
                        <strong>Lịch hẹn:</strong> Chấp nhận khách vãng lai, ưu
                        tiên đặt lịch
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HeadphonesIcon className="w-5 h-5" />
                      Hỗ trợ khẩn cấp 24/7
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Nếu bạn đang tham gia tour và cần hỗ trợ ngay lập tức:
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        Đường dây nóng khẩn cấp: 1-800-HELP-NOW
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Luôn sẵn sàng 24/7 cho khách tham gia tour
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Giải đáp nhanh các thắc mắc thường gặp. Không tìm thấy câu trả
                lời? Hãy gửi tin nhắn cho chúng tôi!
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
