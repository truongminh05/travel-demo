import { notFound } from "next/navigation";
import {
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  LeafIcon,
  XIcon,
  CheckIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import Link from "next/link";

// Sample tour data - in a real app, this would come from a database
const tours = {
  "mountain-retreat-colorado": {
    id: "mountain-retreat-colorado",
    title: "Mountain Retreat in Colorado",
    location: "Aspen, Colorado",
    image: "/mountain-retreat-colorado-aspen-snow-peaks.png",
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 124,
    duration: "5 days",
    cancellation: "free" as const,
    co2Impact: "low" as const,
    highlights: ["Mountain Views", "Spa Access", "Guided Hiking"],
    description:
      "Experience the breathtaking beauty of Colorado's Rocky Mountains with our luxury mountain retreat. Nestled in the heart of Aspen, this 5-day adventure combines relaxation with outdoor exploration.",
    gallery: [
      "/mountain-retreat-colorado-aspen-snow-peaks.png",
      "/sedona-arizona-red-rocks-desert-landscape-sunset.png",
      "/yellowstone-national-park-geysers-wildlife-camping.png",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Welcome",
        activities: [
          "Airport pickup",
          "Check-in at luxury lodge",
          "Welcome dinner",
          "Evening orientation",
        ],
      },
      {
        day: 2,
        title: "Mountain Exploration",
        activities: [
          "Guided hiking tour",
          "Scenic chairlift ride",
          "Lunch at mountain peak",
          "Spa treatment",
        ],
      },
      {
        day: 3,
        title: "Adventure Day",
        activities: [
          "Rock climbing session",
          "Mountain biking",
          "Picnic lunch",
          "Photography workshop",
        ],
      },
      {
        day: 4,
        title: "Relaxation & Culture",
        activities: [
          "Yoga session",
          "Local art gallery visit",
          "Cooking class",
          "Farewell dinner",
        ],
      },
      {
        day: 5,
        title: "Departure",
        activities: [
          "Final breakfast",
          "Check-out",
          "Airport transfer",
          "Safe travels home",
        ],
      },
    ],
    included: [
      "4 nights luxury accommodation",
      "All meals and beverages",
      "Professional guide services",
      "All activities and equipment",
      "Airport transfers",
      "Travel insurance",
    ],
    excluded: [
      "International flights",
      "Personal expenses",
      "Gratuities",
      "Optional activities",
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2024-01-15",
        comment:
          "Absolutely incredible experience! The mountain views were breathtaking and the staff was exceptional.",
      },
      {
        id: 2,
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2024-01-10",
        comment:
          "Perfect blend of adventure and relaxation. The guided hikes were amazing and the spa was so relaxing.",
      },
      {
        id: 3,
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        date: "2024-01-05",
        comment:
          "Great tour overall! The accommodation was luxurious and the activities were well-organized.",
      },
    ],
    maxGuests: 12,
    minAge: 16,
    difficulty: "Moderate",
    departureDate: "2024-03-15",
  },
  // Add more tours as needed
};

interface TourDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params; // ✅ phải await Promise
  const tour = tours[id as keyof typeof tours];

  if (!tour) {
    notFound();
  }
  const getCancellationText = (type: string) => {
    switch (type) {
      case "free":
        return "Free cancellation up to 24 hours before departure";
      case "partial":
        return "50% refund if cancelled 48 hours before departure";
      case "none":
        return "Non-refundable booking";
      default:
        return "";
    }
  };

  const getCO2Badge = (impact: string) => {
    switch (impact) {
      case "low":
        return {
          text: "Low CO2e Impact",
          variant: "default" as const,
          description: "This tour has minimal environmental impact",
        };
      case "medium":
        return {
          text: "Medium CO2e Impact",
          variant: "secondary" as const,
          description: "This tour has moderate environmental impact",
        };
      case "high":
        return {
          text: "High CO2e Impact",
          variant: "destructive" as const,
          description: "This tour has higher environmental impact",
        };
      default:
        return {
          text: "Low CO2e Impact",
          variant: "default" as const,
          description: "This tour has minimal environmental impact",
        };
    }
  };

  const co2Badge = getCO2Badge(tour.co2Impact);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/#tours"
            className="hover:text-foreground transition-colors"
          >
            Tours
          </Link>
          <span>/</span>
          <span className="text-foreground">{tour.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={co2Badge.variant}
                className="flex items-center gap-1"
              >
                <LeafIcon className="w-3 h-3" />
                {co2Badge.text}
              </Badge>
              {tour.originalPrice && (
                <Badge variant="destructive">
                  Save ${tour.originalPrice - tour.price}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-2">
              {tour.title}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                <span>Max {tour.maxGuests} guests</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium ml-1">{tour.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({tour.reviewCount} reviews)
              </span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {tour.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {tour.highlights.map((highlight, index) => (
                <Badge key={index} variant="outline">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src={tour.image || "/placeholder.svg"}
              alt={tour.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tour.gallery.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${tour.title} gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="included">What's Included</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="itinerary" className="space-y-4">
                <h3 className="text-2xl font-semibold mb-4">Daily Itinerary</h3>
                {tour.itinerary.map((day) => (
                  <Card key={day.day}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </span>
                        Day {day.day}: {day.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {day.activities.map((activity, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-green-600" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="included" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-red-600">
                    What's Not Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <XIcon className="w-4 h-4 text-red-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-muted-foreground">
                      ({tour.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {tour.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.avatar || "/placeholder.svg"}
                              alt={review.name}
                            />
                            <AvatarFallback>
                              {review.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.name}</h4>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">Book This Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {tour.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${tour.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-primary">
                      ${tour.price}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    per person
                  </span>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Guests:</span>
                    <span className="font-medium">{tour.maxGuests} people</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Min Age:</span>
                    <span className="font-medium">{tour.minAge} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium">{tour.difficulty}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Next Departure:
                    </span>
                    <div className="font-medium">{tour.departureDate}</div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Cancellation:</span>
                    <div className="font-medium text-green-600">
                      {getCancellationText(tour.cancellation)}
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Book Now - ${tour.price}
                </Button>

                <Button variant="outline" className="w-full bg-transparent">
                  Request Consultation
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  Free cancellation up to 24 hours before departure
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
