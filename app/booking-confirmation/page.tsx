import { CheckCircleIcon, CalendarIcon, MapPinIcon, UsersIcon, PrinterIcon, MailIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"

export default function BookingConfirmationPage() {
  // In a real app, you would fetch booking details based on booking ID
  const bookingDetails = {
    bookingId: "TRV-2024-001234",
    tour: {
      title: "Mountain Retreat in Colorado",
      location: "Aspen, Colorado",
      duration: "5 days",
      departureDate: "March 15, 2024",
      price: 899,
    },
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    guests: 2,
    total: 1870,
    bookingDate: "January 20, 2024",
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">Thank you for your booking. Your adventure awaits!</p>
          </div>

          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-semibold text-lg">{bookingDetails.bookingId}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-medium">{bookingDetails.bookingDate}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{bookingDetails.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{bookingDetails.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{bookingDetails.customer.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tour Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{bookingDetails.tour.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{bookingDetails.tour.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{bookingDetails.tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      <span>{bookingDetails.guests} guests</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Departure Date</p>
                  <p className="font-medium text-lg">{bookingDetails.tour.departureDate}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                  <p className="font-bold text-2xl text-primary">${bookingDetails.total}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <MailIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Confirmation Email</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a detailed confirmation email with your booking voucher within 5 minutes.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Pre-Trip Information</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll send you detailed trip information and packing lists 2 weeks before departure.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <CheckCircleIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Ready to Go!</h4>
                  <p className="text-sm text-muted-foreground">
                    Show up at the meeting point on your departure date and enjoy your adventure!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2">
              <PrinterIcon className="w-4 h-4" />
              Print Confirmation
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/#tours">Browse More Tours</Link>
            </Button>
          </div>

          {/* Important Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Cancellation Policy</h4>
                <p className="text-muted-foreground">
                  Free cancellation up to 24 hours before departure. 50% refund for cancellations made 24-48 hours
                  before departure.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Contact Information</h4>
                <p className="text-muted-foreground">
                  For any questions or changes to your booking, contact us at:
                  <br />
                  Phone: 1-800-TRAVEL
                  <br />
                  Email: bookings@traveldom.com
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Travel Documents</h4>
                <p className="text-muted-foreground">
                  Please ensure you have valid identification for travel. Specific requirements will be included in your
                  confirmation email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
