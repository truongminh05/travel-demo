"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionWrapper } from "@/components/motion-wrapper";
import {
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <MotionWrapper direction="up" duration={800}>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Discover Amazing
              <span className="text-primary block">Domestic Adventures</span>
            </h1>
          </MotionWrapper>

          <MotionWrapper delay={200} direction="up" duration={800}>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
              Explore breathtaking destinations across the country with our
              curated travel experiences. From mountain retreats to coastal
              escapes, find your perfect getaway.
            </p>
          </MotionWrapper>

          <MotionWrapper delay={400} direction="up" duration={800}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 py-4 text-lg">
                <Link href="/tours">Explore Tours</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg bg-transparent"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </MotionWrapper>

          {/* Quick Stats */}
          <MotionWrapper delay={600} direction="up" duration={800}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
              {[
                { value: "500+", label: "Destinations" },
                { value: "50K+", label: "Happy Travelers" },
                { value: "4.9", label: "Average Rating" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" duration={600}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose TravelDom?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We make domestic travel simple, affordable, and unforgettable
                with our comprehensive platform
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPinIcon,
                title: "Curated Destinations",
                description:
                  "Hand-picked locations across the country, from hidden gems to popular attractions",
              },
              {
                icon: StarIcon,
                title: "Premium Experiences",
                description:
                  "High-quality tours and accommodations with verified reviews and ratings",
              },
              {
                icon: ShieldCheckIcon,
                title: "Secure Booking",
                description:
                  "Safe and secure payment processing with flexible cancellation policies",
              },
              {
                icon: HeartIcon,
                title: "Personalized Service",
                description:
                  "Tailored recommendations and 24/7 customer support for your peace of mind",
              },
              {
                icon: TrendingUpIcon,
                title: "Best Prices",
                description:
                  "Competitive pricing with exclusive deals and transparent cost breakdown",
              },
              {
                icon: UsersIcon,
                title: "Community Driven",
                description:
                  "Real reviews from fellow travelers to help you make informed decisions",
              },
            ].map((feature, index) => (
              <MotionWrapper
                key={index}
                delay={index * 100}
                direction="up"
                duration={600}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" duration={600}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Popular Travel Categories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the type of adventure that speaks to you
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Mountain Adventures",
                description:
                  "Scenic peaks, hiking trails, and cozy mountain retreats",
                image: "/mountain-retreat-colorado-aspen-snow-peaks.png",
                link: "/tours?category=adventure-tours",
              },
              {
                title: "Beach Getaways",
                description: "Coastal escapes with sun, sand, and ocean views",
                image: "/beach-resort-myrtle-beach-ocean-waves-palm-trees.png",
                link: "/tours?category=family-trips",
              },
              {
                title: "City Experiences",
                description:
                  "Urban adventures, culture, and historic landmarks",
                image:
                  "/charleston-historic-district-cobblestone-streets-s.png",
                link: "/tours?category=experiences",
              },
              {
                title: "Wine Country",
                description:
                  "Vineyard tours, tastings, and gourmet experiences",
                image:
                  "/napa-valley-vineyard-wine-tasting-rolling-hills-gr.png",
                link: "/tours?category=combo-packages",
              },
              {
                title: "National Parks",
                description: "Wildlife, camping, and natural wonders",
                image:
                  "/yellowstone-national-park-geysers-wildlife-camping.png",
                link: "/tours?category=adventure-tours",
              },
              {
                title: "Desert Landscapes",
                description:
                  "Unique formations, stargazing, and desert adventures",
                image: "/sedona-arizona-red-rocks-desert-landscape-sunset.png",
                link: "/tours?category=adventure-tours",
              },
            ].map((category, index) => (
              <MotionWrapper
                key={index}
                delay={index * 100}
                direction="up"
                duration={600}
              >
                <Link href={category.link}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </MotionWrapper>
            ))}
          </div>

          <MotionWrapper delay={600} direction="up" duration={600}>
            <div className="text-center mt-12">
              <Button asChild size="lg" className="px-8">
                <Link href="/tours">View All Tours</Link>
              </Button>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <MotionWrapper direction="up" duration={800}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing domestic
              destinations with TravelDom
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/tours">Browse Tours</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 bg-transparent"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
