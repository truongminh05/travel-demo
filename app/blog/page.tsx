import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const featuredPost = {
    slug: "ultimate-guide-national-parks-2024",
    title: "The Ultimate Guide to America's National Parks in 2024",
    excerpt:
      "Discover the best times to visit, hidden gems, and insider tips for exploring America's most spectacular national parks this year.",
    image: "/blog-national-parks-guide-mountains-landscape.png",
    author: "Sarah Johnson",
    authorImage: "/professional-woman-ceo-travel-industry.png",
    date: "January 15, 2024",
    readTime: "12 min read",
    category: "Travel Guides",
    featured: true,
  }

  const blogPosts = [
    {
      slug: "spring-travel-destinations-2024",
      title: "10 Perfect Spring Travel Destinations in the US",
      excerpt: "From cherry blossoms in Washington DC to wildflowers in Texas, discover the best spring destinations.",
      image: "/blog-spring-destinations-cherry-blossoms-flowers.png",
      author: "Emily Rodriguez",
      authorImage: "/placeholder-493u9.png",
      date: "January 12, 2024",
      readTime: "8 min read",
      category: "Seasonal Guides",
    },
    {
      slug: "budget-travel-tips-domestic",
      title: "How to Travel America on a Budget: 15 Money-Saving Tips",
      excerpt:
        "Expert strategies to explore the US without breaking the bank, from accommodation hacks to dining deals.",
      image: "/blog-budget-travel-tips-money-saving-backpack.png",
      author: "Michael Chen",
      authorImage: "/professional-man-operations-manager-travel.png",
      date: "January 10, 2024",
      readTime: "10 min read",
      category: "Travel Tips",
    },
    {
      slug: "hidden-gems-colorado-rockies",
      title: "Hidden Gems in the Colorado Rockies You've Never Heard Of",
      excerpt:
        "Venture beyond the popular trails to discover secret waterfalls, pristine lakes, and untouched wilderness.",
      image: "/blog-colorado-hidden-gems-mountain-lake-wilderness.png",
      author: "David Thompson",
      authorImage: "/placeholder-ihg94.png",
      date: "January 8, 2024",
      readTime: "7 min read",
      category: "Destination Highlights",
    },
    {
      slug: "sustainable-travel-practices",
      title: "Sustainable Travel: How to Explore Responsibly",
      excerpt: "Learn how to minimize your environmental impact while maximizing your travel experiences.",
      image: "/blog-sustainable-travel-eco-friendly-nature.png",
      author: "David Thompson",
      authorImage: "/placeholder-ihg94.png",
      date: "January 5, 2024",
      readTime: "9 min read",
      category: "Sustainable Travel",
    },
    {
      slug: "family-friendly-destinations-summer",
      title: "Best Family-Friendly Summer Destinations",
      excerpt: "Kid-approved destinations that parents will love too, with activities for every age group.",
      image: "/blog-family-travel-summer-beach-kids-fun.png",
      author: "Emily Rodriguez",
      authorImage: "/placeholder-493u9.png",
      date: "January 3, 2024",
      readTime: "6 min read",
      category: "Family Travel",
    },
    {
      slug: "photography-tips-landscape",
      title: "Landscape Photography Tips for Travel Enthusiasts",
      excerpt: "Capture stunning travel photos with these professional techniques and equipment recommendations.",
      image: "/blog-photography-tips-camera-landscape-sunset.png",
      author: "Sarah Johnson",
      authorImage: "/professional-woman-ceo-travel-industry.png",
      date: "December 28, 2023",
      readTime: "11 min read",
      category: "Photography",
    },
  ]

  const categories = [
    { name: "All Posts", count: 24, active: true },
    { name: "Travel Tips", count: 8 },
    { name: "Destination Highlights", count: 6 },
    { name: "Seasonal Guides", count: 4 },
    { name: "Family Travel", count: 3 },
    { name: "Sustainable Travel", count: 2 },
    { name: "Photography", count: 1 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4">
              Travel Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Travel Stories & Expert Tips
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Discover insider secrets, seasonal guides, and destination highlights from our travel experts. Get
              inspired for your next American adventure.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input placeholder="Search articles..." className="flex-1" />
                <Button>Search</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Badge className="mb-4">Featured Article</Badge>
              <h2 className="text-3xl font-bold text-foreground">Editor's Pick</h2>
            </div>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] lg:aspect-auto">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-4 text-balance">{featuredPost.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{featuredPost.excerpt}</p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Image
                        src={featuredPost.authorImage || "/placeholder.svg"}
                        alt={featuredPost.author}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-fit">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read Full Article
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            category.active
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{category.name}</span>
                            <span className="text-xs">{category.count}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest travel tips and destination guides delivered to your inbox.
                    </p>
                    <div className="space-y-2">
                      <Input placeholder="Your email address" type="email" />
                      <Button className="w-full" size="sm">
                        Subscribe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Posts Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Latest Articles</h2>
                  <p className="text-muted-foreground">{blogPosts.length} articles</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {blogPosts.map((post, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative aspect-[4/3]">
                        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-background/90 text-foreground">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 text-balance line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3 mb-4">
                          <Image
                            src={post.authorImage || "/placeholder.svg"}
                            alt={post.author}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-xs font-medium">{post.author}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.slug}`}>
                              Read More
                              <ArrowRightIcon className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="bg-transparent">
                    Load More Articles
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Turn Inspiration into Adventure?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-balance">
              Browse our curated tours and start planning your next unforgettable American journey.
            </p>
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link href="/#tours">Explore Our Tours</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
