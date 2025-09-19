"use client"

import { useState } from "react"
import {
  UserIcon,
  CalendarIcon,
  SettingsIcon,
  MapPinIcon,
  StarIcon,
  HeartIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Denver, CO 80202",
    bio: "Adventure enthusiast who loves exploring America's national parks and hidden gems.",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    bookingReminders: true,
  })

  // Sample data - in a real app, this would come from an API
  const bookingHistory = [
    {
      id: "TRV-2024-001234",
      tour: "Mountain Retreat in Colorado",
      location: "Aspen, Colorado",
      image: "/mountain-retreat-colorado-aspen-snow-peaks.png",
      date: "March 15, 2024",
      status: "upcoming",
      guests: 2,
      total: 1870,
      bookingDate: "January 20, 2024",
    },
    {
      id: "TRV-2023-005678",
      tour: "Coastal Adventure in Maine",
      location: "Acadia National Park",
      image: "/placeholder.svg?height=200&width=300",
      date: "August 10, 2023",
      status: "completed",
      guests: 1,
      total: 1299,
      bookingDate: "June 15, 2023",
      rating: 5,
    },
    {
      id: "TRV-2023-003456",
      tour: "Desert Explorer Arizona",
      location: "Sedona, Arizona",
      image: "/sedona-arizona-red-rocks-desert-landscape-sunset.png",
      date: "November 5, 2023",
      status: "completed",
      guests: 2,
      total: 2150,
      bookingDate: "September 20, 2023",
      rating: 4,
    },
  ]

  const savedTours = [
    {
      id: "beach-resort-myrtle",
      title: "Beach Resort Getaway",
      location: "Myrtle Beach, SC",
      image: "/beach-resort-myrtle-beach-ocean-waves-palm-trees.png",
      price: 699,
      originalPrice: 899,
      rating: 4.6,
      duration: "4 days",
      savedDate: "2024-01-15",
    },
    {
      id: "napa-valley-wine",
      title: "Napa Valley Wine Tour",
      location: "Napa Valley, CA",
      image: "/napa-valley-vineyard-wine-tasting-rolling-hills-gr.png",
      price: 1299,
      rating: 4.9,
      duration: "3 days",
      savedDate: "2024-01-10",
    },
    {
      id: "yellowstone-adventure",
      title: "Yellowstone National Park",
      location: "Wyoming",
      image: "/yellowstone-national-park-geysers-wildlife-camping.png",
      price: 1599,
      rating: 4.8,
      duration: "7 days",
      savedDate: "2024-01-05",
    },
  ]

  const handleProfileUpdate = (field: string, value: string) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const removeSavedTour = (tourId: string) => {
    // In a real app, this would make an API call
    console.log("Removing saved tour:", tourId)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={userProfile.avatar || "/placeholder.svg"}
                alt={`${userProfile.firstName} ${userProfile.lastName}`}
              />
              <AvatarFallback>
                {userProfile.firstName[0]}
                {userProfile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {userProfile.firstName}!</h1>
              <p className="text-muted-foreground">Manage your bookings, saved tours, and account settings</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <HeartIcon className="w-4 h-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <BellIcon className="w-4 h-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <HeartIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{savedTours.length}</p>
                        <p className="text-sm text-muted-foreground">Saved Tours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <StarIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">4.7</p>
                        <p className="text-sm text-muted-foreground">Avg Rating Given</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Upcoming trip to Colorado</p>
                        <p className="text-sm text-muted-foreground">Departing March 15, 2024</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <HeartIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Saved Beach Resort Getaway</p>
                        <p className="text-sm text-muted-foreground">Added to wishlist</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Tour
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Bookings</h2>
                <Button asChild>
                  <Link href="/#tours">Book New Tour</Link>
                </Button>
              </div>

              <div className="space-y-6">
                {bookingHistory.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-6 items-center">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                          <Image
                            src={booking.image || "/placeholder.svg"}
                            alt={booking.tour}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{booking.tour}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              <span>{booking.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{booking.date}</span>
                            </div>
                            <p>Booking ID: {booking.id}</p>
                            <p>Guests: {booking.guests}</p>
                          </div>
                          {booking.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">You rated this {booking.rating}/5</span>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${booking.total}</p>
                          <p className="text-sm text-muted-foreground mb-4">Total paid</p>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              <EyeIcon className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {booking.status === "upcoming" && (
                              <Button variant="outline" size="sm" className="w-full bg-transparent">
                                Manage Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Wishlist</h2>
                <p className="text-muted-foreground">{savedTours.length} saved tours</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTours.map((tour) => (
                  <Card key={tour.id} className="overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={() => removeSavedTour(tour.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{tour.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{tour.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{tour.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">• {tour.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {tour.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              ${tour.originalPrice}
                            </span>
                          )}
                          <span className="text-lg font-bold text-primary">${tour.price}</span>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/tours/${tour.id}`}>View Tour</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                  <EditIcon className="w-4 h-4 mr-2" />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={userProfile.firstName}
                          onChange={(e) => handleProfileUpdate("firstName", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={userProfile.lastName}
                          onChange={(e) => handleProfileUpdate("lastName", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => handleProfileUpdate("email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userProfile.phone}
                        onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={userProfile.address}
                        onChange={(e) => handleProfileUpdate("address", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={userProfile.bio}
                        onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CreditCardIcon className="w-4 h-4 mr-2" />
                      Payment Methods
                    </Button>

                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>

                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Download My Data
                    </Button>

                    <Separator />

                    <Button variant="destructive" className="w-full justify-start">
                      <LogOutIcon className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <h2 className="text-2xl font-bold">Notification Preferences</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive booking confirmations and updates</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications" className="text-base font-medium">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Get text messages for urgent updates</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketingEmails" className="text-base font-medium">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive special offers and new tour announcements</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="bookingReminders" className="text-base font-medium">
                        Booking Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">Get reminders before your trip departure</p>
                    </div>
                    <Switch
                      id="bookingReminders"
                      checked={preferences.bookingReminders}
                      onCheckedChange={(checked) => handlePreferenceChange("bookingReminders", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
