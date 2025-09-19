"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Corrected this line
import {
  ArrowLeftIcon,
  CreditCardIcon,
  BanknoteIcon as BanknotesIcon,
  SmartphoneIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import{ useAuth } from "@/hooks/useAuth";
import Link from "next/link";

// Sample tour data - in a real app, this would come from a database or API
const tours = {
  "mountain-retreat-colorado": {
    id: "mountain-retreat-colorado",
    title: "Mountain Retreat in Colorado",
    location: "Aspen, Colorado",
    image: "/mountain-retreat-colorado-aspen-snow-peaks.png",
    price: 899,
    originalPrice: 1199,
    duration: "5 days",
    departureDate: "2024-03-15",
  },
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang login
    // và lưu lại URL hiện tại để quay lại sau khi đăng nhập thành công.
    if (!isAuthenticated) {
      router.push(`/login?redirect=/checkout`);
    }
  }, [isAuthenticated, router]);
  const tourId = searchParams.get("tour");
  const guests = Number.parseInt(searchParams.get("guests") || "1");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    specialRequests: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const tour = tourId ? tours[tourId as keyof typeof tours] : null;

  useEffect(() => {
    if (!tourId) {
      // Chỉ chuyển hướng về trang chủ nếu không có tourId
      router.push("/");
    }
  }, [tourId, router]);

  // Nếu chưa đăng nhập hoặc chưa có tour, hiển thị loading hoặc null
  if (!isAuthenticated || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  const subtotal = tour.price * guests;
  const taxes = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + taxes;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to confirmation page
    router.push(`/booking-confirmation?booking=${Date.now()}`);
  };

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
            href={`/tours/${tour.id}`}
            className="hover:text-foreground transition-colors"
          >
            {tour.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">Checkout</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href={`/tours/${tour.id}`}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Tour Details
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        handleInputChange("specialRequests", e.target.value)
                      }
                      placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      handleInputChange("paymentMethod", value)
                    }
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label
                        htmlFor="credit-card"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCardIcon className="w-5 h-5" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem
                        value="bank-transfer"
                        id="bank-transfer"
                      />
                      <Label
                        htmlFor="bank-transfer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <BanknotesIcon className="w-5 h-5" />
                        Bank Transfer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem
                        value="digital-wallet"
                        id="digital-wallet"
                      />
                      <Label
                        htmlFor="digital-wallet"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <SmartphoneIcon className="w-5 h-5" />
                        Digital Wallet (PayPal, Apple Pay)
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "credit-card" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) =>
                            handleInputChange("cardName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            handleInputChange("cardNumber", e.target.value)
                          }
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) =>
                              handleInputChange("expiryDate", e.target.value)
                            }
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) =>
                              handleInputChange("cvv", e.target.value)
                            }
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeTerms", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="agreeTerms"
                      className="text-sm leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeMarketing", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="agreeMarketing"
                      className="text-sm leading-relaxed"
                    >
                      I would like to receive marketing emails about special
                      offers and new tours
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading || !formData.agreeTerms}
              >
                {isLoading ? "Processing..." : `Complete Booking - $${total}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">{tour.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {tour.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {tour.duration}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Departure: {tour.departureDate}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per person:</span>
                    <span>${tour.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees:</span>
                    <span>${taxes}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Secure payment protected by SSL encryption</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Free cancellation up to 24 hours before departure</p>
                  <p className="mt-1">
                    Confirmation email will be sent immediately after booking
                  </p>
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
