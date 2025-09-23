"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import BackButton from "./back-button";
import ReadTimer from "./read-timer";
import { cn } from "@/lib/utils";

// Định nghĩa lại Type hoặc import từ một file chung
type BlogRow = {
  PostID: number;
  PostSlug: string;
  Title: string;
  Image: string | null;
  AuthorName: string | null;
  Category: string | null;
  PublishedDate: string | null;
};

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

export default function BlogHero({ post }: { post: BlogRow }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Ngưỡng cuộn để kích hoạt hiệu ứng
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* HERO SECTION CHÍNH */}
      <section
        className={cn(
          // == THAY ĐỔI: Bỏ thẻ div giữ chỗ, section giờ là thẻ ngoài cùng ==
          "relative w-full overflow-hidden transition-all duration-300 ease-in-out",
          "hover:scale-[1.02] scale-100",
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        {/* Ảnh nền và lớp phủ được đặt ở background */}
        <div className="absolute inset-0 z-[-1]">
          <Image
            src={post.Image || "/placeholder.svg"}
            alt={post.Title}
            fill
            priority
            className="object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        {/* == THAY ĐỔI: Nội dung không còn position absolute. 
          Padding (py) sẽ quyết định chiều cao tối thiểu của section.
          Nó sẽ tự dãn ra nếu nội dung dài hơn.
        */}
        <div className="container mx-auto px-4">
          <div className="w-full max-w-4xl py-24 md:py-32 lg:py-40">
            <div className="mb-4">
              <BackButton />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg">
              {post.Title}
            </h1>
            {post.Category && (
              <div className="mt-4">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-foreground"
                >
                  {post.Category}
                </Badge>
              </div>
            )}
            <div className="mt-3 text-sm md:text-base text-white/90 flex items-center gap-x-2">
              <span>{post.AuthorName || "Tác giả"}</span>
              <span>·</span>
              <time dateTime={post.PublishedDate || ""}>
                {fmtDate(post.PublishedDate)}
              </time>
              <span>·</span>
              <ReadTimer />
            </div>
          </div>
        </div>
      </section>

      {/* HEADER "DÍNH" (STICKY) KHI CUỘN (giữ nguyên) */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out",
          isScrolled ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="relative h-20 overflow-hidden">
          <Image
            src={post.Image || "/placeholder.svg"}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover blur-md scale-125"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
        <div className="absolute inset-0">
          <div className="container mx-auto h-full px-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white truncate">
                {post.Title}
              </h2>
              <div className="text-xs text-white/80 flex items-center gap-x-2 mt-1">
                {post.Category && (
                  <Badge variant="secondary" className="h-5 px-1.5">
                    {post.Category}
                  </Badge>
                )}
                <span>{post.AuthorName || "Tác giả"}</span>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <BackButton />
            </div>
          </div>
        </div>
      </div>

      {/* == THAY ĐỔI: Thêm một div trống để bù lại không gian của hero khi nó biến mất,
        tránh cho nội dung bên dưới bị "nhảy" lên.
      */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isScrolled ? "h-0" : "h-[1px]" // Chiều cao ảo, sẽ được lấp đầy bởi hero section
        )}
        style={{
          height: isScrolled
            ? 0
            : document.querySelector("section")?.clientHeight + "px",
        }}
        ref={(el) => {
          // Cập nhật lại chiều cao của div giữ chỗ này khi hero section thay đổi
          if (el && !isScrolled) {
            const heroHeight = el.previousElementSibling?.clientHeight || 0;
            el.style.height = `${heroHeight}px`;
          }
        }}
      />
    </>
  );
}
