"use client";

import { useState, useEffect, Fragment, useCallback, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import BackButton from "./back-button";
import ReadTimer from "./read-timer";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
  const teamMembers = (post.AuthorName ?? "")
    .split(/[,|•]/)
    .map((name) => name.trim())
    .filter(Boolean);
  const hasTeam = teamMembers.length > 1;
  const primaryAuthor = teamMembers[0] ?? post.AuthorName ?? "Tác giả";

  useEffect(() => {
    const handleScroll = () => {
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
          "relative w-full overflow-hidden transition-all duration-300 ease-in-out",
          "hover:scale-[1.02] scale-100"
        )}
      >
        <div className="relative h-[50vh] min-h-[400px]">
          {post.Image && (
            <Image
              src={post.Image}
              alt={post.Title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

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
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm md:text-base text-white/90">
              {[
                hasTeam ? (
                  <div key="team" className="flex items-center gap-2 min-w-0">
                    <span className="text-xs uppercase tracking-[0.35em] text-white/60">
                      Team
                    </span>
                    <TeamBadgeScroller members={teamMembers} />
                  </div>
                ) : (
                  <span
                    key="author"
                    className="font-medium text-white drop-shadow"
                  >
                    {primaryAuthor}
                  </span>
                ),
                <time
                  key="date"
                  dateTime={post.PublishedDate || ""}
                  className="text-white/80"
                >
                  {fmtDate(post.PublishedDate)}
                </time>,
                <span key="read" className="text-white/80">
                  <ReadTimer />
                </span>,
              ].map((item, index) => (
                <Fragment key={index}>
                  {index > 0 && (
                    <span className="text-white/50" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {item}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HEADER DÍNH (STICKY) */}
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
              <div className="text-xs text-white/80 flex items-center gap-x-2 mt-1 min-w-0">
                {post.Category && (
                  <Badge variant="secondary" className="h-5 px-1.5">
                    {post.Category}
                  </Badge>
                )}
                {hasTeam ? (
                  <TeamBadgeScroller members={teamMembers} variant="compact" />
                ) : (
                  <span className="truncate">{primaryAuthor}</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <BackButton />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isScrolled ? "h-0" : "h-[1px]"
        )}
        style={{
          height: isScrolled
            ? 0
            : document.querySelector("section")?.clientHeight + "px",
        }}
        ref={(el) => {
          if (el && !isScrolled) {
            const heroHeight = el.previousElementSibling?.clientHeight || 0;
            el.style.height = `${heroHeight}px`;
          }
        }}
      />
    </>
  );
}

function TeamBadgeScroller({
  members,
  variant = "default",
}: {
  members: string[];
  variant?: "default" | "compact";
}) {
  if (!members.length) return null;

  const isCompact = variant === "compact";
  const containerRef = useRef<HTMLDivElement>(null);

  if (isCompact) {
    return (
      <div className="relative flex min-w-0 max-w-[11rem] items-center">
        <div className="flex items-center gap-1 overflow-x-auto pr-4 scrollbar-none">
          {members.map((member) => (
            <Badge
              key={member}
              variant="secondary"
              className="flex-shrink-0 whitespace-nowrap bg-white/90 px-2 py-0 text-[0.65rem] font-medium leading-4 text-foreground/90 shadow-sm"
            >
              {member}
            </Badge>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/40 to-transparent" />
      </div>
    );
  }

  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setScrollState({
      canScrollLeft: scrollLeft > 2,
      canScrollRight: scrollLeft + clientWidth < scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isCompact) return;

    updateScrollState();

    const handleScroll = () => updateScrollState();
    container.addEventListener("scroll", handleScroll, { passive: true });

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateScrollState());
      resizeObserver.observe(container);
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
    };
  }, [isCompact, members.length, updateScrollState]);

  const scrollByCard = useCallback(
    (direction: "left" | "right") => {
      if (isCompact) return;

      const container = containerRef.current;
      if (!container) return;

      const cards = container.querySelectorAll<HTMLElement>(
        "[data-team-member-card]"
      );

      if (!cards.length) return;

      let step = cards[0].offsetWidth;
      if (cards.length > 1) {
        const firstRect = cards[0].getBoundingClientRect();
        const secondRect = cards[1].getBoundingClientRect();
        const gap = secondRect.left - firstRect.right;
        if (gap > 0) {
          step += gap;
        }
      }

      container.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });

      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => updateScrollState());
      }
    },
    [isCompact, updateScrollState]
  );

  const { canScrollLeft, canScrollRight } = scrollState;
  const showControls = canScrollLeft || canScrollRight;

  return (
    <div className="group relative flex min-w-0 items-center gap-3">
      <button
        type="button"
        aria-label="Scroll team left"
        onClick={() => scrollByCard("left")}
        disabled={!canScrollLeft}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          showControls ? "opacity-100" : "pointer-events-none opacity-0",
          canScrollLeft ? "" : "cursor-not-allowed opacity-40"
        )}
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="relative flex-1">
        <div
          ref={containerRef}
          className="flex snap-x snap-mandatory items-center gap-3 overflow-x-auto pr-16 scrollbar-none"
        >
          {members.map((member, index) => (
            <Badge
              key={`${member}-${index}`}
              data-team-member-card
              variant="secondary"
              className="flex-shrink-0 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-sm font-medium leading-5 text-foreground/90 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {member}
            </Badge>
          ))}
        </div>
        {showControls && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
          </>
        )}
      </div>
      <button
        type="button"
        aria-label="Scroll team right"
        onClick={() => scrollByCard("right")}
        disabled={!canScrollRight}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          showControls ? "opacity-100" : "pointer-events-none opacity-0",
          canScrollRight ? "" : "cursor-not-allowed opacity-40"
        )}
      >
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
