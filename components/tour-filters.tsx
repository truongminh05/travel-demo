// File: components/tour-filters.tsx

"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  FilterIcon,
  ChevronDownIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export interface FilterState {
  priceRange: [number, number];
  duration: string[];
  rating: number;
  location: string[];
  dateRange: DateRange | undefined;
  sortBy: string;
}

interface TourFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isSticky?: boolean;
}

export function TourFilters({
  filters,
  onFiltersChange,
  isSticky = false,
}: TourFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    price: true,
    duration: true,
    rating: true,
    location: true,
    date: true,
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: "duration" | "location", value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 50000000],
      duration: [],
      rating: 0,
      location: [],
      sortBy: "featured",
      dateRange: undefined,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000) count++;
    if (filters.duration.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.dateRange) count++;
    return count;
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <div className={isSticky ? "sticky top-4" : ""}>
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Bộ lọc
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <Card className={`${isOpen ? "block" : "hidden"} lg:block`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Bộ lọc</CardTitle>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Xóa tất cả
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Sắp xếp theo</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Nổi bật</SelectItem>
                <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Collapsible
            open={openSections.price}
            onOpenChange={() => toggleSection("price")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Khoảng giá</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  openSections.price ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter("priceRange", value)}
                max={50000000}
                min={0}
                step={1000000}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(filters.priceRange[0])}</span>
                <span>{formatCurrency(filters.priceRange[1])}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* <Collapsible
            open={openSections.date}
            onOpenChange={() => toggleSection("date")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Khoảng ngày</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  openSections.date ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger> */}
          {/* <CollapsibleContent className="space-y-3 pt-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "LLL dd, y", {
                            locale: vi,
                          })}{" "}
                          -{" "}
                          {format(filters.dateRange.to, "LLL dd, y", {
                            locale: vi,
                          })}
                        </>
                      ) : (
                        format(filters.dateRange.from, "LLL dd, y", {
                          locale: vi,
                        })
                      )
                    ) : (
                      <span>Chọn khoảng ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => updateFilter("dateRange", range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </CollapsibleContent>
          </Collapsible> */}

          <Collapsible
            open={openSections.duration}
            onOpenChange={() => toggleSection("duration")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Thời gian</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  openSections.duration ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {["1-2 ngày", "3-4 ngày", "5-6 ngày", "7+ ngày"].map(
                (duration) => (
                  <div key={duration} className="flex items-center space-x-2">
                    <Checkbox
                      id={duration}
                      checked={filters.duration.includes(duration)}
                      onCheckedChange={() =>
                        toggleArrayFilter("duration", duration)
                      }
                    />
                    <Label htmlFor={duration} className="text-sm">
                      {duration}
                    </Label>
                  </div>
                )
              )}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openSections.location}
            onOpenChange={() => toggleSection("location")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Địa điểm</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  openSections.location ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {[
                "Hà Nội",
                "Đà Nẵng",
                "TP. Hồ Chí Minh",
                "Hạ Long",
                "Phú Quốc",
                "Sa Pa",
              ].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.location.includes(location)}
                    onCheckedChange={() =>
                      toggleArrayFilter("location", location)
                    }
                  />
                  <Label htmlFor={`location-${location}`} className="text-sm">
                    {location}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
