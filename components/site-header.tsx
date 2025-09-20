"use client";

import { useState } from "react";
import { MenuIcon, PhoneIcon, MailIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Tours", href: "/tours" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
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
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - THAY ĐỔI TẠI ĐÂY */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/account" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Chào, {user?.firstName}
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/tours">Book Now</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <MenuIcon className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      T
                    </span>
                  </div>
                  <span className="font-bold text-xl text-foreground">
                    TravelDom
                  </span>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="border-t pt-6 space-y-4">
                  <div className="space-y-3">
                    <a
                      href="tel:+1-800-TRAVEL"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      1-800-TRAVEL
                    </a>
                    <a
                      href="mailto:info@traveldom.com"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MailIcon className="w-4 h-4" />
                      info@traveldom.com
                    </a>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Link href="/tours">Book Now</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
