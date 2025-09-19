import { MapPinIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TourMapProps {
  tours: Array<{
    id: string
    title: string
    location: string
    price: number
    rating: number
    co2Impact: "low" | "medium" | "high"
  }>
}

export function TourMap({ tours }: TourMapProps) {
  // Mock coordinates for demonstration
  const tourLocations = [
    { id: "1", name: "Aspen, Colorado", x: 25, y: 40, tours: tours.filter((t) => t.location.includes("Colorado")) },
    {
      id: "2",
      name: "Myrtle Beach, SC",
      x: 75,
      y: 65,
      tours: tours.filter((t) => t.location.includes("South Carolina")),
    },
    { id: "3", name: "Sedona, Arizona", x: 20, y: 60, tours: tours.filter((t) => t.location.includes("Arizona")) },
    { id: "4", name: "Charleston, SC", x: 78, y: 68, tours: tours.filter((t) => t.location.includes("Charleston")) },
    { id: "5", name: "Napa Valley, CA", x: 8, y: 45, tours: tours.filter((t) => t.location.includes("California")) },
    { id: "6", name: "Yellowstone, WY", x: 30, y: 25, tours: tours.filter((t) => t.location.includes("Wyoming")) },
  ]

  return (
    <Card className="h-[600px] overflow-hidden">
      <CardContent className="p-0 h-full relative">
        {/* Map Background */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
          {/* Simplified US Map Outline */}
          <svg
            viewBox="0 0 100 60"
            className="absolute inset-0 w-full h-full opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            {/* Simplified US outline */}
            <path
              d="M10 45 L15 40 L20 35 L25 30 L35 25 L45 20 L55 18 L65 20 L75 25 L85 30 L90 35 L88 45 L85 50 L80 55 L70 58 L60 57 L50 55 L40 52 L30 50 L20 48 L10 45 Z"
              fill="currentColor"
              className="text-muted/10"
            />
          </svg>

          {/* Tour Location Pins */}
          {tourLocations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
            >
              {/* Pin */}
              <div className="relative">
                <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPinIcon className="w-3 h-3 text-white" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-background border rounded-lg shadow-lg p-3 min-w-48">
                    <div className="text-sm font-medium text-foreground mb-1">{location.name}</div>
                    <div className="space-y-1">
                      {location.tours.slice(0, 2).map((tour) => (
                        <div key={tour.id} className="text-xs text-muted-foreground flex justify-between">
                          <span className="truncate mr-2">{tour.title.slice(0, 25)}...</span>
                          <span className="font-medium text-primary">${tour.price}</span>
                        </div>
                      ))}
                      {location.tours.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{location.tours.length - 2} more tours</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium text-foreground mb-2">Legend</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Tour Locations</span>
            </div>
          </div>

          {/* Tour Count */}
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium text-foreground">{tours.length} Tours Available</div>
            <div className="text-xs text-muted-foreground">Across {tourLocations.length} locations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
