"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
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
import { Button } from "@/components/ui/button";

// Định nghĩa lại categories ở đây để dễ truy cập
const categories = [
  { id: "all", name: "Tất cả Tour" },
  { id: "domestic-tours", name: "Tour trong nước" },
  { id: "combo-packages", name: "Gói Combo" },
  { id: "experiences", name: "Trải nghiệm" },
  { id: "adventure-tours", name: "Tour mạo hiểm" },
  { id: "family-trips", name: "Chuyến đi gia đình" },
];

export default function ToursPage() {
  const [allTours, setAllTours] = useState<any[]>([]); // State để giữ tất cả tour
  const [filteredTours, setFilteredTours] = useState<any[]>([]); // State để hiển thị tour đã lọc
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>("grid");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000000],
    duration: [],
    rating: 0,
    location: [],
    sortBy: "featured",
    dateRange: undefined,
  });

  // Effect chỉ fetch tất cả tour một lần khi trang được tải
  useEffect(() => {
    const fetchAllTours = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tours`);
        if (!res.ok) throw new Error("Không thể tải danh sách tour");
        const data = await res.json();
        setAllTours(data);
        setFilteredTours(data); // Ban đầu hiển thị tất cả
      } catch (error) {
        console.error("Lỗi khi fetch tour", error);
        setAllTours([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllTours();
  }, []);

  // Effect để lọc lại danh sách tour mỗi khi filter hoặc category thay đổi
  useEffect(() => {
    let toursToFilter = [...allTours];

    // 1. Lọc theo danh mục
    if (activeCategory !== "all") {
      const categoryName = categories.find(
        (c) => c.id === activeCategory
      )?.name;
      toursToFilter = toursToFilter.filter(
        (tour) => tour.category === categoryName
      );
    }

    // 2. Lọc theo các tiêu chí khác (giá, địa điểm...)
    toursToFilter = toursToFilter.filter(
      (tour) =>
        tour.price >= filters.priceRange[0] &&
        tour.price <= filters.priceRange[1]
    );

    if (filters.location.length > 0) {
      toursToFilter = toursToFilter.filter((tour) =>
        filters.location.includes(tour.location)
      );
    }

    if (filters.duration.length > 0) {
      toursToFilter = toursToFilter.filter((tour) =>
        filters.duration.includes(tour.duration)
      );
    }

    if (filters.rating > 0) {
      toursToFilter = toursToFilter.filter(
        (tour) => tour.rating >= filters.rating
      );
    }

    // 3. Sắp xếp
    switch (filters.sortBy) {
      case "price-low":
        toursToFilter.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        toursToFilter.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        toursToFilter.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredTours(toursToFilter);
  }, [filters, activeCategory, allTours]);

  // Logic đếm số tour trong mỗi danh mục
  const tourCounts = useMemo(() => {
    const counts = {
      all: allTours.length,
      "domestic-tours": allTours.filter((t) => t.category === "Tour trong nước")
        .length,
      "combo-packages": allTours.filter((t) => t.category === "Gói Combo")
        .length,
      experiences: allTours.filter((t) => t.category === "Trải nghiệm").length,
      "adventure-tours": allTours.filter((t) => t.category === "Tour mạo hiểm")
        .length,
      "family-trips": allTours.filter(
        (t) => t.category === "Chuyến đi gia đình"
      ).length,
    };
    return counts as Record<CategoryType, number>;
  }, [allTours]);

  const renderTourContent = () => {
    if (isLoading) {
      const skeletons = Array.from({ length: 6 });
      return currentView === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skeletons.map((_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {skeletons.map((_, i) => (
            <TourListSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (filteredTours.length === 0) {
      return (
        <MotionWrapper direction="fade" duration={600}>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Không tìm thấy tour nào phù hợp với bộ lọc của bạn.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  priceRange: [0, 50000000],
                  duration: [],
                  rating: 0,
                  location: [],
                  sortBy: "featured",
                  dateRange: undefined,
                })
              }
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        </MotionWrapper>
      );
    }

    return currentView === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTours.map((tour) => (
          <TourCard key={tour.id} {...tour} />
        ))}
      </div>
    ) : (
      <div className="space-y-8">
        {filteredTours.map((tour) => (
          <TourListItem key={tour.id} {...tour} />
        ))}
      </div>
    );
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
                  Hiển thị {filteredTours.length} kết quả
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
