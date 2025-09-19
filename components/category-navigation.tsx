"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type CategoryType =
  | "all"
  | "domestic-tours"
  | "combo-packages"
  | "experiences"
  | "adventure-tours"
  | "family-trips";

interface CategoryNavigationProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  tourCounts?: Record<CategoryType, number>;
}

export function CategoryNavigation({
  activeCategory,
  onCategoryChange,
  tourCounts = {
    all: 6,
    "domestic-tours": 4,
    "combo-packages": 2,
    experiences: 3,
    "adventure-tours": 2,
    "family-trips": 1,
  },
}: CategoryNavigationProps) {
  const categories = [
    {
      id: "all" as CategoryType,
      name: "All Tours",
      description: "Browse all available tours",
    },
    {
      id: "domestic-tours" as CategoryType,
      name: "Domestic Tours",
      description: "Explore destinations within the country",
    },
    {
      id: "combo-packages" as CategoryType,
      name: "Combo Packages",
      description: "Multi-destination travel packages",
    },
    {
      id: "experiences" as CategoryType,
      name: "Experiences",
      description: "Unique cultural and adventure experiences",
    },
    {
      id: "adventure-tours" as CategoryType,
      name: "Adventure Tours",
      description: "Thrilling outdoor adventures",
    },
    {
      id: "family-trips" as CategoryType,
      name: "Family Trips",
      description: "Perfect for family vacations",
    },
  ];

  return (
    <section className="py-8 px-4 border-b bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Browse by Category
          </h3>
          <p className="text-sm text-muted-foreground">
            Find the perfect travel experience for you
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`rounded-full transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-transparent hover:bg-primary/10"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
              <Badge
                variant="secondary"
                className={`ml-2 ${
                  activeCategory === category.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tourCounts[category.id]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-transparent hover:bg-primary/10"
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
                <Badge
                  variant="secondary"
                  className={`ml-2 ${
                    activeCategory === category.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tourCounts[category.id]}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {categories.find((cat) => cat.id === activeCategory)?.description}
          </p>
        </div>
      </div>
    </section>
  );
}
