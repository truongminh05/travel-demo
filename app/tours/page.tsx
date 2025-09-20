"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { SearchIcon, MapPinIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TourCard } from "@/components/tour-card";
import { TourListItem } from "@/components/tour-list-item";
import { ViewToggle, type ViewType } from "@/components/view-toggle";
import { TourFilters, type FilterState } from "@/components/tour-filters";
import { SiteHeader } from "@/components/site-header";
import {
  CategoryNavigation,
  type CategoryType,
} from "@/components/category-navigation";
import { SiteFooter } from "@/components/site-footer";
import { MotionWrapper } from "@/components/motion-wrapper";
import {
  TourCardSkeleton,
  TourListSkeleton,
} from "@/components/skeleton-loader";

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>("grid");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    duration: [],
    rating: 0,
    co2Impact: [],
    cancellation: [],
    location: [],
    sortBy: "featured",
  });

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/tours");
        if (!res.ok) throw new Error("Không thể tải danh sách tour");
        const data = await res.json();
        setTours(data);
      } catch (error) {
        console.error("Lỗi tải tour", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  const tourCounts = useMemo(() => {
    const counts: { [key in CategoryType]: number } = {
      all: tours.length,
      "domestic-tours": 0,
      "family-trips": 0,
      "adventure-tours": 0,
      experiences: 0,
      "combo-packages": 0,
    };
    tours.forEach((tour: any) => {
      if (
        tour.category &&
        counts[tour.category as CategoryType] !== undefined
      ) {
        (counts[tour.category as CategoryType] as number)++;
      }
    });
    return counts;
  }, [tours]);

  const filteredAndSortedTours = useMemo(() => {
    let filtered = [...tours];
    // logic lọc và sắp xếp sẽ được viết ở đây
    return filtered;
  }, [tours, activeCategory, filters]);

  const renderTourContent = () => {
    if (isLoading) {
      if (currentView === "grid") {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <TourCardSkeleton key={i} />
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <TourListSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (filteredAndSortedTours.length === 0) {
      return (
        <MotionWrapper direction="fade" duration={600}>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Không có tour nào phù hợp với bộ lọc hiện tại.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                /* logic xóa bộ lọc */
              }}
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        </MotionWrapper>
      );
    }

    if (currentView === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedTours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-8">
          {filteredAndSortedTours.map((tour) => (
            <TourListItem key={tour.id} {...tour} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-gradient-to-br from-primary/5 to-accent/10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" duration={800}>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Tìm kiếm Tour hoàn hảo cho bạn
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Khám phá và trải nghiệm du lịch nội địa tuyệt vời, được thiết kế
                phù hợp với sở thích của bạn
              </p>
            </div>
          </MotionWrapper>
        </div>
      </section>
      <CategoryNavigation
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        tourCounts={tourCounts}
      />
      <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-80 flex-shrink-0">
              <TourFilters
                filters={filters}
                onFiltersChange={setFilters}
                isSticky={true}
              />
            </aside>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {filteredAndSortedTours.length} trên {tours.length}{" "}
                  tour
                </div>
                <ViewToggle
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />
              </div>
              <Suspense fallback={<div>Đang tải...</div>}>
                {renderTourContent()}
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
