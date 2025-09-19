import { notFound } from "next/navigation"
import { CalendarIcon, ClockIcon, ShareIcon, BookmarkIcon, ArrowLeftIcon, TagIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"

// Sample blog post data - in a real app, this would come from a CMS or database
const blogPosts = {
  "ultimate-guide-national-parks-2024": {
    slug: "ultimate-guide-national-parks-2024",
    title: "The Ultimate Guide to America's National Parks in 2024",
    excerpt:
      "Discover the best times to visit, hidden gems, and insider tips for exploring America's most spectacular national parks this year.",
    content: `
      <p>America's national parks are treasures that showcase the incredible diversity of our country's natural landscapes. From the towering peaks of the Rocky Mountains to the otherworldly formations of the Southwest, each park offers unique experiences that create lasting memories.</p>

      <h2>Planning Your National Park Adventure</h2>
      <p>The key to a successful national park visit lies in proper planning. Peak seasons vary by location, but generally, summer months see the highest visitor numbers. For a more peaceful experience, consider visiting during shoulder seasons when crowds are thinner and weather is still favorable.</p>

      <h3>Best Times to Visit Popular Parks</h3>
      <ul>
        <li><strong>Yellowstone:</strong> May-September for full access, though spring and fall offer unique wildlife viewing opportunities</li>
        <li><strong>Grand Canyon:</strong> March-May and September-November for comfortable temperatures</li>
        <li><strong>Yosemite:</strong> April-October, with waterfalls at their peak in late spring</li>
        <li><strong>Great Smoky Mountains:</strong> April-May for wildflowers, October for fall foliage</li>
      </ul>

      <h2>Hidden Gems and Lesser-Known Spots</h2>
      <p>While iconic viewpoints are must-sees, some of the most memorable experiences come from exploring lesser-known areas. Research ranger-recommended trails and ask locals for their favorite spots that don't appear in guidebooks.</p>

      <h3>Insider Tips for Each Region</h3>
      <p><strong>Western Parks:</strong> Start early to avoid crowds and afternoon heat. Bring layers as mountain weather can change quickly.</p>
      <p><strong>Eastern Parks:</strong> Focus on seasonal highlights like fall foliage or spring wildflowers. Many eastern parks offer excellent winter activities.</p>

      <h2>Sustainable Park Visiting</h2>
      <p>As visitor numbers continue to grow, it's crucial to practice Leave No Trace principles. Stay on designated trails, pack out all trash, and respect wildlife by maintaining safe distances.</p>

      <p>National parks are not just destinations; they're living classrooms that teach us about conservation, history, and the natural world. Take time to participate in ranger programs and visit visitor centers to deepen your understanding of these special places.</p>
    `,
    image: "/blog-national-parks-guide-mountains-landscape.png",
    author: "Sarah Johnson",
    authorImage: "/professional-woman-ceo-travel-industry.png",
    authorBio:
      "Sarah is TravelDom's founder and has visited all 63 national parks. She's passionate about sustainable tourism and helping others discover America's natural wonders.",
    date: "January 15, 2024",
    readTime: "12 min read",
    category: "Travel Guides",
    tags: ["National Parks", "Travel Planning", "Nature", "Adventure"],
    featured: true,
  },
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  const relatedPosts = [
    {
      slug: "spring-travel-destinations-2024",
      title: "10 Perfect Spring Travel Destinations in the US",
      image: "/blog-spring-destinations-cherry-blossoms-flowers.png",
      category: "Seasonal Guides",
    },
    {
      slug: "hidden-gems-colorado-rockies",
      title: "Hidden Gems in the Colorado Rockies You've Never Heard Of",
      image: "/blog-colorado-hidden-gems-mountain-lake-wilderness.png",
      category: "Destination Highlights",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Back Navigation */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge variant="outline" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{post.title}</h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Image
                    src={post.authorImage || "/placeholder.svg"}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Tags */}
                  <div className="mt-12 pt-8 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <TagIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Author Bio */}
                  <Card className="mt-12">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={post.authorImage || "/placeholder.svg"}
                          alt={post.author}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-lg mb-2">About {post.author}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{post.authorBio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    {/* Table of Contents */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">In This Article</h3>
                        <nav className="space-y-2 text-sm">
                          <a
                            href="#planning"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Planning Your Adventure
                          </a>
                          <a
                            href="#timing"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Best Times to Visit
                          </a>
                          <a
                            href="#hidden-gems"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Hidden Gems
                          </a>
                          <a
                            href="#sustainable"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Sustainable Visiting
                          </a>
                        </nav>
                      </CardContent>
                    </Card>

                    {/* Newsletter */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get weekly travel tips and destination guides.
                        </p>
                        <Button className="w-full" size="sm">
                          Subscribe
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-background/90 text-foreground">
                          {relatedPost.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4 text-balance">{relatedPost.title}</h3>
                      <Button variant="outline" size="sm" asChild className="bg-transparent">
                        <Link href={`/blog/${relatedPost.slug}`}>Read Article</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
