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
              Discover amazing domestic adventures with our curated travel
              experiences. From mountain retreats to coastal escapes, we help
              you find your perfect getaway.
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
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tours"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Travel Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Tour Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Tour Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tours?category=domestic-tours"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Domestic Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=combo-packages"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Combo Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=experiences"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Experiences
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=adventure-tours"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Adventure Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=family-trips"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Family Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Stay Connected</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneIcon className="w-4 h-4" />
                <span>1-800-TRAVEL</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MailIcon className="w-4 h-4" />
                <span>info@traveldom.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="w-4 h-4" />
                <span>123 Travel St, Adventure City</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Newsletter</p>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="text-sm" />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 TravelDom. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
