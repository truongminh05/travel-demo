import { HeartIcon, ShieldCheckIcon, GlobeIcon, UsersIcon, AwardIcon, StarIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/professional-woman-ceo-travel-industry.png",
      bio: "With 15+ years in the travel industry, Sarah founded TravelDom to make domestic adventures accessible to everyone.",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "/professional-man-operations-manager-travel.png",
      bio: "Michael ensures every tour runs smoothly, bringing his expertise in logistics and customer service.",
    },
    {
      name: "Emily Rodriguez",
      role: "Travel Experience Designer",
      image: "/placeholder-493u9.png",
      bio: "Emily crafts unique itineraries that showcase the hidden gems and authentic experiences of each destination.",
    },
    {
      name: "David Thompson",
      role: "Sustainability Director",
      image: "/placeholder-ihg94.png",
      bio: "David leads our commitment to responsible travel, ensuring our tours benefit local communities and protect the environment.",
    },
  ]

  const values = [
    {
      icon: HeartIcon,
      title: "Passion for Adventure",
      description:
        "We believe every journey should inspire and transform. Our passion drives us to create unforgettable experiences.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Trust & Safety",
      description:
        "Your safety is our priority. We maintain the highest standards and work with certified local partners.",
    },
    {
      icon: GlobeIcon,
      title: "Sustainable Travel",
      description:
        "We're committed to responsible tourism that benefits local communities and preserves natural beauty.",
    },
    {
      icon: UsersIcon,
      title: "Community First",
      description: "We support local businesses and communities, ensuring your travel dollars make a positive impact.",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Happy Travelers" },
    { number: "500+", label: "Unique Tours" },
    { number: "15", label: "Years Experience" },
    { number: "4.9", label: "Average Rating" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                About TravelDom
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                Discover America's Hidden Treasures
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-balance leading-relaxed">
                We're passionate about showcasing the incredible diversity and beauty of domestic travel. From coast to
                coast, we curate authentic experiences that connect you with local culture, stunning landscapes, and
                unforgettable memories.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#tours" className="inline-flex">
                  <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Explore Our Tours
                  </button>
                </Link>
                <Link href="/contact" className="inline-flex">
                  <button className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                    Get in Touch
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2009, TravelDom was born from a simple belief: America's backyard holds some of the
                    world's most incredible destinations. While others looked abroad for adventure, we saw the untapped
                    potential in domestic travel.
                  </p>
                  <p>
                    What started as weekend trips to nearby national parks has grown into a comprehensive platform
                    offering hundreds of curated experiences across all 50 states. We've helped over 50,000 travelers
                    discover hidden gems, from the rugged coastlines of Maine to the desert landscapes of Arizona.
                  </p>
                  <p>
                    Today, we're proud to be America's leading domestic travel company, committed to sustainable
                    tourism, community support, and creating memories that last a lifetime.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder-0t1a0.png"
                  alt="TravelDom team planning tours"
                  width={600}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                These core principles guide everything we do, from tour design to customer service.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                The passionate individuals behind your next great adventure.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-20 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Awards & Recognition</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                We're honored to be recognized for our commitment to excellence.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <AwardIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Best Domestic Tour Operator</h3>
                  <p className="text-muted-foreground text-sm">Travel Excellence Awards 2023</p>
                </CardContent>
              </Card>
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <StarIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Top Customer Service</h3>
                  <p className="text-muted-foreground text-sm">Tourism Industry Awards 2023</p>
                </CardContent>
              </Card>
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <GlobeIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Sustainable Tourism Leader</h3>
                  <p className="text-muted-foreground text-sm">Green Travel Certification 2023</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-balance">
              Join thousands of travelers who have discovered the magic of domestic exploration with TravelDom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#tours" className="inline-flex">
                <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors">
                  Browse Tours
                </button>
              </Link>
              <Link href="/contact" className="inline-flex">
                <button className="border border-primary-foreground/20 px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
