"use client";

import {
  useState,
  useEffect,
  useMemo,
  Suspense,
  type FormEvent,
  useRef,
} from "react";
import { TourCard } from "@/components/tour-card";
import { TourMap } from "@/components/tour-map";
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
import { Input } from "@/components/ui/input";

// Định nghĩa lại categories ở đây để dễ truy cập
const categories = [
  { id: "all", name: "Tất cả Tour" },
  { id: "domestic-tours", name: "Tour trong nước" },
  { id: "combo-packages", name: "Gói Combo" },
  { id: "experiences", name: "Trải nghiệm" },
  { id: "adventure-tours", name: "Tour mạo hiểm" },
  { id: "family-trips", name: "Chuyến đi gia đình" },
];
// Thêm hàm tiện ích để lấy số ngày từ chuỗi thời lượng, ví dụ "3 ngày 2 đêm" -> 3
const parseDurationDays = (durationStr: string): number => {
  const match = durationStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

type RawTour = Record<string, unknown>;

const toNumber = (value: unknown, fallback: number | null = null): number | null => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return fallback;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const firstValidString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

const normalizeTourFromApi = (tour: RawTour, index: number) => {
  const typedTour = tour as Record<string, unknown>;
  const rawId =
    typedTour.id ??
    typedTour.TourID ??
    typedTour.tourid ??
    typedTour.tourId ??
    typedTour.TourId ??
    typedTour.ID ??
    typedTour.Id ??
    index;
  const normalizedId =
    rawId !== null && rawId !== undefined ? String(rawId) : `tour-${index}`;

  const slugCandidate = firstValidString(
    typedTour.slug,
    typedTour.tourslug,
    typedTour.TourSlug,
    typedTour.Slug
  );
  const normalizedSlug = slugCandidate ?? normalizedId;

  return {
    ...tour,
    id: normalizedId,
    slug: normalizedSlug,
    title: firstValidString(typedTour.title, typedTour.Title) ?? "",
    location: firstValidString(typedTour.location, typedTour.Location) ?? "",
    description:
      firstValidString(typedTour.description, typedTour.Description) ?? "",
    category: firstValidString(typedTour.category, typedTour.Category),
    status: firstValidString(typedTour.status, typedTour.Status),
    image: firstValidString(typedTour.image, typedTour.Image),
    cancellation:
      firstValidString(typedTour.cancellation, typedTour.CancellationPolicy) ?? "",
    duration: firstValidString(typedTour.duration, typedTour.Duration) ?? "",
    price: toNumber(typedTour.price ?? typedTour.Price, 0) ?? 0,
    originalPrice: toNumber(
      typedTour.originalPrice ?? typedTour.OriginalPrice,
      null
    ),
    rating:
      toNumber(
        typedTour.rating ??
          typedTour.AverageRating ??
          typedTour.averageRating,
        0
      ) ?? 0,
    reviewCount:
      toNumber(
        typedTour.reviewCount ??
          typedTour.ReviewCount ??
          typedTour.review_count,
        0
      ) ?? 0,
  };
};

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

  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearSearch = () => {
    setSearchValue("");
    setSubmittedSearch(""); // Xóa cả tìm kiếm đã gửi để reset danh sách tour
    setIsSuggestionsVisible(false);
    inputRef.current?.focus(); // Focus lại vào ô input
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = searchValue.trim();
    setSubmittedSearch(value);
    setSearchValue(value);
    setIsSuggestionsVisible(false);
  };

  // Effect chỉ fetch tất cả tour một lần khi trang được tải
  useEffect(() => {
    const fetchAllTours = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tours`);
        if (!res.ok) throw new Error("Không thể tải danh sách tour");
        const data = await res.json();
        const normalizedTours = Array.isArray(data)
          ? data.map((tour, index) => normalizeTourFromApi(tour, index))
          : [];
        setAllTours(normalizedTours);
        setFilteredTours(normalizedTours); // Ban đầu hiển thị tất cả
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
      toursToFilter = toursToFilter.filter((tour) => {
        const days = parseDurationDays(tour.duration); // số ngày của tour hiện tại
        return filters.duration.some((range) => {
          if (range === "1-2 ngày") return days >= 1 && days <= 2;
          if (range === "3-4 ngày") return days >= 3 && days <= 4;
          if (range === "5-6 ngày") return days >= 5 && days <= 6;
          if (range === "7+ ngày") return days >= 7;
          return false;
        });
      });
    }

    if (filters.rating > 0) {
      toursToFilter = toursToFilter.filter(
        (tour) => tour.rating >= filters.rating
      );
    }

    const query = submittedSearch.trim().toLowerCase();
    if (query) {
      toursToFilter = toursToFilter.filter((tour) => {
        const titleMatch = tour.title?.toLowerCase().includes(query);
        const locationMatch = tour.location?.toLowerCase().includes(query);
        return titleMatch || locationMatch;
      });
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
  }, [filters, activeCategory, allTours, submittedSearch]);
  // Effect để tạo danh sách gợi ý khi người dùng gõ
  useEffect(() => {
    if (searchValue.trim().length > 1) {
      const query = searchValue.toLowerCase();
      const filteredSuggestions = allTours
        .filter(
          (tour) =>
            tour.title.toLowerCase().includes(query) ||
            tour.location.toLowerCase().includes(query)
        )
        .slice(0, 5); // Giới hạn 5 kết quả

      setSuggestions(filteredSuggestions);
      setIsSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  }, [searchValue, allTours]);

  // Effect để đóng danh sách gợi ý khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
      if (currentView === "map") {
        return (
          <div className="space-y-4">
            <div className="h-12 rounded-lg bg-muted animate-pulse" />
            <div className="h-[420px] rounded-lg bg-muted animate-pulse" />
          </div>
        );
      }

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

    if (currentView === "map") {
      return <TourMap tours={filteredTours} />;
    }

    if (currentView === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>
      );
    }

    return (
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
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  Tìm kiếm Tour hoàn hảo cho bạn
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Khám phá và trải nghiệm du lịch nội địa tuyệt vời, được thiết
                  kế phù hợp với sở thích của bạn
                </p>
              </div>

              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
              >
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Tìm kiếm tour theo tên hoặc địa điểm..."
                    className="w-full pr-10" // Thêm padding phải để không che nút "x"
                    autoComplete="off"
                  />
                  {searchValue && (
                    <button
                      type="button" // Quan trọng: để không submit form
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      aria-label="Xóa tìm kiếm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                </div>
                <Button type="submit">Tìm kiếm</Button>
              </form>
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
