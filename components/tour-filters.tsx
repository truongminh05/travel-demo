"use client"

import { useState } from "react"
import { FilterIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export interface FilterState {
  priceRange: [number, number]
  duration: string[]
  rating: number
  co2Impact: string[]
  cancellation: string[]
  location: string[]
  sortBy: string
}

interface TourFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isSticky?: boolean
}

export function TourFilters({ filters, onFiltersChange, isSticky = false }: TourFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSections, setOpenSections] = useState({
    price: true,
    duration: true,
    rating: true,
    sustainability: true,
    cancellation: true,
    location: true,
  })

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 2000],
      duration: [],
      rating: 0,
      co2Impact: [],
      cancellation: [],
      location: [],
      sortBy: "featured",
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) count++
    if (filters.duration.length > 0) count++
    if (filters.rating > 0) count++
    if (filters.co2Impact.length > 0) count++
    if (filters.cancellation.length > 0) count++
    if (filters.location.length > 0) count++
    return count
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className={isSticky ? "sticky top-4" : ""}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between">
          <span className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className={`${isOpen ? "block" : "hidden"} lg:block`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort by</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="duration-short">Duration: Shortest</SelectItem>
                <SelectItem value="duration-long">Duration: Longest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Price Range</Label>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.price ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter("priceRange", value)}
                max={2000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Duration */}
          <Collapsible open={openSections.duration} onOpenChange={() => toggleSection("duration")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Duration</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${openSections.duration ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {["1-2 days", "3-4 days", "5-6 days", "7+ days"].map((duration) => (
                <div key={duration} className="flex items-center space-x-2">
                  <Checkbox
                    id={duration}
                    checked={filters.duration.includes(duration)}
                    onCheckedChange={() => toggleArrayFilter("duration", duration)}
                  />
                  <Label htmlFor={duration} className="text-sm">
                    {duration}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Rating */}
          <Collapsible open={openSections.rating} onOpenChange={() => toggleSection("rating")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Minimum Rating</Label>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.rating ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onCheckedChange={() => updateFilter("rating", filters.rating === rating ? 0 : rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1">
                    {rating}+ ⭐
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Sustainability */}
          <Collapsible open={openSections.sustainability} onOpenChange={() => toggleSection("sustainability")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Sustainability</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${openSections.sustainability ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {["low", "medium", "high"].map((impact) => (
                <div key={impact} className="flex items-center space-x-2">
                  <Checkbox
                    id={`co2-${impact}`}
                    checked={filters.co2Impact.includes(impact)}
                    onCheckedChange={() => toggleArrayFilter("co2Impact", impact)}
                  />
                  <Label htmlFor={`co2-${impact}`} className="text-sm capitalize">
                    {impact} CO2 Impact
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Cancellation Policy */}
          <Collapsible open={openSections.cancellation} onOpenChange={() => toggleSection("cancellation")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Cancellation</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${openSections.cancellation ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {[
                { value: "free", label: "Free Cancellation" },
                { value: "partial", label: "Partial Refund" },
                { value: "none", label: "Non-refundable" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cancel-${option.value}`}
                    checked={filters.cancellation.includes(option.value)}
                    onCheckedChange={() => toggleArrayFilter("cancellation", option.value)}
                  />
                  <Label htmlFor={`cancel-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Location */}
          <Collapsible open={openSections.location} onOpenChange={() => toggleSection("location")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <Label className="text-sm font-medium">Location</Label>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${openSections.location ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {["Colorado", "California", "Arizona", "South Carolina", "Wyoming"].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.location.includes(location)}
                    onCheckedChange={() => toggleArrayFilter("location", location)}
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
  )
}
