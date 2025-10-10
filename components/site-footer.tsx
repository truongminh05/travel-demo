import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  T
                </span>
              </div>
              <span className="font-bold text-xl text-foreground">
                TravelDom
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Khám phá những chuyến phiêu lưu trong nước tuyệt vời với những
              trải nghiệm du lịch được tuyển chọn kỹ lưỡng của chúng tôi. Từ
              những kỳ nghỉ dưỡng trên núi đến những chuyến phiêu lưu ven biển,
              chúng tôi sẽ giúp bạn tìm được kỳ nghỉ hoàn hảo.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <FacebookIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <TwitterIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <InstagramIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tours"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tất cả Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bài viết du lịch
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tài khoản của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Danh mục tour */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Danh mục tour</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tours?category=domestic-tours"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tour nội địa
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=combo-packages"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gói Combo
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=experiences"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kinh nghiệm
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=adventure-tours"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Chuyến tham quan mạo hiểm
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=family-trips"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mẹo gia đình
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Liên hệ chúng tôi</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneIcon className="w-4 h-4" />
                <span>+84384349471</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MailIcon className="w-4 h-4" />
                <span>minhhuyenkuti@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="w-4 h-4" />
                <span>23 Nguyễn Hữu Tiến, Tây Thạnh, Tân Phú, TP.HCM</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Tư vấn</p>
              <div className="flex gap-2">
                <Input placeholder="Email của bạn" className="text-sm" />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Đặt mua
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 TravelDom. Trải nghiệm những cuộc phiêu lưu thú vị cùng chúng
            tôi.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Chính sách cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
